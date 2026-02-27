import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, BookOpen } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 숫자 */}
        <div className="relative mb-8">
          <span className="text-[150px] font-bold text-muted/30 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center">
              <Search className="w-12 h-12 text-accent" />
            </div>
          </div>
        </div>

        {/* 메시지 */}
        <h1 className="text-2xl font-bold text-foreground mb-3">
          {"페이지를 찾을 수 없습니다"}
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {"요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다."}
          <br />
          {"주소를 다시 확인해 주세요."}
        </p>

        {/* 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              {"홈으로 돌아가기"}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/courses">
              <BookOpen className="w-4 h-4 mr-2" />
              {"강좌 둘러보기"}
            </Link>
          </Button>
        </div>

        {/* 추가 도움 */}
        <p className="mt-8 text-sm text-muted-foreground">
          {"문제가 계속되면 "}
          <Link href="/support" className="text-accent hover:underline">
            {"고객센터"}
          </Link>
          {"로 문의해 주세요."}
        </p>
      </div>
    </div>
  )
}
