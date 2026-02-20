import { ArrowRight, Users, Award, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

const stats = [
  { icon: Users, value: "50,000+", label: "누적 수강생" },
  { icon: Award, value: "98%", label: "수강 만족도" },
  { icon: BookOpen, value: "200+", label: "프리미엄 강의" },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1628] via-[#0F2140] to-[#1E4D8E] pt-[72px]">
      {/* Subtle dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28 lg:py-36">
        <p className="mb-6 text-[13px] font-bold uppercase tracking-[0.25em] text-mint font-[family-name:var(--font-heading)]">
          Premium AI Education Platform
        </p>

        <h1 className="max-w-[640px] text-[28px] font-extrabold leading-[1.4] text-white sm:text-[36px] md:text-[44px] md:leading-[1.35] lg:text-[52px]">
          <span className="text-balance">
            AI 시대,{" "}
            <br className="hidden sm:block" />
            당신의 새로운 시작을{" "}
            <br className="hidden sm:block" />
            함께합니다
          </span>
        </h1>

        <p className="mt-6 max-w-md text-[16px] leading-[1.8] text-white/55 md:text-[18px]">
          나이는 숫자일 뿐, 실행이 인생을 바꿉니다.
          <br />
          각 분야 최고의 전문가와 함께 새로운 기회를 만드세요.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button className="h-[52px] rounded-xl bg-mint px-8 text-[16px] font-semibold text-white shadow-lg shadow-mint/25 hover:bg-mint-dark md:h-14 md:text-[17px]">
            무료 강의 보기
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            className="h-[52px] rounded-xl border-white/20 bg-transparent px-8 text-[16px] font-medium text-white hover:bg-white/10 hover:text-white md:h-14 md:text-[17px]"
          >
            강의 둘러보기
          </Button>
        </div>

        {/* Trust stats */}
        <div className="mt-20 grid grid-cols-3 gap-6 border-t border-white/10 pt-10 md:max-w-lg md:gap-14">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <stat.icon className="mx-auto mb-2.5 h-5 w-5 text-mint/80 md:mx-0" />
              <p className="text-[24px] font-extrabold text-white md:text-[32px]">
                {stat.value}
              </p>
              <p className="mt-1 text-[13px] text-white/45 md:text-[14px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
