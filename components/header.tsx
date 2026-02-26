"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ShoppingCart, User, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "전체 클래스", href: "/#courses" },
  { label: "카테고리", href: "/#categories" },
  { label: "강사진", href: "/#instructors" },
  { label: "후기", href: "/#testimonials" },
]

interface HeaderProps {
  variant?: "default" | "logged-in"
}

export function Header({ variant = "default" }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">T</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            TITAN<span className="text-primary">CLASS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {variant === "logged-in" ? (
          <div className="hidden items-center gap-2 lg:flex">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  2
                </span>
                <span className="sr-only">장바구니</span>
              </Button>
            </Link>
            <Link href="/mypage">
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                <User className="h-4 w-4" />
                마이페이지
              </Button>
            </Link>
            <Link href="/mypage/notifications">
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  3
                </span>
                <span className="sr-only">알림</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                로그인
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                무료 시작하기
              </Button>
            </Link>
          </div>
        )}

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/50 bg-background lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 border-t border-border/50 pt-4">
              {variant === "logged-in" ? (
                <>
                  <Link href="/cart" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground">
                      <ShoppingCart className="h-4 w-4" />
                      장바구니
                    </Button>
                  </Link>
                  <Link href="/mypage" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      마이페이지
                    </Button>
                  </Link>
                  <Link href="/mypage/notifications" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground">
                      <Bell className="h-4 w-4" />
                      알림
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                        3
                      </span>
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
                      로그인
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button size="sm" className="w-full bg-primary text-primary-foreground">
                      무료 시작하기
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
