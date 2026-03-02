# RichClass Fullstack Platform Design Document

> **Summary**: Supabase 기반 풀스택 온라인 강의 플랫폼 상세 설계 - 인증, API, DB, 영상, 결제 전 영역
>
> **Project**: RichClass (No.1 온라인 수익화 플랫폼)
> **Version**: 0.1.0
> **Author**: AI (Claude)
> **Date**: 2026-02-28
> **Status**: Draft
> **Planning Doc**: [richclass-fullstack-platform.plan.md](../01-plan/features/richclass-fullstack-platform.plan.md)

### Pipeline References

| Phase | Document | Status |
|-------|----------|--------|
| Phase 1 | Schema Definition (Plan 문서 섹션 6.4) | Included |
| Phase 2 | Coding Conventions (이 문서 섹션 10) | Draft |
| Phase 3 | Mockup (기존 프론트엔드 UI 32페이지) | Complete |
| Phase 4 | API Spec (이 문서 섹션 4) | Draft |

---

## 1. Overview

### 1.1 Design Goals

1. **기존 UI 보존**: 32개 페이지, 77개 컴포넌트를 깨뜨리지 않고 점진적으로 백엔드 연동
2. **Supabase 네이티브 활용**: Auth, RLS, Storage, Realtime을 최대한 활용하여 커스텀 코드 최소화
3. **Server-first 패턴**: Next.js Server Components + Server Actions 우선, 클라이언트 코드 최소화
4. **3 Role 보안**: customer/instructor/admin 역할 기반 완전한 접근 제어
5. **웹훅 확장성**: 외부 워크플로우(n8n 등)와 Mux 이벤트를 수신할 수 있는 API 구조

### 1.2 Design Principles

- **점진적 마이그레이션**: 페이지별로 독립적으로 Mock → 실데이터 전환 (한 페이지가 깨져도 다른 페이지 영향 없음)
- **서버 사이드 보안**: 민감한 로직은 모두 Server Actions/API Routes에서 처리, 클라이언트에 Secret 노출 금지
- **Supabase RLS 우선**: 가능한 모든 데이터 접근 제어를 RLS로 처리하여 API 레벨 가드와 이중 보안
- **타입 안전성**: `supabase gen types`로 자동 생성된 DB 타입을 전체 코드에서 사용

---

## 2. Architecture

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ React Pages  │  │   Zustand    │  │  shadcn/ui + TW CSS  │  │
│  │ (32 pages)   │  │  (cart/auth) │  │  (77 components)     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────┘  │
│         │                  │                                     │
└─────────┼──────────────────┼─────────────────────────────────────┘
          │                  │
          ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js Server (Vercel)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Server     │  │    API       │  │     Middleware        │  │
