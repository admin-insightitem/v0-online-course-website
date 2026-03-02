# RichClass 시드 데이터 삽입 Plan

> Feature: seed-data
> 작성일: 2026-03-02
> Phase: Plan
> 상위 문서: [05-launch-checklist.md](../../05-todo/05-launch-checklist.md) Phase 1 (1-6)

---

## 1. 목표

로컬 개발환경에서 전체 사용자 흐름(강의 조회 → 장바구니 → 주문 → 수강 → 리뷰)을
테스트할 수 있도록 시드 데이터를 삽입한다.

**핵심 목표:**
- 강사 프로필 + 강의 6개 + 섹션/레슨 데이터로 `/courses` 페이지가 DB 기반으로 동작
- 관리자/강사 대시보드 테스트 가능

## 2. 현재 상태

| 항목 | 상태 | 비고 |
|------|------|------|
| categories 시드 | ✅ 완료 | 마이그레이션에 6개 카테고리 포함 |
| profiles (강사) | ❌ 없음 | auth.users FK 의존 |
| courses | ❌ 없음 | `lib/courses.ts` 하드코딩 데이터 존재 (6개) |
| course_sections | ❌ 없음 | `lib/courses.ts`에 curriculum 데이터 있음 |
| lectures | ❌ 없음 | curriculum.lessons 데이터 있음 |
| coupons | ❌ 없음 | 테스트용 필요 |
| 주문/수강/리뷰 | ❌ 없음 | 실제 사용자 로그인 후 수동 테스트 |

## 3. 제약 사항

### auth.users FK 의존 문제

`profiles.id`는 `auth.users(id)`를 참조하므로, 직접 INSERT가 불가능하다.

**해결 방안:**

| 방법 | 장점 | 단점 | 선택 |
|------|------|------|------|
| A. Supabase Admin API로 가짜 유저 생성 | 깔끔한 auth.users 연동 | API 호출 스크립트 필요 | |
| B. SQL로 auth.users 직접 INSERT | 한 번에 실행 가능 | auth 스키마 직접 조작 위험 | |
| **C. 카카오 로그인 후 role 변경 + SQL 시드** | 안전, 실제 auth 흐름 사용 | 수동 로그인 1~2회 필요 | ✅ |

**방법 C 상세:**
1. 카카오로 로그인하여 본인 계정 생성 (자동으로 profiles에 customer로 등록)
2. SQL Editor에서 본인 계정을 `admin`으로 변경
3. 시드 SQL에서 강사 profiles는 **본인 UUID를 instructor로 사용** (1인 다역)
4. 또는 추가 카카오 계정으로 강사용 로그인 후 UUID 획득

### RLS 우회

시드 SQL은 Supabase SQL Editor에서 실행하므로 **service_role 권한**으로 RLS를 우회한다.

## 4. 시드 데이터 범위

### 4-1. 강사 프로필 (profiles UPDATE)

카카오 로그인으로 생성된 실제 계정의 role을 변경하는 방식.

```sql
-- 본인 계정을 admin으로 변경
UPDATE profiles SET role = 'admin' WHERE id = '{본인_UUID}';

-- (선택) 강사 전용 계정이 있으면
UPDATE profiles SET
  role = 'instructor',
  instructor_title = 'AI 비즈니스 전문가',
  instructor_bio = '10년간 AI 분야에서 활동...'
WHERE id = '{강사_UUID}';
```

> **1인 테스트 시:** admin 계정 1개로 강사 겸용 가능 (admin은 모든 권한 보유)

### 4-2. 강의 6개 (courses)

`lib/courses.ts`의 하드코딩 데이터를 DB에 삽입.

| # | id (slug) | 카테고리 | 가격 |
|---|-----------|---------|------|
| 1 | chatgpt-ai-automation | AI/자동화 | 149,000 |
| 2 | youtube-monetization | 유튜브 | 129,000 |
| 3 | performance-marketing | 마케팅 | 169,000 |
| 4 | premiere-photoshop-creator | 디자인 | 139,000 |
| 5 | smartstore-coupang | 커머스 | 159,000 |
| 6 | instagram-tiktok-sns | SNS | 119,000 |

