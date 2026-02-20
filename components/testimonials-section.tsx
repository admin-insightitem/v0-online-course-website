import { Star, TrendingUp } from "lucide-react"

const testimonials = [
  {
    name: "김태영",
    age: "45세",
    role: "AI 자동화 수강생",
    content: "40대 중반에 새로운 도전이 두려웠지만, 체계적인 커리큘럼 덕분에 AI 활용법을 제대로 배웠습니다. 지금은 자동화 시스템으로 안정적인 부수입을 만들고 있어요. 눈높이에 맞는 설명이 정말 좋았습니다.",
    result: "월 800만원 부수입 달성",
    rating: 5,
  },
  {
    name: "이수진",
    age: "48세",
    role: "유튜브 수강생",
    content: "유튜브를 시작한 지 6개월 만에 구독자 5만명을 달성했습니다. 막연하게 시작했던 유튜브가 이제는 든든한 수입원이 되었어요. 50대를 앞둔 나이에 새 인생을 시작한 기분입니다.",
    result: "6개월 만에 구독자 5만",
    rating: 5,
  },
  {
    name: "박민호",
    age: "52세",
    role: "커머스 수강생",
    content: "은퇴 후 제2의 인생을 준비하며 스마트스토어 강의를 수강했습니다. 상품 소싱부터 마케팅까지 하나하나 친절하게 가르쳐주셔서 기초부터 탄탄하게 배울 수 있었습니다.",
    result: "월매출 3,000만원 달성",
    rating: 5,
  },
  {
    name: "최하은",
    age: "43세",
    role: "마케팅 수강생",
    content: "회사에서 마케팅 업무를 맡게 되어 체계적으로 배우고 싶었습니다. 실무에서 바로 적용 가능한 전략들을 배워 광고 효율이 눈에 띄게 개선되었어요. 주변에 적극 추천합니다.",
    result: "ROAS 500% 달성",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-secondary py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-semibold tracking-[0.15em] text-accent">
            TESTIMONIALS
          </p>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
            수강생들의 실제 성과와 후기
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
            다양한 연령대의 수강생들이 실질적인 결과를 만들어내고 있습니다
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-lg border border-border bg-card p-8 transition-all duration-300 hover:shadow-md"
            >
              <div className="mb-5 flex items-center gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>

              <p className="mb-6 text-base leading-relaxed text-foreground/85">
                &ldquo;{t.content}&rdquo;
              </p>

              <div className="mb-5 inline-flex items-center gap-2 rounded-sm bg-accent/10 px-4 py-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <span className="text-sm font-bold text-accent">{t.result}</span>
              </div>

              <div className="flex items-center gap-4 border-t border-border pt-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">
                    {t.name} <span className="font-normal text-muted-foreground">({t.age})</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
