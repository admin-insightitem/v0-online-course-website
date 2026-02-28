'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult, EnrollmentWithCourse } from '@/types'

// ─── Get My Enrollments (내 수강 목록) ───
export async function getMyEnrollments(options?: {
  status?: 'in-progress' | 'completed' | 'all'
  page?: number
  limit?: number
}): Promise<ActionResult<{ enrollments: EnrollmentWithCourse[]; total: number }>> {
  const supabase = await createClient()
  const { status = 'all', page = 1, limit = 12 } = options || {}

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  let query = supabase
    .from('enrollments')
    .select(`
      id, enrolled_at, completed_at,
      course:courses!inner(
        id, title, image_url,
        instructor:profiles!courses_instructor_id_fkey(id, name, nickname, avatar_url)
      )
    `, { count: 'exact' })
    .eq('user_id', user.id)

  if (status === 'completed') {
    query = query.not('completed_at', 'is', null)
  } else if (status === 'in-progress') {
    query = query.is('completed_at', null)
  }

  query = query.order('enrolled_at', { ascending: false })

  const from = (page - 1) * limit
  query = query.range(from, from + limit - 1)

  const { data, error, count } = await query

  if (error) {
    return { success: false, error: { code: 'FETCH_FAILED', message: '수강 목록을 불러오는데 실패했습니다.' } }
  }

  // 각 수강에 대해 진도율 계산
  const enrollments: EnrollmentWithCourse[] = await Promise.all(
    (data || []).map(async (enrollment: any) => {
      const courseId = enrollment.course.id

      // 총 강의 수
      const { count: totalLectures } = await supabase
        .from('lectures')
        .select('id', { count: 'exact', head: true })
        .eq('course_sections.course_id', courseId)
        .eq('is_published', true)

      // 완료한 강의 수
      const { count: completedLectures } = await supabase
        .from('lecture_progress')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_completed', true)

      const total = totalLectures || 0
      const completed = Math.min(completedLectures || 0, total)

      return {
        id: enrollment.id,
        enrolled_at: enrollment.enrolled_at,
        completed_at: enrollment.completed_at,
        course: {
          ...enrollment.course,
          total_lectures: total,
        },
        progress: {
          completed_count: completed,
          total_count: total,
          percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        },
      }
    })
  )

  return { success: true, data: { enrollments, total: count || 0 } }
}

// ─── Check Enrollment (수강 등록 확인) ───
export async function checkEnrollment(courseId: string): Promise<ActionResult<{ enrolled: boolean; enrollmentId?: string }>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: true, data: { enrolled: false } }
  }

  const { data } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single()

  return {
    success: true,
    data: {
      enrolled: !!data,
      enrollmentId: data?.id,
    },
  }
}

// ─── Get Course Progress (강좌별 진도 상세) ───
export async function getCourseProgress(courseId: string): Promise<ActionResult<{
  sections: {
    id: string
    title: string
    lectures: {
      id: string
      title: string
      duration: string | null
      isCompleted: boolean
      progressPercent: number
      lastWatchedAt: string | null
    }[]
  }[]
  totalProgress: number
}>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  // 커리큘럼 가져오기
  const { data: sections } = await supabase
    .from('course_sections')
    .select(`
      id, title, sort_order,
      lectures(id, title, duration, sort_order, is_published)
    `)
    .eq('course_id', courseId)
    .order('sort_order')

  if (!sections) {
    return { success: false, error: { code: 'NOT_FOUND', message: '커리큘럼을 찾을 수 없습니다.' } }
  }

  // 유저 진도 가져오기
  const allLectureIds = sections.flatMap(s =>
    (s.lectures || []).filter((l: any) => l.is_published).map((l: any) => l.id)
  )

  const { data: progressData } = await supabase
    .from('lecture_progress')
    .select('lecture_id, progress_percent, is_completed, last_watched_at')
    .eq('user_id', user.id)
    .in('lecture_id', allLectureIds)

  const progressMap = new Map(
    (progressData || []).map(p => [p.lecture_id, p])
  )

  let totalCompleted = 0
  const totalLectures = allLectureIds.length

  const result = sections.map(section => ({
    id: section.id,
    title: section.title,
    lectures: (section.lectures || [])
      .filter((l: any) => l.is_published)
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((lecture: any) => {
        const progress = progressMap.get(lecture.id)
        if (progress?.is_completed) totalCompleted++
        return {
          id: lecture.id,
          title: lecture.title,
          duration: lecture.duration,
          isCompleted: progress?.is_completed || false,
          progressPercent: progress?.progress_percent || 0,
          lastWatchedAt: progress?.last_watched_at || null,
        }
      }),
  }))

  return {
    success: true,
    data: {
      sections: result,
      totalProgress: totalLectures > 0 ? Math.round((totalCompleted / totalLectures) * 100) : 0,
    },
  }
}