│  │  Components  │  │   Routes     │  │  (Auth Guard + Role)  │  │
│  │  + Actions   │  │  (/api/*)    │  │                      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────┘  │
│         │                  │                                     │
└─────────┼──────────────────┼─────────────────────────────────────┘
          │                  │
          ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Supabase Cloud                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │   Auth   │  │ Database │  │ Storage  │  │   Realtime   │   │
│  │ (3 Role) │  │ (Postgres│  │ (Files)  │  │  (Optional)  │   │
│  │ +Kakao   │  │  +RLS)   │  │          │  │              │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────┘
          │                                     │
          ▼                                     ▼
┌──────────────────┐                 ┌──────────────────┐
│    Mux Video     │                 │  External Tools  │
│  (HLS Streaming) │                 │  (n8n Webhook)   │
│  - Asset Upload  │                 │  - 이메일 알림    │
│  - Signed URLs   │                 │  - 영상 정보 연동  │
│  - Webhook       │                 │  - 정산 처리      │
└──────────────────┘                 └──────────────────┘
```

### 2.2 Data Flow Patterns

#### Pattern A: Server Component 데이터 페칭 (읽기 전용 페이지)
```
Page (RSC) → createServerClient() → supabase.from('table').select() → Render
```

#### Pattern B: Server Action (폼 제출, 데이터 변경)
```
Client Form → Server Action → supabase (server) → revalidatePath() → UI 갱신
```

#### Pattern C: API Route (외부 연동, 웹훅)
```
External Service → POST /api/webhooks/mux → Verify Signature → DB Update
```

#### Pattern D: 클라이언트 상호작용 (장바구니, 좋아요)
```
Client Event → Zustand (optimistic) → Server Action → DB → Confirm/Rollback
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| Pages (RSC) | Supabase Server Client | 데이터 조회 |
| Server Actions | Supabase Server Client | 데이터 변경 |
| API Routes | Supabase Admin Client | 웹훅, 관리자 작업 |
| Middleware | Supabase Middleware Helper | 세션 갱신, Role 체크 |
| Zustand Store | Server Actions | 장바구니/인증 상태 동기화 |
| Mux Player | Mux Embed SDK | 영상 재생 |

---

## 3. Data Model

### 3.1 Entity Relationship Diagram

```
[profiles] 1 ──── N [courses]          (instructor_id)
    │                   │
    │                   ├── 1 ──── N [course_sections]
    │                   │               └── 1 ──── N [lectures]
    │                   │                              │
    │                   ├── 1 ──── N [enrollments] ◄───┤ (progress)
    │                   │               │              │
    │                   ├── 1 ──── N [reviews]    [lecture_progress]
    │                   │
    │                   ├── 1 ──── N [inquiries]
    │                   │               └── 1 ──── N [inquiry_replies]
    │                   │
    │                   └── N ──── N [order_items] ──── N [orders]
    │                                                      │
    │                                                      └── 1 ──── N [refunds]
    ├── 1 ──── N [cart_items] ──── 1 [courses]
    ├── 1 ──── N [notifications]
    └── 1 ──── N [webinar_registrations] ──── 1 [webinars]

[coupons] ──── N [orders] (coupon_id)
[categories] 1 ──── N [courses] (category_id)
[webhook_logs] (독립)
```

### 3.2 Core TypeScript Types

```typescript
// types/database.ts - supabase gen types typescript 으로 자동 생성
// 아래는 수동 작성하는 확장 타입들

// === Auth & User ===
export type UserRole = 'customer' | 'instructor' | 'admin'

export interface Profile {
  id: string
  email: string
  name: string | null
  nickname: string | null
  phone: string | null
  avatar_url: string | null
  role: UserRole
  marketing_agreed: boolean
  join_method: 'email' | 'kakao'
  instructor_title: string | null   // instructor 전용
  instructor_bio: string | null     // instructor 전용
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// === Course ===
export interface CourseWithInstructor {
  id: string
  title: string
  description: string | null
  image_url: string | null
  level: 'beginner' | 'intermediate' | 'advanced' | 'all'
  price: number
  original_price: number | null
  badge: string | null
  badge_color: string | null
  is_published: boolean
  total_duration: string | null
  highlights: string[]
  target_audience: string[]
  requirements: string[]
  rating_avg: number
  rating_count: number
  student_count: number
  category: { id: number; name: string; slug: string }
  instructor: Pick<Profile, 'id' | 'name' | 'nickname' | 'avatar_url' | 'instructor_title' | 'instructor_bio'>
  sections?: CourseSectionWithLectures[]
}

export interface CourseSectionWithLectures {
  id: string
  title: string
  sort_order: number
  lectures: LectureBasic[]
}

export interface LectureBasic {
  id: string
  title: string
  duration: string | null
  is_free: boolean
  is_published: boolean
  sort_order: number
}

export interface LectureWithMux extends LectureBasic {
  mux_playback_id: string | null
  mux_upload_status: 'waiting' | 'processing' | 'ready' | 'error'
  materials_url: string | null
}

// === Commerce ===
export interface CartItemWithCourse {
  id: string
  course: Pick<CourseWithInstructor, 'id' | 'title' | 'image_url' | 'price' | 'original_price' | 'instructor'>
  added_at: string
}

export interface OrderWithItems {
  id: string
  order_number: string
  total_amount: number
  discount_amount: number
  payment_method: string | null
  status: 'pending' | 'completed' | 'cancelled' | 'refunded'
  paid_at: string | null
  items: {
    id: string
    course: Pick<CourseWithInstructor, 'id' | 'title' | 'image_url'>
    price: number
  }[]
  coupon?: { code: string; name: string } | null
  created_at: string
}

// === Community ===
export interface ReviewWithAuthor {
  id: string
  rating: number
  content: string | null
  helpful_count: number
  author: Pick<Profile, 'id' | 'name' | 'nickname' | 'avatar_url'>
  course: Pick<CourseWithInstructor, 'id' | 'title' | 'image_url'>
  created_at: string
}

export interface InquiryWithReplies {
  id: string
  type: 'qna' | 'support'
  title: string | null
  content: string
  status: 'pending' | 'answered' | 'closed'
  author: Pick<Profile, 'id' | 'name' | 'nickname' | 'avatar_url'>
  course?: Pick<CourseWithInstructor, 'id' | 'title'> | null
  lecture?: Pick<LectureBasic, 'id' | 'title'> | null
  replies: InquiryReply[]
  created_at: string
}

export interface InquiryReply {
  id: string
  content: string
  author: Pick<Profile, 'id' | 'name' | 'nickname' | 'avatar_url' | 'role'>
  created_at: string
}

// === Teacher Dashboard ===
export interface TeacherRevenueData {
  date: string
  revenue: number
  refund: number
}

export interface TeacherSettlement {
  total_revenue: number
  total_refund: number
  platform_fee: number     // 20%
  net_settlement: number
}

export interface TeacherStudentDetail {
  id: string
  name: string
  email: string
  avatar_url: string | null
  join_date: string
  join_method: string
  total_spent: number
  status: 'active' | 'inactive'
  courses: {
    id: string
    title: string
    progress: number
    last_access: string
    enroll_date: string
    price: number
    is_refunded: boolean
  }[]
}
```

### 3.3 Database Schema

> Plan 문서 섹션 6.4에 전체 SQL 정의 (21개 테이블). 여기서는 핵심 설계 결정만 기술.

**핵심 설계 결정:**

| 결정 | 선택 | 근거 |
|------|------|------|
| profiles 분리 vs auth.users 확장 | **별도 profiles 테이블** | Supabase Auth는 메타데이터 제한적, Role/프로필 확장 필요 |
| 강사 정보 별도 테이블 vs profiles 통합 | **profiles에 통합** (nullable 필드) | 강사 필드 3개뿐, 별도 테이블 불필요 |
| 주문-강의 관계 | **order_items 중간 테이블** | 한 주문에 여러 강의, 주문 시점 가격 스냅샷 필요 |
| 리뷰 중복 방지 | **UNIQUE(user_id, course_id)** | 한 유저가 한 강의에 1개 리뷰만 |
| Q&A vs 고객문의 | **inquiries 통합** + type ENUM | UI 구조가 유사, 강좌 연결 여부로 구분 |
| Soft delete | **profiles만 deleted_at** | 회원 탈퇴 시 데이터 보존, 나머지는 Hard delete |
| 매출/정산 집계 | **실시간 쿼리 (View/Function)** | 별도 테이블 불필요, DB 함수로 처리 |

---

## 4. API Specification

### 4.1 API 설계 원칙

1. **Server Actions 우선**: 폼 제출, CRUD는 Server Actions 사용 (별도 REST 엔드포인트 불필요)
2. **API Routes**: 외부 연동(웹훅), 파일 업로드, 복잡한 조회에만 사용
3. **인증**: 모든 API는 Supabase Auth 세션 기반, `createServerClient()`로 인증된 클라이언트 사용
4. **에러 응답**: 일관된 `{ error: { code, message } }` 포맷

### 4.2 Server Actions

| Action | File | Description | Auth | Role |
|--------|------|-------------|------|------|
| **Auth** | | | | |
| `signUp` | `lib/actions/auth.ts` | 이메일 회원가입 + profiles 생성 | Public | - |
| `signIn` | `lib/actions/auth.ts` | 이메일 로그인 | Public | - |
| `signOut` | `lib/actions/auth.ts` | 로그아웃 | Required | All |
| `resetPassword` | `lib/actions/auth.ts` | 비밀번호 재설정 이메일 발송 | Public | - |
| `updatePassword` | `lib/actions/auth.ts` | 비밀번호 변경 | Required | All |
| `updateProfile` | `lib/actions/auth.ts` | 프로필 수정 (이름, 전화, 마케팅동의) | Required | All |
| `withdrawAccount` | `lib/actions/auth.ts` | 회원 탈퇴 (soft delete) | Required | All |
| **Courses** | | | | |
| `getCourses` | `lib/actions/courses.ts` | 강의 목록 (필터, 페이지네이션) | Public | - |
| `getCourseById` | `lib/actions/courses.ts` | 강의 상세 (커리큘럼, 강사, 리뷰 포함) | Public | - |
| `createCourse` | `lib/actions/courses.ts` | 강의 생성 | Required | admin, instructor |
| `updateCourse` | `lib/actions/courses.ts` | 강의 수정 | Required | admin, instructor(own) |
| `deleteCourse` | `lib/actions/courses.ts` | 강의 삭제 | Required | admin, instructor(own) |
| `toggleCourseVisibility` | `lib/actions/courses.ts` | 공개/비공개 토글 | Required | admin, instructor(own) |
| `updateCourseBadge` | `lib/actions/courses.ts` | 뱃지 변경 | Required | admin, instructor(own) |
| **Lectures** | | | | |
| `getLectureForPlayer` | `lib/actions/courses.ts` | 영상 재생 정보 (Mux playback ID) | Required | enrolled |
| `updateLectureProgress` | `lib/actions/courses.ts` | 진도율 업데이트 | Required | enrolled |
| **Cart** | | | | |
| `getCartItems` | `lib/actions/cart.ts` | 장바구니 조회 | Required | customer |
| `addToCart` | `lib/actions/cart.ts` | 장바구니 추가 | Required | customer |
| `removeFromCart` | `lib/actions/cart.ts` | 장바구니 삭제 | Required | customer |
| **Orders** | | | | |
| `createOrder` | `lib/actions/orders.ts` | 주문 생성 (장바구니 → 주문) | Required | customer |
| `getMyOrders` | `lib/actions/orders.ts` | 내 주문 목록 | Required | customer |
| `getOrderDetail` | `lib/actions/orders.ts` | 주문 상세 | Required | customer(own) |
| `applyCoupon` | `lib/actions/orders.ts` | 쿠폰 적용 (유효성 검증) | Required | customer |
| `completePayment` | `lib/actions/orders.ts` | 결제 완료 처리 + 수강 등록 | Required | customer |
| `requestRefund` | `lib/actions/orders.ts` | 환불 요청 | Required | customer |
| **Reviews** | | | | |
| `createReview` | `lib/actions/reviews.ts` | 리뷰 작성 | Required | enrolled |
| `updateReview` | `lib/actions/reviews.ts` | 리뷰 수정 | Required | customer(own) |
| `deleteReview` | `lib/actions/reviews.ts` | 리뷰 삭제 | Required | customer(own) |
| `toggleHelpful` | `lib/actions/reviews.ts` | 도움이 됨 토글 | Required | customer |
| **QnA** | | | | |
| `createInquiry` | `lib/actions/qna.ts` | Q&A/문의 작성 | Required | customer |
| `createReply` | `lib/actions/qna.ts` | 답변 작성 | Required | instructor, admin |
| `toggleInquiryLike` | `lib/actions/qna.ts` | 좋아요 토글 | Required | All |
| **Admin** | | | | |
| `getAdminDashboard` | `lib/actions/admin.ts` | 대시보드 통계 (매출, 학생, 강좌) | Required | admin |
| `getAdminStudents` | `lib/actions/admin.ts` | 회원 목록 (memberType 필터) | Required | admin |
| `getAdminPayments` | `lib/actions/admin.ts` | 결제 내역 | Required | admin |
| `processRefund` | `lib/actions/admin.ts` | 환불 승인/거절 | Required | admin |
| `manageCoupon` | `lib/actions/admin.ts` | 쿠폰 CRUD | Required | admin |
| **Teacher** | | | | |
| `getTeacherDashboard` | `lib/actions/teacher.ts` | 강사 대시보드 (매출 차트, 정산, 최근 Q&A, 신규 수강생) | Required | instructor |
| `updateTeacherProfile` | `lib/actions/teacher.ts` | 강사 프로필 수정 (이미지, 닉네임, 직함, 소개) | Required | instructor |
| `getTeacherCourses` | `lib/actions/teacher.ts` | 내 강의 목록 (필터, 정렬, 페이지네이션) | Required | instructor |
| `getTeacherStudents` | `lib/actions/teacher.ts` | 내 수강생 목록 | Required | instructor |
| `getTeacherStudentDetail` | `lib/actions/teacher.ts` | 수강생 상세 (수강 이력, 진도, 결제) | Required | instructor |
| `getTeacherInquiries` | `lib/actions/teacher.ts` | 내 강의 Q&A 목록 (필터, 정렬) | Required | instructor |
| `replyToInquiry` | `lib/actions/teacher.ts` | Q&A 답변 작성 | Required | instructor |
| `getTeacherReviews` | `lib/actions/teacher.ts` | 내 강의 리뷰 목록 (별점 필터, 강좌 필터) | Required | instructor |
| `getTeacherRevenue` | `lib/actions/teacher.ts` | 매출 데이터 (일별/월별) | Required | instructor |
| `getTeacherSettlement` | `lib/actions/teacher.ts` | 정산 정보 | Required | instructor |

### 4.3 API Routes (REST Endpoints)

외부 연동 및 Server Action으로 처리 불가한 경우에만 사용.

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/auth/callback` | OAuth 콜백 (카카오) | Public |
| POST | `/api/auth/signout` | 로그아웃 (쿠키 삭제) | Required |
| POST | `/api/webhooks/mux` | Mux 영상 처리 완료 웹훅 | Mux Signature |
| POST | `/api/webhooks/external` | 외부 워크플로우 웹훅 (영상 정보 업데이트 등) | Webhook Secret |
| POST | `/api/upload/avatar` | 프로필 이미지 업로드 (Supabase Storage) | Required |
| POST | `/api/upload/material` | 강의 자료 업로드 | instructor, admin |

### 4.4 Webhook Endpoint Design

#### Mux Webhook (`/api/webhooks/mux`)
```typescript
// 수신 이벤트 타입
type MuxWebhookEvent =
  | 'video.asset.ready'      // 영상 인코딩 완료 → lectures.mux_upload_status = 'ready'
  | 'video.asset.errored'    // 인코딩 실패 → lectures.mux_upload_status = 'error'
  | 'video.upload.created'   // 업로드 시작

// 처리 플로우
POST /api/webhooks/mux
  → Verify Mux-Signature header
  → Parse event type & payload
  → Match asset_id to lectures.mux_asset_id
  → Update lectures.mux_upload_status & mux_playback_id
  → Log to webhook_logs
  → Return 200
```

#### External Webhook (`/api/webhooks/external`)
```typescript
// n8n 등 외부 도구에서 호출하는 범용 웹훅
POST /api/webhooks/external
Headers: { "X-Webhook-Secret": "WEBHOOK_SECRET" }
Body: {
  "event": "lecture.video_updated",
  "data": {
    "lecture_id": "uuid",
    "mux_asset_id": "string",
    "mux_playback_id": "string",
    "status": "ready"
  }
}

// 처리 플로우
  → Verify X-Webhook-Secret header
  → Parse event type
  → Route to handler (switch/case)
  → Update DB accordingly
  → Log to webhook_logs
  → Return 200
```

### 4.5 Error Response Format

```typescript
// 성공 응답 (Server Action)
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } }

// 에러 코드 체계
const ErrorCodes = {
  // Auth
  AUTH_INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다',
  AUTH_EMAIL_EXISTS: '이미 등록된 이메일입니다',
  AUTH_UNAUTHORIZED: '로그인이 필요합니다',
  AUTH_FORBIDDEN: '접근 권한이 없습니다',
  // Validation
  VALIDATION_FAILED: '입력값이 올바르지 않습니다',
  // Course
  COURSE_NOT_FOUND: '강의를 찾을 수 없습니다',
  COURSE_NOT_ENROLLED: '수강 등록이 필요합니다',
  // Order
  ORDER_ALREADY_PURCHASED: '이미 구매한 강의입니다',
  COUPON_INVALID: '유효하지 않은 쿠폰입니다',
  COUPON_EXPIRED: '만료된 쿠폰입니다',
  REFUND_NOT_ELIGIBLE: '환불 대상이 아닙니다',
} as const
```

---

## 5. Authentication & Authorization

### 5.1 Auth Flow

> **인증 방식**: Kakao OAuth만 사용 (이메일 가입 비활성화)

```
┌─────────────────────────────────────────────────────────────┐
│                     Authentication Flows                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [카카오 OAuth 로그인/가입]                                    │
│  1. '카카오로 시작하기' 클릭                                    │
│  2. supabase.auth.signInWithOAuth({ provider: 'kakao' })    │
│  3. 카카오 인증 → /api/auth/callback 리다이렉트                 │
│  4. 콜백에서 세션 교환 + profiles 체크                          │
│     → 프로필 없으면 INSERT (role: 'customer', join_method: 'kakao') │
│     → 프로필 있으면 UPDATE (카카오 메타데이터만 갱신, role 보존)    │
│  5. Role 기반 리다이렉트:                                     │
│     - customer → / (홈)                                     │
│     - instructor → /teacher                                 │
│     - admin → /admin                                        │
│                                                             │
│  [로그인 상태 접근 제어]                                       │
│  - 로그인 상태에서 /login, /signup 접근 → / 홈으로 리다이렉트     │
│  - Middleware에서 세션 감지 후 자동 리다이렉트                    │
│                                                             │
│  [Header 로그인 상태 표시]                                     │
│  - Zustand auth store 기반 (variant prop 없이 모든 페이지 동일)  │
│  - 로그인 시: 닉네임 표시 (nickname > name > role 기본값)        │
│  - 비로그인 시: 로그인/가입하기 버튼 표시                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Supabase Auth Trigger (profiles 자동 생성)

```sql
-- 회원가입 시 profiles 자동 생성 (카카오 메타데이터 전체 매핑)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, email, name, nickname, avatar_url, role, join_method,
    birthyear, birthday, birthday_type, gender
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    COALESCE(NEW.raw_user_meta_data->>'preferred_username',
             NEW.raw_user_meta_data->>'user_name',
             NEW.raw_user_meta_data->>'nickname'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url',
             NEW.raw_user_meta_data->>'picture'),
    'customer'::public.user_role,
    CASE WHEN NEW.raw_app_meta_data->>'provider' = 'kakao' THEN 'kakao' ELSE 'email' END,
    NEW.raw_user_meta_data->>'birthyear',
    NEW.raw_user_meta_data->>'birthday',
    NEW.raw_user_meta_data->>'birthday_type',
    NEW.raw_user_meta_data->>'gender'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

> **주요 변경사항**:
> - `SET search_path = public` 추가 (스키마 검색 경로 명시)
> - `'customer'::public.user_role` 안전한 타입 캐스팅
> - 카카오 메타데이터 전체 매핑 (nickname, avatar_url, birthyear 등)
> - `ON CONFLICT (id) DO NOTHING` 중복 방지

### 5.2.1 OAuth Callback 프로필 동기화

트리거는 `INSERT ON auth.users` 시에만 발동합니다. 기존 유저가 재로그인할 때는 콜백에서 직접 프로필을 동기화합니다:

```typescript
// app/api/auth/callback/route.ts
// 카카오 OAuth 프로필 동기화 (프로필 없으면 생성, 있으면 메타데이터만 갱신)
if (user && user.app_metadata?.provider === 'kakao') {
  const meta = user.user_metadata
  const profileData = { email, name, nickname, avatar_url, birthyear, ... }

  const { data: existingProfile } = await supabase
    .from('profiles').select('id').eq('id', user.id).single()

  if (!existingProfile) {
    // 프로필 없으면 INSERT (role: 'customer')
    await supabase.from('profiles').insert({ id: user.id, ...profileData, role: 'customer' })
  } else {
    // 프로필 있으면 UPDATE (role 보존, 메타데이터만 갱신)
    await supabase.from('profiles').update(profileData).eq('id', user.id)
  }
}
```

> **INSERT가 아닌 check-then-update 패턴 사용 이유**: `upsert`를 사용하면 관리자/강사 role이 'customer'로 초기화될 수 있으므로, 기존 프로필이 있으면 role을 건드리지 않고 메타데이터만 갱신합니다.

### 5.2.2 RLS 헬퍼 함수: `get_my_role()`

관리자 RLS 정책에서 `profiles` 테이블을 직접 조회하면 **무한재귀**가 발생합니다 (profiles SELECT 정책 평가 → 관리자 체크 → profiles SELECT → ...).

이를 방지하기 위해 `SECURITY DEFINER` 함수로 RLS를 우회하여 역할을 조회합니다:

```sql
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.user_role
LANGUAGE sql
SECURITY DEFINER SET search_path = public
STABLE
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;
```

**사용 예시** (모든 관리자 정책에 적용됨):
```sql
-- ❌ 잘못된 방식 (무한재귀 발생)
CREATE POLICY "관리자 전체 프로필 조회" ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ✅ 올바른 방식 (get_my_role() 사용)
CREATE POLICY "관리자 전체 프로필 조회" ON profiles FOR SELECT
  USING (public.get_my_role() = 'admin');
```

### 5.3 Middleware (Role 기반 접근 제어)

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Supabase 세션 갱신
  const supabase = createServerClient(/* config */)
  const { data: { user } } = await supabase.auth.getUser()

  // 공개 경로는 통과
  const publicPaths = ['/', '/courses', '/login', '/signup', '/forgot-password', '/api/webhooks']
  if (publicPaths.some(p => pathname.startsWith(p))) {
    // 로그인 상태에서 /login, /signup 접근 시 홈으로 리다이렉트
    if (user && (pathname === '/login' || pathname === '/signup')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // 미인증 → 로그인 페이지
  if (!user) return NextResponse.redirect(new URL('/login', request.url))

  // Role 조회
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Role 기반 접근 제어
  if (pathname.startsWith('/admin') && profile?.role !== 'admin') {
    return NextResponse.redirect(new URL('/access-denied', request.url))
  }
  if (pathname.startsWith('/teacher') && profile?.role !== 'instructor') {
    return NextResponse.redirect(new URL('/access-denied', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|icons).*)']
}
```

### 5.4 Supabase Client Configuration

```typescript
// lib/supabase/client.ts - 브라우저용
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// lib/supabase/server.ts - Server Component/Action용
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}

// lib/supabase/admin.ts - Service Role용 (웹훅, 관리자 작업)
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

---

## 6. Video Streaming (Mux)

### 6.1 Mux Integration Architecture

```
[강사/관리자]                      [수강생]
     │                               │
     ▼                               ▼
┌──────────────┐              ┌──────────────┐
│ Mux Direct   │              │ Mux Player   │
│ Upload URL   │              │ (Embed)      │
│ (서버에서     │              │ <MuxPlayer   │
│  생성)        │              │  playbackId= │
└──────┬───────┘              │  token= />   │
       │                      └──────┬───────┘
       ▼                             │
┌──────────────┐                     │
│ Mux API      │                     │
│ - Create     │                     ▼
│   Asset      │              ┌──────────────┐
│ - Upload     │              │ Mux CDN      │
│ - Webhook    │──────────────│ HLS Stream   │
└──────┬───────┘              └──────────────┘
       │
       ▼
┌──────────────┐
│ Webhook      │
│ /api/webhooks│
│ /mux         │
│ → DB Update  │
└──────────────┘
```

### 6.2 영상 재생 컴포넌트

```typescript
// Mux Player 임베드 (수강 등록된 사용자만)
// @mux/mux-player-react 사용

// 1. Server Action에서 서명된 토큰 생성
async function getSignedPlaybackToken(playbackId: string) {
  const token = await signPlaybackId(playbackId, {
    type: 'video',
    expiration: '1h',
  })
  return token
}

// 2. 클라이언트에서 Mux Player 렌더링
<MuxPlayer
  playbackId={lecture.mux_playback_id}
  tokens={{ playback: signedToken }}
  metadata={{ video_title: lecture.title }}
  onTimeUpdate={handleProgressUpdate}
/>
```

---

## 7. Page-by-Page Integration Map

각 페이지별로 어떤 Server Action/API를 호출하는지 매핑.

### 7.1 Public Pages

| Page | Data Source | Server Actions |
|------|-----------|----------------|
| `/` (Home) | RSC: getCourses(limit:6) | - |
| `/courses/[id]` | RSC: getCourseById(id) | addToCart |
| `/login` | - | signIn, signInWithOAuth |
| `/forgot-password` | - | resetPassword |
| `/access-denied` | - | - (Static) |

### 7.2 Auth Pages (Customer)

| Page | Data Source | Server Actions |
|------|-----------|----------------|
| `/cart` | RSC: getCartItems | removeFromCart |
| `/order` | RSC: getCartItems | applyCoupon, createOrder |
| `/order/complete` | RSC: getOrderDetail | - |
| `/courses/[id]/watch/[lectureId]` | RSC: getLectureForPlayer | updateLectureProgress |
| `/mypage` | RSC: getMyEnrollments | - |
| `/mypage/orders` | RSC: getMyOrders | requestRefund |
| `/mypage/profile` | RSC: getProfile | updateProfile, updatePassword |
| `/mypage/qna` | RSC: getMyInquiries | createInquiry |
| `/mypage/reviews` | RSC: getMyReviews | createReview, updateReview, deleteReview |
| `/mypage/support` | RSC: getMyInquiries(type:'support') | createInquiry |
| `/mypage/withdraw` | - | withdrawAccount |

### 7.3 Admin Pages

| Page | Data Source | Server Actions |
|------|-----------|----------------|
| `/admin` | RSC: getAdminDashboard | - |
| `/admin/classes` | RSC: getCourses(admin) | toggleCourseVisibility, deleteCourse |
| `/admin/classes/new` | - | createCourse |
| `/admin/students` | RSC: getAdminStudents | - |
| `/admin/payments` | RSC: getAdminPayments | processRefund |
| `/admin/lectures` | RSC: getLectures(courseId) | updateLecture, deleteLecture |
| `/admin/inquiries` | RSC: getInquiries(admin) | createReply |
| `/admin/promotions` | RSC: getCoupons | manageCoupon |

### 7.4 Teacher Pages

| Page | Data Source | Server Actions |
|------|-----------|----------------|
| `/teacher` | RSC: getTeacherDashboard | - |
| `/teacher/profile` | RSC: getProfile | updateTeacherProfile (+ 이미지 업로드) |
| `/teacher/classes` | RSC: getTeacherCourses | toggleCourseVisibility, updateCourseBadge, deleteCourse |
| `/teacher/students` | RSC: getTeacherStudents | - (상세 모달: getTeacherStudentDetail) |
| `/teacher/inquiries` | RSC: getTeacherInquiries | replyToInquiry, toggleInquiryLike |
| `/teacher/reviews` | RSC: getTeacherReviews | toggleHelpful |

---

## 8. State Management

### 8.1 Zustand Stores

```typescript
// store/auth-store.ts
interface AuthState {
  user: Profile | null
  isLoading: boolean
  setUser: (user: Profile | null) => void
}

// store/cart-store.ts
interface CartState {
  items: CartItemWithCourse[]
  isLoading: boolean
  addItem: (courseId: string) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => void
  syncWithServer: () => Promise<void>  // 서버 데이터와 동기화
}
```

### 8.2 State 사용 범위

| 데이터 | 관리 방식 | 근거 |
|--------|----------|------|
| 인증 상태 | Zustand + Supabase Auth listener | 전역 접근 필요, 헤더/미들웨어에서 사용 |
| 장바구니 | Zustand (optimistic) + Server Action | 실시간 UI 반응, 여러 페이지에서 사용 |
| 강의 목록 | Server Component (RSC) | 페이지별 독립, 캐시 활용 |
| 대시보드 데이터 | Server Component (RSC) | 페이지 로드 시 한 번만 조회 |
| 폼 상태 | react-hook-form (로컬) | 컴포넌트 로컬 상태로 충분 |
| 알림 | Server Component + 클라이언트 polling | Realtime 도입 전 polling으로 시작 |

---

## 9. Security Considerations

### 9.1 Security Checklist

- [x] **RLS 정책**: 모든 테이블에 RLS 활성화, 관리자 정책은 `get_my_role()` SECURITY DEFINER 함수 사용 (자기참조 무한재귀 방지)
- [ ] **XSS 방지**: React 기본 이스케이프 + DOMPurify (사용자 입력 HTML 없음)
- [ ] **CSRF**: Next.js Server Actions 기본 보호 (origin 체크)
- [ ] **SQL Injection**: Supabase 클라이언트 파라미터 바인딩 사용
- [ ] **인증 토큰**: httpOnly 쿠키 (Supabase SSR 기본)
- [ ] **환경 변수**: `SUPABASE_SERVICE_ROLE_KEY`, `MUX_TOKEN_SECRET` 서버 전용
- [ ] **웹훅 검증**: Mux Signature / X-Webhook-Secret 검증
- [ ] **파일 업로드**: 이미지 타입/크기 제한 (5MB, jpg/png/webp만)
- [ ] **Rate Limiting**: Vercel Edge Middleware 또는 Supabase 설정 활용

### 9.2 Role 기반 보안 계층

```
Layer 1: Middleware (경로 수준)
  → /admin/* : admin만
  → /teacher/* : instructor만
  → /mypage/*, /cart, /order : 로그인 유저

Layer 2: Server Action (함수 수준)
  → Role 체크 후 로직 실행
  → 에러 시 { success: false, error: AUTH_FORBIDDEN }

Layer 3: Supabase RLS (DB 수준)
  → auth.uid() 기반 행 수준 접근 제어
  → 관리자 정책은 get_my_role() SECURITY DEFINER 함수 사용 (자기참조 방지)
  → 설령 API 우회해도 DB에서 차단
```

---

## 10. Coding Convention

### 10.1 Naming Conventions

| Target | Rule | Example |
|--------|------|---------|
| Components | PascalCase | `CourseCard`, `TeacherLayout` |
| Server Actions | camelCase, 동사 시작 | `getCourses`, `createOrder` |
| API Route files | `route.ts` (Next.js 규칙) | `app/api/webhooks/mux/route.ts` |
| Types | PascalCase, 역할 접미사 | `CourseWithInstructor`, `CartItemWithCourse` |
| Zustand Store | camelCase + `Store` 접미사 | `useAuthStore`, `useCartStore` |
| DB 테이블/컬럼 | snake_case | `course_sections`, `instructor_id` |
| 환경 변수 | UPPER_SNAKE_CASE | `SUPABASE_SERVICE_ROLE_KEY` |
| 파일명 (컴포넌트) | kebab-case.tsx | `course-hero.tsx`, `teacher-layout.tsx` |
| 파일명 (유틸) | kebab-case.ts | `utils.ts`, `constants.ts` |

### 10.2 Import Order

```typescript
// 1. React/Next.js
import { useState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import Image from 'next/image'

// 2. 외부 라이브러리
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// 3. 내부 모듈 (@/ alias)
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

// 4. 상대 경로
import { CourseCard } from './course-card'

// 5. 타입 (type-only imports)
import type { CourseWithInstructor } from '@/types/database'
```

### 10.3 Server Action Pattern

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types'

export async function createReview(
  courseId: string,
  data: { rating: number; content: string }
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: { code: 'AUTH_UNAUTHORIZED', message: '로그인이 필요합니다' } }
  }

  // 수강 등록 여부 확인
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single()

  if (!enrollment) {
    return { success: false, error: { code: 'COURSE_NOT_ENROLLED', message: '수강 등록이 필요합니다' } }
  }

  const { data: review, error } = await supabase
    .from('reviews')
    .insert({ user_id: user.id, course_id: courseId, ...data })
    .select('id')
    .single()

  if (error) {
    return { success: false, error: { code: 'VALIDATION_FAILED', message: error.message } }
  }

  revalidatePath(`/courses/${courseId}`)
  revalidatePath('/mypage/reviews')
  return { success: true, data: { id: review.id } }
}
```

---

## 11. Implementation Guide

### 11.1 Implementation Order

```
Sprint 1: Foundation
├── 1.1 Supabase 프로젝트 생성
├── 1.2 supabase init + migrations 작성 (21개 테이블)
├── 1.3 lib/supabase/ 클라이언트 3종 설정
├── 1.4 middleware.ts 작성
├── 1.5 supabase gen types → types/database.ts
└── 1.6 Route Group 리팩토링

