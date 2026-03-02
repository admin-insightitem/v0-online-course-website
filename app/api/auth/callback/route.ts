import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirect') || '/'

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', origin))
  }

  const response = NextResponse.redirect(new URL(redirectTo, origin))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // 세션 교환
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL('/login?error=auth_failed', origin))
  }

  const { data: { user } } = await supabase.auth.getUser()

  // 카카오 OAuth 프로필 동기화 (프로필 없으면 생성, 있으면 메타데이터만 갱신)
  if (user && user.app_metadata?.provider === 'kakao') {
    const meta = user.user_metadata

    const profileData = {
      email: meta?.email ?? user.email ?? null,
      name: meta?.name ?? meta?.full_name ?? null,
      nickname: meta?.preferred_username ?? meta?.user_name ?? meta?.nickname ?? null,
      avatar_url: meta?.avatar_url ?? meta?.picture ?? null,
      birthyear: meta?.birthyear ?? null,
      birthday: meta?.birthday ?? null,
      birthday_type: meta?.birthday_type ?? null,
      gender: meta?.gender ?? null,
      phone: meta?.phone_number ?? null,
    }

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existingProfile) {
      // 프로필 없으면 생성 (role: customer, join_method: kakao)
      await supabase.from('profiles').insert({
        id: user.id,
        ...profileData,
        role: 'customer',
        join_method: 'kakao',
      })
    } else {
      // 프로필 있으면 메타데이터만 갱신 (role은 유지)
      await supabase.from('profiles').update(profileData).eq('id', user.id)
    }
  }

  // 카카오톡 채널 추가 상태는 OAuth user_metadata에 포함되지 않음
  // 별도 API 호출 필요: GET https://kapi.kakao.com/v1/api/talk/channels
  // → 클라이언트에서 Kakao JS SDK로 확인 후 서버 액션(updateKakaoChannelStatus)으로 DB 업데이트

  // Role 기반 리다이렉트 (redirect 파라미터 없을 때)
  if (user && !searchParams.get('redirect')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', origin))
    }
    if (profile?.role === 'instructor') {
      return NextResponse.redirect(new URL('/teacher', origin))
    }
  }

  return response
}
