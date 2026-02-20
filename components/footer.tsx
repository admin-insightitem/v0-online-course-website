import Link from "next/link"

const footerLinks = [
  {
    title: "서비스",
    links: [
      { label: "전체 클래스", href: "#" },
      { label: "카테고리", href: "#" },
      { label: "무료 웨비나", href: "#" },
      { label: "강사 지원", href: "#" },
    ],
  },
  {
    title: "회사",
    links: [
      { label: "회사 소개", href: "#" },
      { label: "채용 안내", href: "#" },
      { label: "블로그", href: "#" },
      { label: "제휴 문의", href: "#" },
    ],
  },
  {
    title: "고객센터",
    links: [
      { label: "자주 묻는 질문", href: "#" },
      { label: "1:1 문의", href: "#" },
      { label: "환불 정책", href: "#" },
      { label: "이용약관", href: "#" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-5 inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy">
                <span className="text-sm font-extrabold text-white font-[family-name:var(--font-heading)]">T</span>
              </div>
              <span className="text-[17px] font-bold text-navy tracking-tight">
                TitanClass
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[14px] leading-[1.8] text-muted-foreground">
              40대 이상 직장인과 자영업자를 위한 프리미엄 AI 기술 교육 플랫폼. 각 분야 최고 전문가들의 검증된 강의로 새로운 수익을 만들어보세요.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="mb-4 text-[14px] font-bold text-foreground">{group.title}</h4>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-[13px] text-muted-foreground">
            &copy; 2026 TitanClass. All rights reserved.
          </p>
          <div className="flex gap-6 text-[13px] text-muted-foreground">
            <Link href="#" className="hover:text-foreground">개인정보처리방침</Link>
            <Link href="#" className="hover:text-foreground">이용약관</Link>
            <Link href="#" className="hover:text-foreground">사업자정보</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
