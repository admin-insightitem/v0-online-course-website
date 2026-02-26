"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronDown, ChevronUp, Send, MessageSquare } from "lucide-react"
import { MypageLayout } from "@/components/mypage-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// FAQ 데이터
const faqCategories = [
  { id: "all", label: "전체" },
  { id: "payment", label: "결제/환불" },
  { id: "playback", label: "영상 재생" },
  { id: "account", label: "계정/회원" },
  { id: "course", label: "강의/수강" },
]

const faqData = [
  {
    id: 1,
    category: "payment",
    question: "결제가 완료되었는데 강의가 안 보여요.",
    answer: "결제 완료 후 강의가 바로 보이지 않는 경우, 먼저 새로고침을 해주세요. 그래도 해결되지 않으면 브라우저 캐시를 삭제하거나 다른 브라우저에서 시도해 주세요. 문제가 지속되면 1:1 문의를 남겨주시면 빠르게 처리해 드리겠습니다.",
  },
  {
    id: 2,
    category: "payment",
    question: "환불은 어떻게 신청하나요?",
    answer: "환불은 구매일로부터 7일 이내, 강의 진도율 10% 미만일 경우 가능합니다. [마이페이지 > 구매내역]에서 해당 강의의 '환불 신청' 버튼을 클릭하여 신청할 수 있습니다. 환불 처리는 영업일 기준 3~5일 소요됩니다.",
  },
  {
    id: 3,
    category: "payment",
    question: "결제 수단을 변경하고 싶어요.",
    answer: "이미 결제가 완료된 건은 결제 수단 변경이 불가합니다. 다른 결제 수단으로 재결제를 원하시면 기존 결제를 환불 신청 후 다시 구매해 주세요.",
  },
  {
    id: 4,
    category: "playback",
    question: "영상이 재생되지 않아요.",
    answer: "영상 재생 문제는 주로 브라우저 호환성 또는 인터넷 연결 문제입니다. Chrome 최신 버전 사용을 권장하며, 광고 차단 프로그램이 있다면 해제 후 다시 시도해 주세요. 모바일에서는 앱을 통한 시청을 권장합니다.",
  },
  {
    id: 5,
    category: "playback",
    question: "영상 화질이 좋지 않아요.",
    answer: "영상 플레이어 하단의 설정(톱니바퀴) 버튼을 클릭하여 화질을 720p 또는 1080p로 변경해 주세요. 인터넷 속도가 느린 경우 자동으로 낮은 화질로 재생될 수 있습니다.",
  },
  {
    id: 6,
    category: "playback",
    question: "배속 재생이 가능한가요?",
    answer: "네, 가능합니다. 영상 플레이어 하단의 설정 버튼에서 재생 속도를 0.5배속부터 2배속까지 조절할 수 있습니다.",
  },
  {
    id: 7,
    category: "account",
    question: "비밀번호를 잊어버렸어요.",
    answer: "로그인 페이지에서 '비밀번호 찾기'를 클릭하신 후, 가입 시 사용한 이메일을 입력하시면 비밀번호 재설정 링크가 발송됩니다. 메일이 오지 않으면 스팸함을 확인해 주세요.",
  },
  {
    id: 8,
    category: "account",
    question: "이메일 주소를 변경하고 싶어요.",
    answer: "이메일 주소는 [마이페이지 > 회원정보관리]에서 변경 가능합니다. 단, 소셜 로그인(카카오, 네이버 등)으로 가입하신 경우 이메일 변경이 제한될 수 있습니다.",
  },
  {
    id: 9,
    category: "course",
    question: "강의 수강 기간은 얼마인가요?",
    answer: "대부분의 강의는 평생 수강 가능합니다. 단, 일부 기간 한정 강의나 정기 업데이트 강의의 경우 수강 기간이 별도로 명시되어 있으니 강의 상세 페이지를 확인해 주세요.",
  },
  {
    id: 10,
    category: "course",
    question: "수료증은 어떻게 받나요?",
    answer: "강의를 100% 완료하시면 [마이페이지 > 내 강의실]에서 해당 강의의 수료증을 발급받으실 수 있습니다. PDF 형태로 다운로드 가능합니다.",
  },
]

// 문의 유형
const inquiryTypes = [
  { value: "payment", label: "결제/환불 문의" },
  { value: "playback", label: "영상 재생 문의" },
  { value: "account", label: "계정/회원 문의" },
  { value: "course", label: "강의/수강 문의" },
  { value: "etc", label: "기타 문의" },
]

