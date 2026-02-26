"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Tag,
  Image as ImageIcon,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Calendar,
  Percent,
  DollarSign,
  Users,
  TrendingUp,
  Eye,
  EyeOff,
  Gift,
} from "lucide-react"
import Image from "next/image"

// 쿠폰 데이터
const couponsData = [
  {
    id: "1",
    code: "WELCOME2026",
    name: "신규 가입 환영 쿠폰",
    type: "percent",
    discount: 20,
    minPurchase: 100000,
    maxDiscount: 30000,
    usageLimit: 1000,
    usedCount: 456,
    startDate: "2026.01.01",
    endDate: "2026.12.31",
    isActive: true,
    applicableCourses: "전체 강좌",
  },
  {
    id: "2",
    code: "SPRING30",
    name: "봄맞이 30% 할인",
    type: "percent",
    discount: 30,
    minPurchase: 150000,
    maxDiscount: 50000,
    usageLimit: 500,
    usedCount: 312,
    startDate: "2026.03.01",
    endDate: "2026.03.31",
    isActive: true,
    applicableCourses: "전체 강좌",
  },
  {
    id: "3",
    code: "AICLASS50K",
    name: "AI 강좌 5만원 할인",
    type: "fixed",
    discount: 50000,
    minPurchase: 100000,
    maxDiscount: 50000,
    usageLimit: 200,
    usedCount: 89,
    startDate: "2026.02.01",
    endDate: "2026.02.28",
    isActive: true,
    applicableCourses: "AI / 자동화 카테고리",
  },
  {
    id: "4",
    code: "VIP10",
    name: "VIP 전용 10% 추가 할인",
    type: "percent",
    discount: 10,
    minPurchase: 0,
    maxDiscount: 20000,
    usageLimit: 100,
    usedCount: 45,
    startDate: "2026.01.01",
    endDate: "2026.06.30",
    isActive: true,
    applicableCourses: "전체 강좌",
  },
  {
    id: "5",
    code: "EXPIRED2025",
    name: "2025 연말 프로모션",
    type: "percent",
    discount: 25,
    minPurchase: 100000,
    maxDiscount: 40000,
    usageLimit: 1000,
    usedCount: 876,
    startDate: "2025.12.01",
    endDate: "2025.12.31",
    isActive: false,
    applicableCourses: "전체 강좌",
  },
]

// 프로모션 배너 데이터
const bannersData = [
  {
    id: "1",
    title: "AI 자동화 강좌 얼리버드 40% 할인",
    image: "/images/banner-ai.jpg",
    link: "/courses/chatgpt-ai-automation",
    position: "메인 히어로",
    startDate: "2026.02.15",
    endDate: "2026.03.15",
    isActive: true,
    clicks: 12340,
    views: 45678,
  },
  {
    id: "2",
    title: "유튜브 수익화 완전 정복 오픈",
    image: "/images/banner-youtube.jpg",
    link: "/courses/youtube-monetization",
    position: "서브 배너",
    startDate: "2026.02.01",
    endDate: "2026.02.28",
    isActive: true,
    clicks: 8920,
    views: 32100,
  },
  {
    id: "3",
    title: "설 연휴 특별 프로모션",
    image: "/images/banner-event.jpg",
    link: "/event/lunar-new-year",
    position: "팝업",
    startDate: "2026.02.10",
    endDate: "2026.02.20",
    isActive: false,
    clicks: 5670,
    views: 18900,
  },
]

const courseCategories = [
  "전체 강좌",
  "AI / 자동화",
  "유튜브",
  "마케팅",
  "디자인",
  "커머스",
  "SNS",
]

const bannerPositions = ["메인 히어로", "서브 배너", "사이드바", "팝업", "하단 배너"]

