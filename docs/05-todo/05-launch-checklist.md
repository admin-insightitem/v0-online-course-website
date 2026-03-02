# RichClass 실제 오픈까지 남은 작업 전체 정리

> 작성일: 2026-03-01
> 현재 상태: 프론트엔드 + Server Actions 구현 완료 (PDCA 95%), 인프라/외부 서비스 연동 미진행

---

## 현재 구현 완료 상태

| 영역 | 상태 | 비고 |
|------|------|------|
| 프론트엔드 UI | ✅ 완료 | Next.js App Router, 모든 페이지 구현 |
| Server Actions (58개) | ✅ 완료 | 실제 Supabase 클라이언트 사용 (Mock 없음) |
| DB 스키마 (19 테이블) | ✅ 완료 | 마이그레이션 파일 1개로 통합됨 (카카오 프로필+채널 포함) |
| RLS 정책 | ✅ 완료 | 모든 테이블에 Row-Level Security 적용 |
| 인증 코드 | ✅ 완료 | Kakao OAuth만 사용 + 미들웨어 권한 검증 |
| Mux VOD 플레이어 | ✅ 완료 | 진도 추적 (5% 단위), 웹훅 핸들러 구현 |
| 타입 정의 | ✅ 완료 | ActionResult\<T\> 패턴, 전체 타입 동기화 |

---

## Phase 1: 로컬 개발환경 구축 (최우선)

| # | 작업 | 상세 | 난이도 | 예상 시간 |
|---|------|------|--------|-----------|
| 1-1 | **Supabase 프로젝트 생성** | supabase.com에서 개발용 프로젝트 생성 (Free tier) | 쉬움 | 10분 |
| 1-2 | **`.env.local` 실제 값 설정** | 현재 모두 `your_xxx` 플레이스홀더 → 실제 키로 교체 | 쉬움 | 5분 |
| 1-3 | **DB 마이그레이션 실행** | `supabase/migrations/00001_initial_schema.sql` 1개 파일 → SQL Editor에서 실행 | 쉬움 | 10분 |
| 1-4 | **Supabase Auth 설정** | 이메일 Provider OFF, Kakao OAuth만 사용, Redirect URL 설정 | 보통 | 30분 |
| 1-5 | **Supabase Storage 버킷** | `profiles` 버킷 생성 (아바타 업로드용), Public 접근 설정 | 쉬움 | 5분 |
| 1-6 | **시드 데이터 삽입** | 테스트용 강사/학생 계정, 샘플 강의 데이터 생성 | 보통 | 30분 |

### `.env.local` 필요 항목

