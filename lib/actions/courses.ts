'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult, CourseWithInstructor, CourseSectionWithLectures, LectureWithMux } from '@/types'

// ─── Get Courses (강의 목록 - 필터, 페이지네이션) ───
export async function getCourses(options?: {
  categorySlug?: string
  search?: string
  page?: number
  limit?: number
  sort?: 'latest' | 'popular' | 'rating' | 'price_asc' | 'price_desc'
}): Promise<ActionResult<{ courses: CourseWithInstructor[]; total: number }>> {
  const supabase = await createClient()
  const { categorySlug, search, page = 1, limit = 12, sort = 'latest' } = options || {}

  let query = supabase
    .from('courses')
    .select(`
      *,
      category:categories!inner(id, name, slug),
      instructor:profiles!inner(id, name, nickname, avatar_url, instructor_title, instructor_bio)
    `, { count: 'exact' })
    .eq('is_published', true)

  // 카테고리 필터
  if (categorySlug && categorySlug !== 'all') {
    query = query.eq('categories.slug', categorySlug)
  }

  // 검색
  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  // 정렬
  switch (sort) {
    case 'popular':
      query = query.order('student_count', { ascending: false })
      break
    case 'rating':
      query = query.order('rating_avg', { ascending: false })
      break
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  // 페이지네이션
  const from = (page - 1) * limit
  query = query.range(from, from + limit - 1)

  const { data, error, count } = await query

  if (error) {
    return { success: false, error: { code: 'FETCH_FAILED', message: '강의 목록을 불러오는데 실패했습니다.' } }
  }

  return { success: true, data: { courses: (data || []) as unknown as CourseWithInstructor[], total: count || 0 } }
}

// ─── Get Course By ID (강의 상세) ───
export async function getCourseById(courseId: string): Promise<ActionResult<CourseWithInstructor & { sections: CourseSectionWithLectures[] }>> {
  const supabase = await createClient()

  // 강의 기본 정보 + 강사 + 카테고리
  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      *,
      category:categories(id, name, slug),
      instructor:profiles!courses_instructor_id_fkey(id, name, nickname, avatar_url, instructor_title, instructor_bio)
    `)
    .eq('id', courseId)
    .single()

  if (error || !course) {
    return { success: false, error: { code: 'NOT_FOUND', message: '강의를 찾을 수 없습니다.' } }
  }

  // 커리큘럼 (섹션 + 강의)
  const { data: sections } = await supabase
    .from('course_sections')
    .select(`
      id, title, sort_order,
      lectures(id, title, duration, is_free, is_published, sort_order)
    `)
    .eq('course_id', courseId)
    .order('sort_order')

  return {
    success: true,
    data: {
      ...(course as unknown as CourseWithInstructor),
      sections: (sections || []).map(s => ({
        ...s,
        lectures: (s.lectures || []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
      })) as CourseSectionWithLectures[],
    },
  }
}

// ─── Create Course (강의 생성 - admin/instructor) ───
export async function createCourse(formData: FormData): Promise<ActionResult<{ courseId: string }>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || (profile.role !== 'admin' && profile.role !== 'instructor')) {
    return { success: false, error: { code: 'FORBIDDEN', message: '강의 생성 권한이 없습니다.' } }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string | null
  const categoryId = formData.get('category_id') as string
  const price = parseInt(formData.get('price') as string) || 0
  const originalPrice = formData.get('original_price') ? parseInt(formData.get('original_price') as string) : null
  const level = (formData.get('level') as string) || 'all'
  const imageUrl = formData.get('image_url') as string | null

  if (!title) {
    return { success: false, error: { code: 'INVALID_INPUT', message: '강의 제목을 입력해 주세요.' } }
  }

  const { data, error } = await supabase
    .from('courses')
    .insert({
      title,
      description,
      category_id: parseInt(categoryId),
      instructor_id: user.id,
      price,
      original_price: originalPrice,
      level,
      image_url: imageUrl,
      is_published: false,
    })
    .select('id')
    .single()

  if (error) {
    return { success: false, error: { code: 'CREATE_FAILED', message: '강의 생성에 실패했습니다.' } }
  }

  revalidatePath('/admin/classes')
  revalidatePath('/teacher/classes')
  return { success: true, data: { courseId: data.id } }
}

// ─── Update Course (강의 수정) ───
export async function updateCourse(courseId: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  const updates: Record<string, unknown> = {}
  const fields = ['title', 'description', 'level', 'image_url', 'badge', 'badge_color'] as const
  for (const field of fields) {
    const value = formData.get(field)
    if (value !== null) updates[field] = value || null
  }
  const price = formData.get('price')
  if (price !== null) updates.price = parseInt(price as string) || 0
  const originalPrice = formData.get('original_price')
  if (originalPrice !== null) updates.original_price = parseInt(originalPrice as string) || null
  const categoryId = formData.get('category_id')
  if (categoryId !== null) updates.category_id = parseInt(categoryId as string)

  // highlights, target_audience, requirements (JSON arrays)
  const highlights = formData.get('highlights')
  if (highlights !== null) updates.highlights = JSON.parse(highlights as string)
  const targetAudience = formData.get('target_audience')
  if (targetAudience !== null) updates.target_audience = JSON.parse(targetAudience as string)
  const requirements = formData.get('requirements')
  if (requirements !== null) updates.requirements = JSON.parse(requirements as string)

  const { error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', courseId)

  if (error) {
    return { success: false, error: { code: 'UPDATE_FAILED', message: '강의 수정에 실패했습니다.' } }
  }

  revalidatePath('/admin/classes')
  revalidatePath('/teacher/classes')
  revalidatePath(`/courses/${courseId}`)
  return { success: true, data: undefined }
}

// ─── Delete Course (강의 삭제) ───
export async function deleteCourse(courseId: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  const { error } = await supabase.from('courses').delete().eq('id', courseId)

  if (error) {
    return { success: false, error: { code: 'DELETE_FAILED', message: '강의 삭제에 실패했습니다.' } }
  }

  revalidatePath('/admin/classes')
  revalidatePath('/teacher/classes')
  return { success: true, data: undefined }
}

// ─── Toggle Course Visibility (공개/비공개) ───
export async function toggleCourseVisibility(courseId: string): Promise<ActionResult<{ isPublished: boolean }>> {
  const supabase = await createClient()

  const { data: course } = await supabase
    .from('courses')
    .select('is_published')
    .eq('id', courseId)
    .single()

  if (!course) {
    return { success: false, error: { code: 'NOT_FOUND', message: '강의를 찾을 수 없습니다.' } }
  }

  const newValue = !course.is_published
  const { error } = await supabase
    .from('courses')
    .update({ is_published: newValue })
    .eq('id', courseId)

  if (error) {
    return { success: false, error: { code: 'UPDATE_FAILED', message: '상태 변경에 실패했습니다.' } }
  }

  revalidatePath('/admin/classes')
  revalidatePath('/teacher/classes')
  return { success: true, data: { isPublished: newValue } }
}

// ─── Update Course Badge (뱃지 변경) ───
export async function updateCourseBadge(courseId: string, badge: string | null, badgeColor: string | null): Promise<ActionResult> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('courses')
    .update({ badge, badge_color: badgeColor })
    .eq('id', courseId)

  if (error) {
    return { success: false, error: { code: 'UPDATE_FAILED', message: '뱃지 변경에 실패했습니다.' } }
  }

  revalidatePath('/admin/classes')
  return { success: true, data: undefined }
}

// ─── Get Lecture For Player (영상 재생 정보) ───
export async function getLectureForPlayer(lectureId: string): Promise<ActionResult<LectureWithMux & { courseTitle: string; sectionTitle: string }>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  // 강의 정보 조회
  const { data: lecture, error } = await supabase
    .from('lectures')
    .select(`
      *,
      section:course_sections!inner(
        title,
        course:courses!inner(id, title)
      )
    `)
    .eq('id', lectureId)
    .single()

  if (error || !lecture) {
    return { success: false, error: { code: 'NOT_FOUND', message: '강의를 찾을 수 없습니다.' } }
  }

  const courseId = (lecture.section as any).course.id

  // 무료 강의가 아니면 수강 등록 확인
  if (!lecture.is_free) {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single()

    if (!enrollment) {
      return { success: false, error: { code: 'NOT_ENROLLED', message: '수강 등록이 필요합니다.' } }
    }
  }

  return {
    success: true,
    data: {
      id: lecture.id,
      title: lecture.title,
      duration: lecture.duration,
      is_free: lecture.is_free,
      is_published: lecture.is_published,
      sort_order: lecture.sort_order,
      mux_playback_id: lecture.mux_playback_id,
      mux_upload_status: lecture.mux_upload_status,
      materials_url: lecture.materials_url,
      courseTitle: (lecture.section as any).course.title,
      sectionTitle: (lecture.section as any).title,
    },
  }
}

// ─── Update Lecture Progress (진도율 업데이트) ───
export async function updateLectureProgress(lectureId: string, progress: number): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  // 강의의 course_id 가져오기
  const { data: lecture } = await supabase
    .from('lectures')
    .select('id, course_sections!inner(course_id)')
    .eq('id', lectureId)
    .single()

  if (!lecture) {
    return { success: false, error: { code: 'NOT_FOUND', message: '강의를 찾을 수 없습니다.' } }
  }

  const courseId = (lecture.course_sections as any).course_id
  const isCompleted = progress >= 90 // 90% 이상이면 완료로 처리

  // 수강 등록 확인
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single()

  if (!enrollment) {
    return { success: false, error: { code: 'NOT_ENROLLED', message: '수강 등록이 필요합니다.' } }
  }

  // upsert lecture_progress
  const { error } = await supabase
    .from('lecture_progress')
    .upsert(
      {
        user_id: user.id,
        lecture_id: lectureId,
        progress_percent: Math.min(progress, 100),
        is_completed: isCompleted,
        last_watched_at: new Date().toISOString(),
        ...(isCompleted ? { completed_at: new Date().toISOString() } : {}),
      },
      { onConflict: 'user_id,lecture_id' }
    )

  if (error) {
    return { success: false, error: { code: 'UPDATE_FAILED', message: '진도 업데이트에 실패했습니다.' } }
  }

  return { success: true, data: undefined }
}

// ─── Get Categories (카테고리 목록) ───
export async function getCategories(): Promise<ActionResult<{ id: number; name: string; slug: string }[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('sort_order')

  if (error) {
    return { success: false, error: { code: 'FETCH_FAILED', message: '카테고리를 불러오는데 실패했습니다.' } }
  }

  return { success: true, data: data || [] }
}
