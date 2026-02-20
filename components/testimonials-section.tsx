import { TrendingUp, ArrowRight } from "lucide-react"

const testimonials = [
  {
    result: "월 800만원 부수입",
    content: "40대 중반에 새로운 도전이 두려웠지만, 체계적인 커리큘럼 덕분에 AI 활용법을 제대로 배웠습니다. 지금은 자동화 시스템으로 안정적인 부수입을 만들고 있어요.",
    name: "김태영",
    age: "45세",
    course: "AI 자동화 마스터 과정",
  },
  {
    result: "6개월 만에 구독자 5만명",
    content: "유튜브를 시작한 지 6개월 만에 구독자 5만명을 달성했습니다. 막연하게 시작했던 유튜브가 이제는 든든한 수입원이 되었어요.",
    name: "이수진",
    age: "48세",
    course: "유튜브 수익화 완벽 가이드",
  },
  {
    result: "월매출 3,000만원 달성",
    content: "은퇴 후 제2의 인생을 준비하며 수강했습니다. 상품 소싱부터 마케팅까지 친절하게 가르쳐주셔서 기초부터 탄탄하게 배울 수 있었습니다.",
    name: "박민호",
    age: "52세",
    course: "스마트스토어 실전 로드맵",
  },
]

export function TestimonialsSection() {
  return (
    <section id="reviews" className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.25em] text-mint font-[family-name:var(--font-heading)]">
          Success Stories
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-[26px] font-extrabold text-foreground md:text-[32px] text-balance">
              40대에 시작해서 이런 성과를 만들었습니다
            </h2>
            <p className="mt-3 text-[16px] leading-[1.8] text-muted-foreground">
              실제 수강생들의 진짜 성과를 확인하세요.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-navy-light hover:underline"
          >
            더 많은 후기 보기
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-xl border border-border bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Big result number first */}
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint/10">
                  <TrendingUp className="h-4.5 w-4.5 text-mint" />
                </div>
                <span className="text-[22px] font-extrabold text-navy md:text-[24px]">
                  {t.result}
                </span>
              </div>

              {/* Short review */}
              <p className="flex-1 text-[15px] leading-[1.8] text-muted-foreground">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Person */}
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-[14px] font-bold text-white">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-[15px] font-bold text-foreground">
                    {t.name}
                    <span className="ml-1.5 font-normal text-muted-foreground">({t.age})</span>
                  </p>
                  <p className="text-[13px] text-muted-foreground">{t.course}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
