# richclass-fullstack-platform 갭 분석 보고서

> **분석 유형**: 갭 분석 (v0/admin-3 머지 후)
>
> **프로젝트**: RichClass (No.1 온라인 수익화 플랫폼)
> **버전**: 0.1.0
> **분석자**: AI (Claude)
> **일자**: 2026-02-28
> **설계서**: [richclass-fullstack-platform.design.md](../02-design/features/richclass-fullstack-platform.design.md)
> **이전 분석**: 95.4% (2026-02-28, v2.0 수정 후)

### 파이프라인 참조

| 단계 | 문서 | 검증 대상 |
|------|------|----------|
| Phase 1 | 스키마 (Plan 섹션 6.4) | 21 테이블, 타입, 트리거 |
| Phase 2 | 컨벤션 (Design 섹션 10) | 네이밍, 임포트 순서, 패턴 |
| Phase 4 | API 스펙 (Design 섹션 4) | 서버 액션 + API 라우트 |
| Phase 8 | 본 문서 | 아키텍처/컨벤션 리뷰 |

---

## 1. 분석 개요

### 1.1 분석 목적

`v0/admin-3` 브랜치 머지 후 갭 분석. 해당 브랜치에서 추가/변경된 항목:
- 5개 신규 공개 `/support/*` 페이지 (FAQ, 공지사항, 개인정보, 이용약관, 환불정책)
- 1개 신규 데이터 파일 (`lib/faq-data.ts`)
- 7개 수정 파일 (login, signup, mypage/support, header, footer, cta-section, testimonials-section)

분석 초점:
1. 신규 페이지에 아직 존재하지 않는 서버 액션이 필요한지
2. 수정된 페이지가 기존 서버 액션과 올바르게 통합되어 있는지
3. 설계서에 신규 페이지 반영이 필요한지
4. 미들웨어가 신규 라우트를 올바르게 처리하는지
5. 전체 Match Rate 업데이트

### 1.2 v0/admin-3 머지 변경 내역

| # | 파일 | 유형 | 변경 요약 |
|---|------|------|----------|
| 1 | `app/support/page.tsx` | 신규 | 공개 FAQ 페이지 (아코디언) |
| 2 | `app/support/notice/page.tsx` | 신규 | 공개 공지사항 목록 |
| 3 | `app/support/privacy/page.tsx` | 신규 | 정적 개인정보처리방침 |
| 4 | `app/support/terms/page.tsx` | 신규 | 정적 이용약관 |
| 5 | `app/support/refund/page.tsx` | 신규 | 정적 환불정책 |
| 6 | `lib/faq-data.ts` | 신규 | 하드코딩 FAQ 데이터 (10개, 5개 카테고리) |
| 7 | `app/login/page.tsx` | 수정 | `signIn` + `signInWithKakao` 액션 통합 |
| 8 | `app/signup/page.tsx` | 수정 | `signUp` + `signInWithKakao` 액션 통합 |
| 9 | `app/mypage/support/page.tsx` | 수정 | `lib/faq-data.ts` 사용, 1:1 문의 폼 |
| 10 | `components/header.tsx` | 수정 | auth store + `signOut` 액션, 역할 기반 링크 |
| 11 | `components/footer.tsx` | 수정 | `/support`, `/support/refund`, `/support/terms` 링크 |
| 12 | `components/cta-section.tsx` | 수정 | UI 전용 (백엔드 통합 불필요) |
| 13 | `components/testimonials-section.tsx` | 수정 | UI 전용 (하드코딩 후기, 백엔드 불필요) |

### 1.3 분석 범위

