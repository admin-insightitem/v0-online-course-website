'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult, OrderWithItems } from '@/types'

// ─── Create Order (주문 생성 - 장바구니 → 주문) ───
export async function createOrder(options?: {
  couponCode?: string
}): Promise<ActionResult<{ orderId: string; orderNumber: string }>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  // 장바구니 조회
  const { data: cartItems } = await supabase
    .from('cart_items')
    .select('id, course:courses!inner(id, title, price)')
    .eq('user_id', user.id)

  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: { code: 'EMPTY_CART', message: '장바구니가 비어있습니다.' } }
  }

  // 총 금액 계산
  let totalAmount = cartItems.reduce((sum, item: any) => sum + (item.course.price || 0), 0)
  let discountAmount = 0
  let couponId: string | null = null

  // 쿠폰 적용
  if (options?.couponCode) {
    const couponResult = await applyCoupon(options.couponCode, totalAmount)
    if (couponResult.success) {
      discountAmount = couponResult.data.discount
      couponId = couponResult.data.couponId
    }
  }

  // 주문 번호 생성
  const orderNumber = `RC${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`

  // 주문 생성
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      order_number: orderNumber,
      total_amount: totalAmount - discountAmount,
      discount_amount: discountAmount,
      coupon_id: couponId,
      status: 'pending',
    })
    .select('id')
    .single()

  if (orderError || !order) {
    return { success: false, error: { code: 'ORDER_FAILED', message: '주문 생성에 실패했습니다.' } }
  }

  // 주문 항목 생성
  const orderItems = cartItems.map((item: any) => ({
    order_id: order.id,
    course_id: item.course.id,
    price: item.course.price,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    // 롤백: 주문 삭제
    await supabase.from('orders').delete().eq('id', order.id)
    return { success: false, error: { code: 'ORDER_FAILED', message: '주문 항목 생성에 실패했습니다.' } }
  }

  revalidatePath('/order')
  return { success: true, data: { orderId: order.id, orderNumber } }
}

// ─── Complete Payment (결제 완료 처리 + 수강 등록) ───
export async function completePayment(orderId: string, paymentMethod: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  // 주문 확인
  const { data: order } = await supabase
    .from('orders')
    .select('id, status, user_id')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (!order || order.status !== 'pending') {
    return { success: false, error: { code: 'INVALID_ORDER', message: '처리할 수 없는 주문입니다.' } }
  }

  // 주문 완료 처리
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      status: 'completed',
      payment_method: paymentMethod,
      paid_at: new Date().toISOString(),
    })
    .eq('id', orderId)

  if (updateError) {
    return { success: false, error: { code: 'PAYMENT_FAILED', message: '결제 처리에 실패했습니다.' } }
  }

  // 주문 항목에서 강의 ID 가져와서 수강 등록
  const { data: orderItems } = await supabase
    .from('order_items')
    .select('course_id')
    .eq('order_id', orderId)

  if (orderItems) {
    const enrollments = orderItems.map((item: any) => ({
      user_id: user.id,
      course_id: item.course_id,
    }))

    // 이미 수강 중인 건 무시 (upsert)
    await supabase
      .from('enrollments')
      .upsert(enrollments, { onConflict: 'user_id,course_id', ignoreDuplicates: true })

    // 강의 student_count 증가
    for (const item of orderItems) {
      await supabase.rpc('increment_student_count', { course_id_input: item.course_id })
        .then(() => {})
        .catch(() => {
          // rpc가 없으면 직접 업데이트
          supabase.from('courses')
            .update({ student_count: supabase.rpc ? undefined : 0 })
            .eq('id', item.course_id)
        })
    }
  }

  // 장바구니 비우기
  await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)

  // 쿠폰 사용 횟수 증가
  const { data: orderData } = await supabase
    .from('orders')
    .select('coupon_id')
    .eq('id', orderId)
    .single()

  if (orderData?.coupon_id) {
    await supabase.rpc('increment_coupon_usage', { coupon_id_input: orderData.coupon_id })
      .catch(() => {})
  }

  revalidatePath('/mypage')
  revalidatePath('/cart')
  revalidatePath('/order/complete')
  return { success: true, data: undefined }
}

