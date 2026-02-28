# RichClass Fullstack Platform Planning Document

> **Summary**: 기존 프론트엔드 UI 프로토타입을 Supabase 기반 풀스택 온라인 강의 플랫폼으로 전환
>
> **Project**: RichClass (No.1 온라인 수익화 플랫폼)
> **Version**: 0.1.0
> **Author**: AI (Claude)
> **Date**: 2026-02-28
> **Status**: Draft (v0.2 Updated)

---

## 1. Overview

### 1.1 Purpose

RichClass 온라인 강의 플랫폼의 프론트엔드 UI 프로토타입(**32개 페이지**, 77 컴포넌트)에 Supabase 백엔드를 연동하여 실제 운영 가능한 풀스택 서비스로 전환한다. 인증(3 Role), 결제, 영상 재생(Mux), **관리자 + 강사 대시보드**를 포함한 완전한 온라인 교육 플랫폼을 구축한다.

### 1.2 Background

- 현재 상태: Next.js 16 + App Router 기반 프론트엔드 UI 프로토타입 (Mock 데이터, 백엔드 없음)
- 이미 구현된 것: **32개 라우트**, shadcn/ui 77 컴포넌트, 디자인 시스템, 반응형 레이아웃
- **3개 대시보드 완성**: 사용자(MyPage), 관리자(Admin), **강사(Teacher)** 대시보드
- 필요한 것: Supabase 연동(Auth, DB, Storage), API Routes, Mux 영상 임베드, 결제 연동
- 비즈니스 목표: Vercel + Supabase 환경에서 운영 가능한 MVP 수준 온라인 강의 플랫폼

### 1.3 Related Documents

- 현재 코드베이스: `v0/admin-3` 브랜치
- 프론트엔드 라우트: `app/` 디렉토리 (**32개 페이지**)
- 기존 데이터 모델: `lib/courses.ts` (Mock 데이터)

---

## 2. Scope

### 2.1 In Scope

- [x] 기존 프론트엔드 UI 코드 분석 및 보존 (이미 완료)
- [ ] Supabase 프로젝트 설정 및 DB 스키마 설계
- [ ] Supabase Auth 연동 (이메일/비밀번호 + 카카오 OAuth) - 3 Role 체계 (고객, 강사, 어드민)
- [ ] Next.js API Routes / Server Actions 구현
- [ ] 기존 Mock 데이터를 실제 Supabase DB 연동으로 전환
- [ ] Mux 영상 임베드 재생 구현
- [ ] 장바구니 및 주문/결제 플로우 백엔드 로직
- [ ] 마이페이지 (수강 목록, 주문 내역, 프로필 관리, Q&A, 리뷰) 연동
- [ ] 관리자 대시보드 (매출, 회원, 강의, 결제, 환불, 프로모션) 연동
- [ ] **강사 대시보드 (매출 통계, 내 강의, 내 수강생, Q&A 답변, 리뷰 관리, 프로필) 연동**
- [ ] 쿠폰/프로모션 시스템
- [ ] **웨비나 시스템 (목록, 배너, 신청)**
- [ ] RLS(Row Level Security) 정책 설정
- [ ] 웹훅 엔드포인트 설계 (외부 워크플로우 자동화 도구 연동 대비)
- [ ] **접근 제어 에러 페이지 (access-denied, not-found)**

### 2.2 Out of Scope

