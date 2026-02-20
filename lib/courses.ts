export interface CourseLesson {
  title: string
  duration: string
  isFree?: boolean
}

export interface CourseSection {
  title: string
  lessons: CourseLesson[]
}

export interface CourseReview {
  name: string
  rating: number
  date: string
  content: string
  helpful: number
}

export interface Course {
  id: string
  title: string
  instructor: string
  instructorImage: string
  instructorTitle: string
  instructorBio: string
  image: string
  category: string
  rating: number
  reviews: number
  students: number
  duration: string
  lectures: number
  level: string
  price: string
  originalPrice: string
  badge: string | null
  badgeColor: string
  description: string
  highlights: string[]
  targetAudience: string[]
  requirements: string[]
  curriculum: CourseSection[]
  reviewList: CourseReview[]
}

export const courses: Course[] = [
  {
    id: "chatgpt-ai-automation",
    title: "ChatGPT & AI 자동화로 월 1,000만원 수익 만들기",
    instructor: "김도현",
    instructorImage: "/images/instructor-1.jpg",
    instructorTitle: "AI 비즈니스 전문가 / 전 네이버 AI Lab",
    instructorBio: "10년간 AI 분야에서 활동하며 200개 이상의 AI 자동화 프로젝트를 성공적으로 이끌었습니다. 현재 AI 기반 수익화 컨설팅 대표로 활동 중이며, 3,000명 이상의 수강생이 실제 수익을 창출하고 있습니다.",
    image: "/images/course-ai.jpg",
    category: "AI / 자동화",
    rating: 4.9,
    reviews: 1247,
    students: 8340,
    duration: "12시간 30분",
    lectures: 48,
    level: "초급 ~ 중급",
    price: "149,000",
    originalPrice: "299,000",
    badge: "BEST",
    badgeColor: "bg-red-500 text-white",
    description: "ChatGPT와 다양한 AI 도구를 활용하여 실제로 수익을 만드는 방법을 A부터 Z까지 알려드립니다. 단순한 이론이 아닌, 실전에서 바로 적용할 수 있는 검증된 수익화 전략을 배우세요.",
    highlights: [
      "ChatGPT 프롬프트 엔지니어링 완전 정복",
      "AI 자동화 파이프라인 구축 실습",
      "월 1,000만원 수익 로드맵 제공",
      "실제 수익 사례 10가지 분석",
      "평생 수강 + 커뮤니티 접근권",
    ],
    targetAudience: [
      "AI를 활용한 새로운 수익원을 만들고 싶은 분",
      "ChatGPT를 비즈니스에 접목하고 싶은 사업가",
      "자동화로 시간을 절약하고 싶은 직장인",
      "프리랜서로 AI 서비스를 제공하고 싶은 분",
    ],
    requirements: [
      "기본적인 컴퓨터 사용 능력",
      "ChatGPT 무료 계정 (수업 중 가입 안내)",
      "코딩 경험 불필요",
    ],
    curriculum: [
      {
        title: "Section 1. AI 수익화 개론",
        lessons: [
          { title: "강의 소개 및 로드맵 안내", duration: "12:30", isFree: true },
          { title: "AI 시대, 왜 지금 시작해야 하는가", duration: "18:45", isFree: true },
          { title: "수익화 가능한 AI 비즈니스 모델 10가지", duration: "25:10" },
          { title: "성공 사례 분석: 월 1,000만원 달성 스토리", duration: "20:30" },
        ],
      },
      {
        title: "Section 2. ChatGPT 프롬프트 마스터",
        lessons: [
          { title: "프롬프트 엔지니어링 기초", duration: "22:15" },
          { title: "고급 프롬프트 테크닉 10가지", duration: "30:40" },
          { title: "비즈니스용 프롬프트 템플릿 만들기", duration: "28:20" },
          { title: "실습: 나만의 AI 어시스턴트 만들기", duration: "35:50" },
        ],
      },
      {
        title: "Section 3. AI 자동화 시스템 구축",
        lessons: [
          { title: "Zapier & Make 자동화 기초", duration: "25:30" },
          { title: "AI 콘텐츠 자동 생성 파이프라인", duration: "32:15" },
          { title: "이메일 마케팅 자동화 구축", duration: "28:45" },
          { title: "소셜 미디어 자동 포스팅 시스템", duration: "30:20" },
        ],
      },
      {
        title: "Section 4. 수익화 실전 프로젝트",
        lessons: [
          { title: "AI 블로그 수익화 전략", duration: "26:10" },
          { title: "AI 상품 리뷰 자동화", duration: "24:30" },
          { title: "프리랜서 AI 서비스 런칭", duration: "28:40" },
          { title: "월 1,000만원 수익 로드맵 수립", duration: "35:20" },
        ],
      },
    ],
    reviewList: [
      {
        name: "이*석",
        rating: 5,
        date: "2026.01.15",
        content: "AI에 대해 전혀 몰랐는데, 이 강의 덕분에 3개월 만에 월 300만원 부수입을 만들 수 있었습니다. 특히 자동화 파이프라인 구축 파트가 정말 실용적이었어요.",
        helpful: 47,
      },
      {
        name: "박*연",
        rating: 5,
        date: "2026.01.08",
        content: "50대 직장인인데, 설명이 정말 쉽고 따라하기 좋았습니다. 지금은 퇴근 후 AI 부업으로 추가 수입을 올리고 있어요. 강력 추천합니다!",
        helpful: 38,
      },
      {
        name: "김*호",
        rating: 4,
        date: "2025.12.20",
        content: "전체적으로 매우 만족합니다. 다만 고급 과정이 좀 더 있었으면 합니다. 그래도 초급~중급자에게는 최고의 강의입니다.",
        helpful: 22,
      },
    ],
  },
  {
    id: "youtube-monetization",
    title: "유튜브 수익화 완벽 가이드: 0에서 월 500만원까지",
    instructor: "박서연",
    instructorImage: "/images/instructor-2.jpg",
    instructorTitle: "유튜브 크리에이터 / 구독자 85만",
    instructorBio: "유튜브 채널 3개를 운영하며 총 구독자 85만을 보유한 전업 크리에이터입니다. 5년간의 유튜브 경험을 바탕으로 수익화 노하우를 체계적으로 정리했습니다.",
    image: "/images/course-youtube.jpg",
    category: "유튜브",
    rating: 4.8,
    reviews: 983,
    students: 6210,
    duration: "15시간 45분",
    lectures: 56,
    level: "입문 ~ 중급",
    price: "129,000",
    originalPrice: "259,000",
    badge: "NEW",
    badgeColor: "bg-primary text-primary-foreground",
    description: "유튜브 채널 개설부터 수익화까지, 0에서 시작해서 월 500만원을 달성하는 실전 로드맵을 제공합니다. 알고리즘 분석, 영상 기획, 편집, 수익 극대화 전략까지 모두 담았습니다.",
    highlights: [
      "유튜브 알고리즘 완전 분석",
      "조회수 터지는 썸네일 & 제목 공식",
      "수익 극대화 전략 (애드센스 + 브랜디드)",
      "실제 채널 성장 과정 전체 공개",
      "월별 콘텐츠 캘린더 템플릿 제공",
    ],
    targetAudience: [
      "유튜브를 시작하고 싶지만 막막한 분",
      "채널은 있지만 구독자가 늘지 않는 분",
      "유튜브로 안정적인 수입을 만들고 싶은 분",
      "부업으로 영상 제작을 시작하고 싶은 직장인",
    ],
    requirements: [
      "스마트폰 또는 카메라 (스마트폰으로 충분)",
      "구글 계정",
      "기본 영상 편집 경험 (없어도 가능)",
    ],
    curriculum: [
      {
        title: "Section 1. 유튜브 시작하기",
        lessons: [
          { title: "유튜브 수익화의 모든 것", duration: "15:20", isFree: true },
          { title: "니치 마켓 찾기: 나만의 포지션", duration: "22:30", isFree: true },
          { title: "채널 브랜딩 완벽 가이드", duration: "18:45" },
          { title: "첫 영상 기획부터 업로드까지", duration: "28:10" },
        ],
      },
      {
        title: "Section 2. 알고리즘과 성장 전략",
        lessons: [
          { title: "유튜브 알고리즘 작동 원리", duration: "25:30" },
          { title: "CTR 높이는 썸네일 디자인", duration: "30:20" },
          { title: "검색 최적화(SEO) 전략", duration: "22:45" },
          { title: "커뮤니티 활용 성장 가속화", duration: "18:30" },
        ],
      },
      {
        title: "Section 3. 수익화 극대화",
        lessons: [
          { title: "애드센스 수익 최적화", duration: "24:15" },
          { title: "브랜디드 콘텐츠 계약 노하우", duration: "28:40" },
          { title: "멤버십 & 슈퍼챗 전략", duration: "20:30" },
          { title: "다중 수익원 구축하기", duration: "32:10" },
        ],
      },
    ],
    reviewList: [
      {
        name: "정*민",
        rating: 5,
        date: "2026.02.01",
        content: "6개월 전에 수강 시작했는데, 지금 구독자 2만명 달성했습니다. 알고리즘 강의가 진짜 핵심이에요.",
        helpful: 56,
      },
      {
        name: "최*영",
        rating: 5,
        date: "2026.01.18",
        content: "40대 주부인데 취미로 시작한 채널이 이제 월 200만원 수입을 만들어주고 있어요. 감사합니다!",
        helpful: 43,
      },
    ],
  },
  {
    id: "performance-marketing",
    title: "퍼포먼스 마케팅 마스터클래스: ROI 500% 달성 전략",
    instructor: "이준혁",
    instructorImage: "/images/instructor-3.jpg",
    instructorTitle: "마케팅 컨설턴트 / 전 구글 코리아",
    instructorBio: "구글 코리아, 메타 코리아에서 10년간 퍼포먼스 마케팅을 담당했습니다. 현재 마케팅 컨설팅 회사를 운영하며 연간 100억 원 이상의 광고비를 관리하고 있습니다.",
    image: "/images/course-marketing.jpg",
    category: "마케팅",
    rating: 4.9,
    reviews: 756,
    students: 4530,
    duration: "10시간 20분",
    lectures: 38,
    level: "중급 ~ 고급",
    price: "169,000",
    originalPrice: "339,000",
    badge: "HOT",
    badgeColor: "bg-orange-500 text-white",
    description: "구글, 메타, 네이버 광고를 활용한 퍼포먼스 마케팅 실전 전략을 배웁니다. ROI 500%를 달성하는 광고 운영 노하우와 데이터 기반 의사결정 방법을 체계적으로 알려드립니다.",
    highlights: [
      "구글/메타/네이버 광고 통합 전략",
      "ROI 500% 달성 실전 케이스 스터디",
      "광고 예산 최적화 프레임워크",
      "A/B 테스트 설계 및 분석 방법론",
      "실무 대시보드 템플릿 제공",
    ],
    targetAudience: [
      "마케팅 실무 경험이 있는 마케터",
      "광고 ROI를 높이고 싶은 사업가",
      "데이터 기반 마케팅을 배우고 싶은 분",
      "마케팅 에이전시 창업을 준비하는 분",
    ],
    requirements: [
      "기본적인 디지털 마케팅 이해",
      "광고 플랫폼 사용 경험 (권장)",
      "엑셀/스프레드시트 기본 활용 능력",
    ],
    curriculum: [
      {
        title: "Section 1. 퍼포먼스 마케팅 기초",
        lessons: [
          { title: "퍼포먼스 마케팅이란?", duration: "14:20", isFree: true },
          { title: "핵심 지표(KPI) 설정법", duration: "20:30" },
          { title: "고객 여정과 퍼널 설계", duration: "25:15" },
        ],
      },
      {
        title: "Section 2. 플랫폼별 광고 전략",
        lessons: [
          { title: "구글 광고 완전 정복", duration: "35:20" },
          { title: "메타 광고 고급 타겟팅", duration: "30:45" },
          { title: "네이버 검색 광고 최적화", duration: "28:10" },
        ],
      },
    ],
    reviewList: [
      {
        name: "한*우",
        rating: 5,
        date: "2026.01.25",
        content: "현직 마케터인데 이 강의로 광고 ROI를 3배 이상 개선했습니다. 실무에서 바로 쓸 수 있는 내용이라 좋았어요.",
        helpful: 34,
      },
    ],
  },
  {
    id: "premiere-photoshop-creator",
    title: "프리미어 프로 & 포토샵: 1인 크리에이터 완성 패키지",
    instructor: "최예진",
    instructorImage: "/images/instructor-2.jpg",
    instructorTitle: "영상 디렉터 / 전 CJ ENM",
    instructorBio: "CJ ENM에서 5년간 영상 편집 디렉터로 활동했으며, 현재 1인 크리에이터를 위한 영상 제작 교육을 전문으로 하고 있습니다.",
    image: "/images/course-design.jpg",
    category: "디자인",
    rating: 4.7,
    reviews: 621,
    students: 3870,
    duration: "18시간 10분",
    lectures: 62,
    level: "입문 ~ 중급",
    price: "139,000",
    originalPrice: "279,000",
    badge: null,
    badgeColor: "",
    description: "프리미어 프로와 포토샵을 한 번에 마스터하세요. 1인 크리에이터에게 필요한 영상 편집과 썸네일 디자인을 실전 프로젝트로 배웁니다.",
    highlights: [
      "프리미어 프로 완전 정복 (기초~고급)",
      "포토샵 썸네일 디자인 마스터",
      "효과음 & BGM 활용법",
      "10개 실전 프로젝트 포함",
      "소스 파일 전체 제공",
    ],
    targetAudience: [
      "영상 편집을 처음 시작하는 분",
      "유튜브 썸네일을 직접 만들고 싶은 분",
      "1인 크리에이터를 목표로 하는 분",
    ],
    requirements: [
      "Adobe Creative Cloud 구독 (무료 체험 가능)",
      "기본적인 컴퓨터 사용 능력",
    ],
    curriculum: [
      {
        title: "Section 1. 프리미어 프로 기초",
        lessons: [
          { title: "프리미어 프로 인터페이스 소개", duration: "15:30", isFree: true },
          { title: "기본 편집 워크플로우", duration: "22:45" },
          { title: "컷 편집 & 트랜지션", duration: "28:20" },
        ],
      },
    ],
    reviewList: [
      {
        name: "송*희",
        rating: 5,
        date: "2026.01.10",
        content: "영상 편집 1도 몰랐는데 이 강의 하나로 유튜브 채널 운영이 가능해졌어요!",
        helpful: 29,
      },
    ],
  },
  {
    id: "smartstore-coupang",
    title: "스마트스토어 + 쿠팡: 월매출 5,000만원 실전 로드맵",
    instructor: "정민수",
    instructorImage: "/images/instructor-1.jpg",
    instructorTitle: "이커머스 전문가 / 월매출 3억 달성",
    instructorBio: "스마트스토어와 쿠팡에서 월매출 3억을 달성한 실전 셀러입니다. 500명 이상의 수강생을 성공적인 셀러로 양성했습니다.",
    image: "/images/course-commerce.jpg",
    category: "커머스",
    rating: 4.8,
    reviews: 892,
    students: 5120,
    duration: "14시간 50분",
    lectures: 52,
    level: "초급 ~ 중급",
    price: "159,000",
    originalPrice: "319,000",
    badge: "BEST",
    badgeColor: "bg-red-500 text-white",
    description: "스마트스토어와 쿠팡을 동시에 운영하여 월매출 5,000만원을 달성하는 실전 전략을 알려드립니다. 상품 소싱부터 마케팅까지 모든 과정을 담았습니다.",
    highlights: [
      "스마트스토어 & 쿠팡 동시 운영 전략",
      "상품 소싱 노하우 (국내/해외)",
      "상위 노출 SEO 전략",
      "CS 관리 & 리뷰 마케팅",
      "월매출 5,000만원 로드맵",
    ],
    targetAudience: [
      "온라인 쇼핑몰을 시작하고 싶은 분",
      "이미 셀러이지만 매출을 올리고 싶은 분",
      "부업으로 이커머스를 시작하고 싶은 직장인",
    ],
    requirements: [
      "사업자등록증 (수업 중 발급 안내)",
      "초기 자본금 100만원 이상 권장",
    ],
    curriculum: [
      {
        title: "Section 1. 이커머스 시작하기",
        lessons: [
          { title: "이커머스 시장 분석", duration: "18:20", isFree: true },
          { title: "사업자 등록 & 통신판매업 신고", duration: "12:30" },
          { title: "스마트스토어 vs 쿠팡 비교 분석", duration: "20:15" },
        ],
      },
    ],
    reviewList: [
      {
        name: "오*진",
        rating: 5,
        date: "2026.02.05",
        content: "3개월 만에 월 매출 2,000만원 달성했습니다. 소싱 강의가 진짜 대박이에요.",
        helpful: 52,
      },
    ],
  },
  {
    id: "instagram-tiktok-sns",
    title: "인스타그램 & 틱톡: SNS 수익화 완전 정복",
    instructor: "한수빈",
    instructorImage: "/images/instructor-2.jpg",
    instructorTitle: "SNS 마케터 / 팔로워 50만",
    instructorBio: "인스타그램과 틱톡에서 총 팔로워 50만을 보유한 인플루언서이자 SNS 마케팅 전문가입니다.",
    image: "/images/course-sns.jpg",
    category: "SNS",
    rating: 4.6,
    reviews: 534,
    students: 2980,
    duration: "9시간 40분",
    lectures: 34,
    level: "입문 ~ 초급",
    price: "119,000",
    originalPrice: "239,000",
    badge: "NEW",
    badgeColor: "bg-primary text-primary-foreground",
    description: "인스타그램과 틱톡을 활용한 SNS 수익화 전략을 배웁니다. 팔로워를 늘리고 수익으로 연결하는 전 과정을 실전 예시와 함께 알려드립니다.",
    highlights: [
      "인스타그램 & 틱톡 성장 전략",
      "바이럴 콘텐츠 제작법",
      "브랜드 협찬 유치 노하우",
      "SNS 기반 자체 상품 런칭",
      "월 수익 300만원 달성 로드맵",
    ],
    targetAudience: [
      "SNS로 수익을 만들고 싶은 분",
      "인플루언서를 목표로 하는 분",
      "자영업 홍보에 SNS를 활용하고 싶은 분",
    ],
    requirements: [
      "인스타그램 또는 틱톡 계정",
      "스마트폰",
    ],
    curriculum: [
      {
        title: "Section 1. SNS 수익화 기초",
        lessons: [
          { title: "SNS 수익화의 모든 것", duration: "14:10", isFree: true },
          { title: "나만의 브랜드 포지셔닝", duration: "20:30" },
          { title: "콘텐츠 전략 수립", duration: "18:45" },
        ],
      },
    ],
    reviewList: [
      {
        name: "윤*아",
        rating: 5,
        date: "2026.01.28",
        content: "팔로워 200명에서 시작해서 지금 3만명 달성! 브랜드 협찬도 들어오기 시작했어요.",
        helpful: 31,
      },
    ],
  },
]

export function getCourseById(id: string): Course | undefined {
  return courses.find((c) => c.id === id)
}
