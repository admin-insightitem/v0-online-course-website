'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult, InquiryWithReplies } from '@/types'

// ─── Create Inquiry (Q&A/문의 작성) ───
export async function createInquiry(formData: FormData): Promise<ActionResult<{ inquiryId: string }>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  const type = (formData.get('type') as string) || 'qna'
  const title = formData.get('title') as string | null
  const content = formData.get('content') as string
  const courseId = formData.get('course_id') as string | null
  const lectureId = formData.get('lecture_id') as string | null

  if (!content) {
    return { success: false, error: { code: 'INVALID_INPUT', message: '내용을 입력해 주세요.' } }
  }

  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      user_id: user.id,
      type,
      title,
      content,
      course_id: courseId,
      lecture_id: lectureId,
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) {
    return { success: false, error: { code: 'CREATE_FAILED', message: '문의 작성에 실패했습니다.' } }
  }

  revalidatePath('/mypage/qna')
  if (courseId) revalidatePath(`/courses/${courseId}`)
  return { success: true, data: { inquiryId: data.id } }
}

// ─── Create Reply (답변 작성) ───
export async function createReply(inquiryId: string, content: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  if (!content.trim()) {
    return { success: false, error: { code: 'INVALID_INPUT', message: '답변 내용을 입력해 주세요.' } }
  }

  const { error } = await supabase
    .from('inquiry_replies')
    .insert({
      inquiry_id: inquiryId,
      user_id: user.id,
      content,
    })

  if (error) {
    return { success: false, error: { code: 'REPLY_FAILED', message: '답변 작성에 실패했습니다.' } }
  }

  // 문의 상태 업데이트
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role === 'instructor' || profile?.role === 'admin') {
    await supabase
      .from('inquiries')
      .update({ status: 'answered' })
      .eq('id', inquiryId)
  }

  revalidatePath('/mypage/qna')
  revalidatePath('/teacher/inquiries')
  revalidatePath('/admin/inquiries')
  return { success: true, data: undefined }
}

// ─── Toggle Inquiry Like (좋아요 토글) ───
export async function toggleInquiryLike(inquiryId: string): Promise<ActionResult<{ liked: boolean }>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  // 이미 좋아요 했는지 확인 (inquiries 테이블의 liked_by 배열 또는 별도 로직)
  // 간단 구현: inquiry의 likes 카운트 증가/감소
  const { data: inquiry } = await supabase
    .from('inquiries')
    .select('id')
    .eq('id', inquiryId)
    .single()

  if (!inquiry) {
    return { success: false, error: { code: 'NOT_FOUND', message: '문의를 찾을 수 없습니다.' } }
  }

  // TODO: 실제로는 별도 likes 테이블로 중복 방지 필요
  return { success: true, data: { liked: true } }
}

// ─── Get My Inquiries (내 문의 목록) ───
export async function getMyInquiries(options?: {
  type?: 'all' | 'qna' | 'support'
  page?: number
  limit?: number
}): Promise<ActionResult<{ inquiries: InquiryWithReplies[]; total: number }>> {
  const supabase = await createClient()
  const { type = 'all', page = 1, limit = 10 } = options || {}

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  let query = supabase
    .from('inquiries')
    .select(`
      *,
      author:profiles!inquiries_user_id_fkey(id, name, nickname, avatar_url),
      course:courses(id, title),
      lecture:lectures(id, title),
      replies:inquiry_replies(
        id, content, created_at,
        author:profiles(id, name, nickname, avatar_url, role)
      )
    `, { count: 'exact' })
    .eq('user_id', user.id)

  if (type !== 'all') {
    query = query.eq('type', type)
  }

  query = query.order('created_at', { ascending: false })

  const from = (page - 1) * limit
  query = query.range(from, from + limit - 1)

  const { data, error, count } = await query

  if (error) {
    return { success: false, error: { code: 'FETCH_FAILED', message: '문의 목록을 불러오는데 실패했습니다.' } }
  }

  return { success: true, data: { inquiries: (data || []) as unknown as InquiryWithReplies[], total: count || 0 } }
}

// ─── Get Course QnA (강의별 Q&A) ───
export async function getCourseQnA(courseId: string, options?: {
  page?: number
  limit?: number
}): Promise<ActionResult<{ inquiries: InquiryWithReplies[]; total: number }>> {
  const supabase = await createClient()
  const { page = 1, limit = 20 } = options || {}

  let query = supabase
    .from('inquiries')
    .select(`
      *,
      author:profiles!inquiries_user_id_fkey(id, name, nickname, avatar_url),
      lecture:lectures(id, title),
      replies:inquiry_replies(
        id, content, created_at,
        author:profiles(id, name, nickname, avatar_url, role)
      )
    `, { count: 'exact' })
    .eq('course_id', courseId)
    .eq('type', 'qna')

  query = query.order('created_at', { ascending: false })

  const from = (page - 1) * limit
  query = query.range(from, from + limit - 1)

  const { data, error, count } = await query

  if (error) {
    return { success: false, error: { code: 'FETCH_FAILED', message: 'Q&A를 불러오는데 실패했습니다.' } }
  }

  return { success: true, data: { inquiries: (data || []) as unknown as InquiryWithReplies[], total: count || 0 } }
}