- 실결제 PG사 연동 (토스페이먼츠 등) - 결제 플로우 설계까지만, 실연동은 별도 작업
- n8n / 외부 워크플로우 자동화 도구 서버 구축 - 웹훅 수신 API만 제공
- 실시간 채팅/라이브 기능
- 모바일 앱 (React Native)
- SEO 고도화 및 블로그 기능
- 이메일 알림 시스템 (설계만, 구현은 외부 도구 연동)
- 정산 시스템 (관리자 UI는 있으나 실제 정산 로직은 외부 처리)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| **인증 & 권한** | | | |
| FR-01 | 이메일/비밀번호 회원가입 및 로그인 (Supabase Auth) | High | Pending |
| FR-02 | 카카오 OAuth 소셜 로그인 | High | Pending |
| FR-03 | 3가지 사용자 Role 체계: customer(고객), instructor(강사), admin(어드민) | High | Pending |
| FR-04 | Role 기반 페이지 접근 제어 (미들웨어) | High | Pending |
| FR-05 | 비밀번호 재설정 플로우 | Medium | Pending |
| FR-06 | 회원 탈퇴 (soft delete) | Low | Pending |
| **강의 & 콘텐츠** | | | |
| FR-10 | 강의 목록 조회 (카테고리별 필터, 페이지네이션) | High | Pending |
| FR-11 | 강의 상세 정보 조회 (커리큘럼, 강사, 리뷰 포함) | High | Pending |
| FR-12 | Mux 영상 임베드 재생 (수강 등록된 강의만) | High | Pending |
| FR-13 | 수강 진도율 추적 및 저장 | Medium | Pending |
| FR-14 | 강의 자료 다운로드 (Supabase Storage) | Medium | Pending |
| FR-15 | 무료 체험 강의 (미리보기) 재생 | Medium | Pending |
| **장바구니 & 주문** | | | |
| FR-20 | 장바구니 CRUD (추가, 삭제, 조회) | High | Pending |
| FR-21 | 주문 생성 및 결제 플로우 | High | Pending |
| FR-22 | 쿠폰/할인 코드 적용 | Medium | Pending |
| FR-23 | 주문 완료 시 수강 등록 자동 처리 | High | Pending |
| FR-24 | 환불 요청 및 처리 | Medium | Pending |
| **마이페이지** | | | |
| FR-30 | 내 수강 목록 조회 (진행중, 완료, 전체) | High | Pending |
| FR-31 | 주문/결제 내역 조회 | High | Pending |
| FR-32 | 프로필 정보 수정 (이름, 전화번호, 비밀번호, 마케팅 동의) | Medium | Pending |
| FR-33 | Q&A 작성 및 조회 | Medium | Pending |
| FR-34 | 수강 후기(리뷰) 작성 및 관리 | Medium | Pending |
| **관리자 대시보드** | | | |
| FR-40 | 매출 대시보드 (일별/월별 차트, 카테고리별 분석) | High | Pending |
| FR-41 | 강의 관리 (CRUD, 공개/비공개 토글) | High | Pending |
| FR-42 | 학생 관리 (목록, 수강 이력, 환불 이력) | Medium | Pending |
| FR-43 | 결제/환불 관리 (내역 조회, 환불 승인/거절) | High | Pending |
| FR-44 | 문의/Q&A 관리 (답변 작성) | Medium | Pending |
| FR-45 | 쿠폰/프로모션 관리 (CRUD) | Medium | Pending |
| FR-46 | 강의 콘텐츠(렉처) 관리 (순서, 공개/비공개, 자료 업로드) | Medium | Pending |
| **강사 대시보드** | | | |
| FR-60 | 강사 매출 대시보드 (일별/월별 매출 차트, 강좌별 매출, 정산 미리보기) | High | Pending |
| FR-61 | 강사 프로필 관리 (프로필 이미지, 닉네임, 직함, 소개 수정) | Medium | Pending |
| FR-62 | 강사 내 강의 관리 (목록, 검색, 카테고리 필터, 정렬, 뱃지 설정, 공개/비공개 토글) | High | Pending |
| FR-63 | 강사 내 수강생 관리 (목록, 검색, 필터, 상세보기 모달, 수강생 통계) | Medium | Pending |
| FR-64 | 강사 Q&A 답변 관리 (강좌별 필터, 상태 필터, 좋아요, 답변 작성, 답변 상태 변경) | High | Pending |
| FR-65 | 강사 리뷰 관리 (강좌별 필터, 별점 필터, 정렬, 도움이 됨 토글, 평균 별점) | Medium | Pending |
| FR-66 | 강사 알림 시스템 (새 수강생, Q&A, 리뷰 알림) | Low | Pending |
| **웨비나** | | | |
| FR-70 | 웨비나 목록 표시 (홈페이지 섹션) | Low | Pending |
| FR-71 | 웨비나 상단 배너 (활성 웨비나 표시, 닫기 가능) | Low | Pending |
| FR-72 | 웨비나 신청 기능 | Low | Pending |
| **에러 처리 페이지** | | | |
| FR-80 | 접근 거부 페이지 (/access-denied) - 권한 없는 접근 시 | High | Pending |
| FR-81 | 404 페이지 (/not-found) - 존재하지 않는 페이지 | High | Pending |
| **웹훅 & 확장성** | | | |
| FR-50 | 웹훅 수신 API 엔드포인트 (영상 정보 업데이트) | Medium | Pending |
| FR-51 | 웹훅 이벤트 발신 (주문 완료, 환불 처리 등) | Low | Pending |
| FR-52 | Mux 웹훅 수신 (영상 처리 완료 알림) | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | 페이지 초기 로딩 < 2s (Vercel Edge) | Lighthouse |
| Performance | API 응답 시간 < 500ms | Vercel Analytics |
| Security | Supabase RLS로 모든 테이블 행 수준 접근 제어 | RLS 정책 검증 |
| Security | OWASP Top 10 대응 (XSS, CSRF, SQL Injection 방지) | 코드 리뷰 |
| Security | 민감 정보 서버 사이드 전용 (API Key 노출 방지) | 환경변수 검증 |
| Scalability | 외부 웹훅 연동 가능한 API 구조 | API 설계 검증 |
| Availability | Vercel + Supabase 기반 99.9% 가용성 | 모니터링 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] Supabase Auth로 회원가입/로그인 가능 (이메일 + 카카오)
- [ ] 3 Role(고객, 강사, 어드민) 기반 접근 제어 동작
- [ ] 강의 목록/상세/영상 재생 플로우 정상 동작
- [ ] 장바구니 → 주문 → 결제 → 수강 등록 플로우 정상 동작
- [ ] 마이페이지 모든 기능 실데이터 연동
- [ ] 관리자 대시보드 실데이터 기반 렌더링
- [ ] **강사 대시보드 실데이터 기반 렌더링 (매출, 수강생, Q&A, 리뷰)**
- [ ] 모든 테이블에 RLS 정책 적용
- [ ] Vercel 배포 성공 및 정상 동작

