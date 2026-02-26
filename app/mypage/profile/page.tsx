"use client"

import { useState } from "react"
import Link from "next/link"
import { MypageLayout } from "@/components/mypage-layout"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ProfilePage() {
  const [name, setName] = useState("김경민")
  const [email] = useState("k1k1m1@naver.com")
  const [phone, setPhone] = useState("01028153911")
  const [marketing, setMarketing] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <MypageLayout activeMenu="회원정보관리">
      <h2 className="text-xl font-bold text-foreground">회원정보</h2>

      <div className="mt-8 flex flex-col gap-6">
        {/* Name */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <label className="w-28 shrink-0 text-sm font-semibold text-foreground">
            이름
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex h-11 w-full rounded-md border border-border bg-card px-4 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <label className="w-28 shrink-0 text-sm font-semibold text-foreground">
            이메일
          </label>
          <input
            type="email"
            value={email}
            readOnly
            className="flex h-11 w-full cursor-not-allowed rounded-md border border-border bg-muted px-4 text-sm text-muted-foreground outline-none"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <label className="w-28 shrink-0 text-sm font-semibold text-foreground">
            휴대폰번호
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex h-11 w-full rounded-md border border-border bg-card px-4 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Marketing consent */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-6">
          <label className="w-28 shrink-0 text-sm font-semibold text-foreground">
            마케팅 수신 설정
          </label>
          <div className="w-full rounded-lg border border-border bg-muted/30 px-5 py-4">
            <label className="flex cursor-pointer items-start gap-3">
              <div className="relative mt-0.5 flex">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="peer sr-only"
                />
                <div className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                  marketing
                    ? "border-accent bg-accent"
                    : "border-border bg-card"
                }`}>
                  {marketing && (
                    <svg className="h-3.5 w-3.5 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  이벤트/쿠폰 등 혜택 수신 동의
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  체크하지 않으면 무료특강 혜택을 받으실 수 없습니다.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSave}
          className="h-11 min-w-[120px] bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {saved ? (
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" />
              수정 완료
            </span>
          ) : (
            "수정하기"
          )}
        </Button>
      </div>

      {/* 회원탈퇴 링크 */}
      <div className="mt-12 flex justify-center">
        <Link
          href="/mypage/withdraw"
          className="text-xs text-muted-foreground underline hover:text-foreground"
        >
          회원탈퇴
        </Link>
      </div>
    </MypageLayout>
  )
}
