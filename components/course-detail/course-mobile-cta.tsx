"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Course } from "@/lib/courses"

export function CourseMobileCTA({ course }: { course: Course }) {
  const discount = Math.round(
    (1 - parseInt(course.price.replace(/,/g, "")) / parseInt(course.originalPrice.replace(/,/g, ""))) * 100
  )

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card p-4 shadow-lg lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              {"\u20A9"}{course.price}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              {"\u20A9"}{course.originalPrice}
            </span>
            <Badge className="border-0 bg-red-500 text-[10px] font-bold text-white">
              {discount}%
            </Badge>
          </div>
        </div>
        <Button className="h-12 px-6 bg-accent text-base font-bold text-accent-foreground hover:bg-accent/90">
          수강 신청
        </Button>
      </div>
    </div>
  )
}
