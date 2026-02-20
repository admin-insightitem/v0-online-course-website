import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Award, Users } from "lucide-react"

const trustMarkers = [
  { icon: Users, value: "50,000+", label: "누적 수강생" },
  { icon: Award, value: "98.2%", label: "수강 만족도" },
  { icon: Shield, value: "200+", label: "검증된 강의" },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          className="object-cover opacity-15"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-20 lg:px-8 lg:pt-24 lg:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 text-sm font-semibold tracking-[0.15em] text-accent">
            NO.1 PREMIUM ONLINE ACADEMY
          </p>

          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            <span className="text-balance">
              성공을 위한{" "}
              <span className="italic">확실한 투자,</span>
              <br className="hidden md:block" />
              프리미엄 온라인 강의
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            각 분야 최고 전문가들의 검증된 실전 노하우를 체계적으로 배우세요.
            이미 50,000명이 선택한 신뢰할 수 있는 교육 플랫폼입니다.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="h-14 bg-primary px-10 text-base text-primary-foreground hover:bg-primary/90">
              무료 체험 시작하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 border-foreground/20 bg-transparent px-10 text-base text-foreground hover:bg-secondary"
            >
              강의 둘러보기
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            가입 후 7일간 무료 체험 | 언제든 취소 가능
          </p>
        </div>

        <div className="mx-auto mt-20 max-w-2xl">
          <div className="grid grid-cols-3 divide-x divide-border rounded-lg border border-border bg-card p-6 md:p-8">
            {trustMarkers.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2 px-4">
                <stat.icon className="h-5 w-5 text-accent" />
                <span className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
