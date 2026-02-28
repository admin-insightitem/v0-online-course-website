'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult, Notification } from '@/types'

// ─── Get Notifications (알림 목록) ───
export async function getNotifications(options?: {
  unreadOnly?: boolean
  page?: number
  limit?: number
}): Promise<ActionResult<{ notifications: Notification[]; total: number; unreadCount: number }>> {
  const supabase = await createClient()
  const { unreadOnly = false, page = 1, limit = 20 } = options || {}

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  // 읽지 않은 알림 수
  const { count: unreadCount } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  let query = supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)

  if (unreadOnly) {
    query = query.eq('is_read', false)
  }

  query = query.order('created_at', { ascending: false })

  const from = (page - 1) * limit
  query = query.range(from, from + limit - 1)

  const { data, error, count } = await query

  if (error) {
    return { success: false, error: { code: 'FETCH_FAILED', message: '알림을 불러오는데 실패했습니다.' } }
  }

  return {
    success: true,
    data: {
      notifications: (data || []) as Notification[],
      total: count || 0,
      unreadCount: unreadCount || 0,
    },
  }
}

// ─── Mark As Read (읽음 처리) ───
export async function markNotificationAsRead(notificationId: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)

  if (error) {
    return { success: false, error: { code: 'UPDATE_FAILED', message: '업데이트에 실패했습니다.' } }
  }

  return { success: true, data: undefined }
}

// ─── Mark All As Read (전체 읽음) ───
export async function markAllNotificationsAsRead(): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  if (error) {
    return { success: false, error: { code: 'UPDATE_FAILED', message: '업데이트에 실패했습니다.' } }
  }

  revalidatePath('/mypage/notifications')
  return { success: true, data: undefined }
}

// ─── Delete Notification (알림 삭제) ───
export async function deleteNotification(notificationId: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)

  if (error) {
    return { success: false, error: { code: 'DELETE_FAILED', message: '삭제에 실패했습니다.' } }
  }

  return { success: true, data: undefined }
}

// ─── Delete All Notifications (전체 삭제) ───
export async function deleteAllNotifications(): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('user_id', user.id)

  if (error) {
    return { success: false, error: { code: 'DELETE_FAILED', message: '삭제에 실패했습니다.' } }
  }

  revalidatePath('/mypage/notifications')
  return { success: true, data: undefined }
}
