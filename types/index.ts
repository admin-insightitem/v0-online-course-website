// ===========================================
// RichClass - Custom TypeScript Types
// ===========================================

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
  instructor_title: string | null
  instructor_bio: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// === Category ===
export interface Category {
  id: number
  name: string
  slug: string
  sort_order: number
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
  created_at: string
  updated_at: string
  category: Pick<Category, 'id' | 'name' | 'slug'>
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

export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'refunded'
export type PaymentMethod = 'card' | 'kakao' | 'naver' | 'toss' | 'bank'

export interface OrderWithItems {
  id: string
  order_number: string
  total_amount: number
  discount_amount: number
  payment_method: PaymentMethod | null
  status: OrderStatus
  paid_at: string | null
  created_at: string
  items: OrderItem[]
  coupon?: { code: string; name: string } | null
}

export interface OrderItem {
  id: string
  course: Pick<CourseWithInstructor, 'id' | 'title' | 'image_url'>
  price: number
}

export type RefundStatus = 'pending' | 'approved' | 'rejected'

// === Community ===
export interface ReviewWithAuthor {
  id: string
  rating: number
  content: string | null
  helpful_count: number
  created_at: string
  updated_at: string
  author: Pick<Profile, 'id' | 'name' | 'nickname' | 'avatar_url'>
  course: Pick<CourseWithInstructor, 'id' | 'title' | 'image_url'>
}

export type InquiryType = 'qna' | 'support'
export type InquiryStatus = 'pending' | 'answered' | 'closed'

export interface InquiryWithReplies {
  id: string
  type: InquiryType
  title: string | null
  content: string
  status: InquiryStatus
  created_at: string
  author: Pick<Profile, 'id' | 'name' | 'nickname' | 'avatar_url'>
  course?: Pick<CourseWithInstructor, 'id' | 'title'> | null
  lecture?: Pick<LectureBasic, 'id' | 'title'> | null
  replies: InquiryReply[]
}

export interface InquiryReply {
  id: string
  content: string
  created_at: string
  author: Pick<Profile, 'id' | 'name' | 'nickname' | 'avatar_url' | 'role'>
}

// === Enrollment ===
export interface EnrollmentWithCourse {
  id: string
  enrolled_at: string
  completed_at: string | null
  course: Pick<CourseWithInstructor, 'id' | 'title' | 'image_url' | 'instructor'> & {
    total_lectures: number
  }
  progress: {
    completed_count: number
    total_count: number
    percentage: number
  }
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
  platform_fee: number
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

// === Coupon ===
export type CouponType = 'percent' | 'fixed'

export interface Coupon {
  id: string
  code: string
  name: string
  type: CouponType
  discount_value: number
  min_purchase: number
  max_discount: number | null
  usage_limit: number | null
  usage_count: number
  applicable_course_ids: string[] | null
  starts_at: string | null
  expires_at: string | null
  is_active: boolean
  created_at: string
}

// === Notification ===
export type NotificationType = 'notice' | 'qna_reply' | 'promotion' | 'order'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  content: string | null
  is_read: boolean
  link: string | null
  created_at: string
}

// === Webinar ===
export interface Webinar {
  id: string
  title: string
  speaker: string
  event_date: string
  event_time: string
  spots: number
  spots_left: number
  tag: string | null
  tag_color: string | null
  is_active: boolean
  link: string | null
}

// === Server Action Result ===
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } }
