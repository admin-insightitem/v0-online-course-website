'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult, ReviewWithAuthor } from '@/types'

// ─── Create Review (리뷰 작성) ───
export async function createReview(courseId: string, formData: FormData): Promise<ActionResult<{ reviewId: string }>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  // 수강 등록 확인
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single()

  if (!enrollment) {
    return { success: false, error: { code: 'NOT_ENROLLED', message: '수강 중인 강의만 리뷰를 작성할 수 있습니다.' } }
  }

  // 이미 리뷰를 작성했는지 확인
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single()

  if (existingReview) {
    return { success: false, error: { code: 'ALREADY_REVIEWED', message: '이미 리뷰를 작성했습니다.' } }
  }

  const rating = parseInt(formData.get('rating') as string)
  const content = formData.get('content') as string | null

  if (!rating || rating < 1 || rating > 5) {
    return { success: false, error: { code: 'INVALID_RATING', message: '별점을 선택해 주세요. (1~5)' } }
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      user_id: user.id,
      course_id: courseId,
      rating,
      content: content || null,
    })
    .select('id')
    .single()

  if (error) {
    return { success: false, error: { code: 'CREATE_FAILED', message: '리뷰 작성에 실패했습니다.' } }
  }

  // 강의 평균 평점 업데이트
  const { data: stats } = await supabase
    .from('reviews')
    .select('rating')
    .eq('course_id', courseId)

  if (stats && stats.length > 0) {
    const avg = stats.reduce((sum, r) => sum + r.rating, 0) / stats.length
    await supabase
      .from('courses')
      .update({ rating_avg: Math.round(avg * 10) / 10, rating_count: stats.length })
      .eq('id', courseId)
  }

  revalidatePath(`/courses/${courseId}`)
  revalidatePath('/mypage/reviews')
  return { success: true, data: { reviewId: data.id } }
}

// ─── Update Review (리뷰 수정) ───
export async function updateReview(reviewId: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  const rating = parseInt(formData.get('rating') as string)
  const content = formData.get('content') as string | null

  const { data: review } = await supabase
    .from('reviews')
    .select('course_id')
    .eq('id', reviewId)
    .eq('user_id', user.id)
    .single()

  if (!review) {
    return { success: false, error: { code: 'NOT_FOUND', message: '리뷰를 찾을 수 없습니다.' } }
  }

  const { error } = await supabase
    .from('reviews')
    .update({ rating, content: content || null })
    .eq('id', reviewId)

  if (error) {
    return { success: false, error: { code: 'UPDATE_FAILED', message: '리뷰 수정에 실패했습니다.' } }
  }

  revalidatePath(`/courses/${review.course_id}`)
  revalidatePath('/mypage/reviews')
  return { success: true, data: undefined }
}

// ─── Delete Review (리뷰 삭제) ───
export async function deleteReview(reviewId: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  const { data: review } = await supabase
    .from('reviews')
    .select('course_id')
    .eq('id', reviewId)
    .eq('user_id', user.id)
    .single()

  if (!review) {
    return { success: false, error: { code: 'NOT_FOUND', message: '리뷰를 찾을 수 없습니다.' } }
  }

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)

  if (error) {
    return { success: false, error: { code: 'DELETE_FAILED', message: '리뷰 삭제에 실패했습니다.' } }
  }

  // 평점 재계산
  const { data: stats } = await supabase
    .from('reviews')
    .select('rating')
    .eq('course_id', review.course_id)

  const avg = stats && stats.length > 0
    ? stats.reduce((sum, r) => sum + r.rating, 0) / stats.length
    : 0

  await supabase
    .from('courses')
    .update({ rating_avg: Math.round(avg * 10) / 10, rating_count: stats?.length || 0 })
    .eq('id', review.course_id)

  revalidatePath(`/courses/${review.course_id}`)
  revalidatePath('/mypage/reviews')
  return { success: true, data: undefined }
}

// ─── Toggle Helpful (도움이 됨 토글) ───
export async function toggleHelpful(reviewId: string): Promise<ActionResult<{ helpfulCount: number }>> {
  const supabase = await createClient()

  const { data: review } = await supabase
    .from('reviews')
    .select('helpful_count')
    .eq('id', reviewId)
    .single()

  if (!review) {
    return { success: false, error: { code: 'NOT_FOUND', message: '리뷰를 찾을 수 없습니다.' } }
  }

  // 간단히 +1 (실제로는 별도 테이블로 중복 방지 필요)
  const newCount = (review.helpful_count || 0) + 1

  const { error } = await supabase
    .from('reviews')
    .update({ helpful_count: newCount })
    .eq('id', reviewId)

  if (error) {
    return { success: false, error: { code: 'UPDATE_FAILED', message: '업데이트에 실패했습니다.' } }
  }

  return { success: true, data: { helpfulCount: newCount } }
}

// ─── Get My Reviews (내 리뷰 목록) ───
export async function getMyReviews(options?: {
  page?: number
  limit?: number
}): Promise<ActionResult<{ reviews: ReviewWithAuthor[]; total: number }>> {
  const supabase = await createClient()
  const { page = 1, limit = 10 } = options || {}

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  const from = (page - 1) * limit

  const { data, error, count } = await supabase
    .from('reviews')
    .select(`
      *,
      author:profiles!reviews_user_id_fkey(id, name, nickname, avatar_url),
      course:courses(id, title, image_url)
    `, { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)

  if (error) {
    return { success: false, error: { code: 'FETCH_FAILED', message: '리뷰 목록을 불러오는데 실패했습니다.' } }
  }

  return { success: true, data: { reviews: (data || []) as unknown as ReviewWithAuthor[], total: count || 0 } }
}