Sprint 2: Authentication
├── 2.1 lib/actions/auth.ts (signUp, signIn, signOut)
├── 2.2 카카오 OAuth 설정 + /api/auth/callback
├── 2.3 login 페이지 연동
├── 2.4 forgot-password 연동
├── 2.5 store/auth-store.ts (Zustand)
└── 2.6 header.tsx 로그인 상태 반영 (auth store 기반, variant 제거, 닉네임 표시)

Sprint 3: Course & Content
├── 3.1 lib/actions/courses.ts (getCourses, getCourseById)
├── 3.2 홈페이지 강의 목록 연동
├── 3.3 강의 상세 페이지 연동
├── 3.4 Mux 설정 + @mux/mux-player-react
├── 3.5 영상 플레이어 페이지 연동
├── 3.6 수강 진도 추적
└── 3.7 관리자 강의/렉처 CRUD

Sprint 4: Commerce
├── 4.1 lib/actions/cart.ts + store/cart-store.ts
├── 4.2 장바구니 페이지 연동
├── 4.3 lib/actions/orders.ts (createOrder, completePayment)
├── 4.4 주문/결제 페이지 연동
├── 4.5 수강 등록 자동 처리
├── 4.6 쿠폰 시스템
└── 4.7 환불 요청/처리

Sprint 5: Community & Admin
├── 5.1 lib/actions/reviews.ts
├── 5.2 lib/actions/qna.ts
├── 5.3 마이페이지 전체 연동
├── 5.4 lib/actions/admin.ts
├── 5.5 관리자 대시보드 연동
└── 5.6 알림 시스템

