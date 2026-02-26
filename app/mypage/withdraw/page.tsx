"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MypageLayout } from "@/components/mypage-layout"
import { Button } from "@/components/ui/button"
import { ChevronDown, CheckCircle, Eye, EyeOff } from "lucide-react"

const withdrawReasons = [
  "수강하고자 하는 강의가 없어요",
  "서비스 이용이 불편해요",
  "다른 서비스를 이용하고 싶어요",
  "자주 이용하지 않아요",
  "개인정보가 걱정돼요",
  "기타",
]

export default function WithdrawPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedReason, setSelectedReason] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [showComplete, setShowComplete] = useState(false)

  // 비밀번호 확인 상태
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const userName = "김경민"

  const handlePasswordStep = () => {
    if (password && password === confirmPassword) {
      setStep(2)
    }
  }

  const handleNextStep = () => {
    if (selectedReason) {
      setStep(3)
    }
  }

  const handleWithdraw = () => {
    if (agreed) {
      setShowComplete(true)
    }
  }

  const handleComplete = () => {
    router.push("/")
  }

  // 탈퇴 완료 모달
  if (showComplete) {
    return (
      <MypageLayout activeMenu="회원정보관리">
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mt-6 text-xl font-bold text-foreground">회원 탈퇴가 완료되었습니다</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            그동안 이용해 주셔서 감사합니다.<br />
            더 좋은 서비스로 다시 만나뵙겠습니다.
          </p>
          <Button
            onClick={handleComplete}
            className="mt-8 h-11 min-w-[160px] bg-accent text-accent-foreground hover:bg-accent/90"
          >
            홈으로 이동
          </Button>
        </div>
      </MypageLayout>
    )
  }

  return (
    <MypageLayout activeMenu="회원정보관리">
      <h2 className="text-xl font-bold text-foreground">회원 탈퇴</h2>
      <div className="mt-4 h-px bg-border" />

      {step === 1 ? (
        // Step 1: 비밀번호 확인
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-red-600">
            본인 확인을 위해<br />
            비밀번호를 입력해주세요.
          </h3>

          <div className="mt-8 space-y-4">
            {/* 비밀번호 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted-foreground">비밀번호</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력해주세요"
                  className="flex h-12 w-full rounded-md border border-border bg-card px-4 pr-10 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted-foreground">비밀번호 확인</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력해주세요"
                  className="flex h-12 w-full rounded-md border border-border bg-card px-4 pr-10 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/mypage/profile")}
              className="h-12 flex-1"
            >
              취소하기
            </Button>
            <Button
              onClick={handlePasswordStep}
              disabled={!password || password !== confirmPassword}
              className="h-12 flex-1 bg-red-600 text-white hover:bg-red-700 disabled:bg-muted disabled:text-muted-foreground"
            >
              다음 단계 이동
            </Button>
          </div>
        </div>
      ) : step === 2 ? (
        // Step 2: 탈퇴 사유 선택
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-red-600">
            {userName}님,<br />
            저희 서비스를 떠난다니 아쉽습니다.
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">
            탈퇴 사유를 알려주시면 더 향상된 서비스로 거듭나겠습니다!
          </p>

          {/* Dropdown */}
          <div className="relative mt-8">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex h-12 w-full items-center justify-between rounded-md border border-border bg-card px-4 text-left text-sm transition-colors hover:border-muted-foreground"
            >
              <span className={selectedReason ? "text-foreground" : "text-muted-foreground"}>
                {selectedReason || "탈퇴 사유를 선택해주세요"}
              </span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full z-10 mt-1 w-full rounded-md border border-border bg-card py-1 shadow-lg">
                {withdrawReasons.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => {
                      setSelectedReason(reason)
                      setIsDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-secondary ${
                      selectedReason === reason ? "bg-secondary text-accent" : "text-foreground"
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="h-12 flex-1"
            >
              취소하기
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={!selectedReason}
              className="h-12 flex-1 bg-red-600 text-white hover:bg-red-700 disabled:bg-muted disabled:text-muted-foreground"
            >
              다음 단계 이동
            </Button>
          </div>
        </div>
      ) : (
        // Step 3: 탈퇴 안내 및 동의
        <div className="mt-8">
          <p className="text-base font-semibold text-foreground">
            회원 탈퇴 전 아래 사항을 꼭 확인해주시기 바랍니다.
          </p>

          <div className="mt-6 space-y-6">
            {/* 탈퇴 시 처리 내용 */}
            <div>
              <h4 className="text-sm font-bold text-foreground">1. 탈퇴 시 처리 내용</h4>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>- 아이디는 즉시 탈퇴 처리되며, 강의 수강권/구독권/쿠폰 등 보유하신 모든 서비스와 회원 정보에 대한 권리는 소멸됩니다.</li>
                <li>- 회원 탈퇴 후에는 회원님에 대한 정보가 삭제되므로, 회원님의 상품 구매 여부/구매 상태 등을 당사가 확인할 수 없습니다.</li>
                <li>- 서비스 제공을 위해 수집한 정보는 소비자 불만 및 분쟁 해결 목적으로 탈퇴 시점으로부터 30일간 보관 후 삭제합니다.</li>
                <li>- 30일 이후 회원 정보 및 서비스 정보 등 모든 정보는 삭제되며 복구되지 않습니다.</li>
                <li>- 기타 탈퇴와 관련한 모든 정책은 회원가입 시 동의하신 <span className="text-accent underline cursor-pointer">이용 약관</span> 및 <span className="text-accent underline cursor-pointer">개인정보 수집</span> 및 이용 등의 내용에 따릅니다.</li>
                <li>- 또한, 관계법령에 따라 회사가 보관하여야 하는 정보는 일정 기간 보관 처리합니다.</li>
              </ul>
            </div>

            {/* 탈퇴 시 게시물 관리 */}
            <div>
              <h4 className="text-sm font-bold text-foreground">2. 탈퇴 시 게시물 관리</h4>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>- 회원탈퇴 후 당사 고객센터/질의응답 게시판 등으로 문의하신 게시글 및 댓글은 삭제되지 않습니다.</li>
              </ul>
            </div>

            {/* 탈퇴 후 재가입 규정 */}
            <div>
              <h4 className="text-sm font-bold text-foreground">3. 탈퇴 후 재가입 규정</h4>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>- 탈퇴하신 후 30일간 동일한 이메일로 재가입이 불가능합니다.</li>
                <li>- 30일 이후 동일한 이메일로 가입하시더라도 탈퇴 전 보유한 정보는 복구되지 않습니다.</li>
                <li>- 30일은 탈퇴시점을 기준으로 하며, 동일한 날짜여도 조회/확인하는 시점에 따라 가능여부가 달라질 수 있습니다.</li>
              </ul>
            </div>

            {/* 관계 법령 */}
            <div className="rounded-lg bg-secondary/50 p-5">
              <h4 className="text-sm font-semibold text-foreground">관계 법령(관련법령은 위 항목보다 우선하여 적용됨)</h4>
              <div className="mt-4 space-y-4 text-xs text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">1. 전자상거래 등에서의 소비자보호에 관한 법률</p>
                  <ul className="mt-1.5 ml-4 space-y-1">
                    <li>• 계약 또는 청약 철회 등에 관한 기록 5년</li>
                    <li>• 대금 결제 및 재화 등의 공급에 관한 기록 5년</li>
                    <li>• 소비자의 불만 또는 분쟁 처리에 관한 기록 3년</li>
                    <li>• 전자금융거래에 관한 기록 5년</li>
                    <li>• 표시·광고에 관한 기록 6개월</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground">2. 통신비밀보호법</p>
                  <ul className="mt-1.5 ml-4 space-y-1">
                    <li>• 가입자 전기통신일시, 개시·종료시간, 상대방 가입자번호, 사용도수, 발신기지국 위치추적자료 1년</li>
                    <li>• 컴퓨터통신, 인터넷 로그기록자료, 접속지 추적자료 3개월</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 동의 체크박스 */}
          <div className="mt-8 flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <button
              onClick={() => setAgreed(!agreed)}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                agreed ? "border-accent bg-accent" : "border-border"
              }`}
            >
              {agreed && (
                <svg className="h-3.5 w-3.5 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span className="text-sm text-foreground">
              위 안내사항을 모두 확인하였으며, 이에 동의합니다.
            </span>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep(2)}
              className="h-12 flex-1"
            >
              취소하기
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={!agreed}
              className="h-12 flex-1 bg-red-600 text-white hover:bg-red-700 disabled:bg-muted disabled:text-muted-foreground"
            >
              탈퇴하기
            </Button>
          </div>
        </div>
      )}
    </MypageLayout>
  )
}