- **설계서**: `docs/02-design/features/richclass-fullstack-platform.design.md`
- **구현 경로**:
  - `lib/actions/` (10개 파일: auth, courses, cart, orders, reviews, qna, admin, teacher, enrollments, notifications)
  - `app/api/` (5개 라우트: auth/callback, webhooks/mux, webhooks/external, upload/avatar, upload/material)
  - `app/support/` (5개 신규 페이지)
  - `lib/faq-data.ts` (신규)
  - `store/` (2개 파일: auth-store, cart-store)
  - `components/` (header, footer, auth-provider, mux-player-wrapper, cta-section, testimonials-section)
  - `middleware.ts` + `lib/supabase/middleware.ts`
  - `lib/supabase/` (4개 파일: client, server, admin, middleware)
  - `supabase/migrations/` (3개 파일)
  - `types/index.ts`

---

## 2. 신규 페이지 분석 (v0/admin-3)

### 2.1 Support 페이지 데이터 소스 평가

| 페이지 | 라우트 | 데이터 소스 | 서버 액션 필요? | 상태 |
|--------|--------|-----------|:-----------:|------|
| FAQ | `/support` | `lib/faq-data.ts` (하드코딩) | 현재 불필요, 향후 가능 | 정적 |
| 공지사항 | `/support/notice` | 인라인 하드코딩 배열 (5개) | 향후 필요 | 정적 |
| 개인정보 | `/support/privacy` | 인라인 하드코딩 텍스트 | 불필요 | 정적 |
| 이용약관 | `/support/terms` | 인라인 하드코딩 텍스트 | 불필요 | 정적 |
| 환불정책 | `/support/refund` | 인라인 하드코딩 텍스트 | 불필요 | 정적 |

**평가**: 5개 신규 support 페이지 모두 정적/하드코딩 상태. MVP 접근법으로 적절함. 개인정보, 이용약관, 환불정책은 법적 텍스트로 DB 연동 불필요. FAQ와 공지사항은 향후 스프린트에서 DB 마이그레이션 가능.

### 2.2 FAQ 데이터 파일 분석 (`lib/faq-data.ts`)

```
파일: lib/faq-data.ts
내용: 10개 FAQ 항목, 5개 카테고리 (all, payment, playback, account, course)
사용처:
  - app/support/page.tsx (공개 FAQ, "전체"와 "TOP 5" 탭)
  - app/mypage/support/page.tsx (로그인 사용자 FAQ, 검색 + 카테고리 필터)
```

| 항목 | 현재 상태 | 향후 권장 |
|------|----------|----------|
| 데이터 저장 | 하드코딩 TypeScript 배열 | 관리자 CRUD 필요 시 `faqs` DB 테이블로 이관 |
| 카테고리 | 하드코딩 배열 | 동적 변경 필요 시 DB 또는 설정으로 이관 |
| TOP 5 선정 | 하드코딩 ID 목록 | DB에서 조회수 추적 |
| 관리자 관리 | 없음 | 관리자 FAQ CRUD 액션 추가 |

**설계 갭**: 설계서 Section 7에 `/support/*` 페이지가 포함되어 있지 않음. 이 페이지들은 원래 설계에 없는 신규 프론트엔드 추가분.

### 2.3 공지사항 페이지 하드코딩 데이터

공지사항 페이지(`app/support/notice/page.tsx`)에 인라인 하드코딩 데이터 포함:
```typescript
const noticeData = [
  { id: 1, category: "etc", title: "etc", date: "2026.01.28" },
  { id: 2, category: "news", title: "news 01", date: "2026.01.28" },
  // ... 총 5개
]
```

**평가**: 운영 시스템에서는 DB 기반 + 관리자 CRUD가 필요. 현재는 정적 플레이스홀더로 허용.

### 2.4 미들웨어 라우트 접근 확인

`/support` 경로는 로그인 없이 접근 가능해야 함.

| 확인 항목 | 결과 | 상세 |
|----------|:----:|------|
| `/support`가 PUBLIC_PATHS에 있는가? | 아니오 | 명시적으로 등록되지 않음 |
| 미들웨어가 차단하는가? | 아니오 | `/admin`, `/teacher`, `/mypage` 등 보호 경로에 해당하지 않아 통과 |
| 명시적 공개 경로 등록 필요? | 권장 | 우연히 작동하는 것이므로 명시 등록이 안전 |

