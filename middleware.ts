import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// 공개 접근 가능 경로
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/courses',
  '/access-denied',
  '/api/webhooks',
  '/api/auth',
]

// 경로 매칭 헬퍼
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => {
    if (path === '/') return pathname === '/'
    return pathname === path || pathname.startsWith(path + '/')
  })
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 정적 파일, _next 등은 무시
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/icons') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Supabase 세션 갱신
  const { user, supabaseResponse, supabase } = await updateSession(request)

  // 로그인 상태에서 /login, /signup 접근 시 홈으로 리다이렉트
  if (user && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 공개 경로는 통과
  if (isPublicPath(pathname)) {
    return supabaseResponse
  }

  // 미인증 유저 → 로그인 페이지
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Role 기반 접근 제어
  if (pathname.startsWith('/admin') || pathname.startsWith('/teacher')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (pathname.startsWith('/admin') && profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/access-denied', request.url))
    }

    if (pathname.startsWith('/teacher') && profile?.role !== 'instructor') {
      return NextResponse.redirect(new URL('/access-denied', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
