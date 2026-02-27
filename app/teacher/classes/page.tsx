"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TeacherLayout } from "@/components/teacher-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"

// 강사 본인의 클래스 데이터만
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
    id: "7",
    title: "AI 비즈니스 심화 과정: 수익화 전략",
    category: "AI / 자동화",
    instructor: "김도현",
    price: 199000,
    originalPrice: 399000,
    students: 1240,
    lectures: 32,
    isVisible: true,
    badge: "NEW",
    image: "/images/course-ai.jpg",
    createdAt: "2026.02.01",
  },
]

const categories = ["전체", "AI / 자동화"]

type SortField = "createdAt" | "title" | "category" | "price" | "students" | "lectures" | "badge"
type SortDirection = "asc" | "desc"

export default function TeacherClassesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [classes, setClasses] = useState(classesData)
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [classToDelete, setClassToDelete] = useState<string | null>(null)
  const itemsPerPage = 30

  const handleEdit = (classId: string) => {
    router.push(`/teacher/classes/new?edit=${classId}`)
  }

  const handleDeleteClick = (classId: string) => {
    setClassToDelete(classId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (classToDelete) {
      setClasses(classes.filter((cls) => cls.id !== classToDelete))
      setClassToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
    setCurrentPage(1)
  }

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch = cls.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "전체" || cls.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedClasses = [...filteredClasses].sort((a, b) => {
    let comparison = 0
    switch (sortField) {
      case "createdAt":
        comparison = a.createdAt.localeCompare(b.createdAt)
        break
      case "title":
        comparison = a.title.localeCompare(b.title)
        break
      case "category":
        comparison = a.category.localeCompare(b.category)
        break
      case "price":
        comparison = a.price - b.price
        break
      case "students":
        comparison = a.students - b.students
        break
      case "lectures":
        comparison = a.lectures - b.lectures
        break
      case "badge":
        comparison = (a.badge || "").localeCompare(b.badge || "")
        break
    }
    return sortDirection === "asc" ? comparison : -comparison
  })

  const totalPages = Math.ceil(sortedClasses.length / itemsPerPage)
  const paginatedClasses = sortedClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-medium hover:bg-transparent"
      onClick={() => handleSort(field)}
    >
      {label}
      {sortField === field ? (
        sortDirection === "asc" ? (
          <ArrowUp className="ml-1 h-3 w-3" />
        ) : (
          <ArrowDown className="ml-1 h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
      )}
    </Button>
  )

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
    <TeacherLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">내 클래스 관리</h2>
            <p className="text-muted-foreground">내가 등록한 강좌를 관리합니다.</p>
          </div>
          <Link href="/teacher/classes/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              새 클래스 등록
            </Button>
          </Link>
        </div>

        {/* Classes Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              내 클래스 목록
            </CardTitle>
            <CardDescription>
              총 {sortedClasses.length}개의 클래스
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
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
              </div>
              <div className="relative w-full sm:w-[280px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="강좌명으로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center">No.</TableHead>
                  <TableHead><SortButton field="createdAt" label="등록일" /></TableHead>
                  <TableHead><SortButton field="title" label="강좌명" /></TableHead>
                  <TableHead><SortButton field="category" label="카테고리" /></TableHead>
                  <TableHead className="text-right"><SortButton field="price" label="가격" /></TableHead>
                  <TableHead className="text-center"><SortButton field="students" label="수강생" /></TableHead>
                  <TableHead className="text-center"><SortButton field="lectures" label="강의수" /></TableHead>
                  <TableHead className="px-1 text-center">강의 등록</TableHead>
                  <TableHead className="text-center"><SortButton field="badge" label="배지" /></TableHead>
                  <TableHead className="px-1 text-center">노출</TableHead>
                  <TableHead className="px-1 text-center">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedClasses.map((cls, index) => (
                  <TableRow key={cls.id} className={!cls.isVisible ? "text-muted-foreground" : ""}>
                    <TableCell className={`text-center font-medium ${!cls.isVisible ? "text-muted-foreground" : ""}`}>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {cls.createdAt}
                    </TableCell>
                    <TableCell className="min-w-[240px] max-w-[280px]">
                      <div className="flex items-center gap-2">
                        <div className={`relative h-10 w-14 overflow-hidden rounded-md shrink-0 ${!cls.isVisible ? "opacity-50" : ""}`}>
                          <Image
                            src={cls.image}
                            alt={cls.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Link 
                          href={`/courses/${cls.id}`} 
                          className={`font-medium text-sm line-clamp-2 hover:text-primary hover:underline cursor-pointer ${!cls.isVisible ? "text-muted-foreground" : ""}`}
                        >
                          {cls.title}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="px-2">
                      <Badge variant="outline" className="text-xs">{cls.category}</Badge>
                    </TableCell>
                    <TableCell className="px-2 text-right">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{cls.price.toLocaleString()}원</span>
                        <span className="text-xs text-muted-foreground line-through">
                          {cls.originalPrice.toLocaleString()}원
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-2 text-center text-sm">{cls.students.toLocaleString()}명</TableCell>
                    <TableCell className="px-2 text-center text-sm">{cls.lectures}개</TableCell>
                    <TableCell className="px-1 text-center">
                      <Link href={`/teacher/lectures?classId=${cls.id}`}>
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                          <Plus className="mr-1 h-3 w-3" />
                          {"등록"}
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell className="px-2 text-center">
                      <Select
                        value={cls.badge || "none"}
                        onValueChange={(value) => handleBadgeChange(cls.id, value)}
                      >
                        <SelectTrigger className="w-[80px] h-7 text-xs">
                          <SelectValue placeholder="배지" />
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
                    <TableCell className="px-1 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => toggleVisibility(cls.id)}
                      >
                        {cls.isVisible ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="px-1 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(cls.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            수정
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteClick(cls.id)}
                          >
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {sortedClasses.length}개 중 {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, sortedClasses.length)}개 표시
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    이전
                  </Button>
                  <span className="text-sm">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    다음
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{"정말 삭제하시겠습니까?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {"이 작업은 되돌릴 수 없습니다. 해당 클래스가 영구적으로 삭제됩니다."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{"취소"}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-white hover:bg-destructive/90">
              {"삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TeacherLayout>
  )
}
