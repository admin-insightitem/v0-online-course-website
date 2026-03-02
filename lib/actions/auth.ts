'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult, Profile } from '@/types'

// ─── Sign In with Kakao OAuth ───
export async function signInWithKakao(redirectTo?: string): Promise<ActionResult<{ url: string }>> {
  const supabase = await createClient()

  const callbackUrl = new URL('/api/auth/callback', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
  if (redirectTo) {
    callbackUrl.searchParams.set('redirect', redirectTo)
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: callbackUrl.toString(),
      scopes: process.env.NODE_ENV === 'production'
        ? 'profile_nickname profile_image account_email name phone_number birthyear birthday gender plusfriends'
        : 'profile_nickname profile_image account_email ',
    },
  })

  if (error) {
    return { success: false, error: { code: 'OAUTH_FAILED', message: '카카오 로그인에 실패했습니다.' } }
  }

  return { success: true, data: { url: data.url } }
}

// ─── Sign Out (로그아웃) ───
export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
}

// ─── Update Password (비밀번호 변경) ───
export async function updatePassword(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()

  const newPassword = formData.get('new_password') as string

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: { code: 'WEAK_PASSWORD', message: '비밀번호는 6자 이상이어야 합니다.' } }
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword })

  if (error) {
    return { success: false, error: { code: 'UPDATE_FAILED', message: '비밀번호 변경에 실패했습니다.' } }
  }

  return { success: true, data: undefined }
}

// ─── Update Profile (프로필 수정) ───
export async function updateProfile(formData: FormData): Promise<ActionResult<Profile>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  const updates: Record<string, unknown> = {}
  const name = formData.get('name')
  const nickname = formData.get('nickname')
  const phone = formData.get('phone')
  const marketingAgreed = formData.get('marketing_agreed')

  if (name !== null) updates.name = name
  if (nickname !== null) updates.nickname = nickname
  if (phone !== null) updates.phone = phone
  if (marketingAgreed !== null) updates.marketing_agreed = marketingAgreed === 'true'

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    return { success: false, error: { code: 'UPDATE_FAILED', message: '프로필 수정에 실패했습니다.' } }
  }

  revalidatePath('/mypage', 'layout')
  return { success: true, data: data as Profile }
}

// ─── Withdraw Account (회원 탈퇴 - soft delete) ───
export async function withdrawAccount(): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  // Soft delete: deleted_at 설정
  const { error } = await supabase
    .from('profiles')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', user.id)

  if (error) {
    return { success: false, error: { code: 'WITHDRAW_FAILED', message: '회원 탈퇴에 실패했습니다.' } }
  }

  // 로그아웃 처리
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

// ─── Get Current Profile (현재 유저 프로필 조회) ───
export async function getCurrentProfile(): Promise<ActionResult<Profile | null>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: true, data: null }
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    return { success: false, error: { code: 'FETCH_FAILED', message: '프로필 조회에 실패했습니다.' } }
  }

  return { success: true, data: profile as Profile }
}

// ─── Update Kakao Channel Status (카카오톡 채널 추가 상태 업데이트) ───
export async function updateKakaoChannelStatus(connected: boolean): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ kakao_channel_connected: connected })
    .eq('id', user.id)

  if (error) {
    return { success: false, error: { code: 'UPDATE_FAILED', message: '채널 상태 업데이트에 실패했습니다.' } }
  }

  revalidatePath('/mypage', 'layout')
  return { success: true, data: undefined }
}
