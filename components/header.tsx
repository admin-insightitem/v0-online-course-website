"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ShoppingCart, User, Bell, MoreVertical, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "전체 클래스", href: "/#courses" },
  { label: "카테고리", href: "/#categories" },
  { label: "강사진", href: "/#instructors" },
  { label: "후기", href: "/#testimonials" },
]

// 알림 데이터
const notificationsData = [
  {
    id: 1,
    sender: "TITAN CLASS",
    badge: "공지사항",
    badgeColor: "bg-blue-100 text-blue-700",
    date: "오늘 오전 10:30",
    title: "[수강 안내] 새로운 강의가 업데이트 되었습니다!",
    content: "ChatGPT AI 자동화 강의에 새로운 섹션이 추가되었습니다. 지금 바로 확인해보세요.",
    image: "/images/course-1.jpg",
    isRead: false,
  },
  {
    id: 2,
    sender: "김도현 강사",
    badge: "Q&A 답변",
    badgeColor: "bg-green-100 text-green-700",
    date: "어제 오후 3:15",
    title: "질문에 대한 답변이 등록되었습니다.",
    content: "API 호출 관련 질문에 강사님이 답변을 남기셨습니다.",
    image: "/images/instructor-1.jpg",
    isRead: false,
  },
  {
    id: 3,
    sender: "TITAN CLASS",
    badge: "프로모션",
    badgeColor: "bg-orange-100 text-orange-700",
    date: "2월 24일",
    title: "[한정 할인] 봄맞이 특별 프로모션!",
    content: "전 강의 30% 할인 쿠폰이 발급되었습니다. 마이페이지에서 확인하세요.",
    image: "/images/course-2.jpg",
    isRead: true,
  },
]

interface HeaderProps {
  variant?: "default" | "logged-in"
}

export function Header({ variant = "default" }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState(notificationsData)
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 팝업 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false)
        setMenuOpenId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const handleDeleteAll = () => {
    setNotifications([])
  }

  const handleDeleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    setMenuOpenId(null)
  }

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
            <div className="relative" ref={notificationRef}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-muted-foreground hover:text-foreground"
                onClick={() => setNotificationOpen(!notificationOpen)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                    {unreadCount}
                  </span>
                )}
                <span className="sr-only">알림</span>
              </Button>

              {/* 알림 팝업 */}
              {notificationOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 rounded-xl border border-border bg-card shadow-lg">
                  {/* 헤더 */}
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <h3 className="font-semibold text-foreground">알림</h3>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs text-muted-foreground hover:text-foreground"
                        onClick={handleMarkAllRead}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        모두 읽음
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs text-muted-foreground hover:text-destructive"
                        onClick={handleDeleteAll}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        모두 삭제
                      </Button>
                    </div>
                  </div>

                  {/* 알림 목록 */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                        알림이 없습니다.
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`relative flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors ${
                            !notification.isRead ? "bg-primary/5" : ""
                          }`}
                        >
                          {/* 이미지 */}
                          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={notification.image}
                              alt={notification.sender}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* 내용 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground truncate">
                                {notification.sender}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded ${notification.badgeColor}`}>
                                {notification.badge}
                              </span>
                              <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">
                                {notification.date}
                              </span>
                            </div>
                            <p className="mt-1 text-sm font-medium text-foreground line-clamp-1">
                              {notification.title}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                              {notification.content}
                            </p>
                          </div>

                          {/* 더보기 메뉴 */}
                          <div className="relative">
                            <button 
                              className="p-1 text-muted-foreground hover:text-foreground rounded"
                              onClick={(e) => {
                                e.stopPropagation()
                                setMenuOpenId(menuOpenId === notification.id ? null : notification.id)
                              }}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            
                            {menuOpenId === notification.id && (
                              <div className="absolute right-0 top-full mt-1 w-56 rounded-lg border border-border bg-card shadow-lg z-10">
                                <div className="px-3 py-2 border-b border-border">
                                  <p className="text-xs text-muted-foreground">삭제할 알림</p>
                                  <p className="text-sm font-medium text-foreground line-clamp-1 mt-0.5">
                                    {notification.title}
                                  </p>
                                </div>
                                <button 
                                  className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-muted/50"
                                  onClick={() => handleDeleteNotification(notification.id)}
                                >
                                  삭제하기
                                </button>
                                <button 
                                  className="w-full px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted/50 rounded-b-lg"
                                  onClick={() => setMenuOpenId(null)}
                                >
                                  취소
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link href="/mypage">
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                <User className="h-4 w-4" />
                이름(닉네임)
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
