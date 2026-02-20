import { ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-secondary/30 py-20 lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />

      <div className="relative mx-auto max-w-3xl px-4 text-center lg:px-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">
            지금 가입하면 첫 강의 50% 할인
          </span>
        </div>

        <h2 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl text-balance">
          지금 바로 시작하세요
        </h2>

        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          50,000명 이상의 수강생이 타이탄클래스와 함께 인생을 바꾸고 있습니다.
          당신도 그 여정에 동참하세요.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" className="bg-primary px-10 text-primary-foreground hover:bg-primary/90">
            무료 회원가입
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-secondary">
            강의 둘러보기
          </Button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          가입 후 7일 내 무료 취소 가능 | 카드 정보 불필요
        </p>
      </div>
    </section>
  )
}
