"use client"

import { useSearchParams } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
          { id: "l1", title: "강의 소개 및 로드맵 안내", duration: "12:30", type: "video", isFree: true, isPublished: true, materials: [] },
          { id: "l2", title: "AI 시대, 왜 지금 시작해야 하는가", duration: "18:45", type: "video", isFree: true, isPublished: true, materials: [{ name: "AI 트렌드 요약.pdf" }] },
          { id: "l3", title: "수익화 가능한 AI 비즈니스 모델 10가지", duration: "25:10", type: "video", isFree: false, isPublished: true, materials: [{ name: "비즈니스 모델 템플릿.xlsx" }, { name: "사례 분석 자료.pdf" }] },
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">강의 등록</h2>
            <p className="text-muted-foreground">커리큘럼을 구성하고 강의 콘텐츠를 관리합니다.</p>
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
                            <div className="flex flex-col">
                              <span className="font-medium">{lecture.title}</span>
                              {lecture.materials && lecture.materials.length > 0 && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  학습자료 {lecture.materials.length}개
                                </span>
                              )}
                            </div>
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
