'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult, TeacherRevenueData, TeacherSettlement, TeacherStudentDetail } from '@/types'

// ─── Helper: Instructor 권한 검증 ───
async function requireInstructor() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('UNAUTHORIZED')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'instructor' && profile?.role !== 'admin') throw new Error('FORBIDDEN')

  return { supabase, user }
}

// ─── Get Teacher Dashboard (강사 대시보드) ───
export async function getTeacherDashboard(): Promise<ActionResult<{
  totalStudents: number
  totalCourses: number
  totalRevenue: number
  recentQna: any[]
}>> {
  try {
    const { supabase, user } = await requireInstructor()

    const [courses, revenue] = await Promise.all([
      supabase.from('courses').select('id', { count: 'exact' }).eq('instructor_id', user.id),
      supabase
        .from('order_items')
        .select('price, course:courses!inner(instructor_id)')
        .eq('courses.instructor_id', user.id),
    ])

    const courseIds = (courses.data || []).map((c: any) => c.id)

    const students = courseIds.length > 0
      ? await supabase
          .from('enrollments')
          .select('user_id', { count: 'exact', head: true })
          .in('course_id', courseIds)
      : { count: 0 }

    const recentQna = courseIds.length > 0
      ? await supabase
          .from('inquiries')
          .select(`
            id, title, content, status, created_at,
            author:profiles!inquiries_user_id_fkey(name, avatar_url),
            course:courses(title)
          `)
          .in('course_id', courseIds)
          .order('created_at', { ascending: false })
          .limit(5)
      : { data: [] }

    const totalRevenue = (revenue.data || []).reduce((sum: number, item: any) => sum + (item.price || 0), 0)

    return {
      success: true,
      data: {
        totalStudents: students.count || 0,
        totalCourses: courses.count || 0,
        totalRevenue,
        recentQna: recentQna.data || [],
      },
    }
  } catch {
    return { success: false, error: { code: 'FETCH_FAILED', message: '대시보드 데이터를 불러오는데 실패했습니다.' } }
  }
}

// ─── Get Teacher Courses (내 강의 목록) ───
export async function getTeacherCourses(options?: {
  search?: string
  page?: number
  limit?: number
}): Promise<ActionResult<{ courses: any[]; total: number }>> {
  try {
    const { supabase, user } = await requireInstructor()
    const { search, page = 1, limit = 30 } = options || {}

    let query = supabase
      .from('courses')
      .select(`
        *,
        category:categories(name)
      `, { count: 'exact' })
      .eq('instructor_id', user.id)

    if (search) {
      query = query.ilike('title', `%${search}%`)
    }

    query = query.order('created_at', { ascending: false })

    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, error, count } = await query
    if (error) throw error

    return { success: true, data: { courses: data || [], total: count || 0 } }
  } catch {
    return { success: false, error: { code: 'FETCH_FAILED', message: '강의 목록을 불러오는데 실패했습니다.' } }
  }
}

// ─── Update Teacher Profile (강사 프로필 수정) ───
export async function updateTeacherProfile(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireInstructor()

    const updates: Record<string, unknown> = {}
    const name = formData.get('name')
    if (name !== null) updates.name = name
    const nickname = formData.get('nickname')
    if (nickname !== null) updates.nickname = nickname
    const phone = formData.get('phone')
    if (phone !== null) updates.phone = phone
    const instructorTitle = formData.get('instructor_title')
    if (instructorTitle !== null) updates.instructor_title = instructorTitle
    const instructorBio = formData.get('instructor_bio')
    if (instructorBio !== null) updates.instructor_bio = instructorBio
    const avatarUrl = formData.get('avatar_url')
    if (avatarUrl !== null) updates.avatar_url = avatarUrl || null

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (error) throw error

    revalidatePath('/teacher/profile')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: { code: 'UPDATE_FAILED', message: '프로필 수정에 실패했습니다.' } }
  }
}