export default function SupportPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<"faq" | "inquiry">("faq")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  
  // 1:1 문의 폼 상태
  const [inquiryType, setInquiryType] = useState("")
  const [inquiryTitle, setInquiryTitle] = useState("")
  const [inquiryContent, setInquiryContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // 쿼리 파라미터로 탭과 문의 유형, 제목 설정
  useEffect(() => {
    const tab = searchParams.get("tab")
    const type = searchParams.get("type")
    const title = searchParams.get("title")
    
    if (tab === "inquiry") {
      setActiveTab("inquiry")
    }
    
    if (type === "payment") {
      setInquiryType("payment")
    }

    if (title) {
      setInquiryTitle(title)
    }
  }, [searchParams])

  // FAQ 필터링
  const filteredFaq = faqData.filter((faq) => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleFaqToggle = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  const handleInquirySubmit = () => {
    if (!inquiryType || !inquiryTitle.trim() || !inquiryContent.trim()) return
    
    setIsSubmitting(true)
    // 실제로는 API 호출
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccessMessage(true)
      setInquiryType("")
      setInquiryTitle("")
      setInquiryContent("")
      
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
    }, 1000)
  }

  return (
    <MypageLayout activeMenu="고객센터">
      <h2 className="text-xl font-bold text-foreground">고객센터</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        자주 묻는 질문을 확인하거나 1:1 문의를 남겨주세요.
      </p>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-border">
        <button
          onClick={() => setActiveTab("faq")}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "faq"
              ? "border-b-2 border-accent text-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          자주 묻는 질문
        </button>
        <button
          onClick={() => setActiveTab("inquiry")}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "inquiry"
              ? "border-b-2 border-accent text-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          1:1 문의
        </button>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === "faq" ? (
          // FAQ 탭
          <div>
            {/* 검색 */}
            <div className="mb-6">
              <Input
                type="text"
                placeholder="질문을 검색해 보세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11"
              />
            </div>

            {/* 카테고리 필터 */}
            <div className="mb-6 flex flex-wrap gap-2">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* FAQ 목록 */}
            <div className="flex flex-col gap-3">
              {filteredFaq.length === 0 ? (
                <div className="rounded-lg border border-border bg-card px-6 py-12 text-center">
                  <p className="text-muted-foreground">검색 결과가 없습니다.</p>
                </div>
              ) : (
                filteredFaq.map((faq) => (
                  <div
                    key={faq.id}
                    className="rounded-lg border border-border bg-card overflow-hidden"
                  >
                    <button
                      onClick={() => handleFaqToggle(faq.id)}
                      className="flex w-full items-center justify-between gap-4 p-4 text-left"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 shrink-0 rounded bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                          Q
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {faq.question}
                        </span>
                      </div>
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
                      )}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="border-t border-border bg-secondary/30 p-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 shrink-0 rounded bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                            A
                          </span>
                          <p className="text-sm leading-relaxed text-foreground">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* 문의 유도 */}
            <div className="mt-8 rounded-lg border border-border bg-secondary/30 p-6 text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium text-foreground">
                원하시는 답변을 찾지 못하셨나요?
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                1:1 문의를 남겨주시면 빠르게 답변 드리겠습니다.
              </p>
              <Button
                onClick={() => setActiveTab("inquiry")}
                className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                1:1 문의하기
              </Button>
            </div>
          </div>
        ) : (
          // 1:1 문의 탭
          <div>
            {showSuccessMessage && (
              <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
                <p className="text-sm font-medium text-green-800">
                  문의가 성공적으로 등��되었습니다. 빠른 시일 내에 답변 드리겠습니다.
                </p>
              </div>
            )}

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-base font-semibold text-foreground">1:1 문의하기</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                문의 내용을 자세히 작성해 주시면 더 정확한 답변을 받으실 수 있습니다.
              </p>

              <div className="mt-6 flex flex-col gap-5">
                {/* 문의 유형 */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    문의 유형 <span className="text-red-500">*</span>
                  </label>
                  <Select value={inquiryType} onValueChange={setInquiryType}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="문의 유형을 선택해 주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {inquiryTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 제목 */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    제목 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="문의 제목을 입력해 주세요"
                    value={inquiryTitle}
                    onChange={(e) => setInquiryTitle(e.target.value)}
                    className="h-11"
                  />
                </div>

                {/* 내용 */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    문의 내용 <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder="문의 내용을 자세히 작성해 주세요"
                    value={inquiryContent}
                    onChange={(e) => setInquiryContent(e.target.value)}
                    className="min-h-[160px] resize-none"
                  />
                </div>

                {/* 안내 문구 */}
                <div className="rounded-lg bg-secondary/50 p-4">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    - 답변은 영업일 기준 1~2일 이내에 등록된 이메일로 발송됩니다.<br />
                    - 주말 및 공휴일에는 답변이 지연될 수 있습니다.<br />
                    - 개인정보(비밀번호, 카드번호 등)는 문의 내용에 포함하지 마세요.
                  </p>
                </div>

                {/* 제출 버튼 */}
                <Button
                  onClick={handleInquirySubmit}
                  disabled={!inquiryType || !inquiryTitle.trim() || !inquiryContent.trim() || isSubmitting}
                  className="h-11 gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {isSubmitting ? (
                    "등록 중..."
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      문의 등록
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* 이전 문의 내역 */}
            <div className="mt-8">
              <h3 className="text-base font-semibold text-foreground">내 문의 내역</h3>
              <div className="mt-4 rounded-lg border border-border bg-card">
                <div className="flex flex-col divide-y divide-border">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          답변 완료
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          결제 오류 관련 문의드립니다
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">2026.02.20</p>
                    </div>
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                          답변 대기
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          영상 재생이 안됩니다
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">2026.02.25</p>
                    </div>
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MypageLayout>
  )
}
