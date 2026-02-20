import { ShieldCheck, GraduationCap, Clock, HeadphonesIcon } from "lucide-react"

const features = [
  { icon: ShieldCheck, title: "품질 보증", description: "만족하지 못하시면 7일 내 전액 환불해드립니다" },
  { icon: GraduationCap, title: "체계적 커리큘럼", description: "단계별 학습 로드맵으로 확실한 실력 향상" },
  { icon: Clock, title: "무제한 수강", description: "한 번 결제하면 평생 무제한 반복 수강 가능" },
  { icon: HeadphonesIcon, title: "1:1 상담 지원", description: "전담 상담사가 학습 과정을 도와드립니다" },
]

export function TrustBanner() {
  return (
    <section className="border-y border-border bg-card py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-secondary">
                <f.icon className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
