# RichClass 로컬 개발환경 구축 Plan

> Feature: richclass-local-env-setup
> 작성일: 2026-03-01
> Phase: Plan
> 상위 문서: [05-launch-checklist.md](../../05-todo/05-launch-checklist.md) Phase 1

---

## 1. 목표

Supabase 프로젝트를 생성하고, 환경변수를 설정하고, DB 마이그레이션을 실행하여
`pnpm dev`로 로컬 서버를 띄우고 Kakao OAuth 로그인이 동작하는 상태를 만든다.

> **변경사항 (2026-03-01)**: 이메일 가입 제거 → Kakao OAuth만 사용

## 2. 현재 상태

| 항목 | 상태 | 비고 |
|------|------|------|
| 프론트엔드 UI | ✅ 완료 | Vercel에서 UI 작업 완료 |
| Server Actions (58개) | ✅ 완료 | Supabase 클라이언트 사용 |
| DB 스키마 (19 테이블) | ✅ 준비됨 | 마이그레이션 3개 파일 |
| `.env.local` | ⚠️ 플레이스홀더 | 모두 `your_xxx` 상태 |
| Supabase 프로젝트 | ❌ 미생성 | 생성 필요 |
| Auth 설정 (Kakao OAuth만) | ❌ 미설정 | 이메일 가입 제거, Kakao만 사용 |
| Storage 버킷 | ❌ 미생성 | `profiles` 버킷 필요 |

## 3. 작업 단계 (Step-by-Step)

### Step 1: Supabase 프로젝트 생성 (10분)

