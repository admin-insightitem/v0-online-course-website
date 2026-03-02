-- =============================================
-- RichClass Seed Data
-- 실행 방법: Supabase Dashboard → SQL Editor → 이 파일 내용 붙여넣기 → Run
-- =============================================
--
-- ⚠️ 실행 전 필수 작업:
--   1. 카카오로 로그인하여 본인 계정 생성
--   2. 아래 쿼리로 본인 UUID 확인:
--      SELECT id, email, nickname, role FROM profiles;
--   3. 아래 변수의 UUID를 본인 것으로 교체
--
-- =============================================

-- ★ 여기에 본인 UUID를 입력하세요 ★
DO $$
DECLARE
  v_instructor_id UUID := '33d75a55-2de4-4a20-9114-e1691cac15ca';  -- ← 본인 UUID로 교체

  -- 카테고리 ID (마이그레이션에서 생성됨)
  v_cat_ai        INT;
  v_cat_youtube   INT;
  v_cat_marketing INT;
  v_cat_design    INT;
  v_cat_commerce  INT;
  v_cat_sns       INT;

  -- 강의 ID
  v_course_1 UUID;
  v_course_2 UUID;
  v_course_3 UUID;
  v_course_4 UUID;
  v_course_5 UUID;
  v_course_6 UUID;

  -- 섹션 ID
  v_section UUID;

BEGIN

-- =============================================
-- 0. 강사 프로필 설정
-- =============================================
UPDATE profiles SET
  role = 'admin',
  instructor_title = 'RichClass 운영자',
  instructor_bio = '플랫폼 관리자 겸 테스트 강사 계정'
WHERE id = v_instructor_id;

-- =============================================
-- 1. 카테고리 ID 조회
-- =============================================
SELECT id INTO v_cat_ai        FROM categories WHERE slug = 'ai-automation';
SELECT id INTO v_cat_youtube   FROM categories WHERE slug = 'youtube';
SELECT id INTO v_cat_marketing FROM categories WHERE slug = 'marketing';
SELECT id INTO v_cat_design    FROM categories WHERE slug = 'design';
SELECT id INTO v_cat_commerce  FROM categories WHERE slug = 'commerce';
SELECT id INTO v_cat_sns       FROM categories WHERE slug = 'sns';

-- =============================================
-- 2. 강의 6개
-- =============================================

-- Course 1: ChatGPT & AI 자동화
INSERT INTO courses (id, instructor_id, category_id, title, description, image_url, level, price, original_price, badge, badge_color, is_published, total_duration, rating_avg, rating_count, student_count, highlights, target_audience, requirements)
VALUES (
  gen_random_uuid(), v_instructor_id, v_cat_ai,
  'ChatGPT & AI 자동화로 월 1,000만원 수익 만들기',
  'ChatGPT와 다양한 AI 도구를 활용하여 실제로 수익을 만드는 방법을 A부터 Z까지 알려드립니다. 단순한 이론이 아닌, 실전에서 바로 적용할 수 있는 검증된 수익화 전략을 배우세요.',
  '/images/course-ai.jpg', '초급 ~ 중급', 149000, 299000,
  'BEST', 'bg-red-500 text-white', TRUE, '12시간 30분',
  4.9, 1247, 8340,
  ARRAY['ChatGPT 프롬프트 엔지니어링 완전 정복','AI 자동화 파이프라인 구축 실습','월 1,000만원 수익 로드맵 제공','실제 수익 사례 10가지 분석','평생 수강 + 커뮤니티 접근권'],
  ARRAY['AI를 활용한 새로운 수익원을 만들고 싶은 분','ChatGPT를 비즈니스에 접목하고 싶은 사업가','자동화로 시간을 절약하고 싶은 직장인','프리랜서로 AI 서비스를 제공하고 싶은 분'],
  ARRAY['기본적인 컴퓨터 사용 능력','ChatGPT 무료 계정 (수업 중 가입 안내)','코딩 경험 불필요']
) RETURNING id INTO v_course_1;

