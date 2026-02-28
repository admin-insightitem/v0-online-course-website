'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult, CartItemWithCourse } from '@/types'

// ─── Get Cart Items (장바구니 조회) ───
export async function getCartItems(): Promise<ActionResult<CartItemWithCourse[]>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      id, added_at,
      course:courses!inner(
        id, title, image_url, price, original_price,
        instructor:profiles!courses_instructor_id_fkey(id, name, nickname, avatar_url)
      )
    `)
    .eq('user_id', user.id)
    .order('added_at', { ascending: false })

  if (error) {
    return { success: false, error: { code: 'FETCH_FAILED', message: '장바구니를 불러오는데 실패했습니다.' } }
  }

  return { success: true, data: (data || []) as unknown as CartItemWithCourse[] }
}

// ─── Add To Cart (장바구니 추가) ───
export async function addToCart(courseId: string): Promise<ActionResult<{ itemId: string }>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  // 이미 수강 중인지 확인
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single()

  if (enrollment) {
    return { success: false, error: { code: 'ALREADY_ENROLLED', message: '이미 수강 중인 강의입니다.' } }
  }

  // 이미 장바구니에 있는지 확인
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single()

  if (existing) {
    return { success: false, error: { code: 'ALREADY_IN_CART', message: '이미 장바구니에 있는 강의입니다.' } }
  }

  const { data, error } = await supabase
    .from('cart_items')
    .insert({ user_id: user.id, course_id: courseId })
    .select('id')
    .single()

  if (error) {
    return { success: false, error: { code: 'ADD_FAILED', message: '장바구니 추가에 실패했습니다.' } }
  }

  revalidatePath('/cart')
  return { success: true, data: { itemId: data.id } }
}

// ─── Remove From Cart (장바구니 삭제) ───
export async function removeFromCart(itemId: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', user.id)

  if (error) {
    return { success: false, error: { code: 'REMOVE_FAILED', message: '장바구니 삭제에 실패했습니다.' } }
  }

  revalidatePath('/cart')
  return { success: true, data: undefined }
}

// ─── Clear Cart (장바구니 전체 삭제) ───
export async function clearCart(): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)

  if (error) {
    return { success: false, error: { code: 'CLEAR_FAILED', message: '장바구니 비우기에 실패했습니다.' } }
  }

  revalidatePath('/cart')
  return { success: true, data: undefined }
}
