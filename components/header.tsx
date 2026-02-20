"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { label: "강의 둘러보기", href: "#courses" },
    { label: "무료 웨비나", href: "#webinar" },
    { label: "수강 후기", href: "#reviews" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy">
            <span className="text-sm font-extrabold text-white font-[family-name:var(--font-heading)]">T</span>
          </div>
          <span className="text-[17px] font-bold text-navy tracking-tight">
            TitanClass
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[15px] font-medium text-muted-foreground transition-colors hover:text-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" className="text-[15px] font-medium text-muted-foreground hover:text-navy">
            로그인
          </Button>
          <Button className="bg-mint px-5 text-[15px] font-semibold text-white hover:bg-mint-dark rounded-lg h-10">
            무료 체험 시작
          </Button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-lg md:hidden"
          aria-label="메뉴 열기"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-white px-6 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="py-3 text-base font-medium text-muted-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
            <Button variant="outline" className="w-full h-12 justify-center text-base">
              로그인
            </Button>
            <Button className="w-full h-12 justify-center bg-mint text-base font-semibold text-white hover:bg-mint-dark">
              무료 체험 시작
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
