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
import { Camera, Star } from "lucide-react"

// 강사 더미 데이터
const instructorsData = [
  {
    id: "1",
    name: "김도현",
    rating: "4.9",
    title: "AI 비즈니스 전문가 / 전 네이버 AI Lab",
    intro: "10년간 AI 분야에서 활동하며 200개 이상의 AI 자동화 프로젝트를 성공적으로 이끌었습니다. 현재 AI 기반 수익화 컨설팅 대표로 활동 중이며, 3,000명 이상의 수강생이 실제 수익을 창출하고 있습니다.",
    image: null as string | null,
  },
  {
    id: "2",
    name: "이수진",
    rating: "4.8",
    title: "재테크 전문가 / 베스트셀러 작가",
    intro: "15년간 금융업계에서 활동하며 10만명 이상의 수강생을 가르쳤습니다. '돈이 되는 습관' 등 다수의 베스트셀러를 출간했습니다.",
    image: null as string | null,
  },
  {
    id: "3",
    name: "박민수",
    rating: "4.7",
    title: "부동산 투자 전문가",
    intro: "20년간 부동산 투자 경력, 100억 이상의 자산 운용 경험이 있습니다. 실전 투자 노하우를 전수합니다.",
    image: null as string | null,
  },
]

export default function AdminInstructorsPage() {
  // 강사 목록
  const [instructors, setInstructors] = useState(instructorsData)
  
  // 선택된 강사 ID
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>("")
  
  // 편집 폼 상태
  const [editName, setEditName] = useState("")
  const [editRating, setEditRating] = useState("0")
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
        setEditRating(instructor.rating)
        setEditTitle(instructor.title)
        setEditIntro(instructor.intro)
        setEditImage(instructor.image)
      }
    } else {
      // 선택 해제 시 폼 초기화
      setEditName("")
      setEditRating("0")
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
          ? { ...inst, name: editName, rating: editRating, title: editTitle, intro: editIntro, image: editImage }
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
        <div className="flex items-center gap-4">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 프로필 카드 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{"프로필"}</CardTitle>
                  <CardDescription>{"강의 페이지에 표시되는 프로필입니다."}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <div 
                    className="relative w-32 h-32 rounded-full overflow-hidden bg-muted cursor-pointer group"
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
                    <Label htmlFor="rating">{"별점 (이름 옆 표시)"}</Label>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <Input
                        id="rating"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={editRating}
                        onChange={(e) => setEditRating(e.target.value)}
                        placeholder="4.9"
                        className="w-24"
                      />
                      <span className="text-xs text-muted-foreground">{"(0.0 ~ 5.0)"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{"0으로 설정하면 별점이 표시되지 않습니다."}</p>
                  </div>
                </CardContent>
              </Card>

              {/* 강사 정보 카드 */}
              <Card>
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
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  {/* 미리보기 */}
                  <div className="space-y-4 pt-4 border-t">
                    <Label>{"미리보기"}</Label>
                    
                    {/* 미리보기 1: 카드 형태 */}
                    <div className="rounded-lg border bg-card p-4">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-muted shrink-0">
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
                        <div className="flex-1">
                          <h4 className="font-semibold">{editName || "이름"}</h4>
                          <p className="text-sm text-muted-foreground">{editTitle?.split("/")[0]?.trim() || "직함"}</p>
                          <p className="text-sm text-foreground mt-2 line-clamp-2">
                            {editIntro || "강사 소개가 여기에 표시됩니다."}
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            {editRating && parseFloat(editRating) > 0 && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{editRating}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <span>{"8,340명"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{"5개 강의"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 미리보기 2: 강사 소개 형태 */}
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <h4 className="text-sm font-semibold mb-3">{"강사 소개"}</h4>
                      <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-muted shrink-0">
                          {editImage ? (
                            <Image
                              src={editImage}
                              alt="프로필 이미지"
                              width={56}
                              height={56}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                              <span className="text-lg font-bold text-white">{editName.charAt(0) || "?"}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{editName || "이름"}</span>
                            {editRating && parseFloat(editRating) > 0 && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{editRating}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{editTitle || "직함"}</p>
                          <p className="text-sm text-primary">
                            {editIntro || "강사 소개가 여기에 표시됩니다."}
                          </p>
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