// ─── Get My Orders (내 주문 목록) ───
export async function getMyOrders(options?: {
  page?: number
  limit?: number
}): Promise<ActionResult<{ orders: OrderWithItems[]; total: number }>> {
  const supabase = await createClient()
  const { page = 1, limit = 10 } = options || {}

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  const from = (page - 1) * limit

  const { data, error, count } = await supabase
    .from('orders')
    .select(`
      id, order_number, total_amount, discount_amount, payment_method, status, paid_at, created_at,
      items:order_items(
        id, price,
        course:courses(id, title, image_url)
      ),
      coupon:coupons(code, name)
    `, { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)

  if (error) {
    return { success: false, error: { code: 'FETCH_FAILED', message: '주문 목록을 불러오는데 실패했습니다.' } }
  }

  return { success: true, data: { orders: (data || []) as unknown as OrderWithItems[], total: count || 0 } }
}

// ─── Get Order Detail (주문 상세) ───
export async function getOrderDetail(orderId: string): Promise<ActionResult<OrderWithItems>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id, order_number, total_amount, discount_amount, payment_method, status, paid_at, created_at,
      items:order_items(
        id, price,
        course:courses(id, title, image_url)
      ),
      coupon:coupons(code, name)
    `)
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    return { success: false, error: { code: 'NOT_FOUND', message: '주문을 찾을 수 없습니다.' } }
  }

  return { success: true, data: data as unknown as OrderWithItems }
}

// ─── Apply Coupon (쿠폰 적용 유효성 검증) ───
export async function applyCoupon(couponCode: string, totalAmount: number): Promise<ActionResult<{ discount: number; couponId: string }>> {
  const supabase = await createClient()

  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', couponCode)
    .eq('is_active', true)
    .single()

  if (error || !coupon) {
    return { success: false, error: { code: 'INVALID_COUPON', message: '유효하지 않은 쿠폰 코드입니다.' } }
  }

  // 만료일 확인
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { success: false, error: { code: 'EXPIRED_COUPON', message: '만료된 쿠폰입니다.' } }
  }

  // 시작일 확인
  if (coupon.starts_at && new Date(coupon.starts_at) > new Date()) {
    return { success: false, error: { code: 'NOT_STARTED', message: '아직 사용할 수 없는 쿠폰입니다.' } }
  }

  // 사용 횟수 확인
  if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
    return { success: false, error: { code: 'USAGE_EXCEEDED', message: '쿠폰 사용 한도를 초과했습니다.' } }
  }

  // 최소 구매 금액 확인
  if (totalAmount < coupon.min_purchase) {
    return { success: false, error: { code: 'MIN_PURCHASE', message: `최소 구매 금액은 ${coupon.min_purchase.toLocaleString()}원입니다.` } }
  }

  // 할인 금액 계산
  let discount: number
  if (coupon.type === 'percent') {
    discount = Math.round(totalAmount * (coupon.discount_value / 100))
    if (coupon.max_discount && discount > coupon.max_discount) {
      discount = coupon.max_discount
    }
  } else {
    discount = coupon.discount_value
  }

  return { success: true, data: { discount, couponId: coupon.id } }
}

// ─── Request Refund (환불 요청) ───
export async function requestRefund(orderId: string, reason: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  // 주문 확인
  const { data: order } = await supabase
    .from('orders')
    .select('id, total_amount, status')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (!order || order.status !== 'completed') {
    return { success: false, error: { code: 'INVALID_ORDER', message: '환불할 수 없는 주문입니다.' } }
  }

  // 이미 환불 요청이 있는지 확인
  const { data: existingRefund } = await supabase
    .from('refunds')
    .select('id')
    .eq('order_id', orderId)
    .in('status', ['pending', 'approved'])
    .single()

  if (existingRefund) {
    return { success: false, error: { code: 'ALREADY_REQUESTED', message: '이미 환불 요청이 존재합니다.' } }
  }

  const { error } = await supabase
    .from('refunds')
    .insert({
      order_id: orderId,
      user_id: user.id,
      amount: order.total_amount,
      reason,
    })

  if (error) {
    return { success: false, error: { code: 'REFUND_FAILED', message: '환불 요청에 실패했습니다.' } }
  }

  revalidatePath('/mypage/orders')
  return { success: true, data: undefined }
}
