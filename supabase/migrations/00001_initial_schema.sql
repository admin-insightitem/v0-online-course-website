-- =============================================
-- RichClass DB Schema (Supabase PostgreSQL)
-- Migration: 00001_initial_schema
-- =============================================

-- 0. Custom Types
CREATE TYPE user_role AS ENUM ('customer', 'instructor', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'completed', 'cancelled', 'refunded');
CREATE TYPE refund_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE coupon_type AS ENUM ('percent', 'fixed');
CREATE TYPE inquiry_type AS ENUM ('qna', 'support');
CREATE TYPE inquiry_status AS ENUM ('pending', 'answered', 'closed');

-- 1. Profiles (Supabase Auth Extension)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  nickname TEXT,
  phone TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  marketing_agreed BOOLEAN DEFAULT FALSE,
  join_method TEXT DEFAULT 'email',
  instructor_title TEXT,
  instructor_bio TEXT,
  birthyear TEXT,
  birthday TEXT,
  birthday_type TEXT,
  gender TEXT,
  kakao_channel_connected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
COMMENT ON TABLE profiles IS '사용자 프로필 - Supabase Auth 연동, 카카오 OAuth 메타데이터 포함';

-- 2. Categories
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE categories IS '강의 카테고리 - AI/자동화, 유튜브, 마케팅 등';

-- 3. Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL REFERENCES profiles(id),
  category_id INT NOT NULL REFERENCES categories(id),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  level TEXT NOT NULL DEFAULT 'beginner',
  price INT NOT NULL DEFAULT 0,
  original_price INT,
  badge TEXT,
  badge_color TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  total_duration TEXT,
  highlights TEXT[],
  target_audience TEXT[],
  requirements TEXT[],
  rating_avg NUMERIC(3,2) DEFAULT 0,
  rating_count INT DEFAULT 0,
  student_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE courses IS '강의 - 온라인 강의 정보';

-- 4. Course Sections
CREATE TABLE course_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE course_sections IS '강의 섹션 - 강의를 구성하는 챕터/섹션 단위';

-- 5. Lectures
CREATE TABLE lectures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration TEXT,
  is_free BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  mux_asset_id TEXT,
  mux_playback_id TEXT,
  mux_upload_id TEXT,
  mux_upload_status TEXT DEFAULT 'waiting',
  materials_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE lectures IS '강의 영상 - Mux 연동 개별 영상 콘텐츠';

-- 6. Enrollments
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  order_id UUID,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);
COMMENT ON TABLE enrollments IS '수강 등록 - 사용자의 강의 수강 내역';

-- 7. Lecture Progress
CREATE TABLE lecture_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  lecture_id UUID NOT NULL REFERENCES lectures(id),
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  progress_percent INT DEFAULT 0,
  last_watched_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lecture_id)
);
COMMENT ON TABLE lecture_progress IS '수강 진도 - 개별 영상의 시청 진행률';

-- 8. Cart Items
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);
COMMENT ON TABLE cart_items IS '장바구니 - 구매 전 담아둔 강의 목록';

-- 9. Coupons
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type coupon_type NOT NULL DEFAULT 'percent',
  discount_value INT NOT NULL,
  min_purchase INT DEFAULT 0,
  max_discount INT,
  usage_limit INT,
  usage_count INT DEFAULT 0,
  applicable_course_ids UUID[],
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE coupons IS '쿠폰 - 할인 쿠폰 (퍼센트/정액)';

-- 10. Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  order_number TEXT NOT NULL UNIQUE,
  total_amount INT NOT NULL,
  discount_amount INT DEFAULT 0,
  coupon_id UUID REFERENCES coupons(id),
  payment_method TEXT,
  status order_status NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE orders IS '주문 - 강의 결제 주문 내역';

-- 11. Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id),
  price INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE order_items IS '주문 항목 - 주문에 포함된 개별 강의';

-- Add order FK to enrollments
ALTER TABLE enrollments
  ADD CONSTRAINT fk_enrollment_order
  FOREIGN KEY (order_id) REFERENCES orders(id);

