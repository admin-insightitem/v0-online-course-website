"use client"

import { useState } from "react"
import { MypageLayout } from "@/components/mypage-layout"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function ProfilePage() {
  // 기본 데이터
  const [name, setName] = useState("김경민")
  const email = "k1k1m1@naver.com" // 카카오톡 정보, 수정 불가
  const phone = "010-2815-3911" // 카카오톡 정보, 수정 불가 (하이픈 형식)
  const [marketingConsent, setMarketingConsent] = useState(true)

  const handleSave = () => {
    // 저장 로직
    alert("저장되었습니다.")
  }

  return (
    <MypageLayout activeMenu="회원정보관리">
      <h2 className="text-xl font-bold text-foreground">{"회원정보"}</h2>

      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        {/* 이름 */}
        <div className="flex items-center border-b border-border py-6 first:pt-0">
          <label className="w-32 shrink-0 text-sm font-medium text-primary">{"이름"}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 h-11 rounded-md border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>

        {/* 이메일 - 수정 불가 */}
        <div className="flex items-center border-b border-border py-6">
          <label className="w-32 shrink-0 text-sm font-medium text-primary">{"이메일"}</label>
          <input
            type="email"
            value={email}
            readOnly
            className="flex-1 h-11 rounded-md border border-border bg-muted/30 px-4 text-sm text-muted-foreground outline-none cursor-default"
          />
        </div>

        {/* 휴대폰번호 - 수정 불가 */}
        <div className="flex items-center border-b border-border py-6">
          <label className="w-32 shrink-0 text-sm font-medium text-primary">{"휴대폰번호"}</label>
          <input
            type="tel"
            value={phone}
            readOnly
            className="flex-1 h-11 rounded-md border border-border bg-muted/30 px-4 text-sm text-muted-foreground outline-none cursor-default"
          />
        </div>

        {/* 마케팅 수신 설정 */}
        <div className="flex items-start py-6">
          <label className="w-32 shrink-0 text-sm font-medium text-primary pt-2">{"마케팅 수신 설정"}</label>
          <div className="flex-1">
            <div className="rounded-lg border border-border bg-background p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <div
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    marketingConsent
                      ? "border-accent bg-accent"
                      : "border-border bg-background"
                  }`}
                  onClick={() => setMarketingConsent(!marketingConsent)}
                >
                  {marketingConsent && <Check className="h-3.5 w-3.5 text-accent-foreground" />}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground">
                    {"이벤트/쿠폰 등 혜택 수신 동의"}
                  </span>
                  <span className="text-xs text-primary">
                    {"체크하지 않으면 무료특강 혜택을 받으실 수 없습니다."}
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* 저장하기 버튼 */}
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleSave}
            className="h-11 px-8 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {"저장하기"}
          </Button>
        </div>
      </div>
    </MypageLayout>
  )
}