### 4.2 Quality Criteria

- [ ] TypeScript strict mode 오류 없음
- [ ] 빌드 성공 (next build)
- [ ] 주요 API 엔드포인트 정상 응답 확인
- [ ] 모바일 반응형 유지 (기존 UI 깨지지 않음)

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Supabase 무료 티어 한계 (DB 500MB, Auth 50K MAU) | Medium | Low | MVP 단계에서는 충분, 성장 시 Pro 전환 |
| Mux 비용 (영상 인코딩/스트리밍) | Medium | Medium | 초기에는 소수 영상으로 테스트, 비용 모니터링 |
| 카카오 OAuth 설정 복잡도 | Low | Medium | Supabase Auth 공식 문서 기반 설정 |
| 기존 UI 깨짐 (백엔드 연동 시) | High | Medium | 점진적 마이그레이션, 페이지별 독립적 연동 |
| Vercel Serverless 함수 콜드 스타트 | Low | Medium | Edge Runtime 활용, 중요 경로 최적화 |
| 실결제 PG 연동 지연 | Medium | High | MVP에서는 결제 시뮬레이션, PG 연동은 별도 스프린트 |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure | Static sites, portfolios | |
| **Dynamic** | Feature-based modules, BaaS integration | Web apps with backend, SaaS MVPs | **Selected** |
| **Enterprise** | Strict layer separation, DI, microservices | High-traffic systems | |

**선택 근거**: Next.js 풀스택 모노리포 + Supabase BaaS 조합. 별도 백엔드 서버 없이 Next.js API Routes + Supabase를 활용하는 Dynamic 레벨이 적합.

### 6.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Framework | Next.js / React / Vue | **Next.js 16 (App Router)** | 기존 코드베이스 유지, SSR/SSG/Server Actions 지원 |
| Backend | BaaS / Custom Server / Serverless | **Supabase + Next.js API Routes** | 요구사항에 맞는 모노리포 풀스택 구성 |
| Database | Supabase / PlanetScale / Neon | **Supabase (PostgreSQL)** | Auth, Storage, RLS 통합 제공 |
| Auth | NextAuth / Supabase Auth / Clerk | **Supabase Auth** | DB와 통합, RLS 연계, 카카오 OAuth 지원 |
| State Management | Context / Zustand / Redux | **Zustand** | 경량, 장바구니/인증 상태 관리에 적합 |
| API Client | fetch / axios / react-query | **Server Actions + fetch** | Next.js 네이티브 패턴, 별도 클라이언트 불필요 |
| Form Handling | react-hook-form / formik | **react-hook-form + zod** | 기존 코드에 이미 적용됨 |
| Styling | Tailwind / CSS Modules | **Tailwind CSS 4 + shadcn/ui** | 기존 코드 유지 |
| Video Streaming | Mux / Cloudflare Stream / YouTube | **Mux** | 요구사항 명시, HLS 스트리밍, 서명된 URL 지원 |
| Payment | Toss / Stripe / Iamport | **토스페이먼츠** (설계만) | 한국 시장 최적, 카드/간편결제 지원 |

