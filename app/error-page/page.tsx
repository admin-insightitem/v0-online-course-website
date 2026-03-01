import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <AlertTriangle className="h-16 w-16 text-destructive" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-foreground">{"서버 오류가 발생했습니다"}</h1>
        <p className="mb-8 text-muted-foreground">
          {"잠시 후 다시 접속해 주세요."}
        </p>
        <Link href="/">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            {"홈으로 돌아가기"}
          </Button>
        </Link>
      </div>
    </div>
  )
}