```env
# Supabase (프로젝트 Settings > API에서 확인)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Kakao (Kakao Developers → 앱 설정 → 앱 키)
NEXT_PUBLIC_KAKAO_JS_KEY=
NEXT_PUBLIC_KAKAO_CHANNEL_ID=

# Mux (Phase 2에서 설정)
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
MUX_SIGNING_KEY=
MUX_SIGNING_KEY_PRIVATE=

# Webhook
WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Phase 2: 핵심 외부 서비스 연동

| # | 작업 | 상세 | 난이도 | 예상 시간 |
|---|------|------|--------|-----------|
| 2-1 | **Mux 계정 + API 키** | mux.com 가입 → Token ID/Secret 발급 → `.env.local` 설정 | 보통 | 20분 |
| 2-2 | **Mux 웹훅 설정** | Mux Dashboard에서 웹훅 URL 등록 (로컬: ngrok 필요) | 보통 | 30분 |
| 2-3 | **Mux 서명 검증 보완** | `app/api/webhooks/mux/route.ts`의 `verifyMuxSignature` → 실제 HMAC-SHA256 구현 | 보통 | 1시간 |
| 2-4 | **영상 업로드 흐름 구현** | 관리자/강사가 영상 업로드 → Mux Direct Upload URL 생성 API 필요 | 높음 | 3시간 |

### 영상 업로드 흐름 (구현 필요)

```
강사/관리자가 강의 생성 시:
1. 프론트에서 업로드 요청
2. 서버에서 Mux Direct Upload URL 생성 (POST /api/upload/video)
3. 프론트에서 Direct Upload URL로 영상 직접 업로드
4. Mux에서 처리 완료 후 웹훅 호출 (/api/webhooks/mux)
5. 웹훅에서 lectures 테이블에 playback_id 업데이트
6. 강의 영상 재생 가능
```

---

## Phase 3: 결제 시스템 (현재 미구현)

| # | 작업 | 상세 | 난이도 | 예상 시간 |
|---|------|------|--------|-----------|
| 3-1 | **PG사 선정** | 토스페이먼츠 / 아임포트(포트원) 중 선택 | - | - |
| 3-2 | **PG 연동 구현** | 결제 위젯 + 결제 확인 API | 높음 | 1~2일 |
| 3-3 | **결제 콜백 처리** | PG 결제 완료 → `completePayment()` → enrollment 자동 생성 | 높음 | 3시간 |
| 3-4 | **환불 PG 연동** | `processRefund()` → 실제 PG 환불 API 호출 | 높음 | 3시간 |

### 현재 결제 흐름의 Gap

```
현재 구현:
  createOrder() → DB에 주문 생성 (status: 'pending')
  completePayment() → DB status 변경 + enrollment 생성
  ❌ 실제 PG 결제 과정이 없음

필요한 구현:
  createOrder() → DB에 주문 생성
  → PG 결제창 표시 (토스/아임포트 위젯)
  → PG 결제 완료 콜백
  → 서버에서 결제 검증 (PG 서버와 금액 대조)
  → completePayment() 호출
```

---

## Phase 4: 로컬 테스트 순서

### 4-1. 로그인 테스트 (Kakao OAuth만)
```
/login → 카카오 로그인 버튼 클릭 → Kakao OAuth 인증
→ /api/auth/callback → role별 리다이렉트 확인
→ /mypage 도달 확인
```

### 4-2. 관리자 설정
```
DB에서 직접 role='admin' 부여:
  UPDATE profiles SET role = 'admin' WHERE email = 'admin@test.com';
