"use client"

import { Star, Quote, TrendingUp } from "lucide-react"

const testimonials = [
  {
    name: "김태영",
    role: "AI 자동화 수강생",
    content: "ChatGPT 활용법을 제대로 배워서 업무 효율이 3배 이상 올랐습니다. 지금은 자동화 시스템으로 월 800만원 부수입을 만들고 있어요.",
    result: "월 800만원 부수입",
    rating: 5,
  },
  {
    name: "이수진",
    role: "유튜브 수강생",
    content: "유튜브를 시작한 지 6개월 만에 구독자 5만명을 달성했습니다. 수익화 전략이 정말 실전적이었어요. 이제 본업보다 유튜브 수익이 더 많습니다.",
    result: "6개월 만에 구독자 5만",
    rating: 5,
  },
  {
    name: "박민호",
    role: "커머스 수강생",
    content: "스마트스토어 강의 듣고 3개월 만에 월매출 3,000만원을 돌파했습니다. 상품 소싱부터 마케팅까지 체계적으로 배울 수 있었습니다.",
    result: "월매출 3,000만원",
    rating: 5,
  },
  {
    name: "최하은",
    role: "마케팅 수강생",
    content: "광고비 대비 매출이 5배 이상 올랐어요. 퍼포먼스 마케팅의 본질을 제대로 이해하게 되었습니다. 강추합니다!",
    result: "ROAS 500% 달성",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-secondary/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-sm font-semibold text-primary">TESTIMONIALS</span>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl text-balance">
            수강생들의 실제 성과
          </h2>
          <p className="mt-3 text-muted-foreground">
            타이탄클래스와 함께 성장한 수강생들의 이야기
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/30"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />

              <div className="mb-4 flex items-center gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="mb-5 text-sm leading-relaxed text-foreground/90">
                &ldquo;{t.content}&rdquo;
              </p>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary">{t.result}</span>
              </div>

              <div className="flex items-center gap-3 border-t border-border/50 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