### 6.3 프로젝트 폴더 구조 (목표)

```
richclass/
├── app/                              # Next.js App Router
│   ├── (public)/                     # 비로그인 접근 가능 라우트 그룹
│   │   ├── page.tsx                  # 홈
│   │   ├── courses/
│   │   │   ├── page.tsx              # 강의 목록
│   │   │   └── [id]/page.tsx         # 강의 상세
│   │   ├── login/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (auth)/                       # 로그인 필수 라우트 그룹
│   │   ├── cart/page.tsx
│   │   ├── order/
│   │   │   ├── page.tsx
│   │   │   └── complete/page.tsx
│   │   ├── mypage/
│   │   │   ├── page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── qna/page.tsx
│   │   │   ├── reviews/page.tsx
│   │   │   ├── support/page.tsx
│   │   │   └── withdraw/page.tsx
│   │   └── courses/[id]/watch/[lectureId]/page.tsx
│   ├── (admin)/                      # 어드민 전용 라우트 그룹
│   │   └── admin/
│   │       ├── page.tsx              # 대시보드
│   │       ├── classes/
│   │       ├── students/             # 회원 관리 (memberType 필터)
│   │       ├── payments/
│   │       ├── lectures/
│   │       ├── inquiries/
│   │       └── promotions/
│   ├── (teacher)/                    # 강사 전용 라우트 그룹
│   │   └── teacher/
│   │       ├── page.tsx              # 강사 대시보드 (매출, 정산, Q&A, 수강생)
│   │       ├── profile/page.tsx      # 강사 프로필 관리
│   │       ├── classes/page.tsx      # 내 강의 관리
│   │       ├── students/page.tsx     # 내 수강생 관리
│   │       ├── inquiries/page.tsx    # Q&A 답변 관리
│   │       └── reviews/page.tsx      # 리뷰 관리
│   ├── access-denied/page.tsx        # 접근 거부 페이지
│   ├── not-found.tsx                 # 404 페이지
│   ├── api/                          # API Routes
│   │   ├── auth/
│   │   │   ├── callback/route.ts     # OAuth 콜백
│   │   │   └── signout/route.ts
│   │   ├── courses/
│   │   │   ├── route.ts             # GET: 목록, POST: 생성(admin)
│   │   │   └── [id]/
│   │   │       ├── route.ts         # GET/PUT/DELETE
│   │   │       └── lectures/route.ts
│   │   ├── cart/route.ts            # 장바구니 CRUD
│   │   ├── orders/
│   │   │   ├── route.ts            # 주문 생성/조회
│   │   │   └── [id]/route.ts
│   │   ├── enrollments/route.ts     # 수강 등록
│   │   ├── reviews/route.ts         # 리뷰 CRUD
│   │   ├── qna/route.ts            # Q&A CRUD
│   │   ├── coupons/route.ts        # 쿠폰 CRUD
│   │   ├── admin/
│   │   │   ├── dashboard/route.ts   # 대시보드 통계
│   │   │   ├── students/route.ts    # 회원 관리
│   │   │   ├── payments/route.ts
│   │   │   └── refunds/route.ts
│   │   ├── teacher/                  # 강사 전용 API
│   │   │   ├── dashboard/
│   │   │   │   ├── revenue/route.ts  # 매출 데이터
│   │   │   │   └── settlement/route.ts # 정산 정보
│   │   │   ├── profile/route.ts     # 강사 프로필 CRUD
│   │   │   ├── classes/route.ts     # 내 강의 관리
│   │   │   ├── students/route.ts    # 내 수강생 목록
│   │   │   ├── inquiries/route.ts   # Q&A 답변
│   │   │   └── reviews/route.ts     # 리뷰 조회
│   │   ├── webinars/route.ts        # 웨비나 목록/신청
│   │   └── webhooks/
│   │       ├── mux/route.ts         # Mux 웹훅 수신
│   │       └── external/route.ts    # 외부 워크플로우 웹훅
│   ├── layout.tsx
│   └── globals.css
├── components/                       # 기존 UI 컴포넌트 (보존)
│   ├── ui/                          # shadcn/ui (50 컴포넌트)
│   ├── course-detail/
│   ├── admin-layout.tsx
│   ├── mypage-layout.tsx
│   ├── teacher-layout.tsx           # 강사 대시보드 레이아웃
│   ├── webinar-section.tsx          # 웨비나 섹션
│   ├── webinar-top-banner.tsx       # 웨비나 상단 배너
│   ├── header.tsx
│   └── footer.tsx
├── lib/                              # 유틸리티 & 서비스
│   ├── supabase/
│   │   ├── client.ts                # 브라우저 클라이언트
│   │   ├── server.ts                # 서버 클라이언트
│   │   ├── admin.ts                 # Service Role 클라이언트
│   │   └── middleware.ts            # Auth 미들웨어 헬퍼
│   ├── mux/
│   │   └── client.ts               # Mux API 클라이언트
│   ├── actions/                     # Server Actions
│   │   ├── auth.ts                  # 로그인/회원가입/로그아웃
│   │   ├── courses.ts              # 강의 CRUD
│   │   ├── cart.ts                 # 장바구니
│   │   ├── orders.ts              # 주문/결제
│   │   ├── enrollments.ts         # 수강 등록
│   │   ├── reviews.ts             # 리뷰
│   │   ├── qna.ts                 # Q&A
│   │   ├── admin.ts               # 관리자 액션
│   │   └── teacher.ts             # 강사 전용 액션
│   ├── utils.ts                    # 기존 cn() 유틸리티
│   └── constants.ts               # 상수 정의
├── hooks/                           # Custom Hooks
│   ├── use-auth.ts                 # 인증 상태
│   ├── use-cart.ts                 # 장바구니 상태
│   ├── use-mobile.ts              # 기존
│   └── use-toast.ts               # 기존
├── store/                           # Zustand 상태 관리
│   ├── auth-store.ts
│   └── cart-store.ts
├── types/                           # TypeScript 타입 정의
│   ├── database.ts                 # Supabase 생성 타입
│   ├── course.ts
│   ├── user.ts
│   ├── order.ts
│   └── index.ts
├── middleware.ts                     # Next.js 미들웨어 (Auth 가드)
├── supabase/                        # Supabase 로컬 설정
│   ├── migrations/                  # DB 마이그레이션
│   └── seed.sql                    # 시드 데이터
├── public/                          # 정적 파일 (기존)
├── .env.local                       # 환경 변수
├── package.json
├── next.config.mjs
└── tsconfig.json
```