/admin 접속 → 대시보드 확인
```

### 4-3. 강의 생성 테스트
```
/admin/classes → 강의 생성 (제목, 설명, 카테고리, 가격)
섹션 추가 → 강의(Lecture) 추가 (영상 없이 메타데이터만 먼저)
is_published = true로 공개
/courses에서 강의 목록 노출 확인
```

### 4-4. 수강 흐름 테스트
```
일반 사용자 계정으로:
/courses → 강의 상세 → 장바구니 추가
/cart → 주문하기
(PG 미연동 시) DB에서 직접 order status='completed' 변경 후 enrollment 확인
/mypage/learning → 수강 목록 확인
```

### 4-5. VOD 재생 테스트 (Mux 설정 후)
```
강사/관리자가 영상 업로드 → Mux 처리 → 웹훅으로 playback_id 수신
수강생 계정으로 강의 영상 재생
진도 추적 확인 (lecture_progress 테이블)
90% 이상 시청 → 자동 완료 처리 확인
```

### 4-6. 강사 대시보드 테스트
```
강사 계정 (role='instructor') 으로:
/teacher → 대시보드 (매출, 수강생 수)
/teacher/classes → 내 강의 관리
/teacher/students → 수강생 목록
/teacher/qna → Q&A 문의/답변
/teacher/revenue → 매출/정산
```

### 4-7. 기타 기능 테스트
```
리뷰 작성/수정/삭제 → 평점 자동 계산 확인
Q&A 문의 → 강사 답변 → 상태 변경 확인
알림 목록/읽음 처리
쿠폰 생성 → 주문 시 적용 → 할인 확인
환불 요청 → 관리자 승인/거절
```

---

## Phase 5: 환경 분리 전략

| 환경 | Supabase 프로젝트 | Mux 환경 | 용도 |
|------|-------------------|----------|------|
| **Local (개발)** | 개발용 (Free tier) | Development | 개발 + 테스트, 자유롭게 초기화 가능 |
| **Production (운영)** | 운영용 (Pro tier 권장) | Production | 실제 서비스, 백업 필수 |

### 환경변수 파일 전략

```
.env.example        → 템플릿 (git에 포함, 실제 값 없음)
.env.local          → 로컬 개발용 (git 제외, .gitignore에 포함)
Vercel Dashboard    → 프로덕션 환경변수 (Vercel에 직접 설정)
```

---

## Phase 6: 배포

| # | 작업 | 상세 | 난이도 |
|---|------|------|--------|
| 6-1 | **Vercel 프로젝트 연결** | GitHub 레포 → Vercel 자동 배포 설정 | 쉬움 |
| 6-2 | **환경변수 설정** | Vercel Dashboard → Settings → Environment Variables에 프로덕션 키 등록 | 쉬움 |
| 6-3 | **커스텀 도메인** | 도메인 구매 → Vercel에 연결 → SSL 자동 | 쉬움 |
| 6-4 | **Mux 웹훅 URL 업데이트** | `https://yourdomain.com/api/webhooks/mux` | 쉬움 |
| 6-5 | **Kakao OAuth Redirect URL** | 프로덕션 도메인으로 업데이트 | 쉬움 |
| 6-6 | **`next.config.mjs` 수정** | `ignoreBuildErrors: false`, `images.unoptimized` 제거 | 보통 |
| 6-7 | **Supabase Auth Redirect** | Site URL을 프로덕션 도메인으로 변경 | 쉬움 |

---

## Phase 7: 오픈 전 품질 체크

| # | 작업 | 상세 | 우선순위 |
|---|------|------|----------|
| 7-1 | **TypeScript 빌드 에러 수정** | 현재 `ignoreBuildErrors: true`로 무시 중 | 높음 |
| 7-2 | **좋아요/도움됨 중복 방지** | `toggleHelpful()`, `toggleInquiryLike()` - 별도 테이블 추가 필요 | 보통 |
| 7-3 | **Mux 서명 검증 실제 구현** | 현재 개발용 스텁 (존재 여부만 확인) | 높음 |
| 7-4 | **에러 모니터링** | Sentry 등 연동 | 보통 |
| 7-5 | **이미지 최적화 활성화** | `next.config.mjs`에서 `unoptimized` 제거 | 낮음 |
| 7-6 | **SEO 메타태그** | 각 페이지 title, description, OG 태그 확인 | 보통 |
| 7-7 | **모바일 반응형 최종 점검** | 주요 페이지 모바일 레이아웃 확인 | 보통 |
| 7-8 | **Kakao 비즈앱 전환** | 사업자등록증 확보 → 카카오 비즈앱 전환 신청 (아래 상세 참고) | 높음 |

### 7-8. Kakao OAuth 비즈앱 전환 (서비스 출시 전 필수)

