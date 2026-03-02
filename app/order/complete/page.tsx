import Link from "next/link"
import { CheckCircle, BookOpen, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function OrderCompletePage() {
  const orderNumber = "TC-2026022001"
  const orderDate = "2026.02.20"
  const totalAmount = "278,000"

  const orderedCourses = [
    {
      title: "ChatGPT & AI 자동화로 월 1,000만원 수익 만들기",
      instructor: "김도현",
      price: "149,000",
    },
    {
      title: "유튜브 수익화 완벽 가이드: 0에서 월 500만원까지",
      instructor: "박서연",
      price: "129,000",
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-[70vh] bg-background">
        <div className="mx-auto max-w-2xl px-4 py-16 lg:py-24">
          {/* Success icon and message */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-foreground">
              결제가 완료되었습니다
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              수강 신청이 정상적으로 처리되었습니다.<br />
              지금 바로 강의를 시작해 보세요.
            </p>
          </div>

          {/* Order info card */}
          <div className="mt-10 rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold text-card-foreground">주문 정보</h2>
            <div className="mt-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">주문번호</span>
                <span className="text-sm font-medium text-card-foreground">{orderNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">주문일시</span>
                <span className="text-sm font-medium text-card-foreground">{orderDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">결제수단</span>
                <span className="text-sm font-medium text-card-foreground">신용카드 (삼성카드)</span>
              </div>
              <div className="my-1 border-t border-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-card-foreground">총 결제 금액</span>
                <span className="text-xl font-bold text-card-foreground">{totalAmount}{'원'}</span>
              </div>
            </div>
          </div>

          {/* Ordered courses */}
          <div className="mt-6 rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold text-card-foreground">수강 강의</h2>
            <div className="mt-4 divide-y divide-border">
              {orderedCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="line-clamp-1 text-sm font-semibold text-card-foreground">
                      {course.title}
                    </span>
                    <span className="text-xs text-muted-foreground">{course.instructor}</span>
                  </div>
                  <span className="shrink-0 pl-4 text-sm font-bold text-card-foreground">
                    {course.price}{'원'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/mypage" className="flex-1">
              <Button
                variant="outline"
                className="h-14 w-full gap-2 border-border text-base font-semibold text-foreground hover:bg-secondary"
              >
                <BookOpen className="h-5 w-5" />
                내 강의실 가기
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button
                className="h-14 w-full gap-2 bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
              >
                홈으로 돌아가기
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Note */}
          <div className="mt-8 rounded-lg bg-secondary p-4">
            <h3 className="text-sm font-semibold text-secondary-foreground">안내사항</h3>
            <ul className="mt-2 flex flex-col gap-1.5 text-xs leading-relaxed text-muted-foreground">
              <li>{'- 결제 확인 이메일이 등록된 이메일 주소로 발송됩니다.'}</li>
              <li>{'- 강의는 결제 즉시 수강 가능하며, 수강 기간은 무제한입니다.'}</li>
              <li>{'- 환불은 수강 시작 후 7일 이내, 진도율 20% 미만일 경우 가능합니다.'}</li>
              <li>{'- 문의사항은 고객센터(1588-0000) 또는 이메일(help@titanclass.co.kr)로 연락해 주세요.'}</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
