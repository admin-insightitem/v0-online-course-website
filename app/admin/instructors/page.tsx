"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Camera, Star, Users, BookOpen, Award, BadgeCheck, Crown, Shield, Zap } from "lucide-react"

// 아이콘 옵션
const iconOptions = [
  { id: "none", label: "없음", icon: null },
  { id: "award", label: "Award", icon: Award },
  { id: "badge", label: "인증", icon: BadgeCheck },
  { id: "crown", label: "왕관", icon: Crown },
  { id: "shield", label: "방패", icon: Shield },
  { id: "zap", label: "번개", icon: Zap },
]

// 강사 더미 데이터
const instructorsData = [
  {
    id: "1",
    name: "김도현",
    icon: "award",
    rating: 4.9,
    students: 8340,
    courses: 5,
    title: "AI 자동화 전문가",
    intro: "전 네이버 AI 연구원 출신. GPT, 자동화 툴을 활용한 비즈니스 솔루션 전문가. 200개 이상의 기업 컨설팅 경험.",
    image: null as string | null,
  },
  {
    id: "2",
    name: "이수진",
    icon: "badge",
    rating: 4.8,
    students: 6210,
    courses: 4,
    title: "재테크 전문가 / 베스트셀러 작가",
    intro: "15년간 금융업계에서 활동하며 10만명 이상의 수강생을 가르쳤습니다. '돈이 되는 습관' 등 다수의 베스트셀러를 출간했습니다.",
    image: null as string | null,
  },
  {
    id: "3",
    name: "박민수",
    icon: "crown",
    rating: 4.7,
    students: 4530,
    courses: 3,
    title: "부동산 투자 전문가",
    intro: "20년간 부동산 투자 경력, 100억 이상의 자산 운용 경험이 있습니다. 실전 투자 노하우를 전수합니다.",
    image: null as string | null,
  },
]