```
현재 (개발 단계):
  - 개인 계정으로 카카오 앱 생성
  - 팀원만 로그인 가능 (테스트 계정 등록 필요)
  - 동의 항목: 닉네임, 프로필 사진만 가능
  - ❌ 이메일(account_email) 사용 불가 (비즈앱만 지원)

서비스 출시 전 필수 작업:
  1. 사업자등록증 확보
  2. Kakao Developers → 앱 설정 → 비즈니스 인증 → 사업자등록증 제출
  3. 비즈앱 전환 심사 (1~3 영업일)
  4. 전환 완료 후:
     - 모든 사용자 로그인 가능 (테스트 계정 제한 해제)
     - ✅ 이메일(account_email) 동의항목 설정 가능 → 필수 동의로 설정
     - 카카오싱크 (추가 프로필 정보) 사용 가능
     - 서비스 약관 동의 화면 커스터마이징 가능
  5. 동의항목 업데이트:
     - 카카오계정(이메일) → 필수 동의로 변경
     - 필요 시: 이름, 전화번호 등 추가 동의항목 설정
     - 카카오톡 채널 추가 상태(plusfriends) → 동의항목 활성화
  6. 카카오톡 채널 설정:
     - Kakao Developers → 앱 설정 → 카카오톡 채널 연결
     - channelPublicId 확인 후 NEXT_PUBLIC_KAKAO_CHANNEL_ID 환경변수 설정
     - JavaScript 키 확인 후 NEXT_PUBLIC_KAKAO_JS_KEY 환경변수 설정

⚠️ 개발 중 이메일 없이 테스트 시 주의사항:
  - Supabase auth.users.email이 null일 수 있음
  - profiles 테이블에 이메일 없이 닉네임만 저장됨
  - 이메일 기반 로직(알림, 비밀번호 찾기 등)은 비즈앱 전환 후 테스트
```

---

## 우선순위별 로드맵

```
[1단계 - 지금 바로]
  Phase 1: Supabase 프로젝트 생성 + env 설정 + 마이그레이션 실행
  → npm run dev 로 로컬 서버 띄우기
  → 회원가입/로그인 테스트

[2단계 - 핵심 서비스]
  Phase 2: Mux 연동 + 영상 업로드 흐름 구현
  → 강의 생성 + 영상 재생 테스트

[3단계 - 전체 흐름]
  Phase 4: 로컬에서 전체 사용자 흐름 테스트 (4-1 ~ 4-7)

[4단계 - 결제]
  Phase 3: PG 결제 연동 (토스페이먼츠/아임포트)
  → 실제 결제 → 수강 등록 흐름 완성

[5단계 - 배포]
  Phase 5 + 6: 환경 분리 + Vercel 배포 + 도메인 설정

[6단계 - 오픈 전]
  Phase 7: 품질 체크 + 보안 점검 + 모니터링
```

---

## 코드에서 확인된 주요 Gap

### 1. 영상 업로드 API 미구현
- `app/api/upload/material/route.ts` → 강의 자료 업로드 있음
- `app/api/upload/avatar/route.ts` → 아바타 업로드 있음
- ❌ **영상 업로드 (Mux Direct Upload) API 없음** → 구현 필요

### 2. 결제 연동 없음
- `createOrder()` → 주문 DB 생성만 함
- `completePayment()` → DB 상태 변경만 함
- ❌ **실제 PG 결제 과정 없음** → PG사 연동 필요

### 3. Mux 웹훅 서명 검증 미완성
```typescript
// 현재 (개발용 스텁)
function verifyMuxSignature(body, signature) {
  return signature.length > 0  // 존재 여부만 확인
}
// 실제 필요: HMAC-SHA256 서명 비교
```

### 4. 카카오 OAuth 프로필 동기화 ✅ 구현 완료
- `handle_new_user` 트리거: nickname, avatar_url, birthyear, birthday, birthday_type, gender 매핑 완료
- `/api/auth/callback`: 재로그인 시 프로필 upsert 구현 완료
- `signInWithKakao()`: OAuth scopes 설정 완료 (`profile_nickname profile_image account_email`)
- profiles 테이블: 카카오 프로필 필드 + `kakao_channel_connected` 컬럼 추가 완료
- 카카오톡 채널 추가: Kakao JS SDK `followChannel()` 연동, 서버 액션으로 DB 업데이트

### 5. 좋아요/도움됨 중복 방지 테이블 없음
- `reviews.helpful_count` → 증가만 가능, 사용자별 추적 불가
- `inquiries.like_count` → 동일 문제
- 별도의 `review_helpful`, `inquiry_likes` 조인 테이블 필요
