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
    <footer className="border-t border-border bg-card py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-5 inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary">
                <span className="font-serif text-lg font-bold text-primary-foreground">T</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-foreground">
                  TITAN CLASS
                </span>
                <span className="text-[10px] tracking-[0.2em] text-muted-foreground">
                  PREMIUM ONLINE ACADEMY
                </span>
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              No.1 온라인 수익화 플랫폼. 각 분야 최고 전문가들의 검증된 강의로
              당신의 성장을 돕겠습니다.
            </p>
            <div className="mt-6 flex gap-3">
              {["YouTube", "Instagram", "Blog"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-sm border border-border text-sm font-semibold text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  aria-label={social}
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="mb-5 text-[15px] font-bold text-foreground">{group.title}</h4>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 TitanClass. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">개인정보처리방침</Link>
            <Link href="#" className="hover:text-foreground">이용약관</Link>
            <Link href="#" className="hover:text-foreground">사업자정보</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
