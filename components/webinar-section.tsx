import { Calendar, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const webinars = [
  {
    title: "2026년 AI 수익화 트렌드 완전 분석",
    speaker: "김도현",
    speakerTitle: "AI 자동화 전문가",
    date: "3월 5일 (목)",
    time: "20:00 - 21:30",
    totalSpots: 150,
    spotsLeft: 23,
  },
  {
    title: "유튜브 알고리즘의 비밀: 조회수 10배 올리기",
    speaker: "박서연",
    speakerTitle: "구독자 120만 크리에이터",
    date: "3월 8일 (일)",
    time: "19:00 - 20:30",
    totalSpots: 200,
    spotsLeft: 67,
  },
  {
    title: "스마트스토어 월매출 1,000만원 로드맵",
    speaker: "정민수",
    speakerTitle: "커머스 전문가",
    date: "3월 12일 (목)",
    time: "20:00 - 21:00",
    totalSpots: 100,
    spotsLeft: 12,
  },
]

export function WebinarSection() {
  return (
    <section id="webinar" className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.25em] text-mint font-[family-name:var(--font-heading)]">
          Free Webinar
        </p>
        <h2 className="text-[26px] font-extrabold text-foreground md:text-[32px]">
          먼저 무료로 경험해보세요
        </h2>
        <p className="mt-3 text-[16px] leading-[1.8] text-muted-foreground">
          부담 없이 참여하고, 전문가의 실전 노하우를 직접 확인하세요.
        </p>

        <div className="mt-10 flex flex-col gap-4">
          {webinars.map((w) => {
            const urgent = w.spotsLeft <= 20
            return (
              <div
                key={w.title}
                className="flex flex-col gap-5 rounded-xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:flex-row md:items-center md:p-7"
              >
                <div className="flex-1">
                  <h3 className="text-[18px] font-bold leading-snug text-foreground">
                    {w.title}
                  </h3>
                  <p className="mt-1.5 text-[15px] text-muted-foreground">
                    {w.speaker} &middot; {w.speakerTitle}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[14px] text-muted-foreground md:gap-5">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-navy-light" />
                    {w.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-navy-light" />
                    {w.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-navy-light" />
                    <span className={`font-bold ${urgent ? "text-orange" : "text-foreground"}`}>
                      {w.spotsLeft}
                    </span>
                    /{w.totalSpots}석
                    {urgent && (
                      <span className="ml-1 rounded bg-orange/10 px-1.5 py-0.5 text-[12px] font-bold text-orange">
                        마감임박
                      </span>
                    )}
                  </span>

                  <Button className="h-10 rounded-lg bg-mint px-5 text-[14px] font-semibold text-white hover:bg-mint-dark md:ml-2">
                    무료 신청
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
