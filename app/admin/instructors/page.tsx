"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Camera, 
  Crown, 
  Star, 
  Award, 
  Shield, 
  Zap, 
  BadgeCheck,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// 마크 옵션
const markOptions = [
  { id: "none", label: "없음", icon: null },
  { id: "verified", label: "인증", icon: BadgeCheck },
  { id: "crown", label: "왕관", icon: Crown },
  { id: "star", label: "별", icon: Star },
  { id: "award", label: "상장", icon: Award },
  { id: "shield", label: "방패", icon: Shield },
  { id: "zap", label: "번개", icon: Zap },
]

// 강사 더미 데이터
const instructorsData = [
  {
    id: 1,
    name: "김도현",
    mark: "verified",
    title: "AI 비즈니스 전문가 / 전 네이버 AI Lab",
    intro: "10년간 AI 분야에서 활동하며 200개 이상의 AI 자동화 프로젝트를 성공적으로 이끌었습니다.",
    image: null,
    classes: 5,
    students: 1250,
  },
  {
    id: 2,
    name: "이수진",
    mark: "crown",
    title: "재테크 전문가 / 베스트셀러 작가",
    intro: "15년간 금융업계에서 활동하며 10만명 이상의 수강생을 가르쳤습니다.",
    image: null,
    classes: 8,
    students: 3420,
  },
  {
    id: 3,
    name: "박민수",
    mark: "star",
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedInstructor, setSelectedInstructor] = useState<typeof instructorsData[0] | null>(null)

  // 편집 폼 상태
  const [editName, setEditName] = useState("")
  const [editMark, setEditMark] = useState("none")
  const [editTitle, setEditTitle] = useState("")
  const [editIntro, setEditIntro] = useState("")
  const [editImage, setEditImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEditClick = (instructor: typeof instructorsData[0]) => {
    setSelectedInstructor(instructor)
    setEditName(instructor.name)
    setEditMark(instructor.mark)
    setEditTitle(instructor.title)
    setEditIntro(instructor.intro)
    setEditImage(instructor.image)
    setIsEditModalOpen(true)
  }

  const handleNewInstructor = () => {
    setSelectedInstructor(null)
    setEditName("")
    setEditMark("none")
    setEditTitle("")
    setEditIntro("")
    setEditImage(null)
    setIsEditModalOpen(true)
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (selectedInstructor) {
      // 기존 강사 수정
      setInstructors(
        instructors.map((inst) =>
          inst.id === selectedInstructor.id
            ? { ...inst, name: editName, mark: editMark, title: editTitle, intro: editIntro, image: editImage }
            : inst
        )
      )
    } else {
      // 새 강사 추가
      const newInstructor = {
        id: Math.max(...instructors.map((i) => i.id)) + 1,
        name: editName,
        mark: editMark,
        title: editTitle,
        intro: editIntro,
        image: editImage,
        classes: 0,
        students: 0,
      }
      setInstructors([...instructors, newInstructor])
    }
    setIsEditModalOpen(false)
    alert("강사 정보가 저장되었습니다.")
  }

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
          <Button onClick={handleNewInstructor}>
            <Plus className="mr-2 h-4 w-4" />
            {"새 강사 등록"}
          </Button>
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
                  <TableHead className="text-center">{"마크"}</TableHead>
                  <TableHead className="text-center">{"강의 수"}</TableHead>
                  <TableHead className="text-center">{"수강생"}</TableHead>
                  <TableHead className="text-right">{"관리"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstructors.map((instructor) => {
                  const MarkIcon = markOptions.find((m) => m.id === instructor.mark)?.icon
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
                            {MarkIcon && <MarkIcon className="h-4 w-4 text-primary" />}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{instructor.title}</TableCell>
                      <TableCell className="text-center">
                        {instructor.mark !== "none" ? markOptions.find((m) => m.id === instructor.mark)?.label : "-"}
                      </TableCell>
                      <TableCell className="text-center">{instructor.classes}</TableCell>
                      <TableCell className="text-center">{instructor.students.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(instructor)}>
                            <Edit className="h-4 w-4" />
                          </Button>
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

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedInstructor ? "강사 정보 수정" : "새 강사 등록"}</DialogTitle>
            <DialogDescription>
              {selectedInstructor ? "강사의 프로필 정보를 수정합니다." : "새로운 강사를 등록합니다."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 lg:grid-cols-3 mt-4">
            {/* 프로필 사진 및 이름 */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex flex-col items-center gap-4">
                <div
                  className="relative w-32 h-32 rounded-full overflow-hidden bg-muted cursor-pointer group"
                  onClick={handleImageClick}
                >
                  {editImage ? (
                    <Image src={editImage} alt="프로필 이미지" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                      <span className="text-4xl font-bold text-white">{editName.charAt(0) || "?"}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="text-center space-y-1">
                  <p className="text-xs text-muted-foreground">{"클릭하여 프로필 사진을 변경하세요"}</p>
                  <p className="text-xs text-muted-foreground">{"권장: 1200×1200px 이상, 최대 2MB, 1:1 비율"}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editName">{"이름"}</Label>
                <Input
                  id="editName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="이름을 입력하세요"
                />
              </div>

              <div className="space-y-2">
                <Label>{"이름 옆 마크"}</Label>
                <div className="grid grid-cols-4 gap-2">
                  {markOptions.map((option) => {
                    const IconComponent = option.icon
                    const isSelected = editMark === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setEditMark(option.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-colors ${
                          isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                        }`}
                      >
                        {IconComponent ? (
                          <IconComponent className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                        ) : (
                          <span className={`text-xs ${isSelected ? "text-primary" : "text-muted-foreground"}`}>{"X"}</span>
                        )}
                        <span className={`text-xs mt-1 ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                          {option.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* 강사 정보 */}
            <div className="lg:col-span-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editTitle">{"강사 직함"}</Label>
                <Input
                  id="editTitle"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="AI 비즈니스 전문가 / 전 네이버 AI Lab"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editIntro">{"강사 소개"}</Label>
                <Textarea
                  id="editIntro"
                  value={editIntro}
                  onChange={(e) => setEditIntro(e.target.value)}
                  placeholder="강사의 경력 및 전문 분야를 소개해주세요."
                  rows={5}
                />
              </div>

              {/* 미리보기 */}
              <div className="border-t pt-4">
                <Label className="text-sm font-medium mb-3 block">{"미리보기"}</Label>
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-muted shrink-0">
                      {editImage ? (
                        <Image src={editImage} alt="프로필 이미지" width={64} height={64} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                          <span className="text-xl font-bold text-white">{editName.charAt(0) || "?"}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{editName || "이름"}</span>
                        {editMark !== "none" &&
                          (() => {
                            const MarkIcon = markOptions.find((m) => m.id === editMark)?.icon
                            return MarkIcon ? <MarkIcon className="w-4 h-4 text-primary" /> : null
                          })()}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{editTitle || "강사 직함을 입력하세요"}</p>
                      <p className="text-sm">{editIntro || "강사 소개를 입력하세요"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  {"취소"}
                </Button>
                <Button onClick={handleSave}>{"저장하기"}</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