-- Course 2: 유튜브 수익화
INSERT INTO courses (id, instructor_id, category_id, title, description, image_url, level, price, original_price, badge, badge_color, is_published, total_duration, rating_avg, rating_count, student_count, highlights, target_audience, requirements)
VALUES (
  gen_random_uuid(), v_instructor_id, v_cat_youtube,
  '유튜브 수익화 완벽 가이드: 0에서 월 500만원까지',
  '유튜브 채널 개설부터 수익화까지, 0에서 시작해서 월 500만원을 달성하는 실전 로드맵을 제공합니다. 알고리즘 분석, 영상 기획, 편집, 수익 극대화 전략까지 모두 담았습니다.',
  '/images/course-youtube.jpg', '입문 ~ 중급', 129000, 259000,
  'NEW', 'bg-primary text-primary-foreground', TRUE, '15시간 45분',
  4.8, 983, 6210,
  ARRAY['유튜브 알고리즘 완전 분석','조회수 터지는 썸네일 & 제목 공식','수익 극대화 전략 (애드센스 + 브랜디드)','실제 채널 성장 과정 전체 공개','월별 콘텐츠 캘린더 템플릿 제공'],
  ARRAY['유튜브를 시작하고 싶지만 막막한 분','채널은 있지만 구독자가 늘지 않는 분','유튜브로 안정적인 수입을 만들고 싶은 분','부업으로 영상 제작을 시작하고 싶은 직장인'],
  ARRAY['스마트폰 또는 카메라 (스마트폰으로 충분)','구글 계정','기본 영상 편집 경험 (없어도 가능)']
) RETURNING id INTO v_course_2;

-- Course 3: 퍼포먼스 마케팅
INSERT INTO courses (id, instructor_id, category_id, title, description, image_url, level, price, original_price, badge, badge_color, is_published, total_duration, rating_avg, rating_count, student_count, highlights, target_audience, requirements)
VALUES (
  gen_random_uuid(), v_instructor_id, v_cat_marketing,
  '퍼포먼스 마케팅 마스터클래스: ROI 500% 달성 전략',
  '구글, 메타, 네이버 광고를 활용한 퍼포먼스 마케팅 실전 전략을 배웁니다. ROI 500%를 달성하는 광고 운영 노하우와 데이터 기반 의사결정 방법을 체계적으로 알려드립니다.',
  '/images/course-marketing.jpg', '중급 ~ 고급', 169000, 339000,
  'HOT', 'bg-orange-500 text-white', TRUE, '10시간 20분',
  4.9, 756, 4530,
  ARRAY['구글/메타/네이버 광고 통합 전략','ROI 500% 달성 실전 케이스 스터디','광고 예산 최적화 프레임워크','A/B 테스트 설계 및 분석 방법론','실무 대시보드 템플릿 제공'],
  ARRAY['마케팅 실무 경험이 있는 마케터','광고 ROI를 높이고 싶은 사업가','데이터 기반 마케팅을 배우고 싶은 분','마케팅 에이전시 창업을 준비하는 분'],
  ARRAY['기본적인 디지털 마케팅 이해','광고 플랫폼 사용 경험 (권장)','엑셀/스프레드시트 기본 활용 능력']
) RETURNING id INTO v_course_3;

-- Course 4: 프리미어 프로 & 포토샵
INSERT INTO courses (id, instructor_id, category_id, title, description, image_url, level, price, original_price, badge, badge_color, is_published, total_duration, rating_avg, rating_count, student_count, highlights, target_audience, requirements)
VALUES (
  gen_random_uuid(), v_instructor_id, v_cat_design,
  '프리미어 프로 & 포토샵: 1인 크리에이터 완성 패키지',
  '프리미어 프로와 포토샵을 한 번에 마스터하세요. 1인 크리에이터에게 필요한 영상 편집과 썸네일 디자인을 실전 프로젝트로 배웁니다.',
  '/images/course-design.jpg', '입문 ~ 중급', 139000, 279000,
  NULL, '', TRUE, '18시간 10분',
  4.7, 621, 3870,
  ARRAY['프리미어 프로 완전 정복 (기초~고급)','포토샵 썸네일 디자인 마스터','효과음 & BGM 활용법','10개 실전 프로젝트 포함','소스 파일 전체 제공'],
  ARRAY['영상 편집을 처음 시작하는 분','유튜브 썸네일을 직접 만들고 싶은 분','1인 크리에이터를 목표로 하는 분'],
  ARRAY['Adobe Creative Cloud 구독 (무료 체험 가능)','기본적인 컴퓨터 사용 능력']
) RETURNING id INTO v_course_4;

