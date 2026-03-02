"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { MessageCircle } from "lucide-react"
import { signInWithKakao } from "@/lib/actions/auth"

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  )
}

function LoginPageContent() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect")

  const handleKakaoLogin = async () => {
    setIsSubmitting(true)
    try {
      const result = await signInWithKakao(redirectTo || undefined)
      if (result.success) {
        window.location.href = result.data.url
      } else {
        setIsSubmitting(false)
      }
    } catch {
      setIsSubmitting(false)
    }
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

      {/* Login */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-[400px] text-center">
          {/* Brand Tagline */}
          <div className="mb-10">
            <h1 className="text-2xl font-semibold leading-snug text-foreground md:text-[28px]">
              당신의 성장을 위한 교육,
              <br />
              부자 클래스.
            </h1>
          </div>

          {/* Kakao Login */}
          <button
            onClick={handleKakaoLogin}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-4 py-3.5 text-[15px] font-semibold text-[#3C1E1E] transition-colors hover:bg-[#FADA0A] disabled:opacity-50"
          >
            <MessageCircle className="h-5 w-5 fill-[#3C1E1E]" />
            카카오로 1초 만에 시작하기
          </button>
        </div>
      </main>
    </div>
  )
}
