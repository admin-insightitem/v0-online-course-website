"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  BookOpen,
  Filter,
} from "lucide-react"
import Image from "next/image"

// 클래스 데이터
const classesData = [
  {
    id: "1",
    title: "ChatGPT & AI 자동화로 월 1,000만원 수익 만들기",
    category: "AI / 자동화",
    instructor: "김도현",
    price: 149000,
    originalPrice: 299000,
    students: 8340,
    lectures: 48,
    isVisible: true,
    badge: "BEST",
    image: "/images/course-ai.jpg",
    createdAt: "2025.10.15",
  },
  {
    id: "2",
    title: "유튜브 수익화 완벽 가이드: 0에서 월 500만원까지",
    category: "유튜브",
    instructor: "박서연",
    price: 129000,
    originalPrice: 259000,
    students: 6210,
    lectures: 56,
    isVisible: true,
    badge: "NEW",
    image: "/images/course-youtube.jpg",
    createdAt: "2025.12.01",
  },
  {
    id: "3",
    title: "퍼포먼스 마케팅 마스터클래스: ROI 500% 달성 전략",
    category: "마케팅",
    instructor: "이준혁",
    price: 169000,
    originalPrice: 339000,
    students: 4530,
    lectures: 38,
    isVisible: true,
    badge: "HOT",
    image: "/images/course-marketing.jpg",
    createdAt: "2025.11.20",
  },
  {
    id: "4",
    title: "프리미어 프로 & 포토샵: 1인 크리에이터 완성 패키지",
    category: "디자인",
    instructor: "최예진",
    price: 139000,
    originalPrice: 279000,
    students: 3870,
    lectures: 62,
    isVisible: false,
    badge: null,
    image: "/images/course-design.jpg",
    createdAt: "2025.09.10",
  },
  {
    id: "5",
    title: "스마트스토어 + 쿠팡: 월매출 5,000만원 실전 로드맵",
    category: "커머스",
    instructor: "정민수",
    price: 159000,
    originalPrice: 319000,
    students: 5120,
    lectures: 52,
    isVisible: true,
    badge: "BEST",
    image: "/images/course-commerce.jpg",
    createdAt: "2025.08.25",
  },
]

const categories = ["전체", "AI / 자동화", "유튜브", "마케팅", "디자인", "커머스", "SNS"]
const instructors = ["김도현", "박서연", "이준혁", "최예진", "정민수", "한수빈"]

export default function ClassesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [classes, setClasses] = useState(classesData)

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch = cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "전체" || cls.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleVisibility = (id: string) => {
    setClasses(classes.map((cls) =>
      cls.id === id ? { ...cls, isVisible: !cls.isVisible } : cls
    ))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">클래스 관리</h2>
            <p className="text-muted-foreground">강좌를 등록하고 관리합니다.</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                새 클래스 등록
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>새 클래스 등록</DialogTitle>
                <DialogDescription>
                  새로운 강좌 정보를 입력하세요. 강의 콘텐츠는 등록 후 추가할 수 있습니다.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">강좌명</Label>
                  <Input id="title" placeholder="강좌명을 입력하세요" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">카테고리</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c !== "전체").map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="instructor">강사</Label>
                    <Select>
                      <SelectTrigger id="instructor">
                        <SelectValue placeholder="강사 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {instructors.map((instructor) => (
                          <SelectItem key={instructor} value={instructor}>
                            {instructor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">판매가 (원)</Label>
                    <Input id="price" type="number" placeholder="149000" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="originalPrice">정가 (원)</Label>
                    <Input id="originalPrice" type="number" placeholder="299000" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">강좌 소개</Label>
                  <Textarea
                    id="description"
                    placeholder="강좌에 대한 간략한 소개를 입력하세요"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="badge">배지</Label>
                    <Select>
                      <SelectTrigger id="badge">
                        <SelectValue placeholder="배지 선택 (선택사항)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">없음</SelectItem>
                        <SelectItem value="BEST">BEST</SelectItem>
                        <SelectItem value="NEW">NEW</SelectItem>
                        <SelectItem value="HOT">HOT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="level">난이도</Label>
                    <Select>
                      <SelectTrigger id="level">
                        <SelectValue placeholder="난이도 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">입문</SelectItem>
                        <SelectItem value="basic">초급</SelectItem>
                        <SelectItem value="intermediate">중급</SelectItem>
                        <SelectItem value="advanced">고급</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="thumbnail">썸네일 이미지</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex h-24 w-40 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted">
                      <span className="text-sm text-muted-foreground">이미지 업로드</span>
                    </div>
                    <Button variant="outline">파일 선택</Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="visible" defaultChecked />
                  <Label htmlFor="visible">사이트에 노출</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  취소
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  등록하기
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="강좌명 또는 강사명으로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="카테고리" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Classes Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              클래스 목록
            </CardTitle>
            <CardDescription>
              총 {filteredClasses.length}개의 클래스
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">이미지</TableHead>
                  <TableHead>강좌명</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>강사</TableHead>
                  <TableHead className="text-right">가격</TableHead>
                  <TableHead className="text-center">수강생</TableHead>
                  <TableHead className="text-center">강의 수</TableHead>
                  <TableHead className="text-center">노출</TableHead>
                  <TableHead className="text-center">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell>
                      <div className="relative h-12 w-20 overflow-hidden rounded-md">
                        <Image
                          src={cls.image}
                          alt={cls.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium line-clamp-1">{cls.title}</span>
                          {cls.badge && (
                            <Badge
                              variant={cls.badge === "NEW" ? "default" : "secondary"}
                              className={
                                cls.badge === "BEST"
                                  ? "bg-red-500 text-white hover:bg-red-600"
                                  : cls.badge === "HOT"
                                  ? "bg-orange-500 text-white hover:bg-orange-600"
                                  : ""
                              }
                            >
                              {cls.badge}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">등록일: {cls.createdAt}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{cls.category}</Badge>
                    </TableCell>
                    <TableCell>{cls.instructor}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col">
                        <span className="font-medium">{cls.price.toLocaleString()}원</span>
                        <span className="text-xs text-muted-foreground line-through">
                          {cls.originalPrice.toLocaleString()}원
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{cls.students.toLocaleString()}명</TableCell>
                    <TableCell className="text-center">{cls.lectures}개</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleVisibility(cls.id)}
                      >
                        {cls.isVisible ? (
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
                            <BookOpen className="mr-2 h-4 w-4" />
                            강의 관리
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