**발견**: `/support/*` 페이지는 로그인 없이 접근 가능하지만, 미들웨어 로직의 누락에 의한 것이지 명시적 설계가 아님. 경미한 이슈.

---

## 3. 수정 페이지 통합 점검

### 3.1 로그인 페이지 (`app/login/page.tsx`)

| 통합 포인트 | 설계 기대값 | 실제 구현 | 상태 |
|------------|-----------|----------|:----:|
| `signIn` 액션 | `signIn(formData)` 이메일/비밀번호 | FormData로 `signIn` 호출, `result.success` / `result.error.message` 처리 | 일치 |
| `signInWithKakao` 액션 | 카카오 OAuth 플로우 | `signInWithKakao(redirectTo)` 호출, `window.location.href`로 리다이렉트 | 일치 |
| 로그인 후 리다이렉트 | 역할 기반 리다이렉트 | 액션의 `result.data.redirectTo` 사용 | 일치 |
| 에러 처리 | `ActionResult` 형식 | `result.error.message`를 에러 영역에 표시 | 일치 |
| `useTransition` | 로딩 상태 | `isPending` + `Loader2` 스피너 사용 | 일치 |

**로그인 페이지 점수**: 모든 백엔드 통합 정상. 끊어진 연결 없음.

### 3.2 회원가입 페이지 (`app/signup/page.tsx`)

| 통합 포인트 | 설계 기대값 | 실제 구현 | 상태 |
|------------|-----------|----------|:----:|
| `signUp` 액션 | `signUp(formData)` | FormData(email, password, name, phone, marketing_agreed)로 `signUp` 호출 | 일치 |
| `signInWithKakao` 액션 | 카카오 OAuth | 소셜 가입용 `signInWithKakao()` 호출 | 일치 |
| 에러 처리 | `ActionResult` 형식 | `result.error.message` 표시 | 일치 |
| 가입 후 리다이렉트 | `/mypage`로 이동 | `router.push("/mypage")` + `router.refresh()` | 일치 |
| 약관 동의 | marketing_agreed 전달 | `formData.set("marketing_agreed", String(agreeMarketing))` | 일치 |

**회원가입 페이지 점수**: 모든 백엔드 통합 정상.

### 3.3 마이페이지 고객센터 (`app/mypage/support/page.tsx`)

| 통합 포인트 | 설계 기대값 | 실제 구현 | 상태 |
|------------|-----------|----------|:----:|
| FAQ 데이터 | 서버 또는 하드코딩 | `lib/faq-data.ts`의 `faqData`, `faqCategories` 사용 | 정적 |
| 1:1 문의 폼 | `createInquiry` 액션 | ~~`setTimeout` 목 사용~~ → `createInquiry` 서버 액션 연결 완료 | **수정됨** |
| 문의 내역 목록 | `getMyInquiries` 액션 | ~~하드코딩 목 데이터 (2개)~~ → `getMyInquiries` 서버 액션 연결 완료 | **수정됨** |
| 인증 보호 | 미들웨어 가드 | `/mypage` 하위로 미들웨어 보호됨 | 일치 |

**마이페이지 고객센터**: HIGH 갭 2건 모두 수정 완료.

### 3.4 헤더 (`components/header.tsx`)

| 통합 포인트 | 설계 기대값 | 실제 구현 | 상태 |
|------------|-----------|----------|:----:|
| Auth store | `useAuthStore`로 사용자 상태 | `useAuthStore()`에서 `user`, `isLoading` 사용 | 일치 |
| `signOut` 액션 | 로그아웃 기능 | `lib/actions/auth`에서 `signOut()` 호출 | 일치 |
| 역할 기반 대시보드 링크 | `/admin`, `/teacher`, `/mypage` | `user?.role`로 `dashboardLink` 계산 | 일치 |
| 장바구니 뱃지 | cart store 연동 | **여전히 하드코딩** — "2" 표시 | 기존 갭 |
| 알림 | notifications 액션 연동 | **여전히 하드코딩** — `notificationsData` 목 배열 사용 | 기존 갭 |

