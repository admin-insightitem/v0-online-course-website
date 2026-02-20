import { ArrowRight, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="bg-primary py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <Shield className="mx-auto mb-6 h-10 w-10 text-primary-foreground/60" />

        <h2 className="font-serif text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl text-balance">
          지금 바로 시작하세요
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
          50,000명 이상의 수강생이 타이탄클래스와 함께 새로운 가능성을 열어가고 있습니다.
          체계적이고 검증된 교육으로 당신의 성장을 돕겠습니다.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" className="h-14 bg-primary-foreground px-10 text-base text-primary hover:bg-primary-foreground/90">
            무료 체험 시작하기
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" className="h-14 border-primary-foreground/30 bg-transparent px-10 text-base text-primary-foreground hover:bg-primary-foreground/10">
            상담 신청하기
          </Button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 text-sm text-primary-foreground/60 sm:flex-row sm:justify-center sm:gap-6">
          <span>7일 무료 체험</span>
          <span className="hidden sm:inline">|</span>
          <span>카드 정보 불필요</span>
          <span className="hidden sm:inline">|</span>
          <span>언제든 취소 가능</span>
        </div>
      </div>
    </section>
  )
}
