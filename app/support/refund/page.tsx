"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

// 사이드 메뉴
const sideMenu = [
  { label: "자주묻는질문", href: "/support", id: "faq" },
  { label: "공지사항", href: "/support/notice", id: "notice" },
  { label: "개인정보보호방침", href: "/support/privacy", id: "privacy" },
  { label: "이용약관", href: "/support/terms", id: "terms" },
  { label: "환불규정", href: "/support/refund", id: "refund" },
]

export default function RefundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      {/* Hero Banner */}
      <div className="relative h-[180px] w-full overflow-hidden bg-gradient-to-r from-primary/90 to-primary">
        <div className="absolute inset-0 bg-[url('/images/support-banner.jpg')] bg-cover bg-center opacity-30" />
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 lg:px-8">
          <h1 className="text-3xl font-bold text-primary-foreground">{"고객센터"}</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 lg:px-8">
        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="hidden w-[200px] shrink-0 lg:block">
            <nav className="flex flex-col gap-1">
              {sideMenu.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`px-2 py-2.5 text-sm transition-colors ${
                    item.id === "refund"
                      ? "font-semibold text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.id === "refund" && <span className="mr-1">{"📢"}</span>}
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">{"환불 정책"}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{"2026년 2월 12일 목요일"}</p>
            </div>

            <div className="prose prose-sm max-w-none text-foreground">
              <section className="mb-8">
                <h3 className="mb-4 text-lg font-bold text-foreground">{"제 18 조 (수강료 등의 환불)"}</h3>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  {"회사는 회원의 수강 포기 등에 의거 온라인 서비스 환불에 관한 규정을 다음과 같이 준용합니다."}
                </p>

                <div className="pl-4 space-y-3">
                  <p className="leading-relaxed text-muted-foreground">
                    {"1. 구매시점부터 6개월간 [내강의실]에서 영상 반복시청이 가능합니다."}
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    {"2. 구매 후 개강일 0시 기준 24시간 이전까지 수강철회시 전액 환불(결제액 기준) 가능합니다."}
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    {"3. 수강생에 맞춘 수업준비가 완료된 개강일 하루전 수강 철회시 10% 차감 (결제액 기준) 후 환불합니다."}
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    {"4. 환불 기준이 되는 진도는 수강생 개별 진도율이 아닌 수업 개강 후 커리큘럼에 따른 진도를 의미합니다."}
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    {"5. 강의 진도 시작 후 강의 1/3 경과 전까지 철회시 강의료의 2/3에 해당하는 금액을 환불합니다."}
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    {"6. 강의의 1/3 경과 시점부터 취소시 강의료의 1/3에 해당하는 금액을 환불합니다."}
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    {"7. 강의의 1/2 경과 시점부터는 환불이 불가하며 강의기간 종료 이후 환불도 불가합니다."}
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    {"8. 수강혜택으로 제공되는 보충영상, 자료, 템플릿을 제공받은 경우에는 진도와 무관하게 환불 불가합니다."}
                  </p>
                  <p className="leading-relaxed text-muted-foreground underline">
                    {"9. 스터디 콘텐츠 및 VOD 영상은 무단 복제, 유포시 법적 처벌과 손해배상 책임을 물을 수 있습니다."}
                  </p>
                </div>
              </section>
            </div>

            {/* Mobile Sidebar */}
            <div className="mt-10 lg:hidden">
              <h3 className="mb-4 font-semibold text-foreground">{"바로가기"}</h3>
              <div className="flex flex-wrap gap-2">
                {sideMenu.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`rounded-lg px-4 py-2 text-sm ${
                      item.id === "refund"
                        ? "bg-foreground text-background"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
