"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Video,
  FileText,
  Link as LinkIcon,
  GripVertical,
  Play,
  Clock,
  FolderOpen,
  File,
  ChevronRight,
  Upload,
  X,
  Check,
} from "lucide-react"
import Link from "next/link"

// 타입 정의
interface Material {
  name: string
  size: string
}

interface Lecture {
  id: string
  title: string
  duration: string
  type: string
  isFree: boolean
  isPublished: boolean
  materials: Material[]
}

// 세그먼트 컨트롤 컴포넌트
function SegmentedControl({ 
  options, 
  value, 
  onChange,
  size = "default"
}: { 
  options: { label: string; value: string }[]
  value: string
  onChange: (value: string) => void
  size?: "default" | "sm"
}) {
  return (
    <div className="inline-flex rounded-lg bg-muted p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`
            ${size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"}
            rounded-md font-medium transition-all
            ${value === option.value 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

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
          { id: "l1", title: "강의 소개 및 로드맵 안내", duration: "12:30", type: "video", isFree: true, isPublished: true, materials: [] },
          { id: "l2", title: "AI 시대, 왜 지금 시작해야 하는가", duration: "18:45", type: "video", isFree: true, isPublished: true, materials: [{ name: "강의 노트.pdf", size: "2.4MB" }] },
          { id: "l3", title: "수익화 가능한 AI 비즈니스 모델 10가지", duration: "25:10", type: "video", isFree: false, isPublished: true, materials: [{ name: "소스코드.zip", size: "15.2MB" }, { name: "이미지자료.jpg", size: "1.8MB" }] },
          { id: "l4", title: "Section 1 학습자료", duration: "", type: "file", isFree: false, isPublished: true, materials: [] },
        ],
      },
      {
        id: "s2",
        title: "Section 2. ChatGPT 프롬프트 마스터",
        order: 2,
        lectures: [
          { id: "l5", title: "프롬프트 엔지니어링 기초", duration: "22:15", type: "video", isFree: false, isPublished: true, materials: [] },
          { id: "l6", title: "고급 프롬프트 테크닉 10가지", duration: "30:40", type: "video", isFree: false, isPublished: true, materials: [] },
          { id: "l7", title: "비즈니스용 프롬프트 템플릿 만들기", duration: "28:20", type: "video", isFree: false, isPublished: false, materials: [] },
        ],
      },
      {
        id: "s3",
        title: "Section 3. AI 자동화 시스템 구축",
        order: 3,
        lectures: [
          { id: "l8", title: "Zapier & Make 자동화 기초", duration: "25:30", type: "video", isFree: false, isPublished: true, materials: [] },
          { id: "l9", title: "AI 콘텐츠 자동 생성 파이프라인", duration: "32:15", type: "video", isFree: false, isPublished: false, materials: [] },
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
          { id: "l10", title: "유튜브 수익화의 모든 것", duration: "15:20", type: "video", isFree: true, isPublished: true, materials: [] },
          { id: "l11", title: "니치 마켓 찾기: 나만의 포지션", duration: "22:30", type: "video", isFree: true, isPublished: true, materials: [] },
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
          { id: "l12", title: "퍼포먼스 마케팅이란?", duration: "14:20", type: "video", isFree: true, isPublished: true, materials: [] },
          { id: "l13", title: "핵심 지표(KPI) 설정법", duration: "20:30", type: "video", isFree: false, isPublished: true, materials: [] },
        ],
      },
    ],
  },
]