### 6.4 데이터베이스 스키마 초안

```sql
-- =============================================
-- RichClass DB Schema (Supabase PostgreSQL)
-- =============================================

-- 0. 커스텀 타입
CREATE TYPE user_role AS ENUM ('customer', 'instructor', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'completed', 'cancelled', 'refunded');
CREATE TYPE refund_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE coupon_type AS ENUM ('percent', 'fixed');
CREATE TYPE inquiry_type AS ENUM ('qna', 'support');
CREATE TYPE inquiry_status AS ENUM ('pending', 'answered', 'closed');

-- 1. 사용자 프로필 (Supabase Auth 확장)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  nickname TEXT,                          -- 표시 이름 (강사 닉네임)
  phone TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  marketing_agreed BOOLEAN DEFAULT FALSE,
  join_method TEXT DEFAULT 'email',       -- 'email' | 'kakao'
  -- 강사 전용 필드 (role = 'instructor'일 때 사용)
  instructor_title TEXT,                  -- 강사 직함 (예: 'AI 비즈니스 전문가')
  instructor_bio TEXT,                    -- 강사 소개
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ  -- soft delete
);

-- 2. 카테고리
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,          -- 'AI/자동화', '유튜브', '마케팅', '디자인', '커머스', 'SNS'
  slug TEXT NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. 강의 (Course)
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL REFERENCES profiles(id),
  category_id INT NOT NULL REFERENCES categories(id),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  level TEXT NOT NULL DEFAULT 'beginner',   -- 'beginner' | 'intermediate' | 'advanced' | 'all'
  price INT NOT NULL DEFAULT 0,              -- 원 단위
  original_price INT,                        -- 할인 전 가격
  badge TEXT,                                -- '베스트셀러', '신규', 'HOT' 등
  badge_color TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  total_duration TEXT,                       -- '32시간 15분'
  highlights TEXT[],                         -- 강의 하이라이트
  target_audience TEXT[],                    -- 대상 수강생
  requirements TEXT[],                       -- 수강 전 필요사항
  rating_avg NUMERIC(3,2) DEFAULT 0,
  rating_count INT DEFAULT 0,
  student_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. 강의 섹션 (Section)
CREATE TABLE course_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. 강의 영상 (Lecture)
CREATE TABLE lectures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration TEXT,                              -- '12:30'
  is_free BOOLEAN NOT NULL DEFAULT FALSE,    -- 무료 미리보기 여부
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  -- Mux 영상 정보
  mux_asset_id TEXT,
  mux_playback_id TEXT,
  mux_upload_status TEXT DEFAULT 'waiting',  -- 'waiting' | 'processing' | 'ready' | 'error'
  -- 강의 자료
  materials_url TEXT,                         -- Supabase Storage URL
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. 수강 등록 (Enrollment)
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  order_id UUID,  -- FK는 orders 테이블 생성 후 추가
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- 7. 수강 진도 (Progress)
CREATE TABLE lecture_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  lecture_id UUID NOT NULL REFERENCES lectures(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  last_position INT DEFAULT 0,               -- 마지막 재생 위치 (초)
  watched_duration INT DEFAULT 0,            -- 총 시청 시간 (초)
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lecture_id)
);

-- 8. 장바구니 (Cart)
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 9. 쿠폰 (Coupon)
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type coupon_type NOT NULL DEFAULT 'percent',
  discount_value INT NOT NULL,              -- percent: 1~100, fixed: 원 단위
  min_purchase INT DEFAULT 0,               -- 최소 구매 금액
  max_discount INT,                         -- 최대 할인 금액 (percent 타입용)
  usage_limit INT,                          -- 총 사용 가능 횟수
  usage_count INT DEFAULT 0,
  applicable_course_ids UUID[],             -- NULL이면 전체 적용
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. 주문 (Order)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  order_number TEXT NOT NULL UNIQUE,         -- 주문번호 (표시용)
  total_amount INT NOT NULL,                 -- 총 결제 금액
  discount_amount INT DEFAULT 0,             -- 할인 금액
  coupon_id UUID REFERENCES coupons(id),
  payment_method TEXT,                       -- 'card' | 'kakao' | 'naver' | 'toss' | 'bank'
  status order_status NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. 주문 항목 (Order Item)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id),
  price INT NOT NULL,                        -- 주문 시점 강의 가격
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- enrollments에 order_id FK 추가
ALTER TABLE enrollments
  ADD CONSTRAINT fk_enrollment_order
  FOREIGN KEY (order_id) REFERENCES orders(id);

-- 12. 환불 (Refund)
CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  amount INT NOT NULL,
  reason TEXT,
  status refund_status NOT NULL DEFAULT 'pending',
  admin_note TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. 리뷰 (Review)
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 14. Q&A / 문의 (Inquiry)
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  course_id UUID REFERENCES courses(id),     -- NULL이면 일반 문의
  lecture_id UUID REFERENCES lectures(id),   -- NULL이면 강의 전체 질문
  type inquiry_type NOT NULL DEFAULT 'qna',
  title TEXT,
  content TEXT NOT NULL,
  status inquiry_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Q&A 답변 (Inquiry Reply)
CREATE TABLE inquiry_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),  -- 답변자 (강사/관리자)
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. 알림 (Notification)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  type TEXT NOT NULL,                        -- 'notice' | 'qna_reply' | 'promotion' | 'order'
  title TEXT NOT NULL,
  content TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  link TEXT,                                 -- 클릭 시 이동할 경로
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. 웨비나 (Webinar)
CREATE TABLE webinars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  speaker TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL,              -- '14:00'
  spots INT NOT NULL DEFAULT 100,        -- 총 정원
  spots_left INT NOT NULL DEFAULT 100,   -- 잔여 정원
  tag TEXT,                              -- 'LIVE' | '무료' | '마감임박'
  tag_color TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  link TEXT,                             -- 참여 링크
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. 웨비나 신청 (Webinar Registration)
CREATE TABLE webinar_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webinar_id UUID NOT NULL REFERENCES webinars(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(webinar_id, user_id)
);

-- 19. 웹훅 로그 (Webhook Log)
CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,                      -- 'mux' | 'external' | 'payment'
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',   -- 'received' | 'processed' | 'failed'
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_lectures_course ON lectures(course_id);
CREATE INDEX idx_lectures_section ON lectures(section_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_reviews_course ON reviews(course_id);
CREATE INDEX idx_inquiries_course ON inquiries(course_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_lecture_progress_user ON lecture_progress(user_id, course_id);
CREATE INDEX idx_webinars_active ON webinars(is_active, event_date);
CREATE INDEX idx_webinar_registrations_user ON webinar_registrations(user_id);

-- =============================================
-- RLS Policies (핵심 예시)
-- =============================================

-- profiles: 본인만 수정, 어드민은 전체 조회
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- courses: 공개 강의는 누구나 조회, 강사/어드민만 생성/수정
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published courses" ON courses FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Instructors can manage own courses" ON courses FOR ALL USING (
  auth.uid() = instructor_id
);
CREATE POLICY "Admin can manage all courses" ON courses FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- enrollments: 본인 수강 내역만 조회
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own enrollments" ON enrollments FOR SELECT USING (auth.uid() = user_id);

-- cart_items: 본인 장바구니만 접근
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- orders: 본인 주문만 조회
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin can view all orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- reviews: 강사는 자기 강의 리뷰 조회 가능
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "Users can manage own reviews" ON reviews FOR ALL USING (auth.uid() = user_id);

-- inquiries: 강사는 자기 강의 Q&A 조회/답변 가능
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own inquiries" ON inquiries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Instructors can view course inquiries" ON inquiries FOR SELECT USING (
  EXISTS (SELECT 1 FROM courses WHERE courses.id = inquiries.course_id AND courses.instructor_id = auth.uid())
);

-- webinars: 누구나 조회, 어드민만 관리
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active webinars" ON webinars FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admin can manage webinars" ON webinars FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
```

