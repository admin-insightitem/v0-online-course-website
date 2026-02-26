"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
  Video,
  FileText,
  Upload,
  Link as LinkIcon,
  GripVertical,
  Play,
  Clock,
  ChevronDown,
  FolderOpen,
  File,
} from "lucide-react"

// 강좌 및 커리큘럼 데이터
const coursesWithCurriculum = [
  {
    id: "1",
    title: "ChatGPT & AI 자동화로 월 1,000만원 수익 만들기",
    thumbnail: "/images/course-ai.jpg",
    sections: [
      {
        id: "s1",
        title: "Section 1. AI 수익화 개론",
        order: 1,
        lectures: [
          { id: "l1", title: "강의 소개 및 로드맵 안내", duration: "12:30", type: "video", isFree: true, isPublished: true },
          { id: "l2", title: "AI 시대, 왜 지금 시작해야 하는가", duration: "18:45", type: "video", isFree: true, isPublished: true },
          { id: "l3", title: "수익화 가능한 AI 비즈니스 모델 10가지", duration: "25:10", type: "video", isFree: false, isPublished: true },
          { id: "l4", title: "Section 1 학습자료", duration: "", type: "file", isFree: false, isPublished: true },
        ],
      },
      {
        id: "s2",
        title: "Section 2. ChatGPT 프롬프트 마스터",
        order: 2,
        lectures: [
          { id: "l5", title: "프롬프트 엔지니어링 기초", duration: "22:15", type: "video", isFree: false, isPublished: true },
          { id: "l6", title: "고급 프롬프트 테크닉 10가지", duration: "30:40", type: "video", isFree: false, isPublished: true },
          { id: "l7", title: "비즈니스용 프롬프트 템플릿 만들기", duration: "28:20", type: "video", isFree: false, isPublished: false },
        ],
      },
      {
        id: "s3",
        title: "Section 3. AI 자동화 시스템 구축",
        order: 3,
        lectures: [
          { id: "l8", title: "Zapier & Make 자동화 기초", duration: "25:30", type: "video", isFree: false, isPublished: true },
          { id: "l9", title: "AI 콘텐츠 자동 생성 파이프라인", duration: "32:15", type: "video", isFree: false, isPublished: false },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "유튜브 수익화 완벽 가이드: 0에서 월 500만원까지",
    thumbnail: "/images/course-youtube.jpg",
    sections: [
      {
        id: "s4",
        title: "Section 1. 유튜브 시작하기",
        order: 1,
        lectures: [
          { id: "l10", title: "유튜브 수익화의 모든 것", duration: "15:20", type: "video", isFree: true, isPublished: true },
          { id: "l11", title: "니치 마켓 찾기: 나만의 포지션", duration: "22:30", type: "video", isFree: true, isPublished: true },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "퍼포먼스 마케팅 마스터클래스: ROI 500% 달성 전략",
    thumbnail: "/images/course-marketing.jpg",
    sections: [
      {
        id: "s5",
        title: "Section 1. 퍼포먼스 마케팅 기초",
        order: 1,
        lectures: [
          { id: "l12", title: "퍼포먼스 마케팅이란?", duration: "14:20", type: "video", isFree: true, isPublished: true },
          { id: "l13", title: "핵심 지표(KPI) 설정법", duration: "20:30", type: "video", isFree: false, isPublished: true },
        ],
      },
    ],
  },
]

export default function LecturesPage() {
  const searchParams = useSearchParams()
  const classId = searchParams.get("classId") || coursesWithCurriculum[0].id
  
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false)
  const [isAddLectureOpen, setIsAddLectureOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const currentCourse = coursesWithCurriculum.find((c) => c.id === classId)

  const totalLectures = currentCourse?.sections.reduce(
    (acc, section) => acc + section.lectures.length,
    0
  ) || 0

  const publishedLectures = currentCourse?.sections.reduce(
    (acc, section) => acc + section.lectures.filter((l) => l.isPublished).length,
    0
  ) || 0

  const simulateUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">강의 등록</h2>
            <p className="text-muted-foreground">커리큘럼을 구성하고 강의 콘텐츠를 관리합니다.</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  섹션 추가
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>새 섹션 추가</DialogTitle>
                  <DialogDescription>
                    커리큘럼에 새로운 섹션을 추가합니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sectionTitle">섹션명</Label>
                    <Input id="sectionTitle" placeholder="예: Section 4. 실전 프로젝트" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sectionOrder">순서</Label>
                    <Input id="sectionOrder" type="number" placeholder="4" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddSectionOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={() => setIsAddSectionOpen(false)}>추가</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddLectureOpen} onOpenChange={setIsAddLectureOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  강의 추가
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>새 강의 추가</DialogTitle>
                  <DialogDescription>
                    새로운 강의 콘텐츠를 업로드하거나 링크를 등록합니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="lectureSection">섹션 선택</Label>
                    <Select>
                      <SelectTrigger id="lectureSection">
                        <SelectValue placeholder="섹션을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentCourse?.sections.map((section) => (
                          <SelectItem key={section.id} value={section.id}>
                            {section.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lectureTitle">강의명</Label>
                    <Input id="lectureTitle" placeholder="강의 제목을 입력하세요" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="lectureType">콘텐츠 유형</Label>
                      <Select>
                        <SelectTrigger id="lectureType">
                          <SelectValue placeholder="유형 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">동영상</SelectItem>
                          <SelectItem value="file">자료 파일</SelectItem>
                          <SelectItem value="link">외부 링크</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lectureDuration">재생 시간</Label>
                      <Input id="lectureDuration" placeholder="12:30" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>콘텐츠 업로드</Label>
                    <div className="rounded-lg border-2 border-dashed border-border bg-muted/50 p-6">
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <div className="text-center">
                          <p className="text-sm font-medium">파일을 드래그하거나 클릭하여 업로드</p>
                          <p className="text-xs text-muted-foreground">MP4, MOV, PDF (최대 2GB)</p>
                        </div>
                        <Button variant="outline" onClick={simulateUpload}>
                          파일 선택
                        </Button>
                      </div>
                      {isUploading && (
                        <div className="mt-4 space-y-2">
                          <Progress value={uploadProgress} />
                          <p className="text-center text-sm text-muted-foreground">
                            업로드 중... {uploadProgress}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="videoLink">또는 외부 링크 입력</Label>
                    <div className="flex gap-2">
                      <Input id="videoLink" placeholder="https://vimeo.com/..." className="flex-1" />
                      <Button variant="outline">
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>첨부 자료</Label>
                    <div className="flex items-center gap-2">
                      <Input type="file" className="flex-1" />
                      <Button variant="outline" size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">PDF, ZIP 등 학습 자료를 첨부할 수 있습니다.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch id="isFree" />
                      <Label htmlFor="isFree">무료 공개</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="isPublished" defaultChecked />
                      <Label htmlFor="isPublished">즉시 공개</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddLectureOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={() => setIsAddLectureOpen(false)}>등록</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Course Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative h-20 w-36 overflow-hidden rounded-lg border border-border flex-shrink-0">
                  {currentCourse?.thumbnail ? (
                    <Image
                      src={currentCourse.thumbnail}
                      alt={currentCourse.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <Video className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">선택된 강좌</p>
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                    {currentCourse?.title}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-6 rounded-lg bg-muted p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{currentCourse?.sections.length || 0}</p>
                  <p className="text-xs text-muted-foreground">섹션</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{totalLectures}</p>
                  <p className="text-xs text-muted-foreground">전체 강의</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{publishedLectures}</p>
                  <p className="text-xs text-muted-foreground">공개됨</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Curriculum */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              커리큘럼 관리
            </CardTitle>
            <CardDescription>
              드래그하여 순서를 변경하고, 각 강의를 편집할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={currentCourse?.sections.map((s) => s.id)}>
              {currentCourse?.sections.map((section) => (
                <AccordionItem key={section.id} value={section.id} className="border rounded-lg mb-4 px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4 text-primary" />
                        <span className="font-medium">{section.title}</span>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {section.lectures.length}개 강의
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {section.lectures.map((lecture, index) => (
                        <div
                          key={lecture.id}
                          className="flex items-center justify-between rounded-lg border border-border bg-card p-3 hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                            <span className="text-sm text-muted-foreground w-6">{index + 1}</span>
                            {lecture.type === "video" ? (
                              <Play className="h-4 w-4 text-primary" />
                            ) : lecture.type === "file" ? (
                              <File className="h-4 w-4 text-blue-500" />
                            ) : (
                              <LinkIcon className="h-4 w-4 text-green-500" />
                            )}
                            <span className="font-medium">{lecture.title}</span>
                            {lecture.isFree && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                무료
                              </Badge>
                            )}
                            {!lecture.isPublished && (
                              <Badge variant="secondary">비공개</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            {lecture.duration && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {lecture.duration}
                              </div>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  수정
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="mr-2 h-4 w-4" />
                                  자료 관리
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  삭제
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                      <Button variant="ghost" className="w-full border border-dashed">
                        <Plus className="mr-2 h-4 w-4" />
                        강의 추가
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Button variant="outline" className="w-full mt-4">
              <Plus className="mr-2 h-4 w-4" />
              새 섹션 추가
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
