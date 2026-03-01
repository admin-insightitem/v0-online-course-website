"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Star, 
  Search,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// 강사 더미 데이터
const instructorsData = [
  {
    id: 1,
    name: "김도현",
    rating: "4.9",
    title: "AI 비즈니스 전문가 / 전 네이버 AI Lab",
    intro: "10년간 AI 분야에서 활동하며 200개 이상의 AI 자동화 프로젝트를 성공적으로 이끌었습니다.",
    image: null,
    classes: 5,
    students: 1250,
  },
  {
    id: 2,
    name: "이수진",
    rating: "4.8",
    title: "재테크 전문가 / 베스트셀러 작가",
    intro: "15년간 금융업계에서 활동하며 10만명 이상의 수강생을 가르쳤습니다.",
    image: null,
    classes: 8,
    students: 3420,
  },
  {
    id: 3,
    name: "박민수",
    rating: "4.7",
    title: "부동산 투자 전문가",
    intro: "20년간 부동산 투자 경력, 100억 이상의 자산 운용 경험이 있습니다.",
    image: null,
    classes: 3,
    students: 890,
  },
]

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState(instructorsData)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: number) => {
    if (confirm("정말로 이 강사를 삭제하시겠습니까?")) {
      setInstructors(instructors.filter((inst) => inst.id !== id))
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{"강사 관리"}</h2>
            <p className="text-muted-foreground">{"모든 강사의 프로필 정보를 관리합니다."}</p>
          </div>
          <Link href="/admin/instructors/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {"새 강사 등록"}
            </Button>
          </Link>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="강사 이름 또는 직함으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Instructors Table */}
        <Card>
          <CardHeader>
            <CardTitle>{"강사 목록"}</CardTitle>
            <CardDescription>{"총 "}{instructors.length}{"명의 강사가 등록되어 있습니다."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">{"강사"}</TableHead>
                  <TableHead>{"직함"}</TableHead>
                  <TableHead className="text-center">{"별점"}</TableHead>
                  <TableHead className="text-center">{"강의 수"}</TableHead>
                  <TableHead className="text-center">{"수강생"}</TableHead>
                  <TableHead className="text-right">{"관리"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstructors.map((instructor) => {
                  return (
                    <TableRow key={instructor.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
                            {instructor.image ? (
                              <Image
                                src={instructor.image}
                                alt={instructor.name}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                                <span className="text-sm font-bold text-white">{instructor.name.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium">{instructor.name}</span>
                            {parseFloat(instructor.rating) > 0 && (
                              <div className="flex items-center gap-0.5">
                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-medium">{instructor.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{instructor.title}</TableCell>
                      <TableCell className="text-center">
                        {parseFloat(instructor.rating) > 0 ? (
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{instructor.rating}</span>
                          </div>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-center">{instructor.classes}</TableCell>
                      <TableCell className="text-center">{instructor.students.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/instructors/${instructor.id}`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(instructor.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
