# Gap Analysis Report: richclass-fullstack-platform

> **Date**: 2026-02-28
> **Match Rate**: 87.5% → 목표: 90%+
> **Phase**: Check (PDCA)

## Overall Scores

| Category | Score | Status |
|----------|:-----:|:------:|
| Server Actions | 93% (39/42) | PASS |
| API Routes | 50% (3/6) | WARN |
| Data Model | 100% | PASS |
| Auth Flow | 100% | PASS |
| State Management | 100% | PASS |
| Security | 100% | PASS |
| Conventions | 95% | PASS |
| **Overall** | **87.5%** | WARN |

## Critical Gaps (Must Fix)

### 1. `lecture_progress` 스키마 불일치
- **Migration**: `last_position INT`, `watched_duration INT`
- **Code**: `progress_percent`, `last_watched_at`, `completed_at`
- **Fix**: 새 마이그레이션으로 컬럼 추가

### 2. `toggleInquiryLike` 미구현
- **Design**: `lib/actions/qna.ts`에 명시
- **Code**: 구현 없음
- **Fix**: qna.ts에 추가

## Major Gaps

### 3. Upload API Routes 미구현
- `POST /api/upload/avatar` (프로필 이미지)
- `POST /api/upload/material` (강의 자료)

### 4. Coupon update/delete 미구현
- `createCoupon`만 존재, update/delete 없음

## Minor Gaps (의도적 변경)

- `POST /api/auth/signout` → Server Action으로 대체 (OK)
- 14개 추가 구현 (enrollments, notifications 등) → 설계서 업데이트 필요

## Fix Priority

| Priority | Item | Expected Impact |
|----------|------|:--------------:|
| Critical | lecture_progress 스키마 수정 | +2% |
| Critical | toggleInquiryLike 구현 | +2% |
| Major | Upload routes 구현 | +4% |
| Minor | Coupon CRUD 완성 | +0.5% |

**예상 수정 후 Match Rate**: ~92%+