-- Course 5: 스마트스토어 + 쿠팡
INSERT INTO courses (id, instructor_id, category_id, title, description, image_url, level, price, original_price, badge, badge_color, is_published, total_duration, rating_avg, rating_count, student_count, highlights, target_audience, requirements)
VALUES (
  gen_random_uuid(), v_instructor_id, v_cat_commerce,
  '스마트스토어 + 쿠팡: 월매출 5,000만원 실전 로드맵',
  '스마트스토어와 쿠팡을 동시에 운영하여 월매출 5,000만원을 달성하는 실전 전략을 알려드립니다. 상품 소싱부터 마케팅까지 모든 과정을 담았습니다.',
  '/images/course-commerce.jpg', '초급 ~ 중급', 159000, 319000,
  'BEST', 'bg-red-500 text-white', TRUE, '14시간 50분',
  4.8, 892, 5120,
  ARRAY['스마트스토어 & 쿠팡 동시 운영 전략','상품 소싱 노하우 (국내/해외)','상위 노출 SEO 전략','CS 관리 & 리뷰 마케팅','월매출 5,000만원 로드맵'],
  ARRAY['온라인 쇼핑몰을 시작하고 싶은 분','이미 셀러이지만 매출을 올리고 싶은 분','부업으로 이커머스를 시작하고 싶은 직장인'],
  ARRAY['사업자등록증 (수업 중 발급 안내)','초기 자본금 100만원 이상 권장']
) RETURNING id INTO v_course_5;

-- Course 6: 인스타그램 & 틱톡
INSERT INTO courses (id, instructor_id, category_id, title, description, image_url, level, price, original_price, badge, badge_color, is_published, total_duration, rating_avg, rating_count, student_count, highlights, target_audience, requirements)
VALUES (
  gen_random_uuid(), v_instructor_id, v_cat_sns,
  '인스타그램 & 틱톡: SNS 수익화 완전 정복',
  '인스타그램과 틱톡을 활용한 SNS 수익화 전략을 배웁니다. 팔로워를 늘리고 수익으로 연결하는 전 과정을 실전 예시와 함께 알려드립니다.',
  '/images/course-sns.jpg', '입문 ~ 초급', 119000, 239000,
  'NEW', 'bg-primary text-primary-foreground', TRUE, '9시간 40분',
  4.6, 534, 2980,
  ARRAY['인스타그램 & 틱톡 성장 전략','바이럴 콘텐츠 제작법','브랜드 협찬 유치 노하우','SNS 기반 자체 상품 런칭','월 수익 300만원 달성 로드맵'],
  ARRAY['SNS로 수익을 만들고 싶은 분','인플루언서를 목표로 하는 분','자영업 홍보에 SNS를 활용하고 싶은 분'],
  ARRAY['인스타그램 또는 틱톡 계정','스마트폰']
) RETURNING id INTO v_course_6;

-- =============================================
-- 3. 섹션 & 레슨
-- =============================================

-- ── Course 1: AI 자동화 ──

INSERT INTO course_sections (id, course_id, title, sort_order)
VALUES (gen_random_uuid(), v_course_1, 'Section 1. AI 수익화 개론', 1) RETURNING id INTO v_section;
INSERT INTO lectures (section_id, course_id, title, duration, is_free, sort_order) VALUES
  (v_section, v_course_1, '강의 소개 및 로드맵 안내',                  '12:30', TRUE,  1),
  (v_section, v_course_1, 'AI 시대, 왜 지금 시작해야 하는가',          '18:45', TRUE,  2),
  (v_section, v_course_1, '수익화 가능한 AI 비즈니스 모델 10가지',     '25:10', FALSE, 3),
  (v_section, v_course_1, '성공 사례 분석: 월 1,000만원 달성 스토리',  '20:30', FALSE, 4);

INSERT INTO course_sections (id, course_id, title, sort_order)
VALUES (gen_random_uuid(), v_course_1, 'Section 2. ChatGPT 프롬프트 마스터', 2) RETURNING id INTO v_section;
INSERT INTO lectures (section_id, course_id, title, duration, is_free, sort_order) VALUES
  (v_section, v_course_1, '프롬프트 엔지니어링 기초',               '22:15', FALSE, 1),
  (v_section, v_course_1, '고급 프롬프트 테크닉 10가지',            '30:40', FALSE, 2),
  (v_section, v_course_1, '비즈니스용 프롬프트 템플릿 만들기',      '28:20', FALSE, 3),
  (v_section, v_course_1, '실습: 나만의 AI 어시스턴트 만들기',      '35:50', FALSE, 4);

