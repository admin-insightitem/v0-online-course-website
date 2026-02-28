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

export default function TermsPage() {
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
                    item.id === "terms"
                      ? "font-semibold text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.id === "terms" && <span className="mr-1">{"📢"}</span>}
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">{"서비스 이용약관"}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{"2026년 1월 26일 월요일"}</p>
            </div>

            <div className="prose prose-sm max-w-none text-foreground">
              <section className="mb-8">
                <h3 className="mb-4 text-lg font-bold text-foreground">{"제 1 조 (목적)"}</h3>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  {"이 약관은 주식회사 부자클래스 (이하 '회사' 라고 한다)이 영위하는 마케팅 교육정보 서비스(이하 '서비스'라 하며, 접속 가능한 유,무선 단말기의 종류와 상관없이 이용 가능한 사이트가 제공하는 모든 서비스를 의미합니다.)를 이용함에 있어 회원의 권리·의무 및 책임사항을 목적으로 합니다."}
                </p>
              </section>

              <section className="mb-8">
                <h3 className="mb-4 text-lg font-bold text-foreground">{"제 2 조 (정의)"}</h3>
                <div className="pl-4 space-y-4">
                  <p className="leading-relaxed text-muted-foreground">
                    {"1. '사이트' 란 '회사'가 서비스를 회원에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 '서비스 등'을 거래할 수 있도록 설정한 가상의 영업장을 말하며, 사이버몰을 운영하는 사업자의 의미로도 사용합니다. 현재 '회사'가 운영하는 '사이트'는 https://www.richclass.co.kr(이하 '사이트'라고 한다)이며, 더불어 서비스 하는 안드로이드, iOS 환경의 서비스를 포함한 모바일웹과 앱을 포함 합니다."}
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    {"2. '회원'이라 함은 '사이트'에 개인정보를 제공하여 회원등록을 한 자로서, '사이트'에 정해진 회원 가입 방침에 따라 '사이트'의 정보를 지속적으로 제공받으며, '사이트'가 제공하는 '서비스'를 계속적으로 이용할 수 있는 자를 말합니다."}
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    {"3. '비밀번호'라 함은 회원의 동일성 확인과 회원의 권익 및 비밀보호를 위하여 회원 스스로가 설정한 이메일은 아이디가 되며, 비밀번호는 사이트에서 자동으로 생성되는 조합을 말합니다."}
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    {"4. 이 약관에서 정의되지 않은 용어는 관계법령이 정하는 바에 따르며, 그 외에는 일반적인 상관례에 의합니다."}
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h3 className="mb-4 text-lg font-bold text-foreground">{"제 3 조 (약관의 명시와 설명 및 개정)"}</h3>
                <div className="pl-4 space-y-4">
                  <p className="leading-relaxed text-muted-foreground">
                    {"1. 회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 공지사항에 게시합니다. 다만, 약관의 구체적 내용은 회원이 연결화면을 통하여 볼 수 있습니다."}
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    {"2. 회사는 서비스 약관에 관한 관계 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다."}
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    {"3. 회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행 약관과 함께 '사이트'의 공지사항에 그 적용일자 7일(회원에게 불리하거나 중대한 사항의 변경은 30일)이전부터 적용일자 전일까지 본 약관 제2조 제1항에 명시된 웹페이지를 통하여 공지합니다."}
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    {"4. 회사가 약관을 개정할 경우에는 그 개정약관은 그 적용일자 이후에 체결되는 계약에만 적용되고 그 이전에 이미 체결된 계약에 대해서는 개정전의 약관조항이 그대로 적용됩니다."}
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h3 className="mb-4 text-lg font-bold text-foreground">{"제 4 조 (약관 외 준칙)"}</h3>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  {"이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제 등에 관한 법률, 공정거래위원회가 정하는 전자상거래 등에서의 소비자보호지침 및 관계법령 또는 상관례에 따릅니다."}
                </p>
              </section>

              <section className="mb-8">
                <h3 className="mb-4 text-lg font-bold text-foreground">{"제 5 조 (이용계약의 성립)"}</h3>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  {"이용계약은 회원이 되고자 하는 자(이하 '가입신청자')가 약관의 내용에 대하여 동의를 한 다음 회원가입신청을 하고, 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다."}
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
                      item.id === "terms"
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
