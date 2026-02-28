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

export default function PrivacyPage() {
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
                    item.id === "privacy"
                      ? "font-semibold text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.id === "privacy" && <span className="mr-1">{"📢"}</span>}
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">{"개인정보처리방침"}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{"2026년 1월 26일 월요일"}</p>
            </div>

            <div className="prose prose-sm max-w-none text-foreground">
              <p className="mb-6 leading-relaxed text-muted-foreground">
                {"주식회사 부자클래스(이하 '회사'라 한다)는 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리지침을 수립·공개합니다."}
              </p>

              <section className="mb-8">
                <h3 className="mb-4 text-lg font-bold text-foreground">{"제1조(개인정보의 처리목적)"}</h3>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  {"회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다."}
                </p>

                <div className="pl-4 space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">{"1. 홈페이지 회원 가입 및 관리"}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {"회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 제한적 본인확인제 시행에 따른 본인확인, 서비스 부정이용 방지, 만 14세 미만 아동의 개인정보 처리시 법정대리인의 동의여부 확인, 각종 고지·통지, 고충처리 등을 목적으로 개인정보를 처리합니다."}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">{"2. 재화 또는 서비스 제공"}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {"물품배송, 서비스 제공, 계약서·청구서 발송, 콘텐츠 제공, 맞춤서비스 제공, 본인인증, 연령인증, 요금결제·정산, 채권추심 등을 목적으로 개인정보를 처리합니다."}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">{"3. 고충처리"}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {"민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보 등의 목적으로 개인정보를 처리합니다."}
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h3 className="mb-4 text-lg font-bold text-foreground">{"제2조(개인정보의 처리 및 보유기간)"}</h3>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  {"회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다."}
                </p>
              </section>

              <section className="mb-8">
                <h3 className="mb-4 text-lg font-bold text-foreground">{"제3조(개인정보의 제3자 제공)"}</h3>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  {"회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다."}
                </p>
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
                      item.id === "privacy"
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
