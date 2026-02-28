'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/types'

// ─── Helper: Admin 권한 검증 ───
async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('UNAUTHORIZED')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('FORBIDDEN')

  return { supabase, user }
}

// ─── Get Admin Dashboard (대시보드 통계) ───
export async function getAdminDashboard(): Promise<ActionResult<{
  totalStudents: number
  totalCourses: number
  totalRevenue: number
  recentOrders: number
}>> {
  try {
    const { supabase } = await requireAdmin()

    const [students, courses, revenue, orders] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
      supabase.from('courses').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('total_amount').eq('status', 'completed'),
      supabase.from('orders').select('id', { count: 'exact', head: true })
        .eq('status', 'completed')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    ])

    const totalRevenue = (revenue.data || []).reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0)

    return {
      success: true,
      data: {
        totalStudents: students.count || 0,
        totalCourses: courses.count || 0,
        totalRevenue,
        recentOrders: orders.count || 0,
      },
    }
  } catch {
    return { success: false, error: { code: 'ADMIN_ERROR', message: '관리자 권한이 필요합니다.' } }
  }
}

// ─── Get Admin Students (회원 목록) ───
export async function getAdminStudents(options?: {
  memberType?: 'all' | 'customer' | 'instructor'
  search?: string
  page?: number
  limit?: number
}): Promise<ActionResult<{ students: any[]; total: number }>> {
  try {
    const { supabase } = await requireAdmin()
    const { memberType = 'all', search, page = 1, limit = 30 } = options || {}

    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)

    if (memberType !== 'all') {
      query = query.eq('role', memberType)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,nickname.ilike.%${search}%`)
    }

    query = query.order('created_at', { ascending: false })

    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, error, count } = await query

    if (error) throw error

    return { success: true, data: { students: data || [], total: count || 0 } }
  } catch {
    return { success: false, error: { code: 'FETCH_FAILED', message: '회원 목록을 불러오는데 실패했습니다.' } }
  }
}

// ─── Get Admin Payments (결제 내역) ───
export async function getAdminPayments(options?: {
  status?: string
  page?: number
  limit?: number
}): Promise<ActionResult<{ orders: any[]; total: number }>> {
  try {
    const { supabase } = await requireAdmin()
    const { status, page = 1, limit = 30 } = options || {}

    let query = supabase
      .from('orders')
      .select(`
        *,
        user:profiles!orders_user_id_fkey(id, name, email),
        items:order_items(
          id, price,
          course:courses(id, title)
        )
      `, { count: 'exact' })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    query = query.order('created_at', { ascending: false })

    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, error, count } = await query

    if (error) throw error

    return { success: true, data: { orders: data || [], total: count || 0 } }
  } catch {
    return { success: false, error: { code: 'FETCH_FAILED', message: '결제 내역을 불러오는데 실패했습니다.' } }
  }
}

// ─── Process Refund (환불 승인/거절) ───
export async function processRefund(refundId: string, action: 'approved' | 'rejected', reason?: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()

    const { data: refund } = await supabase
      .from('refunds')
      .select('id, order_id, amount, status')
      .eq('id', refundId)
      .single()

    if (!refund || refund.status !== 'pending') {
      return { success: false, error: { code: 'INVALID_STATE', message: '처리할 수 없는 환불 요청입니다.' } }
    }

    // 환불 상태 업데이트
    const { error: refundError } = await supabase
      .from('refunds')
      .update({
        status: action,
        admin_note: reason || null,
        processed_at: new Date().toISOString(),
      })
      .eq('id', refundId)

    if (refundError) throw refundError

    // 승인 시 주문 상태도 업데이트
    if (action === 'approved') {
      await supabase
        .from('orders')
        .update({ status: 'refunded' })
        .eq('id', refund.order_id)
    }

    revalidatePath('/admin/payments')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: { code: 'PROCESS_FAILED', message: '환불 처리에 실패했습니다.' } }
  }
}

// ─── Manage Coupon (쿠폰 CRUD) ───
export async function createCoupon(formData: FormData): Promise<ActionResult<{ couponId: string }>> {
  try {
    const { supabase } = await requireAdmin()

    const { data, error } = await supabase
      .from('coupons')
      .insert({
        code: formData.get('code') as string,
        name: formData.get('name') as string,
        type: formData.get('type') as string,
        discount_value: parseInt(formData.get('discount_value') as string),
        min_purchase: parseInt(formData.get('min_purchase') as string) || 0,
        max_discount: formData.get('max_discount') ? parseInt(formData.get('max_discount') as string) : null,
        usage_limit: formData.get('usage_limit') ? parseInt(formData.get('usage_limit') as string) : null,
        starts_at: (formData.get('starts_at') as string) || null,
        expires_at: (formData.get('expires_at') as string) || null,
        is_active: true,
      })
      .select('id')
      .single()

    if (error) throw error

    revalidatePath('/admin/promotions')
    return { success: true, data: { couponId: data.id } }
  } catch {
    return { success: false, error: { code: 'CREATE_FAILED', message: '쿠폰 생성에 실패했습니다.' } }
  }
}

// ─── Section & Lecture CRUD (관리자/강사 커리큘럼 관리) ───
export async function createSection(courseId: string, title: string): Promise<ActionResult<{ sectionId: string }>> {
  const supabase = await createClient()

  // 마지막 sort_order 확인
  const { data: lastSection } = await supabase
    .from('course_sections')
    .select('sort_order')
    .eq('course_id', courseId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = (lastSection?.sort_order || 0) + 1

  const { data, error } = await supabase
    .from('course_sections')
    .insert({ course_id: courseId, title, sort_order: nextOrder })
    .select('id')
    .single()

  if (error) {
    return { success: false, error: { code: 'CREATE_FAILED', message: '섹션 생성에 실패했습니다.' } }
  }

  revalidatePath('/admin/lectures')
  return { success: true, data: { sectionId: data.id } }
}

export async function updateSection(sectionId: string, title: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('course_sections')
    .update({ title })
    .eq('id', sectionId)

  if (error) {
    return { success: false, error: { code: 'UPDATE_FAILED', message: '섹션 수정에 실패했습니다.' } }
  }

  revalidatePath('/admin/lectures')
  return { success: true, data: undefined }
}

export async function deleteSection(sectionId: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('course_sections')
    .delete()
    .eq('id', sectionId)

  if (error) {
    return { success: false, error: { code: 'DELETE_FAILED', message: '섹션 삭제에 실패했습니다.' } }
  }

  revalidatePath('/admin/lectures')
  return { success: true, data: undefined }
}

export async function createLecture(sectionId: string, formData: FormData): Promise<ActionResult<{ lectureId: string }>> {
  const supabase = await createClient()

  // 마지막 sort_order 확인
  const { data: lastLecture } = await supabase
    .from('lectures')
    .select('sort_order')
    .eq('section_id', sectionId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = (lastLecture?.sort_order || 0) + 1

  const { data, error } = await supabase
    .from('lectures')
    .insert({
      section_id: sectionId,
      title: formData.get('title') as string,
      duration: formData.get('duration') as string || null,
      is_free: formData.get('is_free') === 'true',
      is_published: formData.get('is_published') !== 'false',
      sort_order: nextOrder,
      materials_url: formData.get('materials_url') as string || null,
    })
    .select('id')
    .single()

  if (error) {
    return { success: false, error: { code: 'CREATE_FAILED', message: '강의 생성에 실패했습니다.' } }
  }

  revalidatePath('/admin/lectures')
  return { success: true, data: { lectureId: data.id } }
}

export async function updateLecture(lectureId: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()

  const updates: Record<string, unknown> = {}
  const title = formData.get('title')
  if (title !== null) updates.title = title
  const duration = formData.get('duration')
  if (duration !== null) updates.duration = duration || null
  const isFree = formData.get('is_free')
  if (isFree !== null) updates.is_free = isFree === 'true'
  const isPublished = formData.get('is_published')
  if (isPublished !== null) updates.is_published = isPublished === 'true'
  const materialsUrl = formData.get('materials_url')
  if (materialsUrl !== null) updates.materials_url = materialsUrl || null
  const muxPlaybackId = formData.get('mux_playback_id')
  if (muxPlaybackId !== null) updates.mux_playback_id = muxPlaybackId || null

  const { error } = await supabase
    .from('lectures')
    .update(updates)
    .eq('id', lectureId)

  if (error) {
    return { success: false, error: { code: 'UPDATE_FAILED', message: '강의 수정에 실패했습니다.' } }
  }

  revalidatePath('/admin/lectures')
  return { success: true, data: undefined }
}

export async function deleteLecture(lectureId: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('lectures')
    .delete()
    .eq('id', lectureId)

  if (error) {
    return { success: false, error: { code: 'DELETE_FAILED', message: '강의 삭제에 실패했습니다.' } }
  }

  revalidatePath('/admin/lectures')
  return { success: true, data: undefined }
}