// ─── Get Teacher Students (수강생 목록) ───
export async function getTeacherStudents(options?: {
  courseId?: string
  search?: string
  page?: number
  limit?: number
}): Promise<ActionResult<{ students: any[]; total: number }>> {
  try {
    const { supabase, user } = await requireInstructor()
    const { courseId, search, page = 1, limit = 30 } = options || {}

    // 내 강의 ID 목록
    let courseIds: string[]
    if (courseId) {
      courseIds = [courseId]
    } else {
      const { data: myCourses } = await supabase
        .from('courses')
        .select('id')
        .eq('instructor_id', user.id)
      courseIds = (myCourses || []).map((c: any) => c.id)
    }

    if (courseIds.length === 0) {
      return { success: true, data: { students: [], total: 0 } }
    }

    let query = supabase
      .from('enrollments')
      .select(`
        id, enrolled_at,
        user:profiles!enrollments_user_id_fkey(id, name, email, avatar_url, created_at),
        course:courses(id, title)
      `, { count: 'exact' })
      .in('course_id', courseIds)

    if (search) {
      query = query.or(`profiles.name.ilike.%${search}%,profiles.email.ilike.%${search}%`)
    }

    query = query.order('enrolled_at', { ascending: false })

    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, error, count } = await query
    if (error) throw error

    return { success: true, data: { students: data || [], total: count || 0 } }
  } catch {
    return { success: false, error: { code: 'FETCH_FAILED', message: '수강생 목록을 불러오는데 실패했습니다.' } }
  }
}

// ─── Get Teacher Student Detail (수강생 상세) ───
export async function getTeacherStudentDetail(studentId: string): Promise<ActionResult<TeacherStudentDetail>> {
  try {
    const { supabase, user } = await requireInstructor()

    // 프로필
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', studentId)
      .single()

    if (!profile) {
      return { success: false, error: { code: 'NOT_FOUND', message: '수강생을 찾을 수 없습니다.' } }
    }

    // 내 강의 중 이 수강생이 수강 중인 목록
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select(`
        enrolled_at,
        course:courses!inner(id, title, instructor_id)
      `)
      .eq('user_id', studentId)
      .eq('courses.instructor_id', user.id)

    // 주문 금액 합계
    const { data: orders } = await supabase
      .from('order_items')
      .select('price, order:orders!inner(user_id, status)')
      .eq('orders.user_id', studentId)
      .eq('orders.status', 'completed')

    const totalSpent = (orders || []).reduce((sum: number, o: any) => sum + (o.price || 0), 0)

    return {
      success: true,
      data: {
        id: profile.id,
        name: profile.name || '이름 없음',
        email: profile.email,
        avatar_url: profile.avatar_url,
        join_date: profile.created_at,
        join_method: profile.join_method,
        total_spent: totalSpent,
        status: 'active',
        courses: (enrollments || []).map((e: any) => ({
          id: e.course.id,
          title: e.course.title,
          progress: 0,
          last_access: e.enrolled_at,
          enroll_date: e.enrolled_at,
          price: 0,
          is_refunded: false,
        })),
      },
    }
  } catch {
    return { success: false, error: { code: 'FETCH_FAILED', message: '수강생 정보를 불러오는데 실패했습니다.' } }
  }
}

// ─── Get Teacher Inquiries (Q&A 목록) ───
export async function getTeacherInquiries(options?: {
  courseId?: string
  status?: string
  page?: number
  limit?: number
}): Promise<ActionResult<{ inquiries: any[]; total: number }>> {
  try {
    const { supabase, user } = await requireInstructor()
    const { courseId, status, page = 1, limit = 20 } = options || {}

    // 내 강의 ID 가져오기
    const { data: myCourses } = await supabase
      .from('courses')
      .select('id')
      .eq('instructor_id', user.id)
    const courseIds = courseId ? [courseId] : (myCourses || []).map((c: any) => c.id)

    if (courseIds.length === 0) {
      return { success: true, data: { inquiries: [], total: 0 } }
    }

    let query = supabase
      .from('inquiries')
      .select(`
        *,
        author:profiles!inquiries_user_id_fkey(id, name, nickname, avatar_url),
        course:courses(id, title),
        replies:inquiry_replies(
          id, content, created_at,
          author:profiles(id, name, nickname, avatar_url, role)
        )
      `, { count: 'exact' })
      .in('course_id', courseIds)

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    query = query.order('created_at', { ascending: false })

    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, error, count } = await query
    if (error) throw error

    return { success: true, data: { inquiries: data || [], total: count || 0 } }
  } catch {
    return { success: false, error: { code: 'FETCH_FAILED', message: 'Q&A 목록을 불러오는데 실패했습니다.' } }
  }
}

// ─── Reply To Inquiry (Q&A 답변) ───
export async function replyToInquiry(inquiryId: string, content: string): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireInstructor()

    const { error } = await supabase
      .from('inquiry_replies')
      .insert({
        inquiry_id: inquiryId,
        user_id: user.id,
        content,
      })

    if (error) throw error

    // 문의 상태를 answered로 변경
    await supabase
      .from('inquiries')
      .update({ status: 'answered' })
      .eq('id', inquiryId)

    revalidatePath('/teacher/inquiries')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: { code: 'REPLY_FAILED', message: '답변 작성에 실패했습니다.' } }
  }
}

