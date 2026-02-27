"use client"

import { TeacherLayout } from "@/components/teacher-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  MessageSquare,
  ArrowRight,
  DollarSign,
  Activity,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import Link from "next/link"

// 매출 데이터 (강사 본인의 강의만)
const revenueData = [
  { date: "01/01", revenue: 1500000, refund: 50000 },
  { date: "01/02", revenue: 1800000, refund: 80000 },
  { date: "01/03", revenue: 1600000, refund: 30000 },
  { date: "01/04", revenue: 2100000, refund: 90000 },
  { date: "01/05", revenue: 1900000, refund: 60000 },
  { date: "01/06", revenue: 2400000, refund: 100000 },
  { date: "01/07", revenue: 2200000, refund: 70000 },
]

// 강의별 매출
const courseData = [
  { course: "ChatGPT & AI 자동화", revenue: 45000000 },
  { course: "AI 비즈니스 심화", revenue: 18000000 },
]

// 최근 Q&A
const recentQna = [
  { id: 1, name: "김*수", type: "Q&A", course: "ChatGPT AI 자동화", status: "대기중", time: "10분 전" },
  { id: 2, name: "이*영", type: "Q&A", course: "ChatGPT AI 자동화", status: "처리중", time: "1시간 전" },
  { id: 3, name: "박*진", type: "Q&A", course: "AI 비즈니스 심화", status: "완료", time: "3시간 전" },
  { id: 4, name: "최*희", type: "Q&A", course: "ChatGPT AI 자동화", status: "대기중", time: "5시간 전" },
]

// 신규 수강생
const newStudents = [
  { id: 1, name: "정민수", email: "j***@gmail.com", course: "ChatGPT AI 자동화", date: "2026.02.27" },
  { id: 2, name: "한수빈", email: "h***@naver.com", course: "ChatGPT AI 자동화", date: "2026.02.27" },
  { id: 3, name: "오진영", email: "o***@gmail.com", course: "AI 비즈니스 심화", date: "2026.02.26" },
  { id: 4, name: "송예진", email: "s***@kakao.com", course: "ChatGPT AI 자동화", date: "2026.02.26" },
]

function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  description,
}: {
  title: string
  value: string
  change: string
  changeType: "increase" | "decrease"
  icon: React.ElementType
  description: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="mt-1 flex items-center gap-1 text-sm">
          {changeType === "increase" ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={changeType === "increase" ? "text-green-600" : "text-red-500"}>
            {change}
          </span>
          <span className="text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function formatCurrency(value: number): string {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(1)}억`
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(0)}만`
  }
  return value.toLocaleString()
}

export default function TeacherDashboard() {
  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">대시보드</h2>
          <p className="text-muted-foreground">내 강의 현황을 한눈에 확인하세요.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="이번 달 수익"
            value="1,340만원"
            change="+15.2%"
            changeType="increase"
            icon={DollarSign}
            description="전월 대비"
          />
          <StatCard
            title="내 수강생"
            value="8,340명"
            change="+12.5%"
            changeType="increase"
            icon={Users}
            description="전월 대비"
          />
          <StatCard
            title="내 강의"
            value="2개"
            change="+1개"
            changeType="increase"
            icon={BookOpen}
            description="신규 등록"
          />
          <StatCard
            title="미답변 Q&A"
            value="5건"
            change="-2건"
            changeType="decrease"
            icon={MessageSquare}
            description="전일 대비"
          />
        </div>

        {/* Revenue Chart & Settlement */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>수익 현황</CardTitle>
                  <CardDescription>일별 수익 및 환불 금액</CardDescription>
                </div>
                <Tabs defaultValue="daily" className="w-auto">
                  <TabsList className="h-8">
                    <TabsTrigger value="daily" className="text-xs px-3">일별</TabsTrigger>
                    <TabsTrigger value="monthly" className="text-xs px-3">월별</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis
                      className="text-xs"
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value.toLocaleString()}원`, ""]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--chart-1))"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      name="수익"
                    />
                    <Area
                      type="monotone"
                      dataKey="refund"
                      stroke="hsl(var(--destructive))"
                      fillOpacity={0.3}
                      fill="hsl(var(--destructive))"
                      name="환불"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Settlement Summary */}
          <Card>
            <CardHeader>
              <CardTitle>정산 예정</CardTitle>
              <CardDescription>수수료 제외 금액</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">총 수익</span>
                  <span className="font-medium">13,500,000원</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">환불 금액</span>
                  <span className="font-medium text-red-500">-480,000원</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">플랫폼 수수료 (20%)</span>
                  <span className="font-medium text-red-500">-2,604,000원</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">정산 예정 금액</span>
                    <span className="text-lg font-bold text-primary">10,416,000원</span>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">다음 정산일: 2026.03.05</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Revenue & Recent Q&A */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Course Revenue */}
          <Card>
            <CardHeader>
              <CardTitle>강의별 수익</CardTitle>
              <CardDescription>이번 달 강의별 수익 현황</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                    <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} className="text-xs" />
                    <YAxis type="category" dataKey="course" className="text-xs" width={120} />
                    <Tooltip formatter={(value: number) => [`${value.toLocaleString()}원`, "수익"]} />
                    <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Q&A */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>최근 Q&A</CardTitle>
                <CardDescription>답변이 필요한 질문 목록</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/teacher/inquiries">
                  전체 보기
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentQna.map((qna) => (
                  <div key={qna.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {qna.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{qna.name} - {qna.type}</p>
                        <p className="text-xs text-muted-foreground">{qna.course}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          qna.status === "완료"
                            ? "secondary"
                            : qna.status === "대기중"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {qna.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{qna.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Students */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>신규 수강생</CardTitle>
              <CardDescription>최근 내 강의를 수강 신청한 학생 목록</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/teacher/students">
                전체 보기
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>수강 강좌</TableHead>
                  <TableHead>등록일</TableHead>
                  <TableHead className="text-right">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell>{student.date}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        상세보기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </TeacherLayout>
  )
}
