import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play, ArrowRight, Users, BookOpen, Award } from "lucide-react"

const stats = [
  { icon: Users, value: "50,000+", label: "수강생" },
  { icon: BookOpen, value: "200+", label: "프리미엄 강의" },
  { icon: Award, value: "98%", label: "만족도" },
]

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/40" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pt-20 pb-16 text-center lg:px-8 lg:pt-32">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">
            신규 클래스 매주 업데이트
          </span>
        </div>

        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-7xl">
          <span className="text-balance">
            {"당신의 수익을 10배 만드는"}
            <br />
            {"온라인 클래스"}
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {"AI, 유튜브, 마케팅, 디자인, 커머스 분야 최고 전문가들의 실전 노하우를 지금 바로 시작하세요."}
          <br />
          {"이미 50,000명이 선택한 프리미엄 온라인 강의."}
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button size="lg" className="bg-primary px-8 text-primary-foreground hover:bg-primary/90">
            지금 시작하기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-border bg-transparent text-foreground hover:bg-secondary"
          >
            <Play className="mr-2 h-4 w-4" />
            소개 영상 보기
          </Button>
        </div>

        <div className="mt-16 grid w-full max-w-xl grid-cols-3 gap-6 md:mt-20">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <stat.icon className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-foreground md:text-3xl">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground md:text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
