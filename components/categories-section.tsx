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
    <section id="categories" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-semibold tracking-[0.15em] text-accent">
            CATEGORIES
          </p>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
            체계적으로 분류된 전문 교육 과정
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
            6개 핵심 분야에서 200개 이상의 프리미엄 강의를 만나보세요
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <button
              key={cat.label}
              className="group flex items-start gap-5 rounded-lg border border-border bg-card p-6 text-left transition-all duration-300 hover:border-accent/40 hover:shadow-md"
            >
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-secondary">
                <cat.icon className="h-6 w-6 text-foreground transition-colors group-hover:text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{cat.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
                <p className="mt-2 text-sm font-semibold text-accent">{cat.count}개 강의</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
