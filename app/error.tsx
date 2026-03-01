"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <AlertTriangle className="h-16 w-16 text-destructive" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-foreground">{"서버 오류가 발생했습니다"}</h1>
        <p className="mb-8 text-muted-foreground">
          {"잠시 후 다시 접속해 주세요."}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => reset()}
            variant="outline"
          >
            {"다시 시도"}
          </Button>
          <Button asChild>
            <Link href="/">{"홈으로 돌아가기"}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
