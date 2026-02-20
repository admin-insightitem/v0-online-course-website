import Image from "next/image"
import { Star, Users, BookOpen, CheckCircle } from "lucide-react"

const instructors = [
  {
    name: "김도현",
    title: "AI 자동화 전문가",
    credentials: ["전 네이버 AI 연구원", "200개 기업 컨설팅", "AI 자동화 강의 1위"],
    image: "/images/instructor-1.jpg",
    rating: 4.9,
    students: 8340,
    courses: 5,
  },
  {
    name: "박서연",
    title: "유튜브 & 콘텐츠 크리에이터",
    credentials: ["구독자 120만 채널 운영", "MCN 대표", "콘텐츠 마케팅 전문가"],
    image: "/images/instructor-2.jpg",
    rating: 4.8,
    students: 6210,
    courses: 4,
  },
  {
    name: "이준혁",
    title: "퍼포먼스 마케팅 디렉터",
    credentials: ["전 카카오 마케팅 리드", "ROAS 500% 다수 달성", "마케팅 컨설팅 10년"],
    image: "/images/instructor-3.jpg",
    rating: 4.9,
    students: 4530,
    courses: 3,
  },
]

export function InstructorsSection() {
  return (
    <section id="instructors" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-semibold tracking-[0.15em] text-accent">
            EXPERT INSTRUCTORS
          </p>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
            각 분야 최고의 전문가
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
            검증된 경력과 실전 성과를 갖춘 전문가들이 직접 가르칩니다
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {instructors.map((inst) => (
            <div
              key={inst.name}
              className="group overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={inst.image}
                  alt={inst.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground">{inst.name}</h3>
                <p className="mt-1 text-[15px] font-medium text-accent">{inst.title}</p>

                <ul className="mt-4 flex flex-col gap-2">
                  {inst.credentials.map((cred) => (
                    <li key={cred} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                      {cred}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-center gap-5 border-t border-border pt-5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-bold text-foreground">{inst.rating}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {inst.students.toLocaleString()}명
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    {inst.courses}개 강의
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
