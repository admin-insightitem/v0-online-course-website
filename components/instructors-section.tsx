import Image from "next/image"
import { Star, Users, BookOpen } from "lucide-react"

const instructors = [
  {
    name: "김도현",
    title: "AI 자동화 전문가",
    bio: "전 네이버 AI 연구원 출신. GPT, 자동화 툴을 활용한 비즈니스 솔루션 전문가. 200개 이상의 기업 컨설팅 경험.",
    image: "/images/instructor-1.jpg",
    rating: 4.9,
    students: 8340,
    courses: 5,
  },
  {
    name: "박서연",
    title: "유튜브 & 콘텐츠 크리에이터",
    bio: "구독자 120만 유튜브 채널 운영. 콘텐츠 기획부터 수익화까지 실전 노하우를 공유합니다.",
    image: "/images/instructor-2.jpg",
    rating: 4.8,
    students: 6210,
    courses: 4,
  },
  {
    name: "이준혁",
    title: "퍼포먼스 마케팅 디렉터",
    bio: "전 카카오 퍼포먼스 마케팅 리드. ROAS 500% 달성 경험을 바탕으로 실전 마케팅 전략을 가르칩니다.",
    image: "/images/instructor-3.jpg",
    rating: 4.9,
    students: 4530,
    courses: 3,
  },
]

export function InstructorsSection() {
  return (
    <section id="instructors" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-sm font-semibold text-primary">INSTRUCTORS</span>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl text-balance">
            최고의 전문가와 함께하세요
          </h2>
          <p className="mt-3 text-muted-foreground">
            각 분야 최정상 전문가들이 실전 노하우를 전수합니다
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {instructors.map((inst) => (
            <div
              key={inst.name}
              className="group overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="mb-5 flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={inst.image}
                    alt={inst.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{inst.name}</h3>
                  <p className="text-sm text-primary">{inst.title}</p>
                </div>
              </div>

              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                {inst.bio}
              </p>

              <div className="flex items-center gap-4 border-t border-border/50 pt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  <span className="font-semibold text-foreground">{inst.rating}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {inst.students.toLocaleString()}명
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {inst.courses}개 강의
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
