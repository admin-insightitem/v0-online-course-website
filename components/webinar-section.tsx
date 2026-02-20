import { Calendar, Clock, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const webinars = [
  {
    title: "2026년 AI 수익화 트렌드 완전 분석",
    speaker: "김도현",
    speakerTitle: "AI 자동화 전문가",
    date: "3월 5일 (목)",
    time: "20:00 - 21:30",
    spots: 150,
    spotsLeft: 23,
    tag: "LIVE",
  },
  {
    title: "유튜브 알고리즘의 비밀: 조회수 10배 올리기",
    speaker: "박서연",
    speakerTitle: "유튜브 크리에이터",
    date: "3월 8일 (일)",
    time: "19:00 - 20:30",
    spots: 200,
    spotsLeft: 67,
    tag: "무료",
  },
  {
    title: "스마트스토어 월매출 1,000만원 로드맵",
    speaker: "정민수",
    speakerTitle: "커머스 전문가",
    date: "3월 12일 (목)",
    time: "20:00 - 21:00",
    spots: 100,
    spotsLeft: 12,
    tag: "마감임박",
  },
]

export function WebinarSection() {
  return (
    <section id="webinar" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-sm font-semibold tracking-[0.15em] text-accent">
              LIVE WEBINAR
            </p>
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
              무료 라이브 웨비나
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              전문가와 실시간으로 질의응답하며 인사이트를 얻으세요
            </p>
          </div>
          <Button variant="outline" className="border-border text-base text-foreground hover:bg-card">
            전체 일정 보기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-5">
          {webinars.map((w) => (
            <div
              key={w.title}
              className="group flex flex-col items-start gap-5 rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:shadow-md md:flex-row md:items-center md:p-8"
            >
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <span className={`rounded-sm px-3 py-1 text-xs font-bold ${
                    w.tag === "LIVE" ? "bg-foreground text-background" :
                    w.tag === "무료" ? "bg-accent text-accent-foreground" :
                    "bg-accent/10 text-accent"
                  }`}>
                    {w.tag}
                  </span>
                  <h3 className="text-lg font-bold text-foreground">
                    {w.title}
                  </h3>
                </div>
                <p className="text-[15px] text-muted-foreground">
                  {w.speaker} <span className="text-sm">| {w.speakerTitle}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-[15px] text-muted-foreground md:gap-6">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  {w.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent" />
                  {w.time}
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-accent" />
                  <span className="font-bold text-foreground">{w.spotsLeft}</span>
                  /{w.spots}석
                </span>

                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  신청하기
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