Sprint 6: Teacher Dashboard
├── 6.1 lib/actions/teacher.ts (대시보드, 매출)
├── 6.2 강사 프로필 관리 연동 (이미지 업로드)
├── 6.3 내 강의 관리 연동
├── 6.4 내 수강생 관리 연동
├── 6.5 Q&A 답변 관리 연동
└── 6.6 리뷰 관리 연동

Sprint 7: Webhook & Polish
├── 7.1 /api/webhooks/mux
├── 7.2 /api/webhooks/external
├── 7.3 웨비나 시스템
├── 7.4 시드 데이터
├── 7.5 RLS 정책 검증
└── 7.6 Vercel 재배포
```

### 11.2 New Dependencies to Install

```bash
# Supabase
pnpm add @supabase/supabase-js @supabase/ssr

# Mux
pnpm add @mux/mux-player-react @mux/mux-node

# State Management
pnpm add zustand

# Supabase CLI (dev)
pnpm add -D supabase
```

### 11.3 Key Files to Create

| File | Purpose | Sprint |
|------|---------|--------|
| `middleware.ts` | Auth guard + Role routing | 1 |
| `lib/supabase/client.ts` | Browser Supabase client | 1 |
| `lib/supabase/server.ts` | Server Supabase client | 1 |
| `lib/supabase/admin.ts` | Service role client | 1 |
| `types/database.ts` | Auto-generated DB types | 1 |
| `types/index.ts` | Custom extended types | 1 |
| `lib/actions/auth.ts` | Auth server actions | 2 |
| `lib/actions/courses.ts` | Course server actions | 3 |
| `lib/actions/cart.ts` | Cart server actions | 4 |
| `lib/actions/orders.ts` | Order server actions | 4 |
| `lib/actions/reviews.ts` | Review server actions | 5 |
| `lib/actions/qna.ts` | Q&A server actions | 5 |
| `lib/actions/admin.ts` | Admin server actions | 5 |
| `lib/actions/teacher.ts` | Teacher server actions | 6 |
| `store/auth-store.ts` | Auth Zustand store | 2 |
| `store/cart-store.ts` | Cart Zustand store | 4 |
| `app/api/auth/callback/route.ts` | OAuth callback | 2 |
| `app/api/webhooks/mux/route.ts` | Mux webhook | 7 |
| `app/api/webhooks/external/route.ts` | External webhook | 7 |
| `supabase/migrations/*.sql` | DB schema | 1 |
| `supabase/seed.sql` | Seed data | 7 |
| `.env.local` | Environment variables | 1 |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-28 | Initial design - 전체 아키텍처, API, Auth, DB, Mux, 페이지 매핑 | AI (Claude) |
