import Image from "next/image"
import { ArrowRight } from "lucide-react"

const courses = [
  {
    title: "ChatGPT & AI 자동화로 월 1,000만원 수익 만들기",
    instructor: "김도현",
    image: "/images/course-ai.jpg",
    category: "AI / 자동화",
    price: "149,000",
    originalPrice: "299,000",
    badge: "BEST",
    description: "AI 도구 활용부터 자동화 시스템 구축까지 실전 노하우",
  },
  {
    title: "유튜브 수익화 완벽 가이드: 0에서 월 500만원까지",
    instructor: "박서연",
    image: "/images/course-youtube.jpg",
    category: "유튜브",
    price: "129,000",
    originalPrice: "259,000",
    badge: "NEW",
    description: "채널 기획부터 수익화까지 단계별 로드맵 제공",
  },
  {
    title: "퍼포먼스 마케팅 마스터클래스: ROI 500% 달성 전략",
    instructor: "이준혁",
    image: "/images/course-marketing.jpg",
    category: "마케팅",
    price: "169,000",
    originalPrice: "339,000",
    badge: "BEST",
    description: "광고 세팅부터 데이터 분석까지 실무 중심 강의",
  },
  {
    title: "스마트스토어 + 쿠팡: 월매출 5,000만원 실전 로드맵",
    instructor: "정민수",
    image: "/images/course-commerce.jpg",
    category: "커머스",
    price: "159,000",
    originalPrice: "319,000",
    badge: null,
    description: "상품 소싱부터 광고 운영까지 온라인 셀러 완성",
  },
]

export function CoursesSection() {
  return (
    <section id="courses" className="bg-gray-bg py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.25em] text-mint font-[family-name:var(--font-heading)]">
          Premium Courses
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-[26px] font-extrabold text-foreground md:text-[32px]">
              지금 가장 인기있는 강의
            </h2>
            <p className="mt-3 text-[16px] leading-[1.8] text-muted-foreground">
              수강생들이 가장 많이 선택한 검증된 강의를 만나보세요.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-navy-light hover:underline"
          >
            전체 강의 보기
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <article
              key={course.title}
              className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {course.badge && (
                  <span
                    className={`absolute top-3 left-3 rounded-md px-2.5 py-1 text-[11px] font-bold shadow-sm ${
                      course.badge === "BEST"
                        ? "bg-navy text-white"
                        : "bg-mint text-white"
                    }`}
                  >
                    {course.badge}
                  </span>
                )}
              </div>

              <div className="p-5">
                <span className="text-[12px] font-semibold text-navy-light">{course.category}</span>
                <h3 className="mt-1.5 line-clamp-2 text-[15px] font-bold leading-[1.5] text-foreground">
                  {course.title}
                </h3>
                <p className="mt-1 text-[13px] text-muted-foreground">{course.instructor}</p>

                <div className="mt-4 flex items-baseline gap-2 border-t border-border pt-4">
                  <span className="text-[18px] font-extrabold text-foreground">
                    {"\u20A9"}{course.price}
                  </span>
                  <span className="text-[13px] text-muted-foreground line-through">
                    {"\u20A9"}{course.originalPrice}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