export default function AdminInstructorsPage() {
  // 강사 목록
  const [instructors, setInstructors] = useState(instructorsData)
  
  // 선택된 강사 ID (첫 번째 강사 기본 선택)
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>(instructorsData[0]?.id || "")
  
  // 편집 폼 상태
  const [editName, setEditName] = useState("")
  const [editIcon, setEditIcon] = useState("none")
  const [editRating, setEditRating] = useState(0)
  const [editStudents, setEditStudents] = useState(0)
  const [editCourses, setEditCourses] = useState(0)
  const [editTitle, setEditTitle] = useState("")
  const [editIntro, setEditIntro] = useState("")
  const [editImage, setEditImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 강사 선택 시 폼에 데이터 로드
  useEffect(() => {
    if (selectedInstructorId) {
      const instructor = instructors.find(i => i.id === selectedInstructorId)
      if (instructor) {
        setEditName(instructor.name)
        setEditIcon(instructor.icon)
        setEditRating(instructor.rating)
        setEditStudents(instructor.students)
        setEditCourses(instructor.courses)
        setEditTitle(instructor.title)
        setEditIntro(instructor.intro)
        setEditImage(instructor.image)
      }
    } else {
      // 선택 해제 시 폼 초기화
      setEditName("")
      setEditIcon("none")
      setEditRating(0)
      setEditStudents(0)
      setEditCourses(0)
      setEditTitle("")
      setEditIntro("")
      setEditImage(null)
    }
  }, [selectedInstructorId, instructors])

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
    if (!selectedInstructorId) {
      alert("강사를 선택해주세요.")
      return
    }
    
    setInstructors(
      instructors.map((inst) =>
        inst.id === selectedInstructorId
          ? { 
              ...inst, 
              name: editName, 
              icon: editIcon,
              rating: editRating,
              students: editStudents,
              courses: editCourses,
              title: editTitle, 
              intro: editIntro, 
              image: editImage 
            }
          : inst
      )
    )
    alert("강사 정보가 저장되었습니다.")
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div>
          <h1 className="text-2xl font-bold">{"강사정보관리"}</h1>
          <p className="text-muted-foreground">{"강사 프로필 정보를 관리합니다."}</p>
        </div>

        {/* 강사 선택 */}
        <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
          <Label className="shrink-0">{"강사 선택"}</Label>
          <Select value={selectedInstructorId} onValueChange={setSelectedInstructorId}>
            <SelectTrigger className="w-full md:w-80">
              <SelectValue placeholder="강사를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {instructors.map((instructor) => (
                <SelectItem key={instructor.id} value={instructor.id}>
                  {instructor.name} - {instructor.title.split("/")[0].trim()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 강사 정보 편집 (강사 선택 시에만 표시) */}
        {selectedInstructorId && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 프로필 카드 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{"프로필"}</CardTitle>
                  <CardDescription>{"강의 페이지에 표시되는 프로필입니다."}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <div 
                    className="relative w-24 h-24 rounded-full overflow-hidden bg-muted cursor-pointer group"
                    onClick={handleImageClick}
                  >
                    {editImage ? (
                      <Image
                        src={editImage}
                        alt="프로필 이미지"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                        <span className="text-3xl font-bold text-white">{editName.charAt(0) || "?"}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-6 w-6 text-white" />
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
                    <p className="text-xs text-muted-foreground">
                      {"클릭하여 프로필 사진을 변경하세요"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {"권장: 1200×1200px 이상, 최대 2MB, 1:1 비율"}
                    </p>
                  </div>
                  
                  <div className="w-full space-y-2">
                    <Label htmlFor="name">{"이름"}</Label>
                    <Input
                      id="name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="이름을 입력하세요"
                    />
                  </div>

                  <div className="w-full space-y-2">
                    <Label>{"이름 옆 아이콘"}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {iconOptions.map((option) => {
                        const IconComponent = option.icon
                        const isSelected = editIcon === option.id
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setEditIcon(option.id)}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-colors ${
                              isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                            }`}
                          >
                            {IconComponent ? (
                              <IconComponent className={`h-4 w-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                            ) : (
                              <span className={`text-xs ${isSelected ? "text-primary" : "text-muted-foreground"}`}>{"X"}</span>
                            )}
                            <span className={`text-[10px] mt-1 ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                              {option.label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 강사 정보 카드 */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">{"강사 정보"}</CardTitle>
                  <CardDescription>{"수강생에게 표시되는 강사 소개 정보입니다."}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">{"강사 직함"}</Label>
                    <Input
                      id="title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="예: AI 비즈니스 전문가 / 전 네이버 AI Lab"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="intro">{"강사 소개"}</Label>
                    <Textarea
                      id="intro"
                      value={editIntro}
                      onChange={(e) => setEditIntro(e.target.value)}
                      placeholder="강사 소개를 입력하세요"
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  {/* 미리보기 */}
                  <div className="space-y-4 pt-4 border-t">
                    <Label>{"미리보기"}</Label>
                    
                    {/* 미리보기 1: 강사진 영역 (/#instructors) */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">{"강사진 영역"}</p>
                      <div className="rounded-2xl border border-border/50 bg-card p-6">
                        <div className="mb-5 flex items-center gap-4">
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
                            {editImage ? (
                              <Image
                                src={editImage}
                                alt="프로필 이미지"
                                width={64}
                                height={64}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                                <span className="text-xl font-bold text-white">{editName.charAt(0) || "?"}</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-foreground">{editName || "이름"}</h3>
                            <p className="text-sm text-primary">{editTitle || "직함"}</p>
                          </div>
                        </div>
                        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                          {editIntro || "강사 소개가 여기에 표시됩니다."}
                        </p>
                        <div className="flex items-center gap-4 border-t border-border/50 pt-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                            <span className="font-semibold text-foreground">{editRating || 0}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {editStudents?.toLocaleString() || 0}{"명"}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5" />
                            {editCourses || 0}{"개 강의"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 미리보기 2: 강사 소개 영역 (/courses/[slug]) */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">{"강사 소개 영역"}</p>
                      <div className="rounded-xl border border-border bg-card p-6">
                        <h4 className="mb-5 text-lg font-bold text-foreground">{"강사 소개"}</h4>
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
                            {editImage ? (
                              <Image
                                src={editImage}
                                alt="프로필 이미지"
                                width={80}
                                height={80}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                                <span className="text-2xl font-bold text-white">{editName.charAt(0) || "?"}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <h3 className="text-lg font-bold text-foreground">{editName || "이름"}</h3>
                              {editIcon !== "none" && (() => {
                                const IconComponent = iconOptions.find(o => o.id === editIcon)?.icon
                                return IconComponent ? <IconComponent className="h-4 w-4 text-accent" /> : null
                              })()}
                            </div>
                            <p className="mb-3 text-sm font-medium text-accent">{editTitle || "직함"}</p>
                            <p className="text-[15px] leading-relaxed text-muted-foreground">
                              {editIntro || "강사 소개가 여기에 표시됩니다."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 저장 버튼 */}
            <div className="flex justify-end">
              <Button onClick={handleSave} className="bg-foreground text-background hover:bg-foreground/90">
                {"저장하기"}
              </Button>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