1. [supabase.com](https://supabase.com) 접속 → 회원가입/로그인
2. **New Project** 클릭
3. 설정:
   - **Organization**: 새로 만들거나 기존 선택
   - **Project Name**: `richclass-dev` (개발용)
   - **Database Password**: 안전한 비밀번호 입력 → **반드시 메모**
   - **Region**: `Northeast Asia (Tokyo)` 선택 (한국에서 가장 가까움)
   - **Plan**: Free tier (개발용으로 충분)
4. **Create new project** 클릭 → 2~3분 대기

### Step 2: `.env.local` 실제 값 설정 (5분)

프로젝트 생성 후 **Settings → API** 에서 키 확인:

```env
# Supabase (Settings → API 에서 복사)
NEXT_PUBLIC_SUPABASE_URL=https://[프로젝트ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon public 키]
SUPABASE_SERVICE_ROLE_KEY=[service_role 키 - 절대 프론트에 노출 금지]

# Kakao (Kakao Developers → 앱 설정 → 앱 키)
NEXT_PUBLIC_KAKAO_JS_KEY=[JavaScript 키]
NEXT_PUBLIC_KAKAO_CHANNEL_ID=[카카오톡 채널 프로필 ID]

# Mux (Phase 2에서 설정 - 지금은 빈값)
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
MUX_SIGNING_KEY=
MUX_SIGNING_KEY_PRIVATE=

# Webhook (임의 문자열 생성)
WEBHOOK_SECRET=whsec_dev_임의문자열

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**키 위치 안내:**
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` `public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` `secret` → `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: DB 마이그레이션 실행 (10분)

Supabase Dashboard → **SQL Editor** 에서 아래 2개 파일을 **순서대로** 실행:

| 순서 | 파일 | 내용 |
|------|------|------|
| 1 | `supabase/migrations/00000_reset_all.sql` | 전체 초기화 (트리거, 함수, 테이블, ENUM 삭제 + auth.users 삭제) |
| 2 | `supabase/migrations/00001_initial_schema.sql` | 19 테이블 + RLS + `get_my_role()` 헬퍼 함수 + 트리거 + 인덱스 + 카테고리 시드 |

> **참고**: 기존 00002~00004 마이그레이션은 00001에 통합되어 삭제됨
> - mux_upload_id (lectures), progress_percent/last_watched_at/completed_at (lecture_progress)
> - 카카오 프로필 필드 (birthyear, birthday, birthday_type, gender)
> - email nullable 처리, handle_new_user 트리거 카카오 매핑

> **RLS 무한재귀 방지**: 관리자 권한 확인 시 `profiles` 테이블을 직접 조회하면 무한재귀 발생.
> `get_my_role()` SECURITY DEFINER 함수를 통해 RLS를 우회하여 역할을 조회합니다.

**실행 방법:**
1. Supabase Dashboard → 좌측 메뉴 **SQL Editor** 클릭
2. **New query** 클릭
3. **먼저** `00000_reset_all.sql` 내용을 복사 → 붙여넣기 → **Run** → `Success` 확인
4. **새 쿼리**에서 `00001_initial_schema.sql` 내용을 복사 → 붙여넣기 → **Run** → `Success` 확인
5. 에러 없이 두 파일 모두 `Success` 메시지 확인

> ⚠️ **reset 실행 시 auth.users도 삭제됩니다.** 기존 로그인 세션이 무효화되므로
> 브라우저 쿠키를 삭제하고 다시 카카오 로그인을 진행해야 합니다.
> (DevTools → Application → Cookies → Clear all)

**검증:**
- 좌측 **Table Editor** 클릭 → 19개 테이블이 보이는지 확인
- `profiles`, `courses`, `enrollments`, `orders` 등이 목록에 있어야 함
- **Database → Functions** → `get_my_role`, `handle_new_user` 함수 2개 존재 확인

### Step 4: Supabase Auth 설정 (30분)

#### 4-1. 이메일 인증 비활성화
1. **Authentication → Providers → Email**
   - `Enable Email provider` → **❌ OFF (비활성화)**
   - 이메일/비밀번호 가입을 사용하지 않으므로 비활성화

#### 4-2. Kakao OAuth 설정 (필수)
1. [Kakao Developers](https://developers.kakao.com) 접속
2. **애플리케이션 추가** → 앱 이름: `RichClass`
3. **카카오 로그인 → 일반** → 사용 설정 **ON**
4. **카카오 로그인 → 일반** → OpenID Connect **ON**
5. **앱 → 플랫폼 키 → REST API 키 수정** → 카카오 로그인 리다이렉트 URI 등록:
   ```
   https://aakhlrdcraixnxeddjri.supabase.co/auth/v1/callback
   ```
6. **앱 → 플랫폼 키 → REST API 키** → 클라이언트 시크릿 생성
7. **카카오 로그인 → 동의항목** 설정:

   **개발 단계 (개인앱):**
   - ✅ 닉네임 → **필수 동의**
   - ✅ 프로필 사진 → **필수 동의**

   **비즈앱 전환 후 추가 설정:**
   - ✅ 카카오계정(이메일) → **필수 동의** (`account_email`)
   - ✅ 이름 → **필수 동의** (`name`)
   - ✅ 전화번호 → **선택 동의** (`phone_number`, 형식: `+82 10-1234-5678`)
   - ✅ 출생 연도 → **선택 동의** (`birthyear`, 형식: `YYYY`)
   - ✅ 생일 → **선택 동의** (`birthday`, 형식: `MMDD`)
   - ✅ 생일 타입 → **선택 동의** (`birthday_type`, 값: `SOLAR`/`LUNAR`)
   - ✅ 성별 → **선택 동의** (`gender`, 값: `male`/`female`)
   - ✅ 카카오톡 채널 추가 상태 → **선택 동의** (`plusfriends`, 비즈앱+채널 연결 필요)

   > **참고**: 이메일 외 항목은 비즈앱 전환 후 설정 가능. 개발 중에는 닉네임+프로필 사진만으로 테스트
8. Supabase Dashboard → **Authentication → Providers → Kakao**:
   - `Kakao enabled` → **ON** (토글 활성화)
   - `REST API Key` = 카카오 앱의 REST API 키 (Kakao Developers → 앱 키)
   - `Client Secret Code` = 카카오 로그인 클라이언트 시크릿 코드 (Kakao Developers → 앱 → 플랫폼 키 → 클라이언트 시크릿 → 코드)
   - `Allow users without an email` → **ON** (개발 단계에서 카카오가 이메일을 반환하지 않으므로 반드시 활성화)
   - `Callback URL (for OAuth)` → 자동 생성됨 (카카오 리다이렉트 URI에 등록한 값과 동일한지 확인)

#### 4-3. Auth Redirect URL 설정
1. **Authentication → URL Configuration**:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: `http://localhost:3000/**`

### Step 5: Storage 버킷 생성 및 RLS 정책 설정 (15분)

#### 5-1. 버킷 생성

1. **Storage** → **New Bucket** 클릭
2. 설정:
   - **Name**: `profiles`
   - **Public bucket**: ✅ 체크 (아바타 이미지 공개 접근)
3. **Create bucket** 클릭

#### 5-2. RLS 정책 설정

> **파일 저장 구조**: `{user_id}/filename.jpg` (사용자별 폴더 분리)

**진입 경로:**
```
Storage → Files → Policies 탭 → Buckets 섹션 → PROFILES 옆 "New policy"
```

> ⚠️ Policies 탭에는 **Buckets** 섹션과 **Schema** 섹션이 있음.
> 반드시 **Buckets 섹션**의 PROFILES에서 정책을 추가해야 해당 버킷 전용 정책이 생성됨.
> Schema 섹션(STORAGE.OBJECTS / STORAGE.BUCKETS)은 모든 버킷에 적용되는 전역 정책임.

**정책 생성 방식:**
- "New policy" 클릭 → **"For full customization"** 선택
- 설정 항목: Policy name, Allowed operation, Target roles, Policy definition

**추가할 정책 4개:**

| # | Policy name | Operation | Target roles | Policy definition |
|---|-------------|-----------|--------------|-------------------|
| 1 | `Allow public read` | **SELECT** | `Defaults to all (public)` | `bucket_id = 'profiles'` |
| 2 | `Allow authenticated upload` | **INSERT** | `authenticated` | `bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]` |
| 3 | `Allow individual update` | **UPDATE** | `authenticated` | `bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]` |
| 4 | `Allow individual delete` | **DELETE** | `authenticated` | `bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]` |

**INSERT / UPDATE / DELETE Policy definition:**
```sql
bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]
```

**SQL 함수 설명:**

| 함수 | 역할 |
|------|------|
| `auth.uid()` | 현재 로그인한 사용자의 UUID 반환 |
| `auth.uid()::text` | UUID를 문자열로 캐스팅 |
| `storage.foldername(name)` | 파일 경로에서 폴더명 배열 반환 |
| `(storage.foldername(name))[1]` | 첫 번째 폴더명 (= user_id) |

**생성 결과:**

4개 정책 생성 후 실제로는 **6개 정책**이 표시됨.
UPDATE/DELETE 정책 생성 시 Supabase가 companion SELECT 정책을 자동 생성함
(PostgreSQL에서 UPDATE/DELETE 실행 전 해당 row를 먼저 읽어야 하기 때문).

```
Allow public read              - SELECT  - public          (직접 생성)
Allow authenticated upload     - INSERT  - authenticated   (직접 생성)
Allow individual update _1     - SELECT  - authenticated   (자동 생성)
Allow individual update _0     - UPDATE  - authenticated   (직접 생성)
Allow individual delete _1     - SELECT  - authenticated   (자동 생성)
Allow individual delete _0     - DELETE  - authenticated   (직접 생성)
```

**접근 권한 요약:**

| 작업 | 비로그인 | 로그인 (본인 폴더) | 로그인 (타인 폴더) |
|------|---------|-------------------|-------------------|
| 읽기 (SELECT) | O | O | O |
| 업로드 (INSERT) | X | O | X |
| 수정 (UPDATE) | X | O | X |
| 삭제 (DELETE) | X | O | X |

### Step 6: 로컬 서버 실행 및 테스트 (10분)

```bash
# 의존성 설치 (이미 설치되어 있으면 생략)
pnpm install

# 개발 서버 실행
pnpm dev
```

> ⚠️ 이 프로젝트는 **pnpm** 패키지 매니저를 사용합니다 (`pnpm-lock.yaml` 기준).
> `npm install`을 사용하면 lockfile 호환 문제로 오류가 발생합니다.

**테스트 체크리스트:**
- [ ] `http://localhost:3000` 접속 → 메인 페이지 표시
- [ ] `/login` → 카카오 로그인 버튼 클릭 → Kakao OAuth → `/` 홈 리다이렉트 (admin→`/admin`, instructor→`/teacher`)
  - **하나의 계정으로 역할별 리다이렉트 테스트하기:**
  - Supabase Dashboard → SQL Editor에서 role 변경 후 로그아웃 → 재로그인으로 확인
  - ① `UPDATE profiles SET role = 'admin' WHERE email = '본인이메일';` → 재로그인 → `/admin` 리다이렉트 확인
  - ② `UPDATE profiles SET role = 'instructor' WHERE email = '본인이메일';` → 재로그인 → `/teacher` 리다이렉트 확인
  - ③ `UPDATE profiles SET role = 'customer' WHERE email = '본인이메일';` → 재로그인 → `/` 홈 리다이렉트 확인
  - ④ 테스트 완료 후 원하는 role로 복원
- [ ] `/courses` → 강의 목록 페이지 (비어있음 - 정상)
- [ ] `/admin` → 권한 없으면 `/access-denied` 리다이렉트

## 4. 필요 리소스

| 리소스 | 용도 | 비용 |
|--------|------|------|
| Supabase Free tier | DB + Auth + Storage | 무료 |
| Kakao Developers | OAuth 소셜 로그인 | 무료 |

## 5. 주의사항

- `SUPABASE_SERVICE_ROLE_KEY`는 **절대** 클라이언트/브라우저에 노출하면 안 됨
- 마이그레이션은 `00001_initial_schema.sql` 1개 파일만 실행 (모든 변경사항 통합됨)
- Kakao OAuth가 유일한 인증 수단이므로 Phase 1에서 반드시 설정 필요
- Free tier 제한: DB 500MB, Storage 1GB, 월 50,000 Auth 요청

### 카카오 OAuth 데이터 관련 주의사항

- **개발 단계**: 닉네임, 프로필 사진만 수신 가능 (이메일, 실명, 전화번호는 비즈앱 필요)
- **모든 필드 nullable**: 사용자가 동의하지 않으면 값이 오지 않음
- **phone_number 형식**: `+82 10-1234-5678` → DB 저장 전 파싱 필요
- **birthday**: `MMDD` 4자리 문자열, birthyear: `YYYY` 4자리 문자열
- **gender**: `male` / `female` 영문 소문자
- **재로그인 시 프로필 동기화**: callback에서 upsert 처리 (구현 완료)

### 카카오톡 채널 추가 기능

- **채널 상태 저장**: `profiles.kakao_channel_connected` (BOOLEAN DEFAULT FALSE)
- **클라이언트 연동**: Kakao JS SDK `Kakao.Channel.followChannel()` 사용
- **채널 상태는 OAuth 메타데이터에 포함되지 않음** → 별도 API(`/v1/api/talk/channels`)로 확인
- **환경변수 필요**:
  - `NEXT_PUBLIC_KAKAO_JS_KEY`: 카카오 앱의 JavaScript 키
  - `NEXT_PUBLIC_KAKAO_CHANNEL_ID`: 카카오톡 채널 프로필 ID
- **비즈앱 필요**: `plusfriends` 동의항목으로 채널 관계 조회 시 비즈앱 전환 필요
- **채널 관계 상태**: `ADDED` (추가), `BLOCKED` (차단), `NONE` (이력 없음)

## 6. 예상 완료 기준

- [x] Supabase 프로젝트 생성됨
- [x] `.env.local`에 실제 키 설정됨
- [x] 19개 테이블 마이그레이션 완료
- [x] Auth 이메일 Provider 비활성화
- [x] Kakao OAuth Provider 설정 완료
- [x] Storage `profiles` 버킷 생성됨
- [x] `pnpm dev` → 로컬 서버 정상 실행
- [x] Kakao OAuth 로그인 동작 확인
