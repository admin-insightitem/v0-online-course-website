"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  Save,
  Upload,
  ImageIcon,
  Video,
  FileText,
  Clock,
  BookOpen,
  Users,
  Star,
  CheckCircle,
  Target,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Types
interface Lesson {
  id: string
  title: string
  duration: string
  isFree: boolean
  videoUrl: string
  attachments: string[]
}

interface Section {
  id: string
  title: string
  lessons: Lesson[]
  isExpanded: boolean
}

interface FormData {
  // 기본 정보
  title: string
  description: string
  category: string
  badge: string
  level: string
  language: string
  
  // 가격 정보
  price: string
  originalPrice: string
  
  // 강사 정보
  instructor: string
  instructorTitle: string
  instructorBio: string
  instructorImage: string
  
  // 강의 정보
  duration: string
  enrollmentPeriod: string
  hasCertificate: boolean
  
  // 상세 내용
  highlights: string[]
  targetAudience: string[]
  requirements: string[]
  
  // 커리큘럼
  curriculum: Section[]
  
  // 설정
  isVisible: boolean
  thumbnail: string
  headerImage: string
}

const categories = ["AI / 자동화", "유튜브", "마케팅", "디자인", "커머스", "SNS"]
const instructors = [
  { name: "김도현", title: "AI 비즈니스 전문가 / 전 네이버 AI Lab", image: "/images/instructor-1.jpg" },
  { name: "박서연", title: "유튜브 크리에이터 / 구독자 85만", image: "/images/instructor-2.jpg" },
  { name: "이준혁", title: "마케팅 컨설턴트 / 전 구글 코리아", image: "/images/instructor-3.jpg" },
  { name: "최예진", title: "영상 디렉터 / 전 CJ ENM", image: "/images/instructor-2.jpg" },
  { name: "정민수", title: "이커머스 전문가 / 월매출 3억 달성", image: "/images/instructor-1.jpg" },
  { name: "한수빈", title: "SNS 마케터 / 팔로워 50만", image: "/images/instructor-2.jpg" },
]
const badges = [
  { value: "none", label: "없음" },
  { value: "BEST", label: "BEST" },
  { value: "NEW", label: "NEW" },
  { value: "HOT", label: "HOT" },
]
const levels = [
  { value: "입문", label: "입문" },
  { value: "초급", label: "초급" },
  { value: "초급 ~ 중급", label: "초급 ~ 중급" },
  { value: "중급", label: "중급" },
  { value: "중급 ~ 고급", label: "중급 ~ 고급" },
  { value: "고급", label: "고급" },
]

