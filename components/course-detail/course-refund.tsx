import { ShieldCheck, Clock, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react"

export function CourseRefund() {
  return (
    <section id="detail-refund" className="scroll-mt-32 py-12">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
          <ShieldCheck className="h-5 w-5 text-accent-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground lg:text-2xl">
          환불 정책
        </h2>
      </div>

      {/* Main Refund Policy Card */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/5 to-accent/10">
        <div className="border-b border-accent/20 bg-accent/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <span className="text-base font-bold text-foreground">100% 환불 보장</span>
          </div>
        </div>
        <div className="p-6 lg:p-8">
          <p className="mb-6 text-base leading-relaxed text-foreground">
            수강 시작 후 <strong className="text-accent">30일 이내</strong> 학습한 강의 수가 전체의 30% 미만인 경우 
            <strong className="text-accent"> 전액 환불</strong>이 가능합니다. 
            강의에 만족하지 않으시면 언제든 환불을 요청해 주세요.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-card p-5">
              <div className="mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold text-foreground">환불 가능 기간</span>
              </div>
              <p className="text-2xl font-bold text-primary">30일</p>
            </div>
            <div className="rounded-xl bg-card p-5">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold text-foreground">수강 진도율 조건</span>
              </div>
              <p className="text-2xl font-bold text-primary">30% 미만</p>
            </div>
            <div className="rounded-xl bg-card p-5">
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold text-foreground">환불 금액</span>
              </div>
              <p className="text-2xl font-bold text-accent">전액 환불</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Policy */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
            <CheckCircle className="h-5 w-5 text-green-500" />
            환불 가능한 경우
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
              <span className="text-sm leading-relaxed text-muted-foreground">
                수강 시작일로부터 30일 이내인 경우
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
              <span className="text-sm leading-relaxed text-muted-foreground">
                전체 강의의 30% 미만을 수강한 경우
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
              <span className="text-sm leading-relaxed text-muted-foreground">
                교재 등 유형 상품을 수령하지 않은 경우
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            환불 불가능한 경우
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
              <span className="text-sm leading-relaxed text-muted-foreground">
                수강 시작일로부터 30일이 초과한 경우
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
              <span className="text-sm leading-relaxed text-muted-foreground">
                전체 강의의 30% 이상을 수강한 경우
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
              <span className="text-sm leading-relaxed text-muted-foreground">
                교재 등 유형 상품을 사용한 경우
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-8 rounded-xl border border-border bg-secondary/30 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
          <HelpCircle className="h-5 w-5 text-primary" />
          자주 묻는 질문
        </h3>
        <div className="space-y-4">
          <div>
            <p className="mb-1 text-sm font-semibold text-foreground">Q. 환불은 어떻게 신청하나요?</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              마이페이지 {'>'} 수강 내역에서 환불 신청 버튼을 클릭하시거나, 고객센터로 연락해 주시면 됩니다.
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold text-foreground">Q. 환불까지 얼마나 걸리나요?</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              환불 신청 후 영업일 기준 3~5일 이내에 결제 수단으로 환불됩니다.
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold text-foreground">Q. 부분 환불도 가능한가요?</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              네, 수강 진도율에 따라 부분 환불이 가능합니다. 자세한 사항은 고객센터로 문의해 주세요.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