INSERT INTO course_sections (id, course_id, title, sort_order)
VALUES (gen_random_uuid(), v_course_1, 'Section 3. AI 자동화 시스템 구축', 3) RETURNING id INTO v_section;
INSERT INTO lectures (section_id, course_id, title, duration, is_free, sort_order) VALUES
  (v_section, v_course_1, 'Zapier & Make 자동화 기초',              '25:30', FALSE, 1),
  (v_section, v_course_1, 'AI 콘텐츠 자동 생성 파이프라인',        '32:15', FALSE, 2),
  (v_section, v_course_1, '이메일 마케팅 자동화 구축',              '28:45', FALSE, 3),
  (v_section, v_course_1, '소셜 미디어 자동 포스팅 시스템',         '30:20', FALSE, 4);

INSERT INTO course_sections (id, course_id, title, sort_order)
VALUES (gen_random_uuid(), v_course_1, 'Section 4. 수익화 실전 프로젝트', 4) RETURNING id INTO v_section;
INSERT INTO lectures (section_id, course_id, title, duration, is_free, sort_order) VALUES
  (v_section, v_course_1, 'AI 블로그 수익화 전략',                  '26:10', FALSE, 1),
  (v_section, v_course_1, 'AI 상품 리뷰 자동화',                    '24:30', FALSE, 2),
  (v_section, v_course_1, '프리랜서 AI 서비스 런칭',                '28:40', FALSE, 3),
  (v_section, v_course_1, '월 1,000만원 수익 로드맵 수립',          '35:20', FALSE, 4);

-- ── Course 2: 유튜브 수익화 ──

INSERT INTO course_sections (id, course_id, title, sort_order)
VALUES (gen_random_uuid(), v_course_2, 'Section 1. 유튜브 시작하기', 1) RETURNING id INTO v_section;
INSERT INTO lectures (section_id, course_id, title, duration, is_free, sort_order) VALUES
  (v_section, v_course_2, '유튜브 수익화의 모든 것',               '15:20', TRUE,  1),
  (v_section, v_course_2, '니치 마켓 찾기: 나만의 포지션',         '22:30', TRUE,  2),
  (v_section, v_course_2, '채널 브랜딩 완벽 가이드',               '18:45', FALSE, 3),
  (v_section, v_course_2, '첫 영상 기획부터 업로드까지',           '28:10', FALSE, 4);

INSERT INTO course_sections (id, course_id, title, sort_order)
VALUES (gen_random_uuid(), v_course_2, 'Section 2. 알고리즘과 성장 전략', 2) RETURNING id INTO v_section;
INSERT INTO lectures (section_id, course_id, title, duration, is_free, sort_order) VALUES
  (v_section, v_course_2, '유튜브 알고리즘 작동 원리',             '25:30', FALSE, 1),
  (v_section, v_course_2, 'CTR 높이는 썸네일 디자인',              '30:20', FALSE, 2),
  (v_section, v_course_2, '검색 최적화(SEO) 전략',                 '22:45', FALSE, 3),
  (v_section, v_course_2, '커뮤니티 활용 성장 가속화',             '18:30', FALSE, 4);

INSERT INTO course_sections (id, course_id, title, sort_order)
VALUES (gen_random_uuid(), v_course_2, 'Section 3. 수익화 극대화', 3) RETURNING id INTO v_section;
INSERT INTO lectures (section_id, course_id, title, duration, is_free, sort_order) VALUES
  (v_section, v_course_2, '애드센스 수익 최적화',                  '24:15', FALSE, 1),
  (v_section, v_course_2, '브랜디드 콘텐츠 계약 노하우',           '28:40', FALSE, 2),
  (v_section, v_course_2, '멤버십 & 슈퍼챗 전략',                  '20:30', FALSE, 3),
  (v_section, v_course_2, '다중 수익원 구축하기',                   '32:10', FALSE, 4);

-- ── Course 3: 퍼포먼스 마케팅 ──

INSERT INTO course_sections (id, course_id, title, sort_order)
VALUES (gen_random_uuid(), v_course_3, 'Section 1. 퍼포먼스 마케팅 기초', 1) RETURNING id INTO v_section;
INSERT INTO lectures (section_id, course_id, title, duration, is_free, sort_order) VALUES
  (v_section, v_course_3, '퍼포먼스 마케팅이란?',                  '14:20', TRUE,  1),
  (v_section, v_course_3, '핵심 지표(KPI) 설정법',                 '20:30', FALSE, 2),
  (v_section, v_course_3, '고객 여정과 퍼널 설계',                 '25:15', FALSE, 3);