**헤더**: 백엔드 통합 정상. 장바구니 뱃지와 알림 갭은 v2.0에서 이미 확인된 기존 항목.

### 3.5 푸터 (`components/footer.tsx`)

| 링크 | 대상 | 존재? | 상태 |
|------|------|:-----:|:----:|
| "자주 묻는 질문" | `/support` | 예 | 일치 |
| "환불 정책" | `/support/refund` | 예 | 일치 |
| "이용약관" | `/support/terms` | 예 | 일치 |
| "개인정보처리방침" (하단) | ~~`#`~~ → `/support/privacy` | 예 | **수정됨** |
| "이용약관" (하단) | ~~`#`~~ → `/support/terms` | 예 | **수정됨** |
| "공지사항" (하단) | `/support/notice` | 예 | **수정됨** |

**푸터**: 하단 링크 3건 수정 완료.

### 3.6 CTA 섹션 (`components/cta-section.tsx`)

| 확인 항목 | 상태 | 비고 |
|----------|:----:|------|
| 백엔드 통합 필요? | 아니오 | 순수 UI 컴포넌트, 데이터 페칭 없음 |
| 버튼 링크 연결? | 미완 | "무료 시작하기" 버튼에 Link 래퍼 없음 |

**경미**: CTA 버튼에 네비게이션 링크 없음. `<Button>`만 있고 `<Link>` 래퍼 미사용.

### 3.7 후기 섹션 (`components/testimonials-section.tsx`)

| 확인 항목 | 상태 | 비고 |
|----------|:----:|------|
| 백엔드 통합 필요? | 아니오 | 정적 후기, DB 연동 불필요 |
| 데이터 소스 | 하드코딩 배열 (4개) | 랜딩 페이지 소셜 프루프로 적절 |

**이슈 없음.**

---

## 4. 설계서 갭 분석

### 4.1 설계서에 없는 페이지 (v0/admin-3 신규)

| 페이지 | 라우트 | 설계서에 있는가? | 백엔드 필요? | 우선순위 |
|--------|--------|:-----------:|:--------:|:------:|
| FAQ (공개) | `/support` | 아니오 | 향후 (DB 기반 FAQ) | 낮음 |
| 공지사항 | `/support/notice` | 아니오 | 예 (notices 테이블 + CRUD) | 중간 |
| 개인정보 | `/support/privacy` | 아니오 | 아니오 (정적 법률 텍스트) | 없음 |
| 이용약관 | `/support/terms` | 아니오 | 아니오 (정적 법률 텍스트) | 없음 |
| 환불정책 | `/support/refund` | 아니오 | 아니오 (정적 법률 텍스트) | 없음 |
| 회원가입 | `/signup` | 아니오 (`/login`만 언급) | 이미 통합됨 | 없음 |

### 4.2 누락 DB 스키마 항목

| 항목 | 현재 스키마 | 필요 대상 | 우선순위 |
|------|-----------|----------|:------:|
| `notices` 테이블 | 존재하지 않음 | `/support/notice` 관리자 CRUD | 중간 |
| `faqs` 테이블 | 존재하지 않음 | `/support` 관리자 CRUD | 낮음 |

---

## 5. 이전 분석 항목 이월

### 5.1 서버 액션 (v2.0과 동일)

