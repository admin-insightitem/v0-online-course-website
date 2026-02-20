const items = [
  "AI 자동화 전문가 과정",
  "유튜브 수익화 마스터",
  "퍼포먼스 마케팅 전략",
  "디자인 크리에이터 패키지",
  "커머스 실전 로드맵",
  "SNS 인플루언서 양성",
  "1:1 멘토링 프로그램",
  "실시간 라이브 웨비나",
]

export function Ticker() {
  return (
    <div className="overflow-hidden border-y border-border bg-card py-4">
      <div className="animate-ticker flex whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-8 inline-flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
