"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
import { MypageLayout } from "@/components/mypage-layout"
import { Button } from "@/components/ui/button"
import { courses } from "@/lib/courses"

const orderHistory = [
  {
    orderId: "ORD-2026-0215-001",
    orderDate: "2026.02.15",
    status: "결제완료",
    course: courses[0],
    paymentMethod: "신용카드 (신한)",
    paidPrice: "149,000",
    originalPrice: "299,000",
    discount: "150,000",
  },
  {
    orderId: "ORD-2026-0128-002",
    orderDate: "2026.01.28",
    status: "결제완료",
    course: courses[1],
    paymentMethod: "카카오페이",
    paidPrice: "129,000",
    originalPrice: "259,000",
    discount: "130,000",
  },
  {
    orderId: "ORD-2025-1220-003",
    orderDate: "2025.12.20",
    status: "결제완료",
    course: courses[4],
    paymentMethod: "네이버페이",
    paidPrice: "159,000",
    originalPrice: "319,000",
    discount: "160,000",
  },
]

export default function OrdersPage() {
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<typeof orderHistory[0] | null>(null)

  return (
    <MypageLayout activeMenu="구매내역">
      <h2 className="text-xl font-bold text-foreground">구매내역</h2>

      <div className="mt-6 flex flex-col gap-4">
        {orderHistory.map((order) => (
          <div
            key={order.orderId}
            className="rounded-lg border border-border bg-card"
          >
            {/* Order header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="font-semibold text-foreground">{order.orderDate}</span>
                <span className="text-muted-foreground">주문번호 {order.orderId}</span>
              </div>
              <span className="rounded-full bg-accent/10 px-3 py-0.5 text-xs font-semibold text-accent">
                {order.status}
              </span>
            </div>

            {/* Order body */}
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:gap-5">
              {/* Thumbnail */}
              <Link
                href={`/courses/${order.course.id}`}
                className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden rounded-md sm:w-40"
              >
                <Image
                  src={order.course.image}
                  alt={order.course.title}
                  fill
                  className="object-cover"
                />
              </Link>

              {/* Info */}
              <div className="flex flex-1 flex-col gap-2">
                <Link
                  href={`/courses/${order.course.id}`}
                  className="text-sm font-semibold leading-snug text-foreground hover:underline sm:text-base"
                >
                  {order.course.title}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {order.course.instructor} | {order.course.category}
                </p>

                {/* Price details */}
                <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-lg font-bold text-foreground">{order.paidPrice}원</span>
                  <span className="text-sm text-muted-foreground line-through">{order.originalPrice}원</span>
                  <span className="text-xs text-accent">-{order.discount}원 할인</span>
                </div>

                <p className="text-xs text-muted-foreground">
                  결제수단: {order.paymentMethod}
                </p>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                <Link href={`/courses/${order.course.id}`}>
                  <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
                    강의 바로가기
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="w-full text-xs sm:w-auto">
                  영수증 보기
                </Button>
                <div className="flex-1" />
                <button
                  onClick={() => {
                    setSelectedOrder(order)
                    setIsRefundModalOpen(true)
                  }}
                  className="self-end text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                >
                  환불 신청서 작성
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Refund Application Modal */}
      {isRefundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-card shadow-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="text-lg font-bold text-destructive">환불 신청서 작성</h3>
              <button
                onClick={() => setIsRefundModalOpen(false)}
                className="rounded-full p-1 hover:bg-secondary"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-5 py-4">
              <p className="text-sm text-foreground">
                <span className="font-semibold text-destructive">1:1 문의 등록</span>(하단 클릭)을 통해 제출해주시면,
              </p>
              <p className="mt-2 text-sm text-foreground">
                빠른 시일내 답변을 드리겠으니 꼭 확인 바랍니다.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
              <Button
                variant="outline"
                onClick={() => setIsRefundModalOpen(false)}
              >
                닫기
              </Button>
              <Link 
                href={`/mypage/support?tab=inquiry&type=payment&title=${encodeURIComponent(selectedOrder ? `${selectedOrder.course.title}[${selectedOrder.orderId}] 환불 문의` : '')}`}
              >
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setIsRefundModalOpen(false)}
                >
                  1:1 문의 등록
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </MypageLayout>
  )
}
