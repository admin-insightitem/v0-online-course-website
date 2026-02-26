"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MypageLayout } from "@/components/mypage-layout"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Pencil, X } from "lucide-react"

export default function ProfilePage() {
  // 기본 데이터
  const [name, setName] = useState("김경민")
  const [email, setEmail] = useState("k1k1m1@naver.com")
  const [phone, setPhone] = useState("01028153911")
  const [emailMarketing, setEmailMarketing] = useState(true)
  const [smsMarketing, setSmsMarketing] = useState(false)
  const [emailMarketingDate] = useState("2025.09.02 00:43")
  const [smsMarketingDate] = useState("2024.04.04 20:25")
  const [isMarketingTermsOpen, setIsMarketingTermsOpen] = useState(false)

  // 모달 열릴 때 배경 스크롤 방지
  useEffect(() => {
    if (isMarketingTermsOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMarketingTermsOpen])

  // 프로필 이미지 및 닉네임
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [nickname, setNickname] = useState("김*민1580650")
  const [useProfileNickname, setUseProfileNickname] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 편집 모드 상태
  const [editingField, setEditingField] = useState<"name" | "nickname" | "email" | "phone" | "password" | null>(null)

  // 편집 중 임시 값
  const [tempName, setTempName] = useState("")
  const [tempNickname, setTempNickname] = useState("")
  const [tempEmail, setTempEmail] = useState("")
  const [tempPhone, setTempPhone] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // 비밀번호 보기 상태
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // 유효성 검사 오류
  const [emailError, setEmailError] = useState("")

  const startEditing = (field: "name" | "nickname" | "email" | "phone" | "password") => {
    setEditingField(field)
    if (field === "name") setTempName(name)
    if (field === "nickname") setTempNickname(nickname)
    if (field === "email") setTempEmail("")
    if (field === "phone") setTempPhone("")
    if (field === "password") {
      setNewPassword("")
      setConfirmPassword("")
    }
    setEmailError("")
  }

  const cancelEditing = () => {
    setEditingField(null)
    setEmailError("")
  }

  const handleNameChange = () => {
    if (tempName.trim()) {
      setName(tempName)
      setEditingField(null)
    }
  }

  const handleNicknameChange = () => {
    if (tempNickname.trim() && tempNickname.length >= 2 && tempNickname.length <= 10) {
      setNickname(tempNickname)
      setEditingField(null)
    }
  }

  const handleEmailVerify = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(tempEmail)) {
      setEmailError("규칙에 맞는 이메일 주소를 입력해주세요.")
      return
    }
    setEmailError("")
    // 인증 메일 전송 로직
    alert("인증 메일이 전송되었습니다.")
  }

  const handlePhoneVerify = () => {
    if (tempPhone.length >= 10) {
      // 인증번호 전송 로직
      alert("인증번호가 전송되었습니다.")
    }
  }

  const handlePasswordChange = () => {
    if (newPassword && newPassword === confirmPassword) {
      alert("비밀번호가 변경되었습니다.")
      setEditingField(null)
      setNewPassword("")
      setConfirmPassword("")
    }
  }

  return (
    <MypageLayout activeMenu="회원정보관리">
      <h2 className="text-xl font-bold text-foreground">회원 정보 수정</h2>

      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        <h3 className="text-base font-semibold text-foreground mb-6">내 프로필</h3>

        <div className="flex flex-col gap-6">
          {/* 프로필 이미지 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">프로필 이미지</label>
            <div className="relative w-fit">
              <div className="h-20 w-20 rounded-full bg-amber-100 overflow-hidden flex items-center justify-center">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="프로필 이미지"
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-amber-100 flex items-center justify-center">
                    <span className="text-3xl">👤</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleImageClick}
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* 닉네임 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">닉네임</label>
            {editingField === "nickname" ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempNickname}
                    onChange={(e) => setTempNickname(e.target.value)}
                    maxLength={10}
                    className="flex h-11 w-full max-w-xs rounded-md border border-amber-400 bg-amber-50 px-4 text-sm text-foreground outline-none"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelEditing}
                    className="h-11 px-6"
                  >
                    취소
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleNicknameChange}
                    disabled={!tempNickname.trim() || tempNickname.length < 2}
                    className="h-11 px-6 bg-foreground text-background hover:bg-foreground/90"
                  >
                    변경
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  특수문자, 특수기호, 공백 제외 2~10���
                </p>
                <label className="mt-1 flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useProfileNickname}
                    onChange={(e) => setUseProfileNickname(e.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <span className="text-sm text-muted-foreground">내 프로필 닉네임 사용</span>
                </label>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nickname}
                    readOnly
                    className="flex h-11 w-full max-w-xs rounded-md border border-border bg-muted/30 px-4 text-sm text-muted-foreground outline-none cursor-default"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditing("nickname")}
                    className="h-11 px-6"
                  >
                    변경
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  특수문자, 특수기호, 공백 제외 2~10자
                </p>
                <label className="mt-1 flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useProfileNickname}
                    onChange={(e) => setUseProfileNickname(e.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <span className="text-sm text-muted-foreground">내 프로필 닉네임 사용</span>
                </label>
              </div>
            )}
          </div>

          {/* 구분선 및 기본정보 타이틀 */}
          <div className="pt-2 border-t border-border">
            <h4 className="text-base font-semibold text-foreground mb-2">기본정보</h4>
          </div>

          {/* 이름(닉네임) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">이름(닉네임)</label>
            {editingField === "name" ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="flex h-11 w-full max-w-xs rounded-md border border-amber-400 bg-amber-50 px-4 text-sm text-foreground outline-none"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelEditing}
                    className="h-11 px-6"
                  >
                    취소
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleNameChange}
                    className="h-11 px-6 bg-foreground text-background hover:bg-foreground/90"
                  >
                    변경
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={name}
                  readOnly
                  className="flex h-11 w-full max-w-xs rounded-md border border-border bg-muted/30 px-4 text-sm text-muted-foreground outline-none cursor-default"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing("name")}
                  className="h-11 px-6"
                >
                  변경
                </Button>
              </div>
            )}
          </div>

          {/* 이메일 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">이메일 (인증완료)</label>
            {editingField === "email" ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="flex h-11 w-full max-w-sm rounded-md border border-border bg-muted/30 px-4 text-sm text-muted-foreground outline-none cursor-default"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelEditing}
                    className="h-11 px-6"
                  >
                    취소
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={tempEmail}
                    onChange={(e) => {
                      setTempEmail(e.target.value)
                      setEmailError("")
                    }}
                    placeholder="실제 사용하는 이메일 주소를 입력해주세요."
                    className={`flex h-11 w-full max-w-sm rounded-md border px-4 text-sm text-foreground outline-none ${
                      emailError ? "border-red-400 bg-red-50" : "border-amber-400 bg-amber-50"
                    }`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEmailVerify}
                    className="h-11 px-4 text-amber-600 border-amber-300 hover:bg-amber-50"
                  >
                    인증메일 전송
                  </Button>
                </div>
                {emailError && (
                  <p className="text-sm text-red-500">{emailError}</p>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="flex h-11 w-full max-w-sm rounded-md border border-border bg-muted/30 px-4 text-sm text-muted-foreground outline-none cursor-default"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing("email")}
                  className="h-11 px-6"
                >
                  변경
                </Button>
              </div>
            )}
          </div>

          {/* 휴대전화 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">휴대전화 (인증완료)</label>
            {editingField === "phone" ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="tel"
                    value={phone}
                    readOnly
                    className="flex h-11 w-full max-w-sm rounded-md border border-border bg-muted/30 px-4 text-sm text-muted-foreground outline-none cursor-default"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelEditing}
                    className="h-11 px-6"
                  >
                    취소
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="tel"
                    value={tempPhone}
                    onChange={(e) => setTempPhone(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="- 없이 입력해주세요."
                    className="flex h-11 w-full max-w-sm rounded-md border border-amber-400 bg-amber-50 px-4 text-sm text-foreground outline-none"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePhoneVerify}
                    className="h-11 px-4 text-amber-600 border-amber-300 hover:bg-amber-50"
                  >
                    인증번호 전송
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="tel"
                  value={phone}
                  readOnly
                  className="flex h-11 w-full max-w-sm rounded-md border border-border bg-muted/30 px-4 text-sm text-muted-foreground outline-none cursor-default"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing("phone")}
                  className="h-11 px-6"
                >
                  변경
                </Button>
              </div>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">비밀번호</label>
            {editingField === "password" ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value="••••••••"
                    readOnly
                    className="flex h-11 w-full max-w-sm rounded-md border border-border bg-muted/30 px-4 text-sm text-muted-foreground outline-none cursor-default"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelEditing}
                    className="h-11 px-6"
                  >
                    취소
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-full max-w-sm">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="비밀번호를 입력해주세요."
                      className="flex h-11 w-full rounded-md border border-amber-400 bg-amber-50 px-4 pr-10 text-sm text-foreground outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-full max-w-sm">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="비밀번호를 입력해주세요."
                      className="flex h-11 w-full rounded-md border border-amber-400 bg-amber-50 px-4 pr-10 text-sm text-foreground outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <Button
                    size="sm"
                    onClick={handlePasswordChange}
                    disabled={!newPassword || newPassword !== confirmPassword}
                    className="h-11 px-6"
                  >
                    확인
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value="••••••••"
                  readOnly
                  className="flex h-11 w-full max-w-sm rounded-md border border-border bg-muted/30 px-4 text-sm text-muted-foreground outline-none cursor-default"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing("password")}
                  className="h-11 px-6"
                >
                  변경
                </Button>
              </div>
            )}
          </div>

          {/* 카카오톡 채널 */}
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground">카카오톡 채널</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              채널을 추가하면 유익하고 맞춤화된 정보를 받아볼 수 있습니다.
            </p>
            <div className="mt-3 flex flex-col gap-2 items-start">
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-4 gap-2"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded bg-yellow-400 text-[10px] font-bold text-black">Ch</span>
                채널 추가
              </Button>
              <button className="inline-flex items-center gap-2 h-10 px-6 rounded-md bg-yellow-400 text-black text-sm font-medium hover:bg-yellow-500 transition-colors">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.89 5.29 4.68 6.68-.21.78-.77 2.64-.88 3.06-.14.54.2.53.42.39.17-.11 2.73-1.85 3.84-2.6.62.09 1.26.14 1.94.14 5.52 0 10-3.58 10-8S17.52 3 12 3z"/>
                </svg>
                카카오 연결
              </button>
            </div>
          </div>

          {/* 마케팅 수신 동의 */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-base font-semibold text-foreground mb-4">마케팅 수신 동의</h4>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">마케팅 정보 수신에 동의합니다.</span>
              <button 
                onClick={() => setIsMarketingTermsOpen(true)}
                className="text-sm text-muted-foreground border border-border rounded px-3 py-1 hover:bg-muted/50"
              >
                ��관보기
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              할인 이벤트와 쿠폰 발급 등의 알림을 받으시고 혜택을 놓치지 마세요.
            </p>
            
            <div className="mt-4 space-y-3">
              {/* 이메일 수신 */}
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={emailMarketing}
                    onChange={(e) => setEmailMarketing(e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-sky-500"
                  />
                  <span className="text-sm text-foreground">이메일 수신</span>
                </label>
                <span className="text-xs text-muted-foreground">
                  {emailMarketing ? "동의" : "미동의"} 일자 : {emailMarketingDate}
                </span>
              </div>
              
              {/* 문자메시지 수신 */}
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={smsMarketing}
                    onChange={(e) => setSmsMarketing(e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-sky-500"
                  />
                  <span className="text-sm text-foreground">문자메시지 수신</span>
                </label>
                <span className="text-xs text-muted-foreground">
                  {smsMarketing ? "동의" : "미동의"} 일자 : {smsMarketingDate}
                </span>
              </div>
            </div>
          </div>

          {/* 수정 완료 버튼 */}
          <div className="mt-8">
            <Button className="h-12 px-8 bg-accent text-accent-foreground hover:bg-accent/90">
              수정 완료
            </Button>
          </div>

          {/* 회원탈퇴 링크 */}
          <div className="mt-6">
            <Link
              href="/mypage/withdraw"
              className="text-sm text-muted-foreground underline hover:text-foreground"
            >
              회원 탈퇴하기
            </Link>
          </div>
        </div>
      </div>

      {/* 마케팅 수신 동의 약관 모달 */}
      {isMarketingTermsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          {/* 어두운 배경 오버레이 */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMarketingTermsOpen(false)}
          />
          
          {/* 모달 컨텐츠 */}
          <div className="relative z-10 w-full max-w-3xl mx-4 bg-white rounded-lg shadow-lg text-black">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">마케팅 수신 동의</h3>
              <button
                onClick={() => setIsMarketingTermsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* 모달 본문 */}
            <div className="p-6">
              {/* 테이블 */}
              <div className="border border-gray-200 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-center font-medium text-gray-900 w-24">서비스</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-900">목적</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-900 w-40">항목</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-900 w-32">보유기간</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-4 text-center text-gray-700 align-top">회원가입</td>
                      <td className="px-4 py-4 text-gray-700 align-top">
                        (주) 컴퍼니가 제공하는 이용자 맞춤형 서비스 및 상품 추천, 각종 경품 행사, 이벤트 등의 광고성 정보 제공(이메일, 서신우편, SMS, 카카오톡 등)
                      </td>
                      <td className="px-4 py-4 text-center text-gray-700 align-top">
                        이름, 이메일주소,<br />
                        휴대전화번호, 마케팅 수신 동의 여부
                      </td>
                      <td className="px-4 py-4 text-center text-gray-700 align-top">
                        회원 탈퇴 후 30일<br />
                        또는 동의 철회 시까지
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* 안내 문구 */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 leading-relaxed">
                  본 마케팅 정보 수신에 대한 동의를 거부하실 수 있으며, 이 경우 회원가입은 가능하나 일부 서비스 이용 및 각종 광고, 할인, 이벤트 및 이용자 맞춤형 상품 추천 등의 서비스 제공이 제한될 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </MypageLayout>
  )
}