INSERT INTO course_sections (id, course_id, title, sort_order)
VALUES (gen_random_uuid(), v_course_3, 'Section 2. 플랫폼별 광고 전략', 2) RETURNING id INTO v_section;
INSERT INTO lectures (section_id, course_id, title, duration, is_free, sort_order) VALUES
  (v_section, v_course_3, '구글 광고 완전 정복',                   '35:20', FALSE, 1),
  (v_section, v_course_3, '메타 광고 고급 타겟팅',                 '30:45', FALSE, 2),
  (v_section, v_course_3, '네이버 검색 광고 최적화',               '28:10', FALSE, 3);

-- ── Course 4: 프리미어 프로 & 포토샵 ──

INSERT INTO course_sections (id, course_id, title, sort_order)
VALUES (gen_random_uuid(), v_course_4, 'Section 1. 프리미어 프로 기초', 1) RETURNING id INTO v_section;
INSERT INTO lectures (section_id, course_id, title, duration, is_free, sort_order) VALUES
  (v_section, v_course_4, '프리미어 프로 인터페이스 소개',         '15:30', TRUE,  1),
  (v_section, v_course_4, '기본 편집 워크플로우',                   '22:45', FALSE, 2),
  (v_section, v_course_4, '컷 편집 & 트랜지션',                    '28:20', FALSE, 3);

-- ── Course 5: 스마트스토어 + 쿠팡 ──

INSERT INTO course_sections (id, course_id, title, sort_order)
VALUES (gen_random_uuid(), v_course_5, 'Section 1. 이커머스 시작하기', 1) RETURNING id INTO v_section;
INSERT INTO lectures (section_id, course_id, title, duration, is_free, sort_order) VALUES
  (v_section, v_course_5, '이커머스 시장 분석',                    '18:20', TRUE,  1),
  (v_section, v_course_5, '사업자 등록 & 통신판매업 신고',         '12:30', FALSE, 2),
  (v_section, v_course_5, '스마트스토어 vs 쿠팡 비교 분석',        '20:15', FALSE, 3);

-- ── Course 6: 인스타그램 & 틱톡 ──

INSERT INTO course_sections (id, course_id, title, sort_order)
VALUES (gen_random_uuid(), v_course_6, 'Section 1. SNS 수익화 기초', 1) RETURNING id INTO v_section;
INSERT INTO lectures (section_id, course_id, title, duration, is_free, sort_order) VALUES
  (v_section, v_course_6, 'SNS 수익화의 모든 것',                  '14:10', TRUE,  1),
  (v_section, v_course_6, '나만의 브랜드 포지셔닝',                '20:30', FALSE, 2),
  (v_section, v_course_6, '콘텐츠 전략 수립',                      '18:45', FALSE, 3);

-- =============================================
-- 4. 쿠폰
-- =============================================
INSERT INTO coupons (code, name, type, discount_value, min_purchase, max_discount, usage_limit, is_active, starts_at, expires_at) VALUES
  ('WELCOME10', '신규 가입 10% 할인', 'percent', 10, 50000, 30000, 1000, TRUE, NOW(), NOW() + INTERVAL '90 days'),
  ('SAVE5000',  '5,000원 즉시 할인',  'fixed',   5000, 30000, NULL,  500,  TRUE, NOW(), NOW() + INTERVAL '60 days');

-- =============================================
-- 완료 메시지
-- =============================================
RAISE NOTICE '✅ 시드 데이터 삽입 완료!';
RAISE NOTICE '  - 강의: 6개';
RAISE NOTICE '  - 섹션: 12개';
RAISE NOTICE '  - 레슨: 43개';
RAISE NOTICE '  - 쿠폰: 2개';

END $$;

-- =============================================
-- 검증 쿼리 (별도 실행)
-- =============================================
-- SELECT COUNT(*) AS courses FROM courses;
-- SELECT COUNT(*) AS sections FROM course_sections;
-- SELECT COUNT(*) AS lectures FROM lectures;
-- SELECT COUNT(*) AS coupons FROM coupons;
-- SELECT c.title, COUNT(cs.id) AS sections, COUNT(l.id) AS lectures
--   FROM courses c
--   LEFT JOIN course_sections cs ON cs.course_id = c.id
--   LEFT JOIN lectures l ON l.course_id = c.id
--   GROUP BY c.title;
