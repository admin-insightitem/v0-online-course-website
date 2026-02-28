"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, MessageCircle, ArrowLeft, Loader2 } from "lucide-react"
import { signUp, signInWithKakao } from "@/lib/actions/auth"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [marketingAgreed, setMarketingAgreed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const isFormValid = email.trim() !== "" && password.trim() !== "" && password.length >= 6

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || isPending) return
    setError(null)

    startTransition(async () => {
      const formData = new FormData()
      formData.set("email", email)
      formData.set("password", password)
      if (name.trim()) formData.set("name", name.trim())
      formData.set("marketing_agreed", String(marketingAgreed))

      const result = await signUp(formData)

      if (!result.success) {
        setError(result.error.message)
        return
      }

      router.push("/mypage")
      router.refresh()
    })
  }

  const handleKakaoSignup = () => {
    startTransition(async () => {
      const result = await signInWithKakao()
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

      {/* Signup Form */}
      <main className="flex flex-1 items-start justify-center px-4 pt-12 pb-20 md:pt-20">
        <div className="w-full max-w-[400px]">
          {/* Title */}
          <div className="mb-10">
            <h1 className="text-2xl font-semibold leading-snug text-foreground md:text-[28px]">
              회원가입
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              RichClass에서 성장의 시작을 함께하세요.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Kakao Signup */}
          <button
            onClick={handleKakaoSignup}
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
                또는 이메일로 가입
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-[13px] font-medium text-foreground">
                이름 <span className="text-muted-foreground">(선택)</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력해 주세요"
                disabled={isPending}
                className="h-12 w-full rounded-lg border border-border bg-card px-4 text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none disabled:opacity-50"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[13px] font-medium text-foreground">
                이메일 <span className="text-destructive">*</span>
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
                비밀번호 <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6자 이상 입력해 주세요"
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
              {password.length > 0 && password.length < 6 && (
                <p className="text-xs text-destructive">비밀번호는 6자 이상이어야 합니다.</p>
              )}
            </div>

            {/* Marketing Agreement */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={marketingAgreed}
                onChange={(e) => setMarketingAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-[13px] leading-relaxed text-muted-foreground">
                마케팅 정보 수신에 동의합니다. (선택)
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isFormValid || isPending}
              className="flex h-12 w-full items-center justify-center rounded-lg bg-primary text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            >
              {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "가입하기"}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" />
              이미 계정이 있으신가요? 로그인
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
