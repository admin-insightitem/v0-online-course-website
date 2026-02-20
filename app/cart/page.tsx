"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, ShoppingCart } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { courses } from "@/lib/courses"

const initialCartItems = [courses[0], courses[1]]

function formatNumber(num: number) {
  return num.toLocaleString("ko-KR")
}

function parsePrice(price: string) {
  return parseInt(price.replace(/,/g, ""), 10)
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [selectedIds, setSelectedIds] = useState<string[]>(initialCartItems.map((item) => item.id))

  const allSelected = cartItems.length > 0 && selectedIds.length === cartItems.length

  function toggleAll() {
    if (allSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(cartItems.map((item) => item.id))
    }
  }

  function toggleItem(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  function removeItem(id: string) {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
    setSelectedIds((prev) => prev.filter((i) => i !== id))
  }

  function removeSelected() {
    setCartItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
    setSelectedIds([])
  }

  function removeAll() {
    setCartItems([])
    setSelectedIds([])
  }

  const selectedItems = cartItems.filter((item) => selectedIds.includes(item.id))
  const totalOriginalPrice = selectedItems.reduce((sum, item) => sum + parsePrice(item.originalPrice), 0)
  const totalPrice = selectedItems.reduce((sum, item) => sum + parsePrice(item.price), 0)
  const totalDiscount = totalOriginalPrice - totalPrice

  return (
    <>
      <Header variant="logged-in" />
      <main className="min-h-[70vh] bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
          <h1 className="mb-10 text-3xl font-bold text-foreground lg:text-4xl">장바구니</h1>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground/40" />
              <p className="mb-2 text-lg font-medium text-muted-foreground">장바구니가 비어있습니다</p>
              <p className="mb-8 text-sm text-muted-foreground/70">관심 있는 강의를 담아보세요.</p>
              <Link href="/#courses">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  강의 둘러보기
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
              {/* Left: Cart items */}
              <div className="min-w-0 flex-1">
                {/* Select bar */}
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={toggleAll}
                      className="h-5 w-5 border-border data-[state=checked]:border-accent data-[state=checked]:bg-accent"
                    />
                    <span className="text-sm font-semibold text-foreground">
                      전체 선택 ({selectedIds.length}/{cartItems.length})
                    </span>
                  </label>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <button
                      onClick={removeAll}
                      className="rounded px-2 py-1 transition-colors hover:text-foreground"
                    >
                      전체삭제
                    </button>
                    <span className="text-border">|</span>
                    <button
                      onClick={removeSelected}
                      className="rounded px-2 py-1 transition-colors hover:text-foreground"
                      disabled={selectedIds.length === 0}
                    >
                      선택삭제
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-border">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 py-6 lg:gap-5">
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={() => toggleItem(item.id)}
                        className="mt-5 h-5 w-5 shrink-0 border-border data-[state=checked]:border-accent data-[state=checked]:bg-accent"
                      />
                      <Link href={`/courses/${item.id}`} className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg lg:h-24 lg:w-40">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <Link href={`/courses/${item.id}`} className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors hover:text-accent lg:text-base">
                          {item.title}
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span>{item.instructor}</span>
                          <span>{'   '}</span>
                          <span>{item.category}</span>
                        </div>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-base font-bold text-foreground lg:text-lg">
                            {item.price}원
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {item.originalPrice}원
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="mt-4 shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label={`${item.title} 삭제`}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Payment summary */}
              <div className="w-full lg:w-[340px] lg:shrink-0">
                <div className="sticky top-20 rounded-xl border border-border bg-card p-6">
                  <h2 className="mb-5 text-lg font-bold text-card-foreground">결제 예정금액</h2>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">상품 금액</span>
                      <span className="text-sm font-medium text-card-foreground">
                        {formatNumber(totalOriginalPrice)}원
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">할인 금액</span>
                      <span className="text-sm font-semibold text-red-500">
                        -{formatNumber(totalDiscount)}원
                      </span>
                    </div>
                    <div className="my-2 border-t border-border" />
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-accent">합계</span>
                      <span className="text-xl font-bold text-accent">
                        {formatNumber(totalPrice)}원
                      </span>
                    </div>
                  </div>
                  <Link href="/order">
                    <Button
                      className="mt-6 h-12 w-full bg-accent text-accent-foreground text-base font-semibold hover:bg-accent/90"
                      disabled={selectedIds.length === 0}
                    >
                      상품 주문
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
