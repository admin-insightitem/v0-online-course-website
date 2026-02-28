import Link from "next/link"

const footerLinks = [
  {
    title: "서비스",
    links: [
      { label: "전체 클래스", href: "#" },
      { label: "카테고리", href: "#" },
      { label: "웨비나", href: "#" },
      { label: "강사 지원", href: "#" },
    ],
  },
  {
    title: "회사",
    links: [
      { label: "소개", href: "#" },
      { label: "채용", href: "#" },
      { label: "블로그", href: "#" },
      { label: "제휴 문의", href: "#" },
    ],
  },
  {
    title: "고객센터",
    links: [
      { label: "자주 묻는 질문", href: "/support" },
      { label: "환불 정책", href: "/support/refund" },
      { label: "이용약관", href: "/support/terms" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">R</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Rich<span className="text-primary">Class</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              No.1 온라인 수익화 플랫폼. 당신의 인생을 바꾸는 프리미엄 온라인
              강의를 만나보세요.
            </p>
            <div className="mt-5 flex gap-3">
              {["YouTube", "Instagram", "Blog"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-xs font-semibold text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  aria-label={social}
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="mb-4 text-sm font-semibold text-foreground">{group.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 RichClass. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground">개인정보처리방침</Link>
            <Link href="#" className="hover:text-foreground">이용약관</Link>
            <Link href="#" className="hover:text-foreground">사업자정보</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