### 4-3. 섹션 & 레슨 (course_sections + lectures)

`lib/courses.ts`의 `curriculum` 데이터 기반. 총 약 14개 섹션, 50개+ 레슨.

### 4-4. 쿠폰 2개 (coupons)

| 코드 | 이름 | 타입 | 할인 |
|------|------|------|------|
| WELCOME10 | 신규 가입 10% 할인 | percent | 10 |
| SAVE5000 | 5,000원 즉시 할인 | fixed | 5,000 |

### 4-5. 제외 항목 (실제 테스트로 생성)

아래 데이터는 시드에 포함하지 않고 **실제 사용자 흐름 테스트**로 생성:
- orders / order_items (주문 흐름 테스트)
- enrollments (수강 등록 테스트)
- reviews (리뷰 작성 테스트)
- inquiries / inquiry_replies (Q&A 테스트)
- cart_items (장바구니 테스트)
- notifications (알림 자동 생성)
- lecture_progress (수강 진도 추적)

## 5. 작업 단계

### Step 1: 시드 SQL 파일 생성 (30분)

`supabase/seed.sql` 파일 생성:
1. 변수 치환 가능한 형태로 `instructor_id` 플레이스홀더 사용
2. categories 시드는 이미 마이그레이션에 포함 → 중복 방지 (ON CONFLICT)
3. courses 6개 INSERT (UUID 자동 생성)
4. course_sections INSERT (강의별 2~4개 섹션)
5. lectures INSERT (섹션별 3~4개 레슨)
6. coupons 2개 INSERT

### Step 2: 실행 가이드 작성 (10분)

1. 카카오 로그인으로 본인 계정 생성
2. SQL Editor에서 본인 UUID 확인: `SELECT id, email, nickname FROM profiles;`
3. `seed.sql`의 `'{INSTRUCTOR_ID}'` 를 본인 UUID로 치환
4. SQL Editor에서 실행
5. 검증 쿼리 실행

### Step 3: 검증 (10분)

```sql
-- 검증 쿼리
SELECT COUNT(*) AS course_count FROM courses;           -- 6
SELECT COUNT(*) AS section_count FROM course_sections;  -- ~14
SELECT COUNT(*) AS lecture_count FROM lectures;          -- ~50
SELECT COUNT(*) AS coupon_count FROM coupons;            -- 2
```

프론트엔드 확인:
- [ ] `/courses` → 6개 강의 표시 (DB 연동 후)
- [ ] `/courses/{id}` → 강의 상세 + 커리큘럼 표시
- [ ] `/admin` → 대시보드 통계 반영

## 6. 산출물

| 파일 | 용도 |
|------|------|
| `supabase/seed.sql` | 시드 데이터 SQL (SQL Editor에서 실행) |
| 이 문서 (plan.md) | 시드 데이터 범위 및 실행 가이드 |

## 7. 참고: lib/courses.ts → DB 전환 계획

현재 프론트엔드는 `lib/courses.ts` 하드코딩 데이터를 사용 중.
시드 데이터 삽입은 **DB에 데이터를 준비**하는 것이며,
프론트엔드의 DB 전환 (Server Actions으로 데이터 fetch)은 별도 작업으로 진행.

```
현재:  lib/courses.ts (하드코딩) → CoursesSection, CourseDetail
목표:  Supabase DB → Server Actions → CoursesSection, CourseDetail
```

> 이 전환은 seed-data 완료 후 별도 feature로 진행 권장.

## 8. 예상 완료 기준

- [ ] `supabase/seed.sql` 파일 생성
- [ ] seed.sql 실행 가이드 문서화 (Step 2)
- [ ] SQL Editor에서 시드 실행 성공
- [ ] 검증 쿼리로 데이터 확인 (courses 6, sections ~14, lectures ~50)
- [ ] 프론트엔드에서 데이터 확인 가능 (DB 전환 후)
