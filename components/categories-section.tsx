import { Brain, Youtube, Megaphone, Palette, ShoppingCart, Smartphone } from "lucide-react"

const categories = [
  { icon: Brain, label: "AI / 자동화", count: 42, color: "from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30" },
  { icon: Youtube, label: "유튜브", count: 38, color: "from-red-500/20 to-rose-500/20 hover:from-red-500/30 hover:to-rose-500/30" },
  { icon: Megaphone, label: "마케팅", count: 35, color: "from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30" },
  { icon: Palette, label: "디자인 / 영상", count: 28, color: "from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30" },
  { icon: ShoppingCart, label: "커머스", count: 32, color: "from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30" },
  { icon: Smartphone, label: "SNS 수익화", count: 25, color: "from-pink-500/20 to-rose-500/20 hover:from-pink-500/30 hover:to-rose-500/30" },
]

export function CategoriesSection() {
  return (
    <section id="categories" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-sm font-semibold text-primary">CATEGORIES</span>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl text-balance">
            관심 분야를 선택하세요
          </h2>
          <p className="mt-3 text-muted-foreground">
            6개 핵심 카테고리에서 200개 이상의 프리미엄 강의를 만나보세요
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <button
              key={cat.label}
              className={`group flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-gradient-to-br ${cat.color} p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/50">
                <cat.icon className="h-6 w-6 text-foreground transition-colors group-hover:text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground">{cat.label}</span>
              <span className="text-xs text-muted-foreground">{cat.count}개 강의</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