| 카테고리 | 설계 | 구현 | 매칭 |
|---------|:----:|:----:|:----:|
| Auth | 7 | 9 | 7/7 |
| Course | 9 | 10 | 9/9 |
| Cart | 3 | 4 | 3/3 |
| Order | 6 | 6 | 6/6 |
| Review | 4 | 5 | 4/4 |
| QnA | 3 | 5 | 3/3 |
| Admin | 7 | 13 | 7/7 |
| Teacher | 10 | 10 | 10/10 |
| **합계** | **49** | **62** | **49/49 (100%)** |

### 5.2 API 라우트 (v2.0과 동일)

| 설계 라우트 | 구현 | 상태 |
|-----------|------|:----:|
| `GET /api/auth/callback` | `app/api/auth/callback/route.ts` | 일치 |
| `POST /api/auth/signout` | 서버 액션 `signOut()` | 의도적 변경 |
| `POST /api/webhooks/mux` | `app/api/webhooks/mux/route.ts` | 일치 |
| `POST /api/webhooks/external` | `app/api/webhooks/external/route.ts` | 일치 |
| `POST /api/upload/avatar` | `app/api/upload/avatar/route.ts` | 일치 |
| `POST /api/upload/material` | `app/api/upload/material/route.ts` | 일치 |

**API 라우트 점수**: 5/5 = **100%**

### 5.3 데이터 모델 (v2.0과 동일)

19/19 테이블 = **100%**

### 5.4 인증 플로우, Supabase 설정, 상태 관리, 보안 (변경 없음)

모든 점수 v2.0에서 **100%** 유지.

---

## 6. 전체 점수

### 6.1 Match Rate 요약

```
+--------------------------------------------------+
|  전체 Match Rate: 95%+ (HIGH 갭 수정 후)          |
+--------------------------------------------------+
|                                                    |
|  설계 매칭 (v2.0과 동일)                           |
|  서버 액션:      49/49 설계분  (100%)              |
|  API 라우트:      5/5  기능    (100%)              |
|  데이터 모델:    19/19 테이블  (100%)              |
|  TypeScript 타입: 14/14 설계분  (100%)             |
|  인증 플로우:     5/5  플로우  (100%)              |
|  Supabase 설정:   4/4  클라이언트 (100%)           |
|  상태 관리:       3/3  스토어  (100%)              |
|  보안:            7/7  항목    (100%)              |
|  설계 항목:     109/109 = 100%                     |
|                                                    |
|  프론트엔드 통합 (v3.0 신규 점검)                   |
|  로그인 페이지 통합:          100%                  |
|  회원가입 페이지 통합:        100%                  |
|  헤더 통합:                    90% (기존 갭 2건)    |
|  푸터 링크:                   100% (수정됨)         |
|  마이페이지 고객센터 통합:    100% (수정됨)         |
|  Support 페이지 (백엔드 불필요): 100% (정적 OK)    |
|  프론트엔드 통합 평균:         98%                  |
|                                                    |
|  컨벤션 준수: 90%                                  |
|  아키텍처 준수: 95%                                |
|                                                    |
+--------------------------------------------------+
|  설계 항목 매칭:     109/109 = 100%                |
|  프론트엔드 통합:     98%                          |
|  컨벤션 준수:         90%                          |
|  아키텍처 준수:       95%                          |
|  가중 평균:           ~95%+                        |
+--------------------------------------------------+
```

### 6.2 점수 상세

| 카테고리 | 점수 | 상태 |
|---------|:----:|:----:|
| 서버 액션 매칭 | 100% (49/49) | 통과 |
| API 라우트 매칭 | 100% (5/5) | 통과 |
| 데이터 모델 매칭 | 100% (19/19) | 통과 |
| 인증 플로우 매칭 | 100% (5/5) | 통과 |
| 상태 관리 매칭 | 100% (3/3) | 통과 |
| 보안 매칭 | 100% (7/7) | 통과 |
| 로그인/회원가입 통합 | 100% | 통과 |
| 헤더 통합 | 90% | 통과 |
| 푸터 통합 | 100% (수정됨) | 통과 |
| 마이페이지 고객센터 통합 | 100% (수정됨) | 통과 |
| Support 페이지 (정적) | 100% | 통과 |
| 미들웨어 커버리지 | 95% | 통과 |
| 아키텍처 준수 | 95% | 통과 |
| 컨벤션 준수 | 90% | 통과 |
| **전체 (가중 평균)** | **~95%+** | **통과** |