export default function LecturesPage() {
  const searchParams = useSearchParams()
  const classId = searchParams.get("classId") || coursesWithCurriculum[0].id

  const currentCourse = coursesWithCurriculum.find((c) => c.id === classId)

  // 강의 추가/수정 Dialog 상태
  const [isLectureDialogOpen, setIsLectureDialogOpen] = useState(false)
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null)
  const [lectureTitle, setLectureTitle] = useState("")
  const [lectureMaterials, setLectureMaterials] = useState<Material[]>([])
  const [lectureIsFree, setLectureIsFree] = useState(false)
  const [lectureIsPublished, setLectureIsPublished] = useState(true)
  const [lectureVideo, setLectureVideo] = useState<{ name: string; size: string; duration: string } | null>(null)

  // 섹션 수정 상태 (Section 2는 기본적으로 수정 중)
  const [editingSectionId, setEditingSectionId] = useState<string | null>("s2")
  const [editingSectionTitle, setEditingSectionTitle] = useState("Section 2. ChatGPT 프롬프트 마스터")

  // 강의 추가 버튼 클릭
  const handleAddLecture = () => {
    setEditingLecture(null)
    setLectureTitle("")
    setLectureMaterials([])
    setLectureIsFree(false)
    setLectureIsPublished(true)
    setLectureVideo(null)
    setIsLectureDialogOpen(true)
  }

  // 강의 수정 버튼 클릭
  const handleEditLecture = (lecture: Lecture) => {
    setEditingLecture(lecture)
    setLectureTitle(lecture.title)
    setLectureMaterials([...lecture.materials])
    setLectureIsFree(lecture.isFree)
    setLectureIsPublished(lecture.isPublished)
    // 수정 시 영상이 등록된 예시 데이터
    if (lecture.duration) {
      setLectureVideo({
        name: `${lecture.title}.mp4`,
        size: "245MB",
        duration: lecture.duration
      })
    } else {
      setLectureVideo(null)
    }
    setIsLectureDialogOpen(true)
  }

  // 자료 추가 (파일 선택 시뮬레이션)
  const handleAddMaterial = () => {
    const newMaterial: Material = {
      name: `새 자료_${lectureMaterials.length + 1}.pdf`,
      size: "1.0MB"
    }
    setLectureMaterials([...lectureMaterials, newMaterial])
  }

  // 자료 삭제
  const handleRemoveMaterial = (index: number) => {
    setLectureMaterials(lectureMaterials.filter((_, i) => i !== index))
  }

  // 저장
  const handleSaveLecture = () => {
    // TODO: 실제 저장 로직 구현
    setIsLectureDialogOpen(false)
  }

  // 섹션 수정 시작
  const handleEditSection = (sectionId: string, sectionTitle: string) => {
    setEditingSectionId(sectionId)
    setEditingSectionTitle(sectionTitle)
  }

  // 섹션 수정 저장
  const handleSaveSection = () => {
    // TODO: 실제 저장 로직 구현
    setEditingSectionId(null)
  }

  // 섹션 수정 취소
  const handleCancelSectionEdit = () => {
    setEditingSectionId(null)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/admin/classes" className="hover:text-foreground transition-colors">
            클래스 관리
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">강의 등록</span>
        </div>

        {/* Page Header */}
        <div className="flex items-start gap-4">
          <div className="relative h-20 w-36 overflow-hidden rounded-lg border border-border flex-shrink-0">
            {currentCourse?.thumbnail ? (
              <Image
                src={currentCourse.thumbnail}
                alt={currentCourse.title || ""}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <Video className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">{currentCourse?.title}</h2>
            <p className="text-sm text-muted-foreground mt-2">커리큘럼을 구성하고 강의 콘텐츠를 관리합니다.</p>
          </div>
        </div>

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
                  <div className="flex items-center justify-between">
                    <AccordionTrigger className="hover:no-underline flex-1">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        {editingSectionId === section.id ? (
                          <div className="flex items-center gap-2 flex-1 pr-4" onClick={(e) => e.stopPropagation()}>
                            <FolderOpen className="h-4 w-4 text-primary flex-shrink-0" />
                            <Input
                              value={editingSectionTitle}
                              onChange={(e) => setEditingSectionTitle(e.target.value)}
                              className="h-8 min-w-[600px]"
                              autoFocus
                            />
                            <Button size="sm" variant="ghost" className="h-8 px-2 flex-shrink-0" onClick={handleSaveSection}>
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 px-2 flex-shrink-0" onClick={handleCancelSectionEdit}>
                              <X className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <FolderOpen className="h-4 w-4 text-primary" />
                              <span className="font-medium">{section.title}</span>
                            </div>
                            <Badge variant="secondary" className="ml-2">
                              {section.lectures.length}개 강의
                            </Badge>
                          </>
                        )}
                      </div>
                    </AccordionTrigger>
                    {editingSectionId !== section.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 mr-2">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditSection(section.id, section.title)}>
                            <Edit className="mr-2 h-4 w-4" />
                            수정
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
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
                            <div className="flex flex-col">
                              <span className="font-medium">{lecture.title}</span>
                              {lecture.materials && lecture.materials.length > 0 && (
                                <div className="flex items-center gap-2 mt-0.5">
                                  {lecture.materials.map((material, idx) => (
                                    <span key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                                      <FileText className="h-3 w-3" />
                                      {material.name} {material.size && `(${material.size})`}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            </div>
                          <div className="flex items-center gap-3">
                            <SegmentedControl
                              options={[
                                { label: "무료", value: "free" },
                                { label: "유료", value: "paid" },
                              ]}
                              value={lecture.isFree ? "free" : "paid"}
                              onChange={() => {}}
                              size="sm"
                            />
                            <SegmentedControl
                              options={[
                                { label: "공개", value: "public" },
                                { label: "비공개", value: "private" },
                              ]}
                              value={lecture.isPublished ? "public" : "private"}
                              onChange={() => {}}
                              size="sm"
                            />
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
                                <DropdownMenuItem onClick={() => handleEditLecture(lecture)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  수정
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
                      <Button variant="ghost" className="w-full border border-dashed" onClick={handleAddLecture}>
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

        {/* 강의 추가/수정 Dialog */}
        <Dialog open={isLectureDialogOpen} onOpenChange={setIsLectureDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingLecture ? "강의 수정" : "강의 추가"}</DialogTitle>
              <DialogDescription>
                강의 제목과 학습 자료를 입력하세요.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* 강의 제목 + 세그먼트 컨트롤 */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="lectureTitle">강의 제목</Label>
                  <div className="flex items-center gap-2">
                    <SegmentedControl
                      options={[
                        { label: "무료", value: "free" },
                        { label: "유료", value: "paid" },
                      ]}
                      value={lectureIsFree ? "free" : "paid"}
                      onChange={(v) => setLectureIsFree(v === "free")}
                      size="sm"
                    />
                    <SegmentedControl
                      options={[
                        { label: "공개", value: "public" },
                        { label: "비공개", value: "private" },
                      ]}
                      value={lectureIsPublished ? "public" : "private"}
                      onChange={(v) => setLectureIsPublished(v === "public")}
                      size="sm"
                    />
                  </div>
                </div>
                <Input
                  id="lectureTitle"
                  value={lectureTitle}
                  onChange={(e) => setLectureTitle(e.target.value)}
                  placeholder="강의 제목을 입력하세요"
                />
              </div>

              {/* 강의 영상 업로드 */}
              <div className="grid gap-3">
                <Label>강의 영상</Label>
                {lectureVideo ? (
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Video className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{lectureVideo.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {lectureVideo.size} / {lectureVideo.duration}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setLectureVideo(null)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      삭제
                    </Button>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Video className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium">클릭하여 영상을 업로드하세요</p>
                    <p className="text-xs text-muted-foreground mt-1">MP4, MOV, WebM (최대 2GB)</p>
                  </div>
                )}
              </div>

              {/* 학습 자료 */}
              <div className="grid gap-3">
                <Label>학습 자료</Label>
                
                {/* 업로드된 자료 목록 */}
                {lectureMaterials.length > 0 && (
                  <div className="space-y-2">
                    {lectureMaterials.map((material, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{material.name}</span>
                          <span className="text-xs text-muted-foreground">({material.size})</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleRemoveMaterial(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 자료 업로드 영역 */}
                <div
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={handleAddMaterial}
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">클릭하여 파일을 업로드하세요</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, ZIP, 이미지 등</p>
                </div>
              </div>

              </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsLectureDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleSaveLecture}>
                {editingLecture ? "수정" : "추가"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
