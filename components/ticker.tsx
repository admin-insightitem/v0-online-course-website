const items = [
  "AI 자동화로 월 1,000만원",
  "유튜브 구독자 10만 돌파",
  "마케팅 ROI 500% 달성",
  "디자인 프리랜서 월 수익 2배",
  "스마트스토어 월매출 5,000만원",
  "SNS 인플루언서 수익화 성공",
  "부업으로 월 500만원 달성",
  "퇴사 후 1인 기업 성공",
]

export function Ticker() {
  return (
    <div className="overflow-hidden border-y border-border/50 bg-secondary/50 py-3">
      <div className="animate-ticker flex whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-1 w-1 rounded-full bg-primary" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