-- 12. Refunds
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
COMMENT ON TABLE refunds IS '환불 - 환불 요청 및 처리 내역';

-- 13. Reviews
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
COMMENT ON TABLE reviews IS '수강 후기 - 강의 평점 및 리뷰';

-- 14. Inquiries
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  course_id UUID REFERENCES courses(id),
  lecture_id UUID REFERENCES lectures(id),
  type inquiry_type NOT NULL DEFAULT 'qna',
  title TEXT,
  content TEXT NOT NULL,
  status inquiry_status NOT NULL DEFAULT 'pending',
  like_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE inquiries IS '문의 - Q&A 및 고객지원 문의';

-- 15. Inquiry Replies
CREATE TABLE inquiry_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  like_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE inquiry_replies IS '문의 답변 - 강사/관리자의 문의 답변';

-- 16. Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE notifications IS '알림 - 사용자별 알림 메시지';

-- 17. Webhook Logs
CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE webhook_logs IS '웹훅 로그 - 외부 서비스 웹훅 수신 기록';

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX idx_profiles_role ON profiles(role);
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
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_inquiries_course ON inquiries(course_id);
CREATE INDEX idx_inquiries_user ON inquiries(user_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_lecture_progress_user ON lecture_progress(user_id);
CREATE INDEX idx_webhook_logs_source ON webhook_logs(source, created_at);

-- =============================================
-- Auth Trigger: Auto-create profile on signup
-- =============================================
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
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name'
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'preferred_username',
      NEW.raw_user_meta_data->>'user_name',
      NEW.raw_user_meta_data->>'nickname'
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    ),
    'customer'::public.user_role,
    CASE
      WHEN NEW.raw_app_meta_data->>'provider' = 'kakao' THEN 'kakao'
      ELSE 'email'
    END,
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

-- =============================================
-- Updated_at Trigger
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_courses_updated_at
  BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_lectures_updated_at
  BEFORE UPDATE ON lectures FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_reviews_updated_at
  BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- RLS Helper Functions (자기참조 방지)
-- =============================================
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.user_role
LANGUAGE sql
SECURITY DEFINER SET search_path = public
STABLE
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

-- =============================================
-- RLS Policies
-- =============================================

-- 프로필
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 프로필 조회"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "본인 프로필 생성"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "본인 프로필 수정"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "관리자 전체 프로필 조회"
  ON profiles FOR SELECT
  USING (public.get_my_role() = 'admin');

CREATE POLICY "강사 수강생 프로필 조회"
  ON profiles FOR SELECT
  USING (
    public.get_my_role() = 'instructor' AND
    EXISTS (
      SELECT 1 FROM enrollments e
      JOIN courses c ON c.id = e.course_id
      WHERE e.user_id = profiles.id AND c.instructor_id = auth.uid()
    )
  );

-- 카테고리
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "누구나 카테고리 조회"
  ON categories FOR SELECT
  USING (TRUE);

CREATE POLICY "관리자 카테고리 관리"
  ON categories FOR ALL
  USING (
    public.get_my_role() = 'admin'
  );

-- 강의
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "공개 강의 누구나 조회"
  ON courses FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "강사 본인 강의 관리"
  ON courses FOR ALL
  USING (auth.uid() = instructor_id);

CREATE POLICY "관리자 전체 강의 관리"
  ON courses FOR ALL
  USING (
    public.get_my_role() = 'admin'
  );

-- 강의 섹션
ALTER TABLE course_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "공개 강의 섹션 조회"
  ON course_sections FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM courses WHERE courses.id = course_sections.course_id AND (courses.is_published = TRUE OR courses.instructor_id = auth.uid()))
  );

CREATE POLICY "강사 본인 섹션 관리"
  ON course_sections FOR ALL
  USING (
    EXISTS (SELECT 1 FROM courses WHERE courses.id = course_sections.course_id AND courses.instructor_id = auth.uid())
  );

CREATE POLICY "관리자 전체 섹션 관리"
  ON course_sections FOR ALL
  USING (
    public.get_my_role() = 'admin'
  );

