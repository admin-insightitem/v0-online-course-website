# 시드 데이터 실행 가이드

> 대상 파일: `supabase/seed.sql`
> 사전 조건: Phase 1 (1-1 ~ 1-5) 완료 상태

---

## 테스트 계정 구성

두 개의 카카오 계정으로 로그인하여 아래와 같이 역할을 분리한다.

| 역할 | email | nickname | UUID | 용도 |
|------|-------|----------|------|------|
| admin (강사 겸용) | water001122@naver.com | 비상주어때주식회사바산 | `33d75a55-2de4-4a20-9114-e1691cac15ca` | 강의 등록, 관리자/강사 대시보드 |
| customer | k1k1m1@naver.com | 김경민 | `abe93e84-5568-4fdd-87eb-4492f934d4df` | 강의 조회, 장바구니, 주문, 수강, 리뷰 |

> 두 계정 모두 카카오 로그인 완료 상태. `profiles` 테이블에 이미 등록되어 있음.

---

## 실행 순서

### 1. (완료) 카카오 로그인으로 두 계정 생성

두 계정 모두 카카오 로그인이 완료되어 `profiles` 테이블에 존재함.

```sql
SELECT id, email, nickname, role FROM profiles;
```

| id | email | nickname | role |
|----|-------|----------|------|
| `33d75a55-2de4-4a20-9114-e1691cac15ca` | water001122@naver.com | 비상주어때주식회사바산 | customer |
| `abe93e84-5568-4fdd-87eb-4492f934d4df` | k1k1m1@naver.com | 김경민 | customer |

### 2. seed.sql UUID 확인

`supabase/seed.sql` 상단에 admin 계정의 UUID가 이미 설정되어 있음:

```sql
v_instructor_id UUID := '33d75a55-2de4-4a20-9114-e1691cac15ca';  -- water001122@naver.com
```

> 이미 올바른 UUID가 입력되어 있으므로 **수정 불필요**.

### 3. SQL Editor에서 실행

1. Supabase Dashboard → **SQL Editor** → **New query**
2. `seed.sql` 파일 내용 전체를 복사 → 붙여넣기
3. **Run** 클릭
4. `Success` 메시지 확인

### 4. 검증

실행 후 새 쿼리에서 아래를 실행:

```sql
SELECT 'courses' AS table_name, COUNT(*) AS count FROM courses
UNION ALL
SELECT 'sections', COUNT(*) FROM course_sections
UNION ALL
SELECT 'lectures', COUNT(*) FROM lectures
UNION ALL
SELECT 'coupons', COUNT(*) FROM coupons;
```

**예상 결과:**

| table_name | count |
|------------|-------|
| courses    | 6     |
| sections   | 12    |
| lectures   | 43    |
| coupons    | 2     |

### 5. 역할 확인

```sql
SELECT id, nickname, role, instructor_title FROM profiles;
```

**예상 결과:**

| nickname | role | instructor_title |
|----------|------|-----------------|
| 비상주어때주식회사바산 | **admin** | RichClass 운영자 |
| 김경민 | **customer** | NULL |

---

## 테스트 시나리오

### admin 계정 (water001122@naver.com)

- `/admin` → 관리자 대시보드 접근
- `/teacher` → 강사 대시보드 접근
- 강의 관리, 쿠폰 관리, 회원 관리 등

### customer 계정 (k1k1m1@naver.com)

- `/courses` → 강의 목록 조회
- `/courses/{id}` → 강의 상세 + 커리큘럼 확인
- 장바구니 담기 → 쿠폰 적용 → 주문
- 수강 → 진도 추적
- 리뷰 작성, Q&A 문의

---

## 삽입되는 데이터 요약

| 테이블 | 건수 | 내용 |
|--------|------|------|
| profiles | UPDATE 1 | water001122 → admin 역할 + 강사 정보 |
| courses | 6 | AI자동화, 유튜브, 마케팅, 디자인, 커머스, SNS |
| course_sections | 12 | 강의별 1~4개 섹션 |
| lectures | 43 | 섹션별 3~4개 레슨 (무료 레슨 포함) |
| coupons | 2 | WELCOME10 (10%), SAVE5000 (5,000원) |

---

## 초기화 (필요 시)

시드 데이터를 삭제하고 다시 넣고 싶을 때:

```sql
DELETE FROM lectures;
DELETE FROM course_sections;
DELETE FROM courses;
DELETE FROM coupons;
```

이후 seed.sql을 다시 실행하면 된다.

> 프로필 역할은 초기화되지 않음. 필요 시 수동으로 변경:
> `UPDATE profiles SET role = 'customer', instructor_title = NULL, instructor_bio = NULL WHERE id = '33d75a55-2de4-4a20-9114-e1691cac15ca';`

---

## 트러블슈팅

### "violates foreign key constraint" 에러

UUID가 `profiles` 테이블에 존재하지 않음.
→ 카카오 로그인을 먼저 완료했는지 확인

### "duplicate key value" 에러

이미 시드 데이터가 존재함.
→ 위의 초기화 쿼리 실행 후 재시도

### 카테고리 관련 에러

마이그레이션(`00001_initial_schema.sql`)이 실행되지 않았을 수 있음.
→ `SELECT * FROM categories;` 로 6개 카테고리 존재 확인
