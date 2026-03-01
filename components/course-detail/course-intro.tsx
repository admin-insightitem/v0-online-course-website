import Image from "next/image"
import { CheckCircle, Target, Sparkles, Zap, TrendingUp, Award } from "lucide-react"
import type { Course } from "@/lib/courses"

export function CourseIntro({ course }: { course: Course }) {
  return (
    <section id="detail-intro" className="scroll-mt-32 py-12">
      {/* Main Visual Banner */}
      <div className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 p-8 lg:p-12">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <span className="text-sm font-semibold text-accent">이런 분들을 위한 강의입니다</span>
        </div>
        <h2 className="mb-8 text-2xl font-bold leading-tight text-foreground lg:text-3xl text-balance">
          {course.title}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {course.targetAudience.map((item, index) => (
            <div
              key={item}
              className="flex items-start gap-4 rounded-xl bg-card/80 p-5 shadow-sm backdrop-blur-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <div>
                <span className="text-xs font-medium text-accent">대상 {index + 1}</span>
                <p className="mt-1 text-[15px] font-medium leading-relaxed text-foreground">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What You'll Learn */}
      <div className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground lg:text-2xl">
            이 강의에서 배우는 것
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {course.highlights.map((item) => (
            <div
              key={item}
              className="group flex items-start gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/50 hover:shadow-md"
            >
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <span className="text-[15px] font-medium leading-relaxed text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Course Stats */}
      <div className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <div className="mb-2 text-3xl font-bold text-primary">{course.lectures}</div>
          <div className="text-sm text-muted-foreground">총 강의 수</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <div className="mb-2 text-3xl font-bold text-primary">{course.duration}</div>
          <div className="text-sm text-muted-foreground">총 학습 시간</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <div className="mb-2 text-3xl font-bold text-primary">{course.students.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">수강생</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <div className="mb-2 text-3xl font-bold text-accent">{course.rating}</div>
          <div className="text-sm text-muted-foreground">평점</div>
        </div>
      </div>

      {/* Why This Course */}
      <div className="rounded-2xl bg-primary p-8 lg:p-10">
        <div className="mb-6 flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-accent" />
          <h3 className="text-xl font-bold text-primary-foreground lg:text-2xl">
            왜 이 강의를 들어야 할까요?
          </h3>
        </div>
        <p className="mb-8 text-base leading-relaxed text-primary-foreground/80 lg:text-lg">
          {course.description}
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 p-4">
            <Award className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium text-primary-foreground">평생 무제한 수강</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 p-4">
            <CheckCircle className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium text-primary-foreground">수료증 발급</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 p-4">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium text-primary-foreground">실전 프로젝트 포함</span>
          </div>
        </div>
      </div>

      {/* Requirements */}
      {course.requirements.length > 0 && (
        <div className="mt-12">
          <h3 className="mb-5 text-xl font-bold text-foreground lg:text-2xl">
            수강 전 준비사항
          </h3>
          <div className="rounded-xl border border-border bg-secondary/30 p-6">
            <ul className="space-y-3">
              {course.requirements.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                  <span className="text-[15px] leading-relaxed text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}