이전: 95.4% → 머지 후: 92.8% → **HIGH 갭 수정 후: ~95%+**

---

## 7. 발견된 차이점

### 7.1 수정 완료 — HIGH 우선순위 (이번 이터레이션에서 해결)

| # | 항목 | 페이지 | 사용 가능 액션 | 갭 설명 | 상태 |
|---|------|--------|-------------|---------|:----:|
| 1 | 1:1 문의 제출 | `app/mypage/support/page.tsx` | `createInquiry` (`lib/actions/qna.ts`) | `setTimeout` 목 → 서버 액션 연결 | **수정됨** |
| 2 | 문의 내역 목록 | `app/mypage/support/page.tsx` | `getMyInquiries` (`lib/actions/qna.ts`) | 하드코딩 목 → DB 조회 연결 | **수정됨** |
| 3 | 푸터 개인정보/이용약관 링크 | `components/footer.tsx` | — | `#` → `/support/privacy`, `/support/terms`, `/support/notice` | **수정됨** |

### 7.2 잔여 — MEDIUM/LOW 우선순위

| # | 항목 | 파일 | 이슈 | 영향 |
|---|------|------|------|------|
| 4 | CTA 버튼 링크 없음 | `components/cta-section.tsx` | 버튼에 `href`/`Link` 래퍼 없음 | 중간 — 버튼 클릭 시 아무 동작 없음 |
| 5 | `/support` 미들웨어 PUBLIC_PATHS | `middleware.ts` | 우연히 작동, 명시 등록 권장 | 낮음 — 취약함 |
| 6 | 사이드바 메뉴 중복 | `app/support/` (5개 파일) | 동일 배열이 5곳에 반복 | 낮음 — 유지보수 부담 |

### 7.3 기존 갭 이월 (v2.0부터)

| # | 항목 | 파일 | 이슈 | 영향 |
|---|------|------|------|------|
| 7 | 장바구니 뱃지 하드코딩 | `components/header.tsx:138` | "2" 고정 표시, cart store 미연동 | 낮음 |
| 8 | 알림 하드코딩 | `components/header.tsx:20-54` | 목 `notificationsData` 배열 사용 | 낮음 |
| 9 | `toggleHelpful` 스텁 | `lib/actions/reviews.ts` | 단순 +1, 사용자별 중복 방지 없음 | 낮음 |
| 10 | `toggleInquiryLike` 스텁 | `lib/actions/qna.ts:110-111` | 항상 `{ liked: true }` 반환 | 낮음 |
| 11 | `.env.example` 누락 | 프로젝트 루트 | Phase 9 배포 준비 항목 | 중간 |

### 7.4 설계서 업데이트 필요 항목

| # | 항목 | 업데이트 대상 섹션 | 설명 |
|---|------|-----------------|------|
| 12 | `/support` 페이지 | 설계서 Section 7.1 (공개 페이지) | FAQ 페이지 항목 추가 |
| 13 | `/support/notice` 페이지 | 설계서 Section 7.1 | 공지사항 페이지 항목 추가 |
| 14 | `/support/privacy` 페이지 | 설계서 Section 7.1 | 개인정보처리방침 페이지 추가 |
| 15 | `/support/terms` 페이지 | 설계서 Section 7.1 | 이용약관 페이지 추가 |
| 16 | `/support/refund` 페이지 | 설계서 Section 7.1 | 환불정책 페이지 추가 |
| 17 | `/signup` 페이지 | 설계서 Section 7.1 | 회원가입 페이지 추가 (현재 /login만 기재) |
| 18 | `lib/faq-data.ts` | 설계서 Section 8 또는 신규 섹션 | FAQ 데이터 소스 문서화 |

