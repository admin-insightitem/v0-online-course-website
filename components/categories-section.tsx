import { Brain, Youtube, Megaphone, Palette, ShoppingCart, Smartphone } from "lucide-react"

const categories = [
  { icon: Brain, label: "AI / 자동화", count: 42, description: "최신 AI 기술 활용 수익화" },
  { icon: Youtube, label: "유튜브", count: 38, description: "채널 성장 및 수익화 전략" },
  { icon: Megaphone, label: "마케팅", count: 35, description: "검증된 퍼포먼스 마케팅" },
  { icon: Palette, label: "디자인 / 영상", count: 28, description: "크리에이티브 실무 역량" },
  { icon: ShoppingCart, label: "커머스", count: 32, description: "온라인 쇼핑몰 운영 전략" },
  { icon: Smartphone, label: "SNS 수익화", count: 25, description: "소셜미디어 마케팅 전략" },
]

export function CategoriesSection() {
  return (
    <section className="bg-gray-bg py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.25em] text-mint font-[family-name:var(--font-heading)]">
          Curriculum
        </p>
        <h2 className="text-[26px] font-extrabold text-foreground md:text-[32px]">
          6개 핵심 분야의 체계적 교육 과정
        </h2>
        <p className="mt-3 text-[16px] leading-[1.8] text-muted-foreground">
          목표에 맞는 분야를 선택하고, 단계별로 학습하세요.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <button
              key={cat.label}
              className="group flex items-start gap-5 rounded-xl border border-border bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-navy/5 transition-colors group-hover:bg-mint/10">
                <cat.icon className="h-6 w-6 text-navy transition-colors group-hover:text-mint" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-foreground">{cat.label}</h3>
                <p className="mt-1 text-[14px] leading-[1.7] text-muted-foreground">{cat.description}</p>
                <p className="mt-2 text-[13px] font-semibold text-navy-light">{cat.count}개 강의</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
