import Image from "next/image"
import { BookOpen } from "lucide-react"

const instructors = [
  {
    name: "김도현",
    field: "AI 자동화 전문가",
    credentials: ["전 네이버 AI 연구원", "200개 기업 AI 컨설팅"],
    image: "/images/instructor-1.jpg",
    courses: 5,
  },
  {
    name: "박서연",
    field: "유튜브 & 콘텐츠 크리에이터",
    credentials: ["구독자 120만 채널 운영", "MCN 대표"],
    image: "/images/instructor-2.jpg",
    courses: 4,
  },
  {
    name: "이준혁",
    field: "퍼포먼스 마케팅 디렉터",
    credentials: ["전 카카오 마케팅 리드", "ROAS 500% 다수 달성"],
    image: "/images/instructor-3.jpg",
    courses: 3,
  },
]

export function InstructorsSection() {
  return (
    <section id="instructors" className="bg-[#0F2140] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.25em] text-mint font-[family-name:var(--font-heading)]">
          Expert Instructors
        </p>
        <h2 className="text-[26px] font-extrabold text-white md:text-[32px] text-balance">
          각 분야 최고의 전문가가 직접 가르칩니다
        </h2>
        <p className="mt-3 text-[16px] leading-[1.8] text-white/50">
          검증된 경력과 실전 성과를 갖춘 전문가들의 강의를 만나보세요.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {instructors.map((inst) => (
            <div
              key={inst.name}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors hover:bg-white/[0.08]"
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
                <h3 className="text-[20px] font-bold text-white">{inst.name}</h3>
                <p className="mt-1 text-[15px] font-medium text-mint">{inst.field}</p>

                <ul className="mt-4 flex flex-col gap-2">
                  {inst.credentials.map((cred) => (
                    <li key={cred} className="flex items-center gap-2 text-[14px] text-white/60">
                      <span className="h-1 w-1 flex-shrink-0 rounded-full bg-mint" />
                      {cred}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-center gap-1.5 border-t border-white/10 pt-5 text-[14px] text-white/50">
                  <BookOpen className="h-4 w-4" />
                  담당 강의 {inst.courses}개
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