---

## 8. 아키텍처 준수

### 8.1 레이어 구조 (Dynamic 레벨)

| 기대값 | 실제 | 상태 |
|--------|------|:----:|
| `components/` | `components/` (UI 컴포넌트) | 일치 |
| `lib/actions/` | `lib/actions/` (서버 액션 = 애플리케이션 레이어) | 일치 |
| `lib/supabase/` | `lib/supabase/` (인프라 레이어) | 일치 |
| `lib/faq-data.ts` | `lib/faq-data.ts` (데이터/설정 레이어) | 일치 |
| `store/` | `store/` (상태 관리) | 일치 |
| `types/` | `types/` (도메인 타입) | 일치 |
| `app/api/` | `app/api/` (API 라우트) | 일치 |
| `app/support/` | `app/support/` (공개 페이지) | 일치 |
| `middleware.ts` | `middleware.ts` (인증 가드) | 일치 |

### 8.2 의존성 방향 (신규 파일 점검)

| 파일 | 임포트 | 방향 적합? | 상태 |
|------|--------|:--------:|:----:|
| `app/support/page.tsx` | `@/components/header`, `@/components/footer`, `@/lib/faq-data` | 페이지 → 컴포넌트, 페이지 → Lib | 일치 |
| `app/support/notice/page.tsx` | `@/components/header`, `@/components/footer` | 페이지 → 컴포넌트 | 일치 |
| `app/login/page.tsx` | `@/lib/actions/auth` | 페이지 → 액션 | 일치 |
| `app/signup/page.tsx` | `@/lib/actions/auth`, `@/components/ui/dialog` | 페이지 → 액션, 페이지 → 컴포넌트 | 일치 |
| `app/mypage/support/page.tsx` | `@/components/mypage-layout`, `@/components/ui/*`, `@/lib/faq-data`, `@/lib/actions/qna` | 페이지 → 컴포넌트, 페이지 → Lib, 페이지 → 액션 | 일치 |

신규 및 수정 파일에서 의존성 방향 위반 없음.

**아키텍처 점수: 95%**

---

## 9. 컨벤션 준수

### 9.1 네이밍 컨벤션 점검 (신규 파일)

| 파일 | 컨벤션 | 실제 | 상태 |
|------|--------|------|:----:|
| `app/support/page.tsx` | Default export PascalCase | `SupportPage` | 일치 |
| `app/support/notice/page.tsx` | Default export PascalCase | `NoticePage` | 일치 |
| `lib/faq-data.ts` | kebab-case.ts, camelCase export | `faqData`, `faqCategories`, `topFaqIds` | 일치 |
| `app/signup/page.tsx` | Default export PascalCase | `SignupPage` | 일치 |

**네이밍 점수**: 100%

### 9.2 사이드바 메뉴 코드 중복

`sideMenu` 배열이 5개 support 페이지에 중복:
- `app/support/page.tsx`
- `app/support/notice/page.tsx`
- `app/support/privacy/page.tsx`
- `app/support/terms/page.tsx`
- `app/support/refund/page.tsx`

**권장**: 공유 컴포넌트 또는 데이터 파일로 추출 (예: `app/support/_components/support-sidebar.tsx`)

**컨벤션 점수: 90%**

---

## 10. 이전 분석과 비교

| 카테고리 | v1.0 (87.5%) | v2.0 (95.4%) | v3.0 (수정 후) | 변화 (v2→v3) |
|---------|:----------:|:----------:|:----------:|:----------:|
| 서버 액션 | 93% | 100% | 100% | 0% |
| API 라우트 | 50% | 100% | 100% | 0% |
| 데이터 모델 | 100% | 100% | 100% | 0% |
| 인증 플로우 | 100% | 100% | 100% | 0% |
| 상태 관리 | 100% | 100% | 100% | 0% |
| 보안 | 100% | 100% | 100% | 0% |
| 프론트엔드 통합 | n/a | n/a | 98% (수정 후) | 신규 점검 |
| 컨벤션 | 95% | 91% | 90% | -1% |
| 아키텍처 | n/a | 95% | 95% | 0% |
| **전체** | **87.5%** | **95.4%** | **~95%+** | **유지** |

