"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "전체 클래스", href: "#courses" },
  { label: "강사진", href: "#instructors" },
  { label: "수강 후기", href: "#testimonials" },
  { label: "웨비나", href: "#webinar" },
  { label: "고객센터", href: "#" },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
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

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Button variant="ghost" className="text-[15px] text-muted-foreground hover:text-foreground">
            로그인
          </Button>
          <Button className="bg-primary px-6 text-[15px] text-primary-foreground hover:bg-primary/90">
            무료 체험 시작
          </Button>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center text-foreground lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto max-w-7xl px-6 py-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block py-3 text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
              <Button variant="ghost" className="justify-start text-base text-muted-foreground">
                로그인
              </Button>
              <Button className="bg-primary text-base text-primary-foreground">
                무료 체험 시작
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
