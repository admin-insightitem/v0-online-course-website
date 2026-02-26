"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CreditCard, Building, ChevronDown } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { courses } from "@/lib/courses"

const orderItems = [courses[0], courses[1]]

function formatNumber(num: number) {
  return num.toLocaleString("ko-KR")
}

function parsePrice(price: string) {
  return parseInt(price.replace(/,/g, ""), 10)
}

const paymentMethods = [
  { id: "card", label: "신용/체크카드", icon: CreditCard },
  { id: "naverpay", label: "네이버페이" },
  { id: "kakaopay", label: "카카오페이" },
  { id: "tosspay", label: "토스페이" },
  { id: "bank", label: "가상계좌", icon: Building },
]

const cardOptions = [
  "카드사 선택",
  "삼성카드",
  "현대카드",
  "KB국민카드",
  "신한카드",
  "롯데카드",
  "우리카드",
  "하나카드",
  "NH농협카드",
  "BC카드",
]

const installmentOptions = [
  "일시불",
  "2개월",
  "3개월 (무이자)",
  "6개월 (무이자)",
  "12개월",
]

export default function OrderPage() {
  const router = useRouter()
  const [selectedPayment, setSelectedPayment] = useState("card")
  const [selectedCard, setSelectedCard] = useState("카드사 선택")
  const [selectedInstallment, setSelectedInstallment] = useState("일시불")
  const [couponCode, setCouponCode] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [agreedToEmail, setAgreedToEmail] = useState(true)
  const [agreedToSms, setAgreedToSms] = useState(false)

  const totalOriginalPrice = orderItems.reduce((sum, item) => sum + parsePrice(item.originalPrice), 0)
  const totalPrice = orderItems.reduce((sum, item) => sum + parsePrice(item.price), 0)
  const totalDiscount = totalOriginalPrice - totalPrice

  function handleOrder() {
    if (!agreedToTerms) return
    router.push("/order/complete")
  }

  return (
    <>
      <Header variant="logged-in" />
      <main className="min-h-[70vh] bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
          <h1 className="mb-10 text-3xl font-bold text-foreground lg:text-4xl">결제하기</h1>

          <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
            {/* Left column */}
            <div className="min-w-0 flex-1">
              {/* Order items */}
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">주문 상품</h2>
                  <span className="text-sm text-muted-foreground">
                    {'총 '}{orderItems.length}{'개'}
                  </span>
                </div>

                <div className="mt-5 divide-y divide-border">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 py-5">
                      <Link
                        href={`/courses/${item.id}`}
                        className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg lg:h-[88px] lg:w-36"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <Link
                          href={`/courses/${item.id}`}
                          className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors hover:text-accent lg:text-base"
                        >
                          {item.title}
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span>{item.instructor}</span>
                          <span className="text-border">{'|'}</span>
                          <span>{item.category}</span>
                        </div>
                        <div className="mt-1.5 flex items-baseline gap-2">
                          <span className="text-sm text-muted-foreground line-through">
                            {item.originalPrice}{'원'}
                          </span>
                          <span className="text-base font-bold text-accent lg:text-lg">
                            {item.price}{'원'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="my-8 border-t border-border" />

              {/* Coupon section */}
              <section>
                <h2 className="text-lg font-bold text-foreground">쿠폰선택</h2>
                <div className="mt-4 flex flex-col gap-3">
                  <div className="relative">
                    <select
                      className="h-12 w-full appearance-none rounded-lg border border-border bg-card px-4 pr-10 text-sm text-muted-foreground outline-none transition-colors focus:border-ring"
                      defaultValue=""
                    >
                      <option value="" disabled>사용가능한 쿠폰 없음</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="쿠폰 코드를 입력하세요."
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="h-12 flex-1 rounded-lg border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-ring"
                    />
                    <Button
                      variant="outline"
                      className="h-12 shrink-0 border-foreground px-5 text-sm font-semibold text-foreground hover:bg-foreground hover:text-background"
                    >
                      쿠폰 등록
                    </Button>
                  </div>
                </div>
              </section>

              <div className="my-8 border-t border-border" />

              {/* Payment method */}
              <section>
                <h2 className="text-lg font-bold text-foreground">결제 방법 선택</h2>
                <div className="mt-4">
                  <div className="inline-flex rounded-lg border border-border bg-card">
                    <button
                      className="flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-medium text-foreground bg-secondary"
                    >
                      <CreditCard className="h-4 w-4" />
                      일반결제
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-semibold text-foreground">결제 방법</h3>
                  <div className="flex flex-wrap gap-2">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`flex items-center gap-1.5 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                          selectedPayment === method.id
                            ? "border-foreground bg-card text-foreground"
                            : "border-border bg-card text-muted-foreground hover:border-foreground/30"
                        }`}
                      >
                        {method.icon && <method.icon className="h-4 w-4" />}
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedPayment === "card" && (
                  <div className="mt-5 flex flex-col gap-3">
                    <div className="rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">
                      신한카드 최대 12개월 무이자 할부
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="relative flex-1">
                        <select
                          value={selectedCard}
                          onChange={(e) => setSelectedCard(e.target.value)}
                          className="h-11 w-full appearance-none rounded-lg border border-border bg-card px-4 pr-10 text-sm text-foreground outline-none focus:border-ring"
                        >
                          {cardOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                      <div className="relative flex-1">
                        <select
                          value={selectedInstallment}
                          onChange={(e) => setSelectedInstallment(e.target.value)}
                          className="h-11 w-full appearance-none rounded-lg border border-border bg-card px-4 pr-10 text-sm text-foreground outline-none focus:border-ring"
                        >
                          {installmentOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <p>{'삼성 앱카드 · 150만원 이상 결제 시 5,000원 즉시할인'}</p>
                      <Link href="#" className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">
                        {'신용카드 무이자 할부 안내 >'}
                      </Link>
                    </div>
                  </div>
                )}
              </section>

            </div>

            {/* Right column: Payment summary */}
            <div className="w-full lg:w-[380px] lg:shrink-0">
              <div className="sticky top-20 rounded-xl border border-border bg-card p-6">
                <h2 className="mb-5 text-lg font-bold text-card-foreground">결제 금액</h2>
                <div className="flex flex-col gap-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">판매금액</span>
                    <span className="text-sm font-medium text-card-foreground">
                      {formatNumber(totalOriginalPrice)}{'원'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">총 할인금액</span>
                    <span className="text-sm font-semibold text-red-500">
                      {'-'}{formatNumber(totalDiscount)}{'원'}
                    </span>
                  </div>
                  <div className="my-1 border-t border-border" />
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-card-foreground">총 결제 금액</span>
                    <span className="text-2xl font-bold text-card-foreground">
                      {formatNumber(totalPrice)}{'원'}
                    </span>
                  </div>
                  <p className="text-right text-xs text-muted-foreground">
                    {'12개월 할부 시 월 '}{formatNumber(Math.ceil(totalPrice / 12))}{'원'}
                  </p>
                </div>

                {/* Payment & Marketing Consent */}
                <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5">
                  <label className="flex cursor-pointer items-start gap-2.5">
                    <Checkbox
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                      className="mt-0.5 h-4 w-4 shrink-0 border-border data-[state=checked]:border-accent data-[state=checked]:bg-accent"
                    />
                    <span className="text-xs leading-relaxed text-card-foreground">
                      강의 및 결제 정보를 확인하였으며, 이에 동의합니다(필수)
                    </span>
                  </label>

                  {/* 마케팅 수신 동의 */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs leading-relaxed text-card-foreground">
                      {"마케팅 수신 동의"}
                    </span>
                    
                    <p className="text-xs leading-relaxed text-card-foreground">
                      {"할인 이벤트와 쿠폰 발급 등의 알림을 받으시고 혜택을 놓치지 마세요."}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <label className="flex cursor-pointer items-center gap-2">
                        <Checkbox
                          checked={agreedToEmail}
                          onCheckedChange={(checked) => setAgreedToEmail(checked === true)}
                          className="h-4 w-4 border-border data-[state=checked]:border-accent data-[state=checked]:bg-accent"
                        />
                        <span className="text-xs leading-relaxed text-card-foreground">{"이메일 수신"}</span>
                      </label>
                      <span className="text-xs text-muted-foreground">
                        {"동의 일자 : 2025.09.02 00:43"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="flex cursor-pointer items-center gap-2">
                        <Checkbox
                          checked={agreedToSms}
                          onCheckedChange={(checked) => setAgreedToSms(checked === true)}
                          className="h-4 w-4 border-border data-[state=checked]:border-accent data-[state=checked]:bg-accent"
                        />
                        <span className="text-xs leading-relaxed text-card-foreground">{"문자메시지 수신"}</span>
                      </label>
                      <span className="text-xs text-muted-foreground">
                        {"미동의 일자 : 2024.04.04 20:25"}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleOrder}
                  disabled={!agreedToTerms}
                  className="mt-5 h-14 w-full bg-red-600 text-base font-bold text-white hover:bg-red-700 disabled:bg-muted disabled:text-muted-foreground"
                >
                  결제하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
