"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, ShieldX, LogIn } from "lucide-react"

export default function AccessDeniedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 아이콘 */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldX className="w-14 h-14 text-destructive" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-background border-4 border-background flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
          </div>
        </div>

        {/* 메시지 */}
        <h1 className="text-2xl font-bold text-foreground mb-3">
          {"페이지에 접근 권한이 없습니다"}
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {"이 페이지를 보려면 로그인이 필요하거나"}
          <br />
          {"접근 권한이 있는 계정으로 로그인해야 합니다."}
        </p>

        {/* 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/login">
              <LogIn className="w-4 h-4 mr-2" />
              {"로그인하기"}
            </Link>
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {"이전 페이지로"}
          </Button>
        </div>

        {/* 홈으로 */}
        <div className="mt-6">
          <Button variant="ghost" asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              {"홈으로 돌아가기"}
            </Link>
          </Button>
        </div>

        {/* 추가 안내 */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {"권한이 필요한 페이지입니다. 강좌를 구매하셨다면"}
            <br />
            {"구매한 계정으로 로그인해 주세요."}
          </p>
        </div>
      </div>
    </div>
  )
}