---

## 7. Convention Prerequisites

### 7.1 Existing Project Conventions

- [x] TypeScript 설정 (`tsconfig.json`) - strict mode
- [x] Tailwind CSS 4 설정 (globals.css)
- [x] shadcn/ui 설정 (components.json - new-york style)
- [x] `cn()` 유틸리티 (clsx + tailwind-merge)
- [ ] `CLAUDE.md` 코딩 컨벤션 - 없음 (생성 필요)
- [ ] ESLint 설정 - 기본만 있음
- [ ] Prettier 설정 - 없음

### 7.2 Conventions to Define/Verify

| Category | Current State | To Define | Priority |
|----------|---------------|-----------|:--------:|
| **Naming** | PascalCase 컴포넌트, kebab-case 파일명 | Server Action 네이밍, API Route 네이밍 규칙 | High |
| **Folder structure** | 기존 flat 구조 | Route Group 기반 리팩토링 | High |
| **Import order** | 없음 | React → Next → 3rd party → local 순서 | Medium |
| **Environment variables** | 없음 | Supabase, Mux 키 정의 | High |
| **Error handling** | 없음 | Server Action 에러 패턴, API 응답 포맷 | High |

### 7.3 Environment Variables Needed

| Variable | Purpose | Scope | To Be Created |
|----------|---------|-------|:-------------:|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | Client | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 익명 키 | Client | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 롤 키 (관리자용) | Server | Yes |
| `MUX_TOKEN_ID` | Mux API 토큰 ID | Server | Yes |
| `MUX_TOKEN_SECRET` | Mux API 토큰 시크릿 | Server | Yes |
| `MUX_SIGNING_KEY` | Mux 서명된 URL 키 | Server | Yes |
| `MUX_SIGNING_KEY_PRIVATE` | Mux 서명 비밀키 | Server | Yes |
| `WEBHOOK_SECRET` | 웹훅 검증 시크릿 | Server | Yes |

