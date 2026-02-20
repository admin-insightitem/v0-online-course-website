import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="bg-gradient-to-br from-[#0A1628] via-[#0F2140] to-[#1E4D8E] py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="mb-5 text-[13px] font-bold uppercase tracking-[0.25em] text-mint font-[family-name:var(--font-heading)]">
          Start Now
        </p>
        <h2 className="text-[26px] font-extrabold leading-[1.4] text-white md:text-[36px] lg:text-[42px]">
          <span className="text-balance">
            지금 시작하면,{" "}
            <br className="hidden md:block" />
            3개월 후 달라진 당신을 만납니다
          </span>
        </h2>

        <p className="mx-auto mt-5 max-w-lg text-[16px] leading-[1.8] text-white/55 md:text-[17px]">
          50,000명 이상의 수강생이 타이탄클래스와 함께 새로운 가능성을 열어가고 있습니다.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button className="h-[52px] rounded-xl bg-mint px-9 text-[16px] font-semibold text-white shadow-lg shadow-mint/25 hover:bg-mint-dark md:h-14 md:text-[17px]">
            무료 체험 시작
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            className="h-[52px] rounded-xl border-white/20 bg-transparent px-9 text-[16px] font-medium text-white hover:bg-white/10 hover:text-white md:h-14 md:text-[17px]"
          >
            상담 신청
          </Button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 text-[14px] text-white/40 sm:flex-row sm:justify-center sm:gap-6">
          <span>7일 무료 체험</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span>카드정보 불필요</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span>언제든 취소 가능</span>
        </div>
      </div>
    </section>
  )
}
