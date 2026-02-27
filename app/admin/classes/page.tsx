"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

export default function ClassesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
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

  const handleBadgeChange = (id: string, value: string) => {
    setClasses(classes.map((cls) =>
      cls.id === id ? { ...cls, badge: value === "none" ? null : value } : cls
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
          <Link href="/admin/classes/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              새 클래스 등록
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">{"카테고리"}</span>
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
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">{"강좌"}</span>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="강좌 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{"전체"}</SelectItem>
                      {classesData.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.title.length > 15 ? cls.title.substring(0, 15) + "..." : cls.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="relative w-full sm:w-[280px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="강좌명 또는 강사명으로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
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
                  <TableHead className="text-center">배지</TableHead>
                  <TableHead className="text-center">노출</TableHead>
                  <TableHead className="text-center">강의 등록</TableHead>
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
                        <Link 
                          href={`/courses/${cls.id}`} 
                          className="font-medium line-clamp-1 hover:text-primary hover:underline cursor-pointer"
                        >
                          {cls.title}
                        </Link>
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
                      <Select
                        value={cls.badge || "none"}
                        onValueChange={(value) => handleBadgeChange(cls.id, value)}
                      >
                        <SelectTrigger className="w-[100px] h-8">
                          <SelectValue placeholder="배지 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">없음</SelectItem>
                          <SelectItem value="BEST">
                            <span className="text-red-500 font-medium">BEST</span>
                          </SelectItem>
                          <SelectItem value="NEW">
                            <span className="text-blue-500 font-medium">NEW</span>
                          </SelectItem>
                          <SelectItem value="HOT">
                            <span className="text-orange-500 font-medium">HOT</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
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
                      <Link href={`/admin/lectures?classId=${cls.id}`}>
                        <Button variant="outline" size="sm">
                          <Plus className="mr-1 h-3 w-3" />
                          강의 등록
                        </Button>
                      </Link>
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