export default function PromotionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false)
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false)
  const [coupons, setCoupons] = useState(couponsData)
  const [banners, setBanners] = useState(bannersData)

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && coupon.isActive) ||
      (statusFilter === "inactive" && !coupon.isActive)
    return matchesSearch && matchesStatus
  })

  const filteredBanners = banners.filter((banner) => {
    const matchesSearch = banner.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && banner.isActive) ||
      (statusFilter === "inactive" && !banner.isActive)
    return matchesSearch && matchesStatus
  })

  const activeCoupons = coupons.filter((c) => c.isActive).length
  const totalCouponUsage = coupons.reduce((acc, c) => acc + c.usedCount, 0)
  const activeBanners = banners.filter((b) => b.isActive).length
  const totalBannerClicks = banners.reduce((acc, b) => acc + b.clicks, 0)

  const toggleCouponStatus = (id: string) => {
    setCoupons(coupons.map((c) =>
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ))
  }

  const toggleBannerStatus = (id: string) => {
    setBanners(banners.map((b) =>
      b.id === id ? { ...b, isActive: !b.isActive } : b
    ))
  }

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">쿠폰/이벤트 관리</h2>
            <p className="text-muted-foreground">할인 쿠폰과 프로모션 배너를 관리합니다.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeCoupons}</p>
                  <p className="text-sm text-muted-foreground">활성 쿠폰</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-green-100 p-3">
                  <Gift className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCouponUsage.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">총 쿠폰 사용</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-100 p-3">
                  <ImageIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeBanners}</p>
                  <p className="text-sm text-muted-foreground">활성 배너</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-yellow-100 p-3">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalBannerClicks.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">총 배너 클릭</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="coupons" className="space-y-4">
          <TabsList>
            <TabsTrigger value="coupons" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              쿠폰 관리
            </TabsTrigger>
            <TabsTrigger value="banners" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              프로모션 배너
            </TabsTrigger>
          </TabsList>

          {/* Coupons Tab */}
          <TabsContent value="coupons" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Card className="flex-1">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="쿠폰 코드 또는 이름으로 검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="상태" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">전체</SelectItem>
                          <SelectItem value="active">활성</SelectItem>
                          <SelectItem value="inactive">비활성</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Dialog open={isCouponDialogOpen} onOpenChange={setIsCouponDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    쿠폰 생성
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>새 쿠폰 생성</DialogTitle>
                    <DialogDescription>
                      새로운 할인 쿠폰을 생성합니다.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="couponCode">쿠폰 코드</Label>
                      <Input id="couponCode" placeholder="WELCOME2026" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="couponName">쿠폰명</Label>
                      <Input id="couponName" placeholder="신규 가입 환영 쿠폰" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="discountType">할인 유형</Label>
                        <Select>
                          <SelectTrigger id="discountType">
                            <SelectValue placeholder="유형 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percent">정률 할인 (%)</SelectItem>
                            <SelectItem value="fixed">정액 할인 (원)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="discountValue">할인값</Label>
                        <Input id="discountValue" type="number" placeholder="20" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="minPurchase">최소 결제금액</Label>
                        <Input id="minPurchase" type="number" placeholder="100000" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="maxDiscount">최대 할인금액</Label>
                        <Input id="maxDiscount" type="number" placeholder="30000" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="startDate">시작일</Label>
                        <Input id="startDate" type="date" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="endDate">종료일</Label>
                        <Input id="endDate" type="date" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="usageLimit">발급 수량</Label>
                      <Input id="usageLimit" type="number" placeholder="1000" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="applicableCourses">적용 대상</Label>
                      <Select>
                        <SelectTrigger id="applicableCourses">
                          <SelectValue placeholder="적용 대상 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {courseCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="couponActive" defaultChecked />
                      <Label htmlFor="couponActive">즉시 활성화</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCouponDialogOpen(false)}>
                      취소
                    </Button>
                    <Button onClick={() => setIsCouponDialogOpen(false)}>생성</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>쿠폰 목록</CardTitle>
                <CardDescription>총 {filteredCoupons.length}개의 쿠폰</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>쿠폰 코드</TableHead>
                      <TableHead>쿠폰명</TableHead>
                      <TableHead>할인</TableHead>
                      <TableHead>사용현황</TableHead>
                      <TableHead>기간</TableHead>
                      <TableHead className="text-center">상태</TableHead>
                      <TableHead className="text-center">액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCoupons.map((coupon) => {
                      const usagePercent = Math.round((coupon.usedCount / coupon.usageLimit) * 100)
                      return (
                        <TableRow key={coupon.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                                {coupon.code}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyCouponCode(coupon.code)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{coupon.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {coupon.applicableCourses}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {coupon.type === "percent" ? (
                                <>
                                  <Percent className="h-4 w-4 text-primary" />
                                  <span className="font-medium">{coupon.discount}%</span>
                                </>
                              ) : (
                                <>
                                  <DollarSign className="h-4 w-4 text-primary" />
                                  <span className="font-medium">
                                    {coupon.discount.toLocaleString()}원
                                  </span>
                                </>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              최소 {coupon.minPurchase.toLocaleString()}원
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="w-32">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>{coupon.usedCount}</span>
                                <span className="text-muted-foreground">/ {coupon.usageLimit}</span>
                              </div>
                              <Progress value={usagePercent} className="h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span>
                                {coupon.startDate} ~ {coupon.endDate}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleCouponStatus(coupon.id)}
                            >
                              {coupon.isActive ? (
                                <Eye className="h-4 w-4 text-green-600" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  수정
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="mr-2 h-4 w-4" />
                                  복제
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  삭제
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Banners Tab */}
          <TabsContent value="banners" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Card className="flex-1">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="배너 제목으로 검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="상태" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">전체</SelectItem>
                          <SelectItem value="active">활성</SelectItem>
                          <SelectItem value="inactive">비활성</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    배너 등록
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>새 배너 등록</DialogTitle>
                    <DialogDescription>
                      새로운 프로모션 배너를 등록합니다.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="bannerTitle">배너 제목</Label>
                      <Input id="bannerTitle" placeholder="AI 자동화 강좌 얼리버드 40% 할인" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bannerImage">배너 이미지</Label>
                      <div className="flex items-center gap-4">
                        <div className="flex h-24 w-48 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <Button variant="outline">이미지 업로드</Button>
                      </div>
                      <p className="text-xs text-muted-foreground">권장 크기: 1920x600px (메인), 400x300px (서브)</p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bannerLink">연결 링크</Label>
                      <Input id="bannerLink" placeholder="/courses/chatgpt-ai-automation" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bannerPosition">배너 위치</Label>
                      <Select>
                        <SelectTrigger id="bannerPosition">
                          <SelectValue placeholder="위치 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {bannerPositions.map((position) => (
                            <SelectItem key={position} value={position}>
                              {position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="bannerStartDate">시작일</Label>
                        <Input id="bannerStartDate" type="date" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="bannerEndDate">종료일</Label>
                        <Input id="bannerEndDate" type="date" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="bannerActive" defaultChecked />
                      <Label htmlFor="bannerActive">즉시 활성화</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsBannerDialogOpen(false)}>
                      취소
                    </Button>
                    <Button onClick={() => setIsBannerDialogOpen(false)}>등록</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>배너 목록</CardTitle>
                <CardDescription>총 {filteredBanners.length}개의 배너</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">미리보기</TableHead>
                      <TableHead>배너 제목</TableHead>
                      <TableHead>위치</TableHead>
                      <TableHead>기간</TableHead>
                      <TableHead className="text-center">클릭/노출</TableHead>
                      <TableHead className="text-center">CTR</TableHead>
                      <TableHead className="text-center">상태</TableHead>
                      <TableHead className="text-center">액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBanners.map((banner) => {
                      const ctr = ((banner.clicks / banner.views) * 100).toFixed(1)
                      return (
                        <TableRow key={banner.id}>
                          <TableCell>
                            <div className="relative h-16 w-28 overflow-hidden rounded-md bg-muted">
                              <div className="flex h-full w-full items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{banner.title}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {banner.link}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{banner.position}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span>
                                {banner.startDate} ~ {banner.endDate}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="text-sm">
                              <span className="font-medium">{banner.clicks.toLocaleString()}</span>
                              <span className="text-muted-foreground"> / {banner.views.toLocaleString()}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={Number(ctr) >= 5 ? "default" : "secondary"}
                              className={Number(ctr) >= 5 ? "bg-green-100 text-green-700" : ""}
                            >
                              {ctr}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleBannerStatus(banner.id)}
                            >
                              {banner.isActive ? (
                                <Eye className="h-4 w-4 text-green-600" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  수정
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="mr-2 h-4 w-4" />
                                  복제
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  삭제
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