export default function NewClassPage() {
  const router = useRouter()
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"basic" | "content" | "curriculum" | "settings">("basic")
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    badge: "none",
    level: "",
    language: "한국어",
    price: "",
    originalPrice: "",
    instructor: "",
    instructorTitle: "",
    instructorBio: "",
    instructorImage: "",
    duration: "",
    enrollmentPeriod: "평생 무제한",
    hasCertificate: true,
    highlights: [""],
    targetAudience: [""],
    requirements: [""],
    curriculum: [],
    isVisible: true,
    thumbnail: "",
    headerImage: "",
  })

  // 강사 선택시 자동 입력
  const handleInstructorChange = (name: string) => {
    const instructor = instructors.find(i => i.name === name)
    if (instructor) {
      setFormData(prev => ({
        ...prev,
        instructor: instructor.name,
        instructorTitle: instructor.title,
        instructorImage: instructor.image,
      }))
    }
  }

  // 배열 필드 추가
  const addArrayItem = (field: "highlights" | "targetAudience" | "requirements") => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }))
  }

  // 배열 필드 삭제
  const removeArrayItem = (field: "highlights" | "targetAudience" | "requirements", index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  // 배열 필드 업데이트
  const updateArrayItem = (field: "highlights" | "targetAudience" | "requirements", index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  // 섹션 추가
  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: `Section ${formData.curriculum.length + 1}. `,
      lessons: [],
      isExpanded: true,
    }
    setFormData(prev => ({
      ...prev,
      curriculum: [...prev.curriculum, newSection]
    }))
  }

  // 섹션 삭제
  const removeSection = (sectionId: string) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.filter(s => s.id !== sectionId)
    }))
  }

  // 섹션 토글
  const toggleSection = (sectionId: string) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map(s => 
        s.id === sectionId ? { ...s, isExpanded: !s.isExpanded } : s
      )
    }))
  }

  // 섹션 제목 업데이트
  const updateSectionTitle = (sectionId: string, title: string) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map(s => 
        s.id === sectionId ? { ...s, title } : s
      )
    }))
  }

  // 레슨 추가
  const addLesson = (sectionId: string) => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: "",
      duration: "",
      isFree: false,
      videoUrl: "",
      attachments: [],
    }
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map(s => 
        s.id === sectionId ? { ...s, lessons: [...s.lessons, newLesson] } : s
      )
    }))
  }

  // 레슨 삭제
  const removeLesson = (sectionId: string, lessonId: string) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map(s => 
        s.id === sectionId ? { ...s, lessons: s.lessons.filter(l => l.id !== lessonId) } : s
      )
    }))
  }

  // 레슨 업데이트
  const updateLesson = (sectionId: string, lessonId: string, field: keyof Lesson, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map(s => 
        s.id === sectionId ? {
          ...s,
          lessons: s.lessons.map(l => 
            l.id === lessonId ? { ...l, [field]: value } : l
          )
        } : s
      )
    }))
  }

  // 총 ���의 수 계산
  const totalLectures = formData.curriculum.reduce((acc, section) => acc + section.lessons.length, 0)

  // 총 강의 시간 계산
  const calculateTotalDuration = () => {
    let totalMinutes = 0
    formData.curriculum.forEach(section => {
      section.lessons.forEach(lesson => {
        if (lesson.duration) {
          const [mins, secs] = lesson.duration.split(":").map(Number)
          totalMinutes += mins + (secs || 0) / 60
        }
      })
    })
    const hours = Math.floor(totalMinutes / 60)
    const mins = Math.round(totalMinutes % 60)
    return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`
  }

  // 할인율 계산
  const calculateDiscount = () => {
    const price = parseInt(formData.price.replace(/,/g, "")) || 0
    const originalPrice = parseInt(formData.originalPrice.replace(/,/g, "")) || 0
    if (originalPrice > 0 && price > 0) {
      return Math.round((1 - price / originalPrice) * 100)
    }
    return 0
  }

  const tabs = [
    { id: "basic" as const, label: "기본 정보", icon: BookOpen },
    { id: "content" as const, label: "상세 내용", icon: FileText },
    { id: "curriculum" as const, label: "커리큘럼", icon: Video },
    { id: "settings" as const, label: "설정", icon: Target },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/classes">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">새 클래스 등록</h2>
              <p className="text-muted-foreground">강좌 정보를 입력하고 등록하세요.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsPreviewOpen(true)}>
              <Eye className="mr-2 h-4 w-4" />
              미리보기
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              등록하기
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Basic Info Tab */}
        {activeTab === "basic" && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* 기본 정보 */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
                <CardDescription>강좌의 기본 정보를 입력하세요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">강좌명 *</Label>
                  <Input
                    id="title"
                    placeholder="예: ChatGPT & AI 자동화로 월 1,000만원 수익 만들기"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">강좌 소개 *</Label>
                  <Textarea
                    id="description"
                    placeholder="강좌에 대한 상세한 소개를 입력하세요. 이 강좌를 통해 수강생이 무엇을 배울 수 있는지 설명해주세요."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">카테고리 *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="카테고리 선택" />
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
                  <div className="grid gap-2">
                    <Label htmlFor="badge">배지</Label>
                    <Select
                      value={formData.badge}
                      onValueChange={(value) => setFormData({ ...formData, badge: value })}
                    >
                      <SelectTrigger id="badge">
                        <SelectValue placeholder="배지 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {badges.map((badge) => (
                          <SelectItem key={badge.value} value={badge.value}>
                            {badge.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="level">난이도 *</Label>
                    <Select
                      value={formData.level}
                      onValueChange={(value) => setFormData({ ...formData, level: value })}
                    >
                      <SelectTrigger id="level">
                        <SelectValue placeholder="난이도 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="language">언어</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => setFormData({ ...formData, language: value })}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="언어 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="한국어">한국어</SelectItem>
                        <SelectItem value="영어">영어</SelectItem>
                        <SelectItem value="일본어">일본어</SelectItem>
                        <SelectItem value="중국어">중국어</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 이미지 업로드 */}
            <Card>
              <CardHeader>
                <CardTitle>이미지 설정</CardTitle>
                <CardDescription>강좌에 사용될 이미지를 업로드하세요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 목록 썸네일 */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">{"목록 썸네일"}<span className="text-foreground ml-1">*</span></Label>
                    <p className="text-xs text-muted-foreground">강좌 목록, 카드에 표시되는 이미지</p>
                  </div>
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted">
                    {formData.thumbnail ? (
                      <Image
                        src={formData.thumbnail}
                        alt="썸네일 미리보기"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                        <span className="text-xs">권장: 1280 x 720px</span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    썸네일 업로드
                  </Button>
                </div>

                <Separator />

                {/* 상세 페이지 타이틀 이미지 */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">{"상세 페이지 헤더 이미지"}<span className="text-foreground ml-1">*</span></Label>
                    <p className="text-xs text-muted-foreground">상세 페이지 상단 배경 이미지</p>
                  </div>
                  <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted">
                    {formData.headerImage ? (
                      <Image
                        src={formData.headerImage}
                        alt="헤더 이미지 미리보기"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                        <span className="text-xs">권장: 1920 x 600px</span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    헤더 이미지 업로드
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 가격 정보 */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>가격 정보</CardTitle>
                <CardDescription>강좌 가격을 설정하세요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">판매가 (원) *</Label>
                    <Input
                      id="price"
                      placeholder="149,000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="originalPrice">정가 (원)</Label>
                    <Input
                      id="originalPrice"
                      placeholder="299,000"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    />
                  </div>
                </div>
                {calculateDiscount() > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                      {calculateDiscount()}% OFF
                    </Badge>
                    <span className="text-muted-foreground">할인 적용</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 강사 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>강사 정보</CardTitle>
                <CardDescription>강사를 선택하거나 직접 입력하세요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="instructor">{"강사 선택"}<span className="text-foreground ml-1">*</span></Label>
                  <Select
                    value={formData.instructor}
                    onValueChange={handleInstructorChange}
                  >
                    <SelectTrigger id="instructor">
                      <SelectValue placeholder="강사 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {instructors.map((instructor) => (
                        <SelectItem key={instructor.name} value={instructor.name}>
                          {instructor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="instructorTitle">강사 직함</Label>
                  <Input
                    id="instructorTitle"
                    placeholder="AI 비즈니스 전문가 / 전 네이버 AI Lab"
                    value={formData.instructorTitle}
                    onChange={(e) => setFormData({ ...formData, instructorTitle: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="instructorBio">강사 소개</Label>
                  <Textarea
                    id="instructorBio"
                    placeholder="강사의 경력 및 전문 분야를 소개해주세요."
                    rows={3}
                    value={formData.instructorBio}
                    onChange={(e) => setFormData({ ...formData, instructorBio: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 강의 정보 */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>강의 정보</CardTitle>
                <CardDescription>강의 기간 및 수료증 발급 여부를 설정하세요.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
                    <Clock className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">총 강의 시간</span>
                    <span className="font-semibold">{calculateTotalDuration() || "-"}</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
                    <Video className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">강의 수</span>
                    <span className="font-semibold">{totalLectures}개</span>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="enrollmentPeriod">수강 기간</Label>
                    <Select
                      value={formData.enrollmentPeriod}
                      onValueChange={(value) => setFormData({ ...formData, enrollmentPeriod: value })}
                    >
                      <SelectTrigger id="enrollmentPeriod">
                        <SelectValue placeholder="수강 기간" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="평생 무제한">평생 무제한</SelectItem>
                        <SelectItem value="1년">1년</SelectItem>
                        <SelectItem value="6개월">6개월</SelectItem>
                        <SelectItem value="3개월">3개월</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>수료증</Label>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="hasCertificate"
                        checked={formData.hasCertificate}
                        onCheckedChange={(checked) => setFormData({ ...formData, hasCertificate: checked })}
                      />
                      <Label htmlFor="hasCertificate" className="font-normal">
                        {formData.hasCertificate ? "발급 가능" : "발급 불가"}
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === "content" && (
          <div className="grid gap-6">
            {/* 이 강의에서 배우는 것 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  이 강의에서 배우는 것
                </CardTitle>
                <CardDescription>수강생이 이 강의를 통해 배울 수 있는 내용을 작성하세요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                    <Input
                      placeholder="예: ChatGPT 프롬프트 엔지니어링 완전 정복"
                      value={highlight}
                      onChange={(e) => updateArrayItem("highlights", index, e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem("highlights", index)}
                      disabled={formData.highlights.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={() => addArrayItem("highlights")}>
                  <Plus className="mr-2 h-4 w-4" />
                  항목 추가
                </Button>
              </CardContent>
            </Card>

            {/* 이런 분께 추천합니다 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  이런 분께 추천합니다
                </CardTitle>
                <CardDescription>이 강좌를 들으면 좋은 대상을 작성하세요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.targetAudience.map((target, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Target className="h-4 w-4 shrink-0 text-orange-500" />
                    <Input
                      placeholder="예: AI를 활용한 새로운 수익원을 만들고 싶은 분"
                      value={target}
                      onChange={(e) => updateArrayItem("targetAudience", index, e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem("targetAudience", index)}
                      disabled={formData.targetAudience.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={() => addArrayItem("targetAudience")}>
                  <Plus className="mr-2 h-4 w-4" />
                  항목 추가
                </Button>
              </CardContent>
            </Card>

            {/* 수강 전 준비사항 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                  수강 전 준비사항
                </CardTitle>
                <CardDescription>수강에 필요한 사전 준비 사항을 작성하세요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-blue-500" />
                    <Input
                      placeholder="예: 기본적인 컴퓨터 사용 능력"
                      value={requirement}
                      onChange={(e) => updateArrayItem("requirements", index, e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem("requirements", index)}
                      disabled={formData.requirements.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={() => addArrayItem("requirements")}>
                  <Plus className="mr-2 h-4 w-4" />
                  항목 추가
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Curriculum Tab */}
        {activeTab === "curriculum" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">커리큘럼 구성</h3>
                <p className="text-sm text-muted-foreground">
                  {formData.curriculum.length}개 섹션 · {totalLectures}개 강의 · 총 {calculateTotalDuration()}
                </p>
              </div>
              <Button onClick={addSection}>
                <Plus className="mr-2 h-4 w-4" />
                섹션 추가
              </Button>
            </div>

            {formData.curriculum.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Video className="h-12 w-12 text-muted-foreground mb-4" />
                  <h4 className="font-medium mb-2">커리큘럼을 구성하세요</h4>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    섹션을 추가하고 각 섹션에 강의를 등록하세요.
                  </p>
                  <Button onClick={addSection}>
                    <Plus className="mr-2 h-4 w-4" />
                    첫 번째 섹션 추가
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {formData.curriculum.map((section, sectionIndex) => (
                  <Card key={section.id}>
                    <CardHeader className="cursor-pointer" onClick={() => toggleSection(section.id)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <Input
                              value={section.title}
                              onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="font-semibold text-base"
                              placeholder="섹션 제목을 입력하세요"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {section.lessons.length}개 강의
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeSection(section.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {section.isExpanded ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {section.isExpanded && (
                      <CardContent className="space-y-3">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div key={lesson.id} className="flex items-start gap-3 rounded-lg border p-3">
                            <GripVertical className="mt-2 h-4 w-4 text-muted-foreground" />
                            <div className="flex-1 space-y-3">
                              <div className="grid gap-3 md:grid-cols-2">
                                <Input
                                  placeholder="강의 제목"
                                  value={lesson.title}
                                  onChange={(e) => updateLesson(section.id, lesson.id, "title", e.target.value)}
                                />
                                <div className="flex items-center gap-2">
                                  <Input
                                    placeholder="시간 (예: 12:30)"
                                    value={lesson.duration}
                                    onChange={(e) => updateLesson(section.id, lesson.id, "duration", e.target.value)}
                                    className="w-28"
                                  />
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      id={`free-${lesson.id}`}
                                      checked={lesson.isFree}
                                      onCheckedChange={(checked) => updateLesson(section.id, lesson.id, "isFree", checked)}
                                    />
                                    <Label htmlFor={`free-${lesson.id}`} className="text-sm">
                                      미리보기
                                    </Label>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Input
                                  placeholder="비디오 URL 또는 파일 업로드"
                                  value={lesson.videoUrl}
                                  onChange={(e) => updateLesson(section.id, lesson.id, "videoUrl", e.target.value)}
                                  className="flex-1"
                                />
                                <Button variant="outline" size="icon">
                                  <Upload className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeLesson(section.id, lesson.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button variant="outline" className="w-full" onClick={() => addLesson(section.id)}>
                          <Plus className="mr-2 h-4 w-4" />
                          강의 추가
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>노출 설정</CardTitle>
                <CardDescription>강좌의 사이트 노출 여부를 설정합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>사이트에 노출</Label>
                    <p className="text-sm text-muted-foreground">
                      활성화하면 사용자가 강좌를 볼 수 있습니다.
                    </p>
                  </div>
                  <Switch
                    checked={formData.isVisible}
                    onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>등록 정보 요약</CardTitle>
                <CardDescription>입력한 정보를 확인하세요.</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">강좌명</dt>
                    <dd className="font-medium truncate max-w-[200px]">{formData.title || "-"}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">카테고리</dt>
                    <dd className="font-medium">{formData.category || "-"}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">강사</dt>
                    <dd className="font-medium">{formData.instructor || "-"}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">판매가</dt>
                    <dd className="font-medium">{formData.price ? `${formData.price}원` : "-"}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">총 강의 수</dt>
                    <dd className="font-medium">{totalLectures}개</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">총 강의 시간</dt>
                    <dd className="font-medium">{calculateTotalDuration() || "-"}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bottom Action Bar */}
        <div className="sticky bottom-0 -mx-6 -mb-6 flex items-center justify-end gap-3 border-t bg-background px-6 py-4">
          <Link href="/admin/classes">
            <Button variant="outline">취소</Button>
          </Link>
          <Button variant="outline" onClick={() => setIsPreviewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            미리보기
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            등록하기
          </Button>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>강좌 미리보기</DialogTitle>
            <DialogDescription>
              등록될 강좌의 미리보기입니다. 실제 표시와 다를 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Hero Section Preview */}
            <div className="relative rounded-lg bg-zinc-900 p-6 text-white overflow-hidden">
              {formData.headerImage && (
                <Image
                  src={formData.headerImage}
                  alt="헤더 배경"
                  fill
                  className="object-cover opacity-40"
                />
              )}
              <div className="relative z-10">
              <div className="flex items-center gap-2 text-sm text-zinc-400 mb-4">
                <span>홈</span>
                <span>/</span>
                <span>전체 클래스</span>
                <span>/</span>
                <span>{formData.category || "카테고리"}</span>
              </div>
              {formData.badge && formData.badge !== "none" && (
                <Badge
                  className={`mb-3 ${
                    formData.badge === "BEST"
                      ? "bg-red-500 text-white"
                      : formData.badge === "HOT"
                      ? "bg-orange-500 text-white"
                      : ""
                  }`}
                >
                  {formData.badge}
                </Badge>
              )}
              <h1 className="text-2xl font-bold mb-3">{formData.title || "강좌명을 입력하세요"}</h1>
              <p className="text-zinc-300 mb-4 line-clamp-2">{formData.description || "강좌 소개를 입력하세요"}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>0.0</span>
                  <span className="text-zinc-400">(0개의 수강평)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>0명 수강 중</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>총 {calculateTotalDuration()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  <span>{totalLectures}개 강의</span>
                </div>
              </div>
              </div>
            </div>

            {/* Price Card Preview */}
            <div className="rounded-lg border p-4">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold">
                  {formData.price ? `₩${parseInt(formData.price.replace(/,/g, "")).toLocaleString()}` : "₩0"}
                </span>
                {calculateDiscount() > 0 && (
                  <>
                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                      {calculateDiscount()}% OFF
                    </Badge>
                    <span className="text-sm text-muted-foreground line-through">
                      ₩{parseInt(formData.originalPrice.replace(/,/g, "")).toLocaleString()}
                    </span>
                  </>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">총 강의 시간</span>
                  <span>{calculateTotalDuration()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">강의 수</span>
                  <span>{totalLectures}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">난이도</span>
                  <span>{formData.level || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">언어</span>
                  <span>{formData.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">수강 기간</span>
                  <span>{formData.enrollmentPeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">수료증</span>
                  <span>{formData.hasCertificate ? "발급 가능" : "발급 불가"}</span>
                </div>
              </div>
            </div>

            {/* Content Preview */}
            {formData.highlights.some(h => h) && (
              <div>
                <h3 className="font-semibold mb-3">이 강의에서 배우는 것</h3>
                <div className="grid gap-2">
                  {formData.highlights.filter(h => h).map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.targetAudience.some(t => t) && (
              <div>
                <h3 className="font-semibold mb-3">이런 분께 추천합니다</h3>
                <div className="grid gap-2">
                  {formData.targetAudience.filter(t => t).map((target, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">{target}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum Preview */}
            {formData.curriculum.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">커리큘럼</h3>
                <div className="space-y-2">
                  {formData.curriculum.map((section) => (
                    <div key={section.id} className="rounded-lg border">
                      <div className="flex items-center justify-between p-3 bg-muted/50">
                        <span className="font-medium">{section.title || "섹션 제목"}</span>
                        <span className="text-sm text-muted-foreground">{section.lessons.length}개 강의</span>
                      </div>
                      {section.lessons.length > 0 && (
                        <div className="p-3 space-y-2">
                          {section.lessons.map((lesson) => (
                            <div key={lesson.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <Video className="h-4 w-4 text-muted-foreground" />
                                <span>{lesson.title || "강의 제목"}</span>
                                {lesson.isFree && (
                                  <Badge variant="outline" className="text-xs">미리보기</Badge>
                                )}
                              </div>
                              <span className="text-muted-foreground">{lesson.duration || "00:00"}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              닫기
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              등록하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