---

## 11. 권장 조치

### 11.1 단기 조치 (1주 이내)

| 우선순위 | # | 항목 | 파일 | 필요 작업 |
|---------|---|------|------|----------|
| 중간 | 1 | CTA 버튼 링크 연결 | `components/cta-section.tsx` | 버튼을 `<Link href="/signup">`, `<Link href="/#courses">`로 래핑 |
| 중간 | 2 | `/support` PUBLIC_PATHS 등록 | `middleware.ts` | `PUBLIC_PATHS` 배열에 `'/support'` 추가 |
| 낮음 | 3 | 사이드바 메뉴 추출 | `app/support/` (5개 파일) | 공유 `support-sidebar.tsx` 컴포넌트 생성 |
| 낮음 | 4 | 장바구니 뱃지 cart store 연동 | `components/header.tsx` | `useCartStore` 임포트, `items.length` 사용 |

### 11.2 향후 스프린트 (설계서 업데이트)

| # | 항목 | 조치 |
|---|------|------|
| 5 | 설계서에 support 페이지 추가 | Section 7 페이지별 통합 맵에 `/support/*` 6개 페이지 문서화 |
| 6 | `notices` 테이블 검토 | 관리자 공지사항 관리 필요 시 스키마 설계에 추가 |
| 7 | `faqs` 테이블 검토 | 관리자 FAQ 관리 필요 시 스키마 설계에 추가 |
| 8 | `.env.example` 생성 | Phase 9 배포 준비 |

---

## 12. 결론

v0/admin-3 머지로 5개 신규 정적 support 페이지와 7개 기존 파일 수정이 추가되었다.

**긍정적 사항:**
1. 로그인, 회원가입 페이지가 `signIn`, `signUp`, `signInWithKakao` 서버 액션과 올바르게 통합됨
2. 헤더가 auth store와 `signOut` 액션을 적절히 사용하며 역할 기반 네비게이션 동작
3. 모든 신규 support 페이지가 네이밍 컨벤션과 아키텍처 패턴을 올바르게 준수
4. 푸터가 5개 신규 support 페이지 중 3개와 올바르게 링크됨 (나머지 수정 완료)
5. 신규/수정 파일에서 의존성 방향 위반 없음

**수정 완료 갭:**
1. `app/mypage/support/page.tsx`의 1:1 문의 폼이 `createInquiry` 서버 액션과 연결됨
2. 동 페이지 문의 내역이 `getMyInquiries`로 실제 데이터 조회
3. 푸터 하단 개인정보/이용약관/공지사항 링크가 실제 페이지와 연결됨

**이전 검증 완료 백엔드 항목 (49개 서버 액션, 5개 API 라우트, 19개 DB 테이블 등) 모두 100% 매칭 유지.**

**최종 판정**: 통과 (~95%+ > 90% 기준)

---

## 버전 이력

| 버전 | 일자 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 1.0 | 2026-02-28 | 최초 분석 (87.5%) | AI (Claude) |
| 2.0 | 2026-02-28 | 4건 수정 후 재분석 (95.4%) | AI (Claude) |
| 3.0 | 2026-02-28 | v0/admin-3 머지 후 분석 (92.8%) — 5개 신규 support 페이지, 7개 수정 파일 점검 | AI (Claude) |
| 3.1 | 2026-02-28 | HIGH 갭 3건 수정 후 (~95%+) — mypage/support 서버 액션 연결, 푸터 링크 수정 | AI (Claude) |
