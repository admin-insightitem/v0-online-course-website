"use client"

import { useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Star, ArrowLeft } from "lucide-react"

// 강사 더미 데이터
const instructorsData: Record<string, {
  id: number
  name: string
  rating: string
  title: string
  intro: string
  image: string | null
  classes: number
  students: number
}> = {
  "1": {
    id: 1,
    name: "김도현",
    rating: "4.9",
    title: "AI 비즈니스 전문가 / 전 네이버 AI Lab",
    intro: "10년간 AI 분야에서 활동하며 200개 이상의 AI 자동화 프로젝트를 성공적으로 이끌었습니다. 현재 AI 기반 수익화 컨설팅 대표로 활동 중이며, 3,000명 이상의 수강생이 실제 수익을 창출하고 있습니다.",
    image: null,
    classes: 5,
    students: 1250,
  },
  "2": {
    id: 2,
    name: "이수진",
    rating: "4.8",
    title: "재테크 전문가 / 베스트셀러 작가",
    intro: "15년간 금융업계에서 활동하며 10만명 이상의 수강생을 가르쳤습니다.",
    image: null,
    classes: 8,
    students: 3420,
  },
  "3": {
    id: 3,
    name: "박민수",
    rating: "4.7",
    title: "부동산 투자 전문가",
    intro: "20년간 부동산 투자 경력, 100억 이상의 자산 운용 경험이 있습니다.",
    image: null,
    classes: 3,
    students: 890,
  },
  "new": {
    id: 0,
    name: "",
    rating: "0",
    title: "",
    intro: "",
    image: null,
    classes: 0,
    students: 0,
  },
}

export default function AdminInstructorEditPage() {
  const params = useParams()
  const router = useRouter()
  const instructorId = params.id as string
  const isNew = instructorId === "new"
  
  const instructorData = instructorsData[instructorId] || instructorsData["new"]
  
  // 프로필 이미지
  const [profileImage, setProfileImage] = useState<string | null>(instructorData.image)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 기본 정보
  const [name, setName] = useState(instructorData.name)
  const [rating, setRating] = useState(instructorData.rating)
  
  // 강사 정보
  const [instructorTitle, setInstructorTitle] = useState(instructorData.title)
  const [instructorIntro, setInstructorIntro] = useState(instructorData.intro)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    alert(isNew ? "강사가 등록되었습니다." : "강사 정보가 저장되었습니다.")
    router.push("/admin/instructors")
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin/instructors">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {isNew ? "새 강사 등록" : "강사 정보 수정"}
            </h2>
            <p className="text-muted-foreground">
              {isNew ? "새로운 강사를 등록합니다." : "강사 프로필 정보를 관리합니다."}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 프로필 사진 및 이름 */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>{"프로필"}</CardTitle>
              <CardDescription>{"강의 페이지에 표시되는 프로필입니다."}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div 
                className="relative w-32 h-32 rounded-full overflow-hidden bg-muted cursor-pointer group"
                onClick={handleImageClick}
              >
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="프로필 이미지"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                    <span className="text-4xl font-bold text-white">{name.charAt(0) || "?"}</span>
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    placeholder="4.9"
                    className="w-24"
                  />
                  <span className="text-xs text-muted-foreground">{"(0.0 ~ 5.0)"}</span>
                </div>
                <p className="text-xs text-muted-foreground">{"0으로 설정하면 별점이 표시되지 않습니다."}</p>
              </div>
            </CardContent>
          </Card>

          {/* 강사 정보 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{"강사 정보"}</CardTitle>
              <CardDescription>{"수강생에게 표시되는 강사 소개 정보입니다."}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="instructorTitle">{"강사 직함"}</Label>
                <Input
                  id="instructorTitle"
                  value={instructorTitle}
                  onChange={(e) => setInstructorTitle(e.target.value)}
                  placeholder="AI 비즈니스 전문가 / 전 네이버 AI Lab"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructorIntro">{"강사 소개"}</Label>
                <Textarea
                  id="instructorIntro"
                  value={instructorIntro}
                  onChange={(e) => setInstructorIntro(e.target.value)}
                  placeholder="강사의 경력 및 전문 분야를 소개해주세요."
                  rows={5}
                />
              </div>

              {/* 미리보기 */}
              <div className="border-t pt-6">
                <Label className="text-sm font-medium mb-3 block">{"미리보기"}</Label>
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-muted shrink-0">
                      {profileImage ? (
                        <Image
                          src={profileImage}
                          alt="프로필 이미지"
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                          <span className="text-xl font-bold text-white">{name.charAt(0) || "?"}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{name || "이름"}</span>
                        {rating && parseFloat(rating) > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{rating}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {instructorTitle || "강사 직함을 입력하세요"}
                      </p>
                      <p className="text-sm">
                        {instructorIntro || "강사 소개를 입력하세요"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Link href="/admin/instructors">
                  <Button variant="outline">{"취소"}</Button>
                </Link>
                <Button onClick={handleSave}>
                  {isNew ? "등록하기" : "저장하기"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
