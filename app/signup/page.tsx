"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Check, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  // Agreement states
  const [agreeAll, setAgreeAll] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [agreeAge, setAgreeAge] = useState(false)
  const [agreeMarketing, setAgreeMarketing] = useState(false)
  const [showMarketingModal, setShowMarketingModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  const handleAgreeAll = () => {
    const newValue = !agreeAll
    setAgreeAll(newValue)
    setAgreeTerms(newValue)
    setAgreePrivacy(newValue)
    setAgreeAge(newValue)
    setAgreeMarketing(newValue)
  }

  const handleIndividualAgree = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    currentValue: boolean
  ) => {
    setter(!currentValue)
    // Check if all required are checked after this change
    const newTerms = setter === setAgreeTerms ? !currentValue : agreeTerms
    const newPrivacy = setter === setAgreePrivacy ? !currentValue : agreePrivacy
    const newAge = setter === setAgreeAge ? !currentValue : agreeAge
    const newMarketing = setter === setAgreeMarketing ? !currentValue : agreeMarketing
    
    if (newTerms && newPrivacy && newAge && newMarketing) {
      setAgreeAll(true)
    } else {
      setAgreeAll(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, "")
    setPhone(value)
  }

  const handleSendVerification = () => {
    if (email.trim()) {
      setEmailSent(true)
      // Handle email verification logic
    }
  }

  const isFormValid =
    name.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    password.trim() !== "" &&
    passwordConfirm.trim() !== "" &&
    password === passwordConfirm &&
    agreeTerms &&
    agreePrivacy &&
    agreeAge

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
      <main className="flex flex-1 items-start justify-center px-4 pt-12 pb-20 md:pt-16">
        <div className="w-full max-w-[440px]">
          {/* Brand Tagline */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold leading-snug text-foreground md:text-[28px]">
              {"당신의 성장을 위한 교육,"}
              <br />
              {"리치클래스."}
            </h1>
          </div>

          {/* Promotion Banner */}
          <div className="mb-8 rounded-lg bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm font-semibold text-amber-800">
              {"[신규 회원] 20% 할인 쿠폰 증정 중!"}
            </p>
            <p className="mt-1 text-xs text-amber-700">
              {"10초만에 회원 가입하고 할인 쿠폰 받자!"}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (isFormValid) {
                // handle signup
              }
            }}
            className="flex flex-col gap-5"
          >
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-[13px] font-medium text-foreground">
                {"이름"}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="한글로 공백 없이 입력해주세요."
                className="h-12 w-full rounded-lg border border-border bg-card px-4 text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[13px] font-medium text-foreground">
                {"이메일"}
              </label>
              <div className="flex gap-2">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="실제 사용하는 이메일 주소를 입력해주세요."
                  className="h-12 flex-1 rounded-lg border border-border bg-card px-4 text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendVerification}
                  disabled={!email.trim()}
                  className="h-12 whitespace-nowrap rounded-lg border border-border bg-card px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {emailSent ? "재발송" : "인증메일 발송"}
                </button>
              </div>
              {emailSent && (
                <p className="text-xs text-green-600">{"인증 메일이 발송되었습니다. 메일함을 확인해주세요."}</p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-[13px] font-medium text-foreground">
                {"휴대폰 번호 (숫자만)"}
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="-없이 숫자만 입력해주세요."
                className="h-12 w-full rounded-lg border border-border bg-card px-4 text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[13px] font-medium text-foreground">
                {"비밀번호"}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력해주세요."
                  className="h-12 w-full rounded-lg border border-border bg-card pr-12 pl-4 text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
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
            </div>

            {/* Password Confirm */}
            <div className="flex flex-col gap-2">
              <label htmlFor="passwordConfirm" className="text-[13px] font-medium text-foreground">
                {"비밀번호 확인"}
              </label>
              <div className="relative">
                <input
                  id="passwordConfirm"
                  type={showPasswordConfirm ? "text" : "password"}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="비밀번호를 다시 입력해주세요."
                  className="h-12 w-full rounded-lg border border-border bg-card pr-12 pl-4 text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  {showPasswordConfirm ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              {passwordConfirm && password !== passwordConfirm && (
                <p className="text-xs text-red-500">{"비밀번호가 일치하지 않습니다."}</p>
              )}
            </div>

            {/* Agreements */}
            <div className="mt-2 flex flex-col gap-3 border-t border-border pt-5">
              {/* Agree All */}
              <label className="flex cursor-pointer items-center gap-3">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded border ${
                    agreeAll
                      ? "border-primary bg-primary"
                      : "border-border bg-card"
                  }`}
                  onClick={handleAgreeAll}
                >
                  {agreeAll && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                </div>
                <span className="text-[14px] font-medium text-foreground">{"전체 동의"}</span>
              </label>

              <div className="ml-1 flex flex-col gap-2.5 border-l-2 border-border pl-5">
                {/* Terms */}
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border ${
                        agreeTerms
                          ? "border-primary bg-primary"
                          : "border-border bg-card"
                      }`}
                      onClick={() => handleIndividualAgree(setAgreeTerms, agreeTerms)}
                    >
                      {agreeTerms && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                    </div>
                    <span className="text-[13px] text-muted-foreground">
                      {"서비스 이용약관 동의 "}
                      <span className="text-primary">{"(필수)"}</span>
                    </span>
                  </label>
                  <button 
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-[12px] text-muted-foreground hover:underline"
                  >
                    {"보기"}
                  </button>
                </div>

                {/* Privacy */}
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border ${
                        agreePrivacy
                          ? "border-primary bg-primary"
                          : "border-border bg-card"
                      }`}
                      onClick={() => handleIndividualAgree(setAgreePrivacy, agreePrivacy)}
                    >
                      {agreePrivacy && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                    </div>
                    <span className="text-[13px] text-muted-foreground">
                      {"개인정보 수집 및 이용 동의 "}
                      <span className="text-primary">{"(필수)"}</span>
                    </span>
                  </label>
                  <button 
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-[12px] text-muted-foreground hover:underline"
                  >
                    {"보기"}
                  </button>
                </div>

                {/* Age */}
                <div className="flex items-center">
                  <label className="flex cursor-pointer items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border ${
                        agreeAge
                          ? "border-primary bg-primary"
                          : "border-border bg-card"
                      }`}
                      onClick={() => handleIndividualAgree(setAgreeAge, agreeAge)}
                    >
                      {agreeAge && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                    </div>
                    <span className="text-[13px] text-muted-foreground">
                      {"만 14세 이상입니다 "}
                      <span className="text-primary">{"(필수)"}</span>
                    </span>
                  </label>
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border ${
                        agreeMarketing
                          ? "border-primary bg-primary"
                          : "border-border bg-card"
                      }`}
                      onClick={() => handleIndividualAgree(setAgreeMarketing, agreeMarketing)}
                    >
                      {agreeMarketing && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                    </div>
                    <span className="text-[13px] text-muted-foreground">
                      {"마케팅 수신 동의 "}
                      <span className="text-muted-foreground/70">{"(선택)"}</span>
                    </span>
                  </label>
                  <button 
                    type="button"
                    onClick={() => setShowMarketingModal(true)}
                    className="text-[12px] text-muted-foreground hover:underline"
                  >
                    {"보기"}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-4">
              <button
                type="submit"
                disabled={!isFormValid}
                className="h-12 w-full rounded-lg bg-primary text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
              >
                {"회원가입하기"}
              </button>
            </div>
          </form>

          {/* Already have account */}
          <div className="mt-6 text-center">
            <p className="text-[13px] text-muted-foreground">
              {"이미 계정이 있으신가요? "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                {"로그인"}
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Marketing Modal */}
      <Dialog open={showMarketingModal} onOpenChange={setShowMarketingModal}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="flex flex-row items-center justify-between border-b border-border px-6 py-4">
            <DialogTitle className="text-lg font-semibold">{"마케팅 수신 동의"}</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4">
            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm table-fixed">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="w-[80px] border-r border-border px-3 py-3 text-center font-medium text-foreground">{"서비스"}</th>
                    <th className="w-[45%] border-r border-border px-3 py-3 text-center font-medium text-foreground">{"목적"}</th>
                    <th className="border-r border-border px-3 py-3 text-center font-medium text-foreground">{"항목"}</th>
                    <th className="w-[110px] px-3 py-3 text-center font-medium text-foreground">{"보유기간"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="border-r border-border px-3 py-3 text-center text-muted-foreground align-top">{"회원가입"}</td>
                    <td className="border-r border-border px-3 py-3 text-left text-muted-foreground align-top leading-relaxed">
                      {"(주) 컴퍼니가 제공하는 이용자 맞춤형 서비스 및 상품 추천, 각종 경품 행사, 이벤트 등의 광고성 정보 제공(이메일, 서신우편, SMS, 카카오톡 등)"}
                    </td>
                    <td className="border-r border-border px-3 py-3 text-center text-muted-foreground align-top">
                      {"이름, 이메일주소, 휴대전화번호, 마케팅 수신 동의 여부"}
                    </td>
                    <td className="px-3 py-3 text-center text-muted-foreground align-top">
                      {"회원 탈퇴 후 30일 또는 동의 철회 시까지"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Notice */}
            <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
              {"본 마케팅 정보 수신에 대한 동의를 거부하실 수 있으며, 이 경우 회원가입은 가능하나 일부 서비스 이용 및 각종 광고, 할인, 이벤트 및 이용자 맞춤형 상품 추천 등의 서비스 제공이 제한될 수 있습니다."}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-3xl p-0">
          <DialogHeader className="flex flex-row items-center justify-between border-b border-border px-6 py-4">
            <DialogTitle className="text-lg font-semibold">{"부자 클래스 이용약관"}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
            <div className="space-y-6 text-sm text-muted-foreground">
              <section>
                <h3 className="mb-3 font-semibold text-foreground">{"제1장 총칙"}</h3>
                <ul className="space-y-1 pl-2">
                  <li>{"제 1 조 (목적)"}</li>
                  <li>{"제 2 조 (용어의 정의)"}</li>
                  <li>{"제 3 조 (약관의 명시와 효력 및 개정)"}</li>
                  <li>{"제 4 조 (약관 외 준칙)"}</li>
                  <li>{"제 5 조 (이용계약의 성립)"}</li>
                  <li>{"제 6 조 (회원의 의무)"}</li>
                  <li>{"제 7 조 (회원의 아이디 및 비밀번호에 대한 의무)"}</li>
                  <li>{"제 8 조 (회원 탈퇴 및 자격 상실 등)"}</li>
                  <li>{"제 9 조 (회사의 의무)"}</li>
                  <li>{"제 10 조 (서비스의 제공 및 변경)"}</li>
                  <li>{"제 11 조 (서비스의 중단)"}</li>
                  <li>{"제 12 조 (개인정보보호)"}</li>
                  <li>{"제 13 조 (회원에 대한 통지)"}</li>
                  <li>{"제 14 조 (정보의 제공 및 광고의 게재)"}</li>
                </ul>
              </section>

              <section>
                <h3 className="mb-3 font-semibold text-foreground">{"제2장 전자상거래 서비스"}</h3>
                <ul className="space-y-1 pl-2">
                  <li>{"제 15 조 (구매신청)"}</li>
                  <li>{"제 16 조 (대금지급방법)"}</li>
                  <li>{"제 17 조 (할인쿠폰)"}</li>
                  <li>{"제 18 조 (포인트)"}</li>
                  <li>{"제 19 조 (계약의 성립)"}</li>
                  <li>{"제 20 조 (수신확인통지·구매신청 변경 및 취소)"}</li>
                  <li>{"제 21 조 (상품 등의 공급)"}</li>
                  <li>{"제 22 조 (환급)"}</li>
                  <li>{"제 23 조 (청약철회 등)"}</li>
                  <li>{"제 24 조 (청약철회 등의 효과)"}</li>
                  <li>{"제 25 조 (상품 등의 환불 특칙)"}</li>
                </ul>
              </section>

              <section>
                <h3 className="mb-3 font-semibold text-foreground">{"제3장 커뮤니티"}</h3>
                <ul className="space-y-1 pl-2">
                  <li>{"제 26 조 (커뮤니티의 이용)"}</li>
                  <li>{"제 27 조 (게시물에 대한 권리 귀속 및 사용 허가)"}</li>
                  <li>{"제 28 조 (게시물의 삭제 등)"}</li>
                  <li>{"제 29 조 (커뮤니티 이용의 제한)"}</li>
                  <li>{"제 30 조 (회사의 커뮤니티 서비스에 대한 면책)"}</li>
                </ul>
              </section>

              <section>
                <h3 className="mb-3 font-semibold text-foreground">{"제4장 기타 사항"}</h3>
                <ul className="space-y-1 pl-2">
                  <li>{"제 31 조 (연결 사이트와 피연결 ��이트의 관계)"}</li>
                  <li>{"제 32 조 (저작권의 귀속 및 이용제한)"}</li>
                  <li>{"제 33 조 (회사의 면책)"}</li>
                  <li>{"제 34 조 (분쟁해결)"}</li>
                  <li>{"제 35 조 (재판권 및 준거법)"}</li>
                </ul>
              </section>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Modal */}
      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="max-w-3xl p-0">
          <DialogHeader className="flex flex-row items-center justify-between border-b border-border px-6 py-4">
            <DialogTitle className="text-lg font-semibold">{"개인정보 수집 및 이용 동의"}</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4">
            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="border-r border-border px-4 py-3 text-center font-medium text-foreground">{"수집항목"}</th>
                    <th className="border-r border-border px-4 py-3 text-center font-medium text-foreground">{"수집 및 이용 목적"}</th>
                    <th className="px-4 py-3 text-center font-medium text-foreground">{"이용 및 보유기간"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="border-r border-border px-4 py-4 text-center text-muted-foreground">
                      {"[필수] 이름, 이메일, 휴대폰번호, 비밀번호"}
                    </td>
                    <td className="border-r border-border px-4 py-4 text-center text-muted-foreground">
                      {"회원가입 및 서비스 이용"}
                    </td>
                    <td className="px-4 py-4 text-center font-medium text-foreground">
                      {"회원 탈퇴 후 30일까지"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Notice */}
            <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
              {"※고객님께서는 [필수] 개인정보 수집 및 이용동의에 거부할 수 있습니다."}
              <br />
              {"단, 거부할 경우 회원가입이 불가능합니다."}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