-- 강의 영상
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "공개 강의 무료 영상 조회"
  ON lectures FOR SELECT
  USING (
    is_free = TRUE AND EXISTS (SELECT 1 FROM courses WHERE courses.id = lectures.course_id AND courses.is_published = TRUE)
  );

CREATE POLICY "수강생 강의 영상 조회"
  ON lectures FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM enrollments WHERE enrollments.user_id = auth.uid() AND enrollments.course_id = lectures.course_id)
  );

CREATE POLICY "강사 본인 영상 관리"
  ON lectures FOR ALL
  USING (
    EXISTS (SELECT 1 FROM courses WHERE courses.id = lectures.course_id AND courses.instructor_id = auth.uid())
  );

CREATE POLICY "관리자 전체 영상 관리"
  ON lectures FOR ALL
  USING (
    public.get_my_role() = 'admin'
  );

-- 수강 등록
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 수강 내역 조회"
  ON enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "강사 본인 강의 수강생 조회"
  ON enrollments FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM courses WHERE courses.id = enrollments.course_id AND courses.instructor_id = auth.uid())
  );

CREATE POLICY "관리자 전체 수강 내역 조회"
  ON enrollments FOR SELECT
  USING (
    public.get_my_role() = 'admin'
  );

-- 수강 진도
ALTER TABLE lecture_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 수강 진도 관리"
  ON lecture_progress FOR ALL
  USING (auth.uid() = user_id);

-- 장바구니
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 장바구니 관리"
  ON cart_items FOR ALL
  USING (auth.uid() = user_id);

-- 쿠폰
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "활성 쿠폰 누구나 조회"
  ON coupons FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "관리자 쿠폰 관리"
  ON coupons FOR ALL
  USING (
    public.get_my_role() = 'admin'
  );

-- 주문
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 주문 조회"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "본인 주문 생성"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "관리자 전체 주문 관리"
  ON orders FOR ALL
  USING (
    public.get_my_role() = 'admin'
  );

-- 주문 항목
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 주문 항목 조회"
  ON order_items FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

CREATE POLICY "관리자 전체 주문 항목 조회"
  ON order_items FOR SELECT
  USING (
    public.get_my_role() = 'admin'
  );

-- 환불
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 환불 조회"
  ON refunds FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "본인 환불 요청"
  ON refunds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "관리자 전체 환불 관리"
  ON refunds FOR ALL
  USING (
    public.get_my_role() = 'admin'
  );

-- 수강 후기
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "누구나 후기 조회"
  ON reviews FOR SELECT
  USING (TRUE);

CREATE POLICY "본인 후기 작성"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "본인 후기 수정"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "본인 후기 삭제"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- 문의
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 문의 조회"
  ON inquiries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "강사 본인 강의 문의 조회"
  ON inquiries FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM courses WHERE courses.id = inquiries.course_id AND courses.instructor_id = auth.uid())
  );

CREATE POLICY "관리자 전체 문의 조회"
  ON inquiries FOR SELECT
  USING (
    public.get_my_role() = 'admin'
  );

CREATE POLICY "본인 문의 작성"
  ON inquiries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 문의 답변
ALTER TABLE inquiry_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "누구나 문의 답변 조회"
  ON inquiry_replies FOR SELECT
  USING (TRUE);

CREATE POLICY "강사 및 관리자 답변 작성"
  ON inquiry_replies FOR INSERT
  WITH CHECK (
    public.get_my_role() IN ('instructor', 'admin')
  );

-- 알림
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 알림 조회"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "본인 알림 수정"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- 웹훅 로그
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "관리자 웹훅 로그 조회"
  ON webhook_logs FOR SELECT
  USING (
    public.get_my_role() = 'admin'
  );

-- =============================================
-- Seed: Default Categories
-- =============================================
INSERT INTO categories (name, slug, sort_order) VALUES
  ('AI/자동화', 'ai-automation', 1),
  ('유튜브', 'youtube', 2),
  ('마케팅', 'marketing', 3),
  ('디자인', 'design', 4),
  ('커머스', 'commerce', 5),
  ('SNS', 'sns', 6);
