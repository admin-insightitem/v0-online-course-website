import { ShieldCheck, Infinity, Headphones, LayoutList } from "lucide-react"

const features = [
  {
    icon: ShieldCheck,
    title: "7일 내 전액 환불 보장",
    description: "만족하지 못하시면 수강 시작 7일 이내 전액 환불해드립니다. 조건 없이.",
  },
  {
    icon: Infinity,
    title: "평생 무제한 수강",
    description: "한 번 결제하면 평생 무제한으로 반복 수강할 수 있습니다.",
  },
  {
    icon: Headphones,
    title: "1:1 학습 상담",
    description: "전담 상담사가 학습 계획 수립부터 진도 관리까지 도와드립니다.",
  },
  {
    icon: LayoutList,
    title: "체계적 단계별 커리큘럼",
    description: "입문부터 실전까지, 수준별 로드맵으로 확실하게 성장하세요.",
  },
]

export function TrustBanner() {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.25em] text-mint font-[family-name:var(--font-heading)]">
          Why TitanClass
        </p>
        <h2 className="text-[26px] font-extrabold text-foreground md:text-[32px]">
          왜 타이탄클래스를 선택해야 하는가
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-gray-bg p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-mint/10">
                <f.icon className="h-6 w-6 text-mint" />
              </div>
              <h3 className="text-[17px] font-bold text-foreground">{f.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.8] text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
