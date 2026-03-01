"use client"

import Image from "next/image"
import { Play, Award, Clock, BookOpen, Users, Heart, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Course } from "@/lib/courses"

export function CoursePurchaseSidebar({ course }: { course: Course }) {
  const discount = Math.round(
    (1 - parseInt(course.price.replace(/,/g, "")) / parseInt(course.originalPrice.replace(/,/g, ""))) * 100
  )

  return (
    <div className="sticky top-24">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        {/* Video Thumbnail */}
        <div className="relative aspect-video">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-primary/40">
            <button className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-110">
              <Play className="h-6 w-6 fill-current" />
            </button>
          </div>
          <div className="absolute bottom-3 right-3 rounded-md bg-primary/80 px-2 py-1 text-xs font-medium text-primary-foreground">
            미리보기
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Price */}
          <div className="mb-4">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-foreground">
                {"\u20A9"}{course.price}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                {"\u20A9"}{course.originalPrice}
              </span>
              <Badge className="border-0 bg-red-500 text-xs font-bold text-white">
                {discount}%
              </Badge>
            </div>
          </div>

          {/* CTA Buttons */}
          <Button className="mb-2 h-12 w-full bg-accent text-base font-bold text-accent-foreground hover:bg-accent/90">
            수강 신청하기
          </Button>
          <Button variant="outline" className="mb-4 h-11 w-full text-sm font-medium">
            장바구니 담기
          </Button>

          {/* Quick Actions */}
          <div className="mb-4 flex gap-2">
            <Button variant="ghost" size="sm" className="flex-1 gap-1.5 text-muted-foreground">
              <Heart className="h-4 w-4" />
              찜하기
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 gap-1.5 text-muted-foreground">
              <Share2 className="h-4 w-4" />
              공유
            </Button>
          </div>

          {/* Course Info */}
          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                총 강의 시간
              </span>
              <span className="font-medium text-foreground">{course.duration}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                강의 수
              </span>
              <span className="font-medium text-foreground">{course.lectures}개</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                수강생
              </span>
              <span className="font-medium text-foreground">{course.students.toLocaleString()}명</span>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-4 space-y-2 border-t border-border pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="h-4 w-4 text-accent" />
              <span>평생 무제한 수강</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="h-4 w-4 text-accent" />
              <span>수료증 발급</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="h-4 w-4 text-accent" />
              <span>30일 환불 보장</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
