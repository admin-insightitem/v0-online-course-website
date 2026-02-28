"use client"

import { Suspense, useState, useTransition } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, MessageCircle, ArrowRight, Loader2 } from "lucide-react"
import { signIn, signInWithKakao } from "@/lib/actions/auth"

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  )
}

function LoginPageContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const router = useRouter()
  const redirectTo = searchParams.get("redirect")

  const isFormValid = email.trim() !== "" && password.trim() !== ""

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || isPending) return
    setError(null)

    startTransition(async () => {
      const formData = new FormData()
      formData.set("email", email)
      formData.set("password", password)
      if (redirectTo) formData.set("redirect", redirectTo)

      const result = await signIn(formData)

      if (!result.success) {
        setError(result.error.message)
        return
      }

      router.push(result.data.redirectTo)
      router.refresh()
    })
  }

  const handleKakaoLogin = () => {
    startTransition(async () => {
      const result = await signInWithKakao(redirectTo || undefined)
      if (result.success) {
        window.location.href = result.data.url
      }
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">R</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Rich<span className="text-primary">Class</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <main className="flex flex-1 items-start justify-center px-4 pt-12 pb-20 md:pt-20">
        <div className="w-full max-w-[400px]">
          {/* Brand Tagline */}
          <div className="mb-10">
            <h1 className="text-2xl font-semibold leading-snug text-foreground md:text-[28px]">
              당신의 성장을 위한 교육,
              <br />
              부자 클래스.
            </h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Kakao Login */}
          <button
            onClick={handleKakaoLogin}
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-4 py-3.5 text-[15px] font-semibold text-[#3C1E1E] transition-colors hover:bg-[#FADA0A] disabled:opacity-50"
          >
            <MessageCircle className="h-5 w-5 fill-[#3C1E1E]" />
            카카오로 1초 만에 시작하기
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-[13px] text-muted-foreground">
                또는 이메일로 로그인
              </span>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[13px] font-medium text-foreground">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                disabled={isPending}
                className="h-12 w-full rounded-lg border border-border bg-card px-4 text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[13px] font-medium text-foreground">
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력해 주세요"
                  disabled={isPending}
                  className="h-12 w-full rounded-lg border border-border bg-card pr-12 pl-4 text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-[13px] font-medium text-accent transition-colors hover:underline"
                >
                  비밀번호 찾기
                </Link>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-2 flex flex-col gap-3">
              <button
                type="submit"
                disabled={!isFormValid || isPending}
                className="flex h-12 w-full items-center justify-center rounded-lg bg-primary text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
              >
                {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "로그인"}
              </button>

              <Link
                href="/signup"
                className="flex h-12 w-full items-center justify-center rounded-lg border border-border bg-card text-[15px] font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                이메일로 회원가입
              </Link>
            </div>
          </form>

          {/* Help */}
          <div className="mt-8 text-center">
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              로그인/회원 관련 궁금하신 사항이 있다면?
            </p>
            <Link
              href="/support"
              className="mt-1 inline-flex items-center gap-1 text-[13px] font-medium text-accent transition-colors hover:underline"
            >
              자주 묻는 질문 바로가기
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
