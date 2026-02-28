// FAQ 카테고리
export const faqCategories = [
  { id: "all", label: "전체" },
  { id: "payment", label: "결제/환불" },
  { id: "playback", label: "영상 재생" },
  { id: "account", label: "계정/회원" },
  { id: "course", label: "강의/수강" },
]

// FAQ 데이터
export const faqData = [
  {
    id: 1,
    category: "payment",
    question: "결제내역은 어디서 확인하나요",
    answer: "로그인 하신 후 > 나의강의실 > 마이페이지를 통해 확인가능합니다.",
  },
  {
    id: 2,
    category: "payment",
    question: "해외카드로도 결제가 가능한가요",
    answer: "네, 해외 발급 카드로도 결제가 가능합니다. Visa, MasterCard, American Express 등 주요 해외 카드를 지원합니다.",
  },
  {
    id: 3,
    category: "playback",
    question: "PC와 모바일 동시에 실행 가능한가요?",
    answer: "동시 접속은 최대 2대의 기기에서 가능합니다. 단, 동일 강의를 동시에 재생하는 것은 제한될 수 있습니다.",
  },
  {
    id: 4,
    category: "playback",
    question: "플레이어 영상재생이 안되고 까맣게 나와요",
    answer: "브라우저 캐시를 삭제하거나 Chrome 최신 버전으로 업데이트해 주세요. 광고 차단 프로그램이 있다면 해제 후 다시 시도해 주세요.",
  },
  {
    id: 5,
    category: "playback",
    question: "플레이어가 설치가 안돼요",
    answer: "별도의 플레이어 설치 없이 웹 브라우저에서 바로 시청 가능합니다. Chrome, Safari, Edge 등 최신 브라우저를 권장합니다.",
  },
  {
    id: 6,
    category: "playback",
    question: "플레이어 설치 중 플레이어가 정상적으로 설치되지 않아요",
    answer: "웹 브라우저 기반으로 별도 설치가 필요 없습니다. 재생 문제가 있다면 브라우저를 최신 버전으로 업데이트해 주세요.",
  },
  {
    id: 7,
    category: "payment",
    question: "환불은 어떻게 신청하나요?",
    answer: "환불은 구매일로부터 7일 이내, 강의 진도율 10% 미만일 경우 가능합니다. [마이페이지 > 구매내역]에서 해당 강의의 '환불 신청' 버튼을 클릭하여 신청할 수 있습니다.",
  },
  {
    id: 8,
    category: "account",
    question: "비밀번호를 잊어버렸어요.",
    answer: "로그인 페이지에서 '비밀번호 찾기'를 클릭하신 후, 가입 시 사용한 이메일을 입력하시면 비밀번호 재설정 링크가 발송됩니다.",
  },
  {
    id: 9,
    category: "course",
    question: "강의 수강 기간은 얼마인가요?",
    answer: "대부분의 강의는 평생 수강 가능합니다. 단, 일부 기간 한정 강의의 경우 수강 기간이 별도로 명시되어 있습니다.",
  },
  {
    id: 10,
    category: "course",
    question: "수료증은 어떻게 받나요?",
    answer: "강의를 100% 완료하시면 [마이페이지 > 내 강의실]에서 해당 강의의 수료증을 발급받으실 수 있습니다.",
  },
]

// Top 5 FAQ (자주 조회되는 질문)
export const topFaqIds = [1, 2, 3, 4, 5]
