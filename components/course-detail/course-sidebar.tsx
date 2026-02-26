"use client"

import { Clock, BookOpen, Globe, Award, Infinity, ShieldCheck, Signal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Course } from "@/lib/courses"

export function CourseSidebar({ course }: { course: Course }) {
  const discount = Math.round(
    (1 - parseInt(course.price.replace(/,/g, "")) / parseInt(course.originalPrice.replace(/,/g, ""))) * 100
  )

  return (
    <div className="sticky top-20">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        {/* Price */}
        <div className="border-b border-border p-6">
          <div className="mb-1 flex items-center gap-3">
            <span className="text-3xl font-bold text-foreground">
              {"\u20A9"}{course.price}
            </span>
            <Badge className="border-0 bg-red-500 text-xs font-bold text-white">
              {discount}% OFF
            </Badge>
          </div>
          <p className="mb-5 text-sm text-muted-foreground line-through">
            {"\u20A9"}{course.originalPrice}
          </p>

          <Button className="mb-3 h-12 w-full bg-accent text-base font-bold text-accent-foreground hover:bg-accent/90">
            수강 신청하기
          </Button>
          <Button variant="outline" className="h-12 w-full text-base font-medium">
            장바구니 담기
          </Button>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            30일 이내 환불 보장
          </p>
        </div>

        {/* Course details */}
        <div className="p-6">
          <h3 className="mb-4 text-sm font-bold text-foreground">강의 정보</h3>
          <ul className="space-y-3.5">
            <li className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" /> 총 강의 시간
              </span>
              <span className="font-medium text-foreground">{course.duration}</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="h-4 w-4" /> 강의 수
              </span>
              <span className="font-medium text-foreground">{course.lectures}개</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Signal className="h-4 w-4" /> 난이도
              </span>
              <span className="font-medium text-foreground">{course.level}</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Globe className="h-4 w-4" /> 언어
              </span>
              <span className="font-medium text-foreground">한국어</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Infinity className="h-4 w-4" /> 수강 기간
              </span>
              <span className="font-medium text-foreground">평생 무제한</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Award className="h-4 w-4" /> 수료증
              </span>
              <span className="font-medium text-foreground">발급 가능</span>
            </li>
          </ul>
        </div>

        {/* Guarantee */}
        <div className="border-t border-border bg-secondary/30 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <p className="text-sm font-semibold text-foreground">품질 보장</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                수강 시작 후 30일 이내 100% 환불 보장. 강의에 만족하지 않으시면 전액 환불해 드립니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