// ─── Get Teacher Reviews (리뷰 목록) ───
export async function getTeacherReviews(options?: {
  courseId?: string
  rating?: number
  page?: number
  limit?: number
}): Promise<ActionResult<{ reviews: any[]; total: number }>> {
  try {
    const { supabase, user } = await requireInstructor()
    const { courseId, rating, page = 1, limit = 10 } = options || {}

    const { data: myCourses } = await supabase
      .from('courses')
      .select('id')
      .eq('instructor_id', user.id)
    const courseIds = courseId ? [courseId] : (myCourses || []).map((c: any) => c.id)

    if (courseIds.length === 0) {
      return { success: true, data: { reviews: [], total: 0 } }
    }

    let query = supabase
      .from('reviews')
      .select(`
        *,
        author:profiles!reviews_user_id_fkey(id, name, nickname, avatar_url),
        course:courses(id, title, image_url)
      `, { count: 'exact' })
      .in('course_id', courseIds)

    if (rating) {
      query = query.eq('rating', rating)
    }

    query = query.order('created_at', { ascending: false })

    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, error, count } = await query
    if (error) throw error

    return { success: true, data: { reviews: data || [], total: count || 0 } }
  } catch {
    return { success: false, error: { code: 'FETCH_FAILED', message: '리뷰 목록을 불러오는데 실패했습니다.' } }
  }
}

// ─── Get Teacher Revenue (매출 데이터) ───
export async function getTeacherRevenue(period: 'daily' | 'monthly' = 'daily'): Promise<ActionResult<TeacherRevenueData[]>> {
  try {
    const { supabase, user } = await requireInstructor()

    const { data: myCourses } = await supabase
      .from('courses')
      .select('id')
      .eq('instructor_id', user.id)
    const courseIds = (myCourses || []).map((c: any) => c.id)

    if (courseIds.length === 0) {
      return { success: true, data: [] }
    }

    // 최근 30일/12개월 주문 데이터
    const daysBack = period === 'daily' ? 30 : 365
    const since = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString()

    const { data: orderItems } = await supabase
      .from('order_items')
      .select(`
        price,
        order:orders!inner(created_at, status)
      `)
      .in('course_id', courseIds)
      .gte('orders.created_at', since)

    // 날짜별 집계
    const revenueMap = new Map<string, { revenue: number; refund: number }>()
    for (const item of orderItems || []) {
      const date = period === 'daily'
        ? (item.order as any).created_at.substring(0, 10)
        : (item.order as any).created_at.substring(0, 7)

      const entry = revenueMap.get(date) || { revenue: 0, refund: 0 }
      if ((item.order as any).status === 'refunded') {
        entry.refund += item.price
      } else if ((item.order as any).status === 'completed') {
        entry.revenue += item.price
      }
      revenueMap.set(date, entry)
    }

    const result: TeacherRevenueData[] = Array.from(revenueMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return { success: true, data: result }
  } catch {
    return { success: false, error: { code: 'FETCH_FAILED', message: '매출 데이터를 불러오는데 실패했습니다.' } }
  }
}

// ─── Get Teacher Settlement (정산 정보) ───
export async function getTeacherSettlement(): Promise<ActionResult<TeacherSettlement>> {
  try {
    const { supabase, user } = await requireInstructor()

    const { data: myCourses } = await supabase
      .from('courses')
      .select('id')
      .eq('instructor_id', user.id)
    const courseIds = (myCourses || []).map((c: any) => c.id)

    if (courseIds.length === 0) {
      return {
        success: true,
        data: { total_revenue: 0, total_refund: 0, platform_fee: 0, net_settlement: 0 },
      }
    }

    const { data: orderItems } = await supabase
      .from('order_items')
      .select('price, order:orders!inner(status)')
      .in('course_id', courseIds)

    let totalRevenue = 0
    let totalRefund = 0
    for (const item of orderItems || []) {
      if ((item.order as any).status === 'completed') totalRevenue += item.price
      if ((item.order as any).status === 'refunded') totalRefund += item.price
    }

    const platformFeeRate = 0.2 // 20% 수수료
    const platformFee = Math.round(totalRevenue * platformFeeRate)
    const netSettlement = totalRevenue - totalRefund - platformFee

    return {
      success: true,
      data: {
        total_revenue: totalRevenue,
        total_refund: totalRefund,
        platform_fee: platformFee,
        net_settlement: netSettlement,
      },
    }
  } catch {
    return { success: false, error: { code: 'FETCH_FAILED', message: '정산 정보를 불러오는데 실패했습니다.' } }
  }
}