### 7.4 Pipeline Integration

| Phase | Status | Description |
|-------|:------:|-------------|
| Phase 1 (Schema) | **이 문서에 포함** | DB 스키마 초안 (섹션 6.4) |
| Phase 2 (Convention) | 미완료 | CLAUDE.md 컨벤션 정의 필요 |
| Phase 3 (Mockup) | **완료** | 기존 UI 프로토타입 |
| Phase 4 (API) | 미완료 | API Routes + Server Actions 구현 필요 |
| Phase 5 (Design System) | **완료** | shadcn/ui + Tailwind CSS 4 |
| Phase 6 (UI Integration) | 미완료 | 프론트엔드-백엔드 연동 필요 |
| Phase 7 (SEO/Security) | 미완료 | RLS, 미들웨어 가드 구현 필요 |
| Phase 8 (Review) | 미완료 | |
| Phase 9 (Deployment) | 부분 완료 | Vercel 배포 경험 있음, Supabase 연동 필요 |

---

## 8. Implementation Roadmap

### Sprint 1: Foundation (기반 구축)
1. [ ] Supabase 프로젝트 생성 및 DB 스키마 마이그레이션 (19개 테이블)
2. [ ] Supabase 클라이언트 설정 (`lib/supabase/`)
3. [ ] Next.js 미들웨어 + Auth 가드 구현 (3 Role 분기)
4. [ ] Route Group 리팩토링 `(public)`, `(auth)`, `(admin)`, `(teacher)`
5. [ ] TypeScript 타입 정의 (`types/database.ts` 자동 생성)

