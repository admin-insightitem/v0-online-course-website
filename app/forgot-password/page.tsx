"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const isFormValid = email.trim() !== "" && email.includes("@")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      setIsSubmitted(true)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
        <div className="w-full max-w-[440px] rounded-xl bg-background p-8 shadow-sm">
          {!isSubmitted ? (
            <>
              {/* Brand Tagline */}
              <div className="mb-8">
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                    <span className="text-xs font-bold text-primary-foreground">T</span>
                  </div>
                  <span className="text-base font-bold tracking-tight text-foreground">
                    TITAN<span className="text-primary">CLASS</span>
                  </span>
                </Link>
                <h1 className="text-2xl font-semibold leading-snug text-foreground">
                  당신의 성장을 위한 교육,
                  <br />
                  타이탄클래스.
                </h1>
              </div>

              {/* Instructions */}
              <div className="mb-8 text-sm leading-relaxed text-muted-foreground">
                <p>가입하신 이메일 주소를 입력해 주세요.</p>
                <p>
                  이메일 주소로 비밀번호를 <span className="font-medium text-accent">재설정할 수 있는 이메일</span>을 보내드립니다.
                </p>
                <p className="mt-2">
                  발송된 이메일의 비밀번호 재설정은 <span className="font-medium text-accent">10분</span> 간 유효합니다.
                </p>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-[13px] font-medium text-foreground">
                    이메일
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일 주소를 입력해 주세요."
                    className="h-12 w-full rounded-lg border border-border bg-card px-4 text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="h-12 w-full rounded-lg bg-primary text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                >
                  이메일 전송하기
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-3 w-3" />
                  로그인으로 돌아가기
                </Link>
              </div>
            </>
          ) : (
            /* Email Sent Confirmation */
            <>
              <div className="mb-8">
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                    <span className="text-xs font-bold text-primary-foreground">T</span>
                  </div>
                  <span className="text-base font-bold tracking-tight text-foreground">
                    TITAN<span className="text-primary">CLASS</span>
                  </span>
                </Link>
                <h1 className="text-2xl font-semibold leading-snug text-foreground">
                  이메일이 전송되었습니다.
                </h1>
              </div>

              <div className="mb-8 text-sm leading-relaxed text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">{email}</span> 주소로 비밀번호 재설정 이메일을 발송했습니다.
                </p>
                <p className="mt-2">
                  이메일을 확인하시고, 안내에 따라 비밀번호를 재설정해 주세요.
                </p>
                <p className="mt-2">
                  이메일이 도착하지 않았다면, 스팸 폴더를 확인해 주세요.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="h-12 w-full rounded-lg border border-border bg-card text-[15px] font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  다른 이메일로 다시 시도
                </button>
                <Link
                  href="/login"
                  className="flex h-12 w-full items-center justify-center rounded-lg bg-primary text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  로그인으로 돌아가기
                </Link>
              </div>
            </>
          )}
        </div>
    </div>
  )
}
