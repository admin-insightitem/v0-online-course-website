"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Ticket,
  CreditCard,
  Settings,
  LogOut,
  Star,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const sideMenu = [
  { icon: BookOpen, label: "내 강의실", href: "/mypage" },
  { icon: Settings, label: "회원정보관리", href: "/mypage/profile" },
  { icon: Ticket, label: "쿠폰목록", href: "/mypage/coupons" },
  { icon: CreditCard, label: "구매내역", href: "/mypage/orders" },
  { icon: Star, label: "수강평 목록", href: "/mypage/reviews" },
  { icon: LogOut, label: "로그아웃", href: "/" },
]

interface MypageLayoutProps {
  children: React.ReactNode
  activeMenu?: string
}

export function MypageLayout({ children, activeMenu }: MypageLayoutProps) {
  const pathname = usePathname()

  const resolvedActive = activeMenu ?? sideMenu.find((m) => m.href === pathname)?.label ?? "내 강의실"

  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="logged-in" />

      {/* Banner */}
      <section className="bg-primary px-4 py-10 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-primary-foreground lg:text-3xl">
            마이페이지
          </h1>
        </div>
      </section>

      {/* Profile */}
      <section className="border-b border-border bg-card px-4 py-8">
        <div className="mx-auto flex max-w-7xl items-center gap-5">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-border lg:h-20 lg:w-20">
            <Image
              src="/images/avatar-user.jpg"
              alt="프로필 사진"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground lg:text-xl">김경민</h2>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>수강중인 강의 <strong className="text-foreground">2</strong></span>
              <span>완료한 강의 <strong className="text-foreground">2</strong></span>
              <span>쿠폰 <strong className="text-foreground">3</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 px-4 py-8 lg:py-10">
        <div className="mx-auto flex max-w-7xl gap-8 lg:gap-12">
          {/* Sidebar */}
          <aside className="hidden w-44 shrink-0 lg:block">
            <nav className="flex flex-col">
              {sideMenu.map((item) => {
                const isActive = item.label === resolvedActive
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-2.5 border-l-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-accent bg-transparent text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon className={`h-4 w-4 ${isActive ? "text-accent" : ""}`} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Content */}
          <div className="min-w-0 flex-1">
            {children}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