### Sprint 2: Authentication (인증)
6. [ ] 이메일/비밀번호 회원가입/로그인 구현
7. [ ] 카카오 OAuth 연동
8. [ ] 3 Role(customer, instructor, admin) 체계 구현
9. [ ] 비밀번호 재설정 플로우
10. [ ] 프로필 관리 (조회/수정) - 고객 + 강사 프로필

### Sprint 3: Course & Content (강의/콘텐츠)
11. [ ] 강의 목록 API + 프론트 연동 (카테고리 필터, 페이지네이션)
12. [ ] 강의 상세 API + 프론트 연동
13. [ ] Mux 영상 임베드 설정 + 영상 플레이어 연동
14. [ ] 수강 진도 추적 API
15. [ ] 관리자: 강의/렉처 CRUD

### Sprint 4: Commerce (커머스)
16. [ ] 장바구니 CRUD API + 프론트 연동
17. [ ] 주문 생성 + 결제 플로우 (시뮬레이션)
18. [ ] 주문 완료 시 수강 등록 처리
19. [ ] 쿠폰 시스템 구현
20. [ ] 환불 요청/처리 API

### Sprint 5: Community & Admin (커뮤니티/관리자)
21. [ ] Q&A / 문의 CRUD + 답변
22. [ ] 리뷰 CRUD + 평점 집계
23. [ ] 알림 시스템
24. [ ] 관리자 대시보드 실데이터 연동 (매출/회원/통계)
25. [ ] 관리자 결제/환불/회원 관리 연동

### Sprint 6: Teacher Dashboard (강사 대시보드)
26. [ ] 강사 매출 대시보드 연동 (일별/월별 차트, 강좌별 매출, 정산)
27. [ ] 강사 프로필 관리 연동 (이미지 업로드, 직함, 소개)
28. [ ] 강사 내 강의 관리 연동 (CRUD, 뱃지, 공개/비공개)
29. [ ] 강사 내 수강생 관리 연동 (목록, 상세, 통계)
30. [ ] 강사 Q&A 답변 관리 연동 (필터, 좋아요, 답변 작성)
31. [ ] 강사 리뷰 관리 연동 (필터, 정렬, 도움이 됨)

### Sprint 7: Webhook & Polish (웹훅/마무리)
32. [ ] Mux 웹훅 수신 엔드포인트 (영상 처리 상태 업데이트)
33. [ ] 외부 워크플로우 웹훅 엔드포인트 (n8n 등 연동 대비)
34. [ ] 웨비나 시스템 (목록, 배너, 신청)
35. [ ] 시드 데이터 작성 (기존 Mock 데이터 마이그레이션)
36. [ ] RLS 정책 전수 검증
37. [ ] Vercel 재배포 및 Supabase 연동 확인

---

## 9. Next Steps

1. [ ] Design 문서 작성 (`/pdca design richclass-fullstack-platform`)
2. [ ] Supabase 프로젝트 생성 및 환경 변수 설정
3. [ ] Sprint 1부터 구현 시작

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-27 | Initial draft - 프론트엔드 분석 기반 전체 계획 수립 | AI (Claude) |
| 0.2 | 2026-02-28 | 강사(Teacher) 대시보드 6페이지 추가, 웨비나 시스템, 에러 페이지 반영. DB 스키마 19→21 테이블, FR 52→65개, 스프린트 6→7 확장 | AI (Claude) |
