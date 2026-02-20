import { Calendar, Clock, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const webinars = [
  {
    title: "2026년 AI 수익화 트렌드 완전 분석",
    speaker: "김도현",
    date: "3월 5일 (목)",
    time: "20:00 - 21:30",
    spots: 150,
    spotsLeft: 23,
    tag: "LIVE",
    tagColor: "bg-red-500 text-white",
  },
  {
    title: "유튜브 알고리즘의 비밀: 조회수 10배 올리기",
    speaker: "박서연",
    date: "3월 8일 (일)",
    time: "19:00 - 20:30",
    spots: 200,
    spotsLeft: 67,
    tag: "무료",
    tagColor: "bg-emerald-500 text-white",
  },
  {
    title: "스마트스토어 월매출 1,000만원 로드맵",
    speaker: "정민수",
    date: "3월 12일 (목)",
    time: "20:00 - 21:00",
    spots: 100,
    spotsLeft: 12,
    tag: "마감임박",
    tagColor: "bg-orange-500 text-white",
  },
]

export function WebinarSection() {
  return (
    <section id="webinar" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="mb-3 inline-block text-sm font-semibold text-primary">WEBINAR</span>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl text-balance">
              무료 라이브 웨비나
            </h2>
            <p className="mt-3 text-muted-foreground">
              전문가와 실시간으로 소통하며 인사이트를 얻으세요
            </p>
          </div>
          <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
            전체 일정 보기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {webinars.map((w) => (
            <div
              key={w.title}
              className="group flex flex-col items-start gap-4 rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/30 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Badge className={`${w.tagColor} border-0 text-xs font-bold`}>
                    {w.tag}
                  </Badge>
                  <h3 className="text-base font-bold text-foreground md:text-lg">
                    {w.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  강연자: <span className="text-foreground">{w.speaker}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground md:gap-6">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  {w.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" />
                  {w.time}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">{w.spotsLeft}</span>
                  /{w.spots}석
                </span>

                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
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
