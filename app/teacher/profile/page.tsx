"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { TeacherLayout } from "@/components/teacher-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Check, Crown, Star, Award, Shield, Zap, BadgeCheck } from "lucide-react"

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

export default function TeacherProfilePage() {
  // 프로필 이미지
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 기본 정보
  const [name, setName] = useState("김도현")
  const [selectedMark, setSelectedMark] = useState("verified")
  
  // 강사 정보
  const [instructorTitle, setInstructorTitle] = useState("AI 비즈니스 전문가 / 전 네이버 AI Lab")
  const [instructorIntro, setInstructorIntro] = useState("10년간 AI 분야에서 활동하며 200개 이상의 AI 자동화 프로젝트를 성공적으로 이끌었습니다. 현재 AI 기반 수익화 컨설팅 대표로 활동 중이며, 3,000명 이상의 수강생이 실제 수익을 창출하고 있습니다.")

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
    alert("강사 정보가 저장되었습니다.")
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{"강사정보관리"}</h2>
          <p className="text-muted-foreground">{"강사 프로필 정보를 관리합니다."}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 프로필 사진 및 닉네임 */}
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
                    <span className="text-4xl font-bold text-white">{name.charAt(0)}</span>
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
                <Label>{"이름 옆 마크"}</Label>
                <div className="grid grid-cols-4 gap-2">
                  {markOptions.map((option) => {
                    const IconComponent = option.icon
                    const isSelected = selectedMark === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedMark(option.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
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
                          <span className="text-xl font-bold text-white">{name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{name || "이름"}</span>
                        {selectedMark !== "none" && (() => {
                          const MarkIcon = markOptions.find(m => m.id === selectedMark)?.icon
                          return MarkIcon ? <MarkIcon className="w-4 h-4 text-primary" /> : null
                        })()}
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

              <div className="flex justify-end">
                <Button onClick={handleSave}>
                  {"저장하기"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TeacherLayout>
  )
}
