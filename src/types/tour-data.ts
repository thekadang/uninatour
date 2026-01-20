import { TextStyle } from './text-style';
import { FlightData, FlightLabels, FlightPageStyles } from './flight-types';
import { Accommodation, AccommodationLabels, AccommodationPageStyles } from './accommodation-types';
import { QuotationData, QuotationLabels, QuotationPageStyles } from './quotation-types';
import { ItineraryItem, DetailedSchedule, ItineraryCalendarLabels, ItineraryCalendarStyles, DetailedScheduleStyles, DetailedScheduleLabels } from './itinerary-types';
import { CommonPageStyles, ProcessPageStyles, PaymentPageStyles, ContactPageStyles, TransportationPageStyles } from './other-types';

export interface TransportationOption {
  name: string;
  price: string;
  description: string;
  validFor: string;
  usage: string;
  color: 'cyan' | 'green' | 'purple' | 'yellow';
  icon: 'train' | 'bus' | 'card';
  features?: string[];
  pros?: string[];
  cons?: string[];
}

export interface TourData extends
  FlightLabels,
  AccommodationLabels,
  QuotationLabels,
  QuotationData,
  ItineraryCalendarLabels,
  FlightPageStyles,
  AccommodationPageStyles,
  QuotationPageStyles,
  ItineraryCalendarStyles,
  DetailedScheduleStyles,
  DetailedScheduleLabels,
  CommonPageStyles,
  ProcessPageStyles,
  PaymentPageStyles,
  ContactPageStyles,
  TransportationPageStyles {

  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  nights: number;
  days: number;
  coverTitle: string;
  coverMainTitle: string;
  coverDate: string;
  coverPlanningLabel: string;
  coverCopyright: string;
  plannerName: string;

  travelParty: string;
  travelPartyLabel: string;
  travelTheme: string;
  travelThemeLabel: string;
  travelPeriodLabel: string;
  importantRequestsLabel: string;
  highlightsTitle: string;
  travelThemeStyle: TextStyle; //TextStyle로 변경 (임시)
  specialRequests: string;
  highlights: string;

  // Introduction page text
  introductionTitle: string;
  introductionSubtitle: string;

  // Detailed schedule and Quotation specific
  itinerary: ItineraryItem[];
  countryColors: { [country: string]: string };
  accommodations: Accommodation[];

  services: {
    title: string;
    description: string;
    includes: string;
    color: 'cyan' | 'yellow';
  }[];

  // Process page specific
  processTitle: string;
  processLabels: string[];
  processSubtext1: string;
  processSubtext2: string;
  processSubtext3: string;
  processNote: string;
  processPageTitle: string;
  serviceOptionsTitle: string;
  serviceIncludesTitle: string;

  // Tourist spot list
  touristSpotPickTitle: string;
  touristSpots?: DetailedSchedule[];

  // Payment specific
  paymentMethodsAddButtonText: string;
  paymentMethods: { title: string; details: string; }[];
  paymentNotices: string;
  paymentNoticesTitle: string;
  contactEmail: string;
  contactPhone: string;
  contactTitle: string;
  contactPerson: string;
  paymentDeadline: string;
  paymentDeadlineTitle: string;
  paymentMethodsTitle: string;
  paymentCardReceipt: string;
  paymentCardReceiptTitle: string;
  paymentCancellation: string;
  paymentCancellationTitle: string;
  paymentPageTitle: string;

  // Detailed schedule
  detailedSchedules: DetailedSchedule[];

  // Transportation pages data
  transportationPages?: {
    country: string;
    city: string;
    options: TransportationOption[];
  }[];

  // Transportation tickets
  transportationTicketTitle: string;
  transportationTickets?: any[]; // Simplified for now as it's complex
  transportationRestrictions?: any[];
  transportationRestrictionsTitle?: string;
  transportationRestrictionsTitleStyle?: TextStyle;

  // Transportation cards
  transportationCardPageTitle: string;
  transportationCards?: any[];
  transportationCardRestrictions?: any[];
  transportationCardRestrictionsTitle?: string;
  transportationCardRestrictionsTitleStyle?: TextStyle;

  // Flight specific (Nested)
  flights: FlightData;

  // Additional contact fields
  contactPageTitle?: string;
  contactPageSubtitle?: string;
}

export const defaultTourData: TourData = {
  title: '유럽 3개국 투어',
  subtitle: '프랑스 · 이탈리아 · 스위스',
  startDate: '2026-08-05',
  endDate: '2026-08-15',
  totalDays: 11,
  nights: 10,
  days: 11,
  coverTitle: 'OOO님의 윤이나는 oo 여행',
  coverMainTitle: '여행 제안서',
  coverDate: '날짜: 2025.05.05',
  coverPlanningLabel: '1차 플래닝',
  coverCopyright: '* 본 문서는 유니나투어의 자산으로 외부 공유 및 배포를 금하며,\\n유포시 법적 책임 소지가 있습니다.',
  plannerName: '황이나',

  // Cover page text styles
  coverMainTitleStyle: { size: '48px', weight: 'bold', color: '#0891b2' },
  coverTitleStyle: { size: '35px', weight: 'semibold', color: '#0891b2' },
  coverPlanningLabelStyle: { size: '20px', weight: 'normal', color: '#0891b2' },
  coverDateStyle: { size: '20px', weight: 'normal', color: '#6b7280' },
  plannerNameStyle: { size: '14px', weight: 'normal', color: '#6b7280' },
  coverCopyrightStyle: { size: '12px', weight: 'normal', color: '#6b7280' },

  travelParty: 'O명 (OOO님, OOO님)',
  travelTheme: '신혼여행 / 처음 유럽여행',
  specialRequests: '결혼식 후 바로 떠나는 신혼여행 입니다. 여기는 꼭 보고싶어요! 호텔은 4성급이상이 좋습니다. / 항공은 비즈니스를 원합니다.',
  highlights: '후기가 좋은 4-5성급 호텔\n대한항공 직항 비즈니스 항공\n공항 - 숙소간의 전용차량 배치\n분위기있는 레스토랑 예약\n신혼여행의 분위기 업 스냅예약',

  // Introduction page editable labels
  travelPartyLabel: '여행 참가자',
  travelThemeLabel: '여행 테마',
  travelPeriodLabel: '여행 기간',
  importantRequestsLabel: '중요 요청사항',
  highlightsTitle: '여행 하이라이트',

  // Introduction page text
  introductionTitle: '여행 소개',
  introductionSubtitle: '고객 니즈 체크',

  // Introduction page text styles
  introductionTitleStyle: { size: '35px', weight: 'semibold', color: '#0891b2' },
  introductionSubtitleStyle: { size: '20px', weight: 'normal', color: '#374151' },
  travelPartyLabelStyle: { size: '20px', weight: 'normal', color: '#6b7280' },
  travelPartyStyle: { size: '18px', weight: 'normal', color: '#1f2937' },
  travelThemeLabelStyle: { size: '20px', weight: 'normal', color: '#6b7280' },
  travelThemeStyle: { size: '18px', weight: 'normal', color: '#1f2937' },
  travelPeriodLabelStyle: { size: '20px', weight: 'normal', color: '#6b7280' },
  periodDisplayStyle: { size: '18px', weight: 'normal', color: '#1f2937' },
  importantRequestsLabelStyle: { size: '20px', weight: 'normal', color: '#6b7280' },
  specialRequestsStyle: { size: '18px', weight: 'normal', color: '#1f2937' },
  highlightsTitleStyle: { size: '20px', weight: 'normal', color: '#6b7280' },
  highlightsStyle: { size: '18px', weight: 'normal', color: '#1f2937' },

  // Flight labels
  flightDepartureDescription: '한국에서 유럽으로 출발하는 항공편 정보입니다',
  flightTransitDescription: '유럽 내 이동하는 항공편 정보입니다',
  flightArrivalDescription: '유럽에서 한국으로 돌아오는 항공편 정보입니다',
  flightDepartureTitle: '항공편 (출발)',
  flightDepartureDirectLabel: '직항',
  flightDepartureConnectingLabel: '경유',
  flightDepartureAddSegmentLabel: '경유 추가',
  flightDepartureSegmentTitle: '출발 항공편',
  flightDepartureAirlineLabel: '항공사',
  flightDepartureDepartureLabel: '출발',
  flightDepartureDirectBadge: '직항',
  flightDepartureArrivalLabel: '도착',
  flightDepartureServicesTitle: '포함 서비스',
  flightDepartureTransitLabel: '환승 대기 시간:',
  flightDepartureChecklistTitle: '✓ 탑승 전 확인사항',
  flightTransitTitle: '항공편 (경유)',
  flightTransitDirectLabel: '직항',
  flightTransitConnectingLabel: '경유',
  flightTransitAddSegmentLabel: '경유 추가',
  flightTransitSegmentTitle: '중간이동 항공편',
  flightTransitAirlineLabel: '항공사',
  flightTransitDepartureLabel: '출발',
  flightTransitDirectBadge: '직항',
  flightTransitArrivalLabel: '도착',
  flightTransitServicesTitle: '포함 서비스',
  flightTransitTransitLabel: '환승 대기 시간:',
  flightTransitChecklistTitle: '✓ 탑승 전 확인사항',
  flightArrivalTitle: '항공편 (도착)',
  flightArrivalDirectLabel: '직항',
  flightArrivalConnectingLabel: '경유',
  flightArrivalAddSegmentLabel: '경유 추가',
  flightArrivalSegmentTitle: '도착 항공편',
  flightArrivalAirlineLabel: '항공사',
  flightArrivalDepartureLabel: '출발',
  flightArrivalDirectBadge: '직항',
  flightArrivalArrivalLabel: '도착',
  flightArrivalServicesTitle: '포함 서비스',
  flightArrivalTransitLabel: '환승 대기 시간:',
  flightArrivalChecklistTitle: '✓ 귀국 전 확인사항',

  // Flight styles
  flightDepartureDescriptionStyle: { size: '20px', weight: 'normal', color: '#6b7280' },
  flightDepartureTitleStyle: { size: '35px', weight: 'semibold', color: '#0891b2' },
  flightDepartureSegmentTitleStyle: { size: '20px', weight: 'normal', color: '#111827' },
  flightDepartureLabelStyle: { size: '18px', weight: 'normal', color: '#111827' },
  flightDepartureDataStyle: { size: '18px', weight: 'normal', color: '#111827' },
  flightDepartureDirectBadgeStyle: { size: '18px', weight: 'normal', color: '#111827' },
  flightDepartureServicesItemStyle: { size: '18px', weight: 'normal', color: '#111827' },
  flightDepartureChecklistTitleStyle: { size: '20px', weight: 'normal', color: '#111827' },
  flightDepartureChecklistItemStyle: { size: '18px', weight: 'normal', color: '#111827' },
  flightTransitDescriptionStyle: { size: '20px', weight: 'normal', color: '#6b7280' },
  flightTransitTitleStyle: { size: '35px', weight: 'semibold', color: '#0891b2' },
  flightTransitSegmentTitleStyle: { size: '20px', weight: 'normal', color: '#111827' },
  flightTransitDataStyle: { size: '18px', weight: 'normal', color: '#111827' },
  flightTransitLabelStyle: { size: '18px', weight: 'normal', color: '#111827' },
  flightTransitDirectBadgeStyle: { size: '18px', weight: 'normal', color: '#111827' },
  flightTransitServicesTitleStyle: { size: '18px', weight: 'normal', color: '#111827' },
  flightTransitServicesItemStyle: { size: '18px', weight: 'normal', color: '#111827' },
  flightTransitChecklistTitleStyle: { size: '20px', weight: 'normal', color: '#111827' },
  flightTransitChecklistItemStyle: { size: '18px', weight: 'normal', color: '#111827' },
  flightArrivalDescriptionStyle: { size: '20px', weight: 'normal', color: '#6b7280' },
  flightArrivalTitleStyle: { size: '35px', weight: 'semibold', color: '#0891b2' },
  flightArrivalSegmentTitleStyle: { size: '20px', weight: 'normal', color: '#111827' },
  flightArrivalChecklistTitleStyle: { size: '20px', weight: 'normal', color: '#111827' },
  flightArrivalLabelStyle: { size: '18px', weight: 'normal', color: '#111827' },
  flightArrivalDataStyle: { size: '18px', weight: 'normal', color: '#111827' },
  flightArrivalDirectBadgeStyle: { size: '18px', weight: 'normal', color: '#111827' },
  flightArrivalServicesTitleStyle: { size: '18px', weight: 'normal', color: '#111827' },
  flightArrivalServicesItemStyle: { size: '18px', weight: 'normal', color: '#111827' },
  flightArrivalChecklistItemStyle: { size: '18px', weight: 'normal', color: '#111827' },

  // Itinerary labels
  itineraryCalendarTitle: '여행 일정',
  itineraryTransportTitle: '이동수단',
  itineraryCountryTitle: '방문 국가',
  itineraryCalendarDateRange: '',

  // Itinerary styles
  itineraryCalendarTitleStyle: { size: '35px', weight: 'semibold', color: '#0891b2' },
  itineraryCalendarDateRangeStyle: { size: '20px', weight: 'normal', color: '#374151' },
  itineraryCalendarHelpTextStyle: { size: '18px', weight: 'normal', color: '#6b7280' },
  itineraryTransportTitleStyle: { size: '20px', weight: 'normal', color: '#6b7280' },
  itineraryTransportLabelStyle: { size: '18px', weight: 'normal', color: '#1f2937' },
  itineraryCountryTitleStyle: { size: '20px', weight: 'normal', color: '#6b7280' },
  itineraryCountryLabelStyle: { size: '18px', weight: 'normal', color: '#1f2937' },
  itineraryCountryEmptyStyle: { size: '14px', weight: 'normal', color: '#6b7280' },
  itineraryCalendarWeekdayStyle: { size: '14px', weight: 'normal', color: '#9ca3af' },
  itineraryCalendarDateNumberStyle: { size: '14px', weight: 'normal', color: '#0e7490' },
  itineraryCalendarDayLabelStyle: { size: '9px', weight: 'normal', color: '#ffffff' },
  itineraryCalendarCountryNameStyle: { size: '9px', weight: 'normal', color: '#4b5563' },
  itineraryCalendarCityNameStyle: { size: '10px', weight: 'normal', color: '#1f2937' },

  // Detailed schedule labels
  detailedScheduleDayTitleStyle: { size: '35px', weight: 'semibold', color: '#0891b2' },
  detailedScheduleDateStyle: { size: '20px', weight: 'normal', color: '#1f2937' },
  detailedScheduleTimelineTitleStyle: { size: '20px', weight: 'normal', color: '#111827' },
  detailedSchedulePickTitleStyle: { size: '20px', weight: 'normal', color: '#111827' },
  detailedScheduleTimeStyle: { size: '18px', weight: 'normal', color: '#f2f2f2' },
  detailedScheduleTimelineTitleTextStyle: { size: '18px', weight: 'normal', color: '#111827' },
  detailedScheduleTimelineLocationStyle: { size: '18px', weight: 'normal', color: '#111827' },
  detailedScheduleCardNumberStyle: { size: '18px', weight: 'normal', color: '#f1f2f3' },
  detailedScheduleCardTitleStyle: { size: '18px', weight: 'normal', color: '#ffffff' },
  detailedScheduleCardLocationStyle: { size: '18px', weight: 'normal', color: '#111827' },
  detailedScheduleCardTimeTextStyle: { size: '18px', weight: 'normal', color: '#111827' },
  detailedScheduleCardActivityStyle: { size: '18px', weight: 'normal', color: '#111827' },
  detailedScheduleCardNotesStyle: { size: '18px', weight: 'normal', color: '#111827' },

  // Quotation labels
  quotationPageTitle: '견적서',
  productNameLabel: '상품명',
  periodLabel: '여행 기간',
  countriesLabel: '여행 국가',
  participantsLabel: '참가자',
  transportationLabel: '교통 수단',
  accommodationLabel: '숙소 요약',
  estimatedCostTitle: '1차 견적 비용',
  includedItemsTitle: '견적 내 포함사항',
  excludedItemsTitle: '견적 불포함사항',

  // Quotation data
  productName: '유럽 3개국 투어',
  period: '2026.08.05 - 2026.08.15',
  countries: '프랑스, 이탈리아, 스위스',
  participants: 'O명 (OOO님, OOO님)',
  transportation: '대한항공 비즈니스 항공',
  accommodationSummary: '후기가 좋은 4-5성급 호텔',
  totalCost: '₩5,000,000',
  costWarning: '가격은 예상 가격이며, 실제 가격은 항공사 및 호텔의 정책에 따라 변동될 수 있습니다.',
  quotationLabels: {
    label1: '총 비용',
    label2: '비용 경고',
    label3: '항공편',
    label4: '숙소',
    label5: '식사',
    label6: '관광지 입장료'
  },
  estimatedCostAmount: '₩5,000,000',
  estimatedCostNote: '1차 견적 비용은 실시간 예약 기준 금액으로 예약 시 금액 변동이 있을 수 있습니다. 또한 1차 일정 내의 비용으로 2차 세부일정으로 금액이 변동 될 수 있습니다.  ',
  includedItems: '항공권, 숙소, 도시 간 이동 교통비, 1차 일정 내 관광지 입장료, 유니나투어 대행 수수료, 케어서비스 수수료',
  excludedItems: '항공사 추가 수수료, 호텔 도시세 및 추가 수수료, 렌트비용, 개인비용 ',
  excludedItemsNote: '* 불포함 사항 예약 대행시 추가 금액이 발생합니다',

  // Quotation styles
  quotationPageTitleStyle: { size: '35px', weight: 'semibold', color: '#0891b2' },
  quotationTitleStyle: { size: '48px', weight: 'semibold', color: '#0891b2' },
  quotationNotesStyle: { size: '14px', weight: 'normal', color: '#6b7280' },
  quotationSummaryLabelStyle: { size: '20px', weight: 'normal', color: '#111827' },
  quotationSummaryValueStyle: { size: '18px', weight: 'normal', color: '#111827' },
  quotationEstimatedTitleStyle: { size: '20px', weight: 'normal', color: '#ffffff' },
  quotationEstimatedAmountStyle: { size: '20px', weight: 'normal', color: '#f9fafa' },
  quotationEstimatedNoteStyle: { size: '12px', weight: 'normal', color: '#ffffff' },
  quotationIncludedTitleStyle: { size: '20px', weight: 'normal', color: '#111827' },
  quotationIncludedItemStyle: { size: '18px', weight: 'normal', color: '#111827' },
  quotationExcludedTitleStyle: { size: '20px', weight: 'normal', color: '#111827' },
  quotationExcludedItemStyle: { size: '18px', weight: 'normal', color: '#111827' },
  quotationExcludedNoteStyle: { size: '18px', weight: 'normal', color: '#111827' },

  // Flight nested data
  flights: {
    departure: {
      isDirect: true,
      segments: [
        {
          airline: '대한항공',
          class: '비즈니스',
          departureTime: '2026.08.05 10:00',
          departureAirport: '인천국제공항',
          arrivalTime: '2026.08.05 14:00',
          arrivalAirport: '니스국제공항',
          services: '프리미엄 서비스'
        }
      ],
      checklist: '출발 3시간 전까지 공항 도착을 권장합니다\n여권 유효기간을 확인해주세요 (입국일 기준 6개월 이상)\n비즈니스석은 라운지 이용이 가능합니다'
    },
    transit: {
      isDirect: true,
      segments: [
        {
          airline: '대한항공',
          class: '비즈니스',
          departureTime: '2026.08.15 10:00',
          departureAirport: '바르셀로나국제공항',
          arrivalTime: '2026.08.15 14:00',
          arrivalAirport: '인천국제공항',
          services: '프리미엄 서비스'
        }
      ],
      checklist: '출발 2시간 전까지 공항 도착을 권장합니다\nEU 내 항공편은 액체류 제한이 있습니다 (100ml 이하)\n수하물 무게 제한을 확인해주세요'
    },
    arrival: {
      isDirect: true,
      segments: [
        {
          airline: '대한항공',
          class: '비즈니스',
          departureTime: '2026.08.15 10:00',
          departureAirport: '바르셀로나국제공항',
          arrivalTime: '2026.08.15 14:00',
          arrivalAirport: '인천국제공항',
          services: '프리미엄 서비스'
        }
      ],
      checklist: '출발 3시간 전까지 공항 도착을 권장합니다\n면세품 구매 한도를 확인해주세요 (US $600)\n도착 후 입국심사 및 세관신고를 진행합니다'
    }
  },

  itinerary: [
    { date: '2026-08-05', country: '한국', city: '인천', transport: 'plane', dayNum: 1 },
    { date: '2026-08-06', country: '프랑스', city: '니스', transport: null, dayNum: 2 },
    { date: '2026-08-07', country: '프랑스', city: '니스', transport: null, dayNum: 3 },
  ],

  countryColors: {
    '프랑스': 'bg-blue-500',
    '이탈리아': 'bg-red-500',
    '스위스': 'bg-gray-500'
  },

  accommodations: [
    {
      country: '프랑스',
      city: '니스',
      checkIn: '2026.08.08',
      checkOut: '2026.08.10',
      nights: '2박 3일',
      name: 'Hotel Negresco Nice',
      type: '호텔',
      stars: 5,
      roomType: '디럭스 더블룸',
      facilities: ['수영장', '사우나', '피트니스', '엘리베이터', '에어컨'],
      breakfast: true,
      cityTax: '₩3,000 per person/night',
      description: '니스의 프롬나드 데 장글레(Promenade des Anglais)에 위치한 5성급 럭셔리 호텔로, 지중해의 아름다운 전망과 벨 에포크 시대의 우아함을 자랑합니다.',
      nearbyAttractions: ['영국인 산책로 (도보 1분)', '마세나 광장 (도보 10분)', '구시가지 (차량 5분)'],
      images: [
        'https://images.unsplash.com/photo-1731336478850-6bce7235e320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzYyOTg2NTMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1631048835184-3f0ceda91b75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGJlZHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjI5NjQyNDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1759223607861-f0ef3e617739?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMGJhdGhyb29tfGVufDF8fHx8MTc2Mjk0NDQ1MXww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1722867710896-8b5ddb94e141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjB2aWV3fGVufDF8fHx8MTc2MzAxNDk5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1758973470049-4514352776eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGFtZW5pdGllcyUyMHBvb2x8ZW58MXx8fHwxNzYyOTIwNTUyfDA&ixlib=rb-4.1.0&q=80&w=1080'
      ]
    },
    {
      country: '이탈리아',
      city: '밀라노',
      checkIn: '2026.08.11',
      checkOut: '2026.08.13',
      nights: '2박 3일',
      name: 'Armani Hotel Milano',
      type: '호텔',
      stars: 5,
      roomType: '스탠다드 더블룸',
      facilities: ['수영장', '피트니스', '엘리베이터', '에어컨'],
      breakfast: true,
      cityTax: '₩5,000 per person/night',
      description: '밀라노의 중심부 몬테나폴레오네 거리에 위치한 조르지오 아르마니가 디자인한 럭셔리 호텔로, 세련된 이탈리아 디자인과 최상급 서비스를 제공합니다.',
      nearbyAttractions: ['두오모 성당 (도보 15분)', '스칼라 극장 (도보 10분)', '갤러리아 비토리오 에마누엘레 2세 (도보 12분)'],
      images: [
        'https://images.unsplash.com/photo-1631048835184-3f0ceda91b75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGJlZHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjI5NjQyNDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1731336478850-6bce7235e320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzYyOTY0MjQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1722867710896-8b5ddb94e141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjB2aWV3fGVufDF8fHx8MTc2Mjk0NDQ1MXww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1759223607861-f0ef3e617739?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMGJhdGhyb29tfGVufDF8fHx8MTc2MzAxNDk5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1758973470049-4514352776eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGFtZW5pdGllcyUyMHBvb2x8ZW58MXx8fHwxNzYyOTIwNTUyfDA&ixlib=rb-4.1.0&q=80&w=1080'
      ]
    }
  ],
  accommodationTitle: '숙소 안내',

  // Accommodation labels
  accommodationHotelNameLabel: '호텔명',
  accommodationCheckInLabel: '체크인',
  accommodationCheckOutLabel: '체크아웃',
  accommodationRoomTypeLabel: '룸 형태',
  accommodationBreakfastLabel: '조식 포함 여부',
  accommodationFacilitiesLabel: '주요 부대시설',
  accommodationAttractionsLabel: '주변 관광지',
  accommodationCityTaxLabel: '예상 도시세',

  // Accommodation styles
  accommodationTitleStyle: { size: '35px', weight: 'semibold', color: '#0891b2' },
  accommodationLocationStyle: { size: '20px', weight: 'normal', color: '#374151' },
  accommodationHotelNameStyle: { size: '25px', weight: 'normal', color: '#111827' },
  accommodationHotelTypeStyle: { size: '20px', weight: 'normal', color: '#0e7490' },
  accommodationDescriptionStyle: { size: '16px', weight: 'normal', color: '#4b5563' },
  accommodationCheckInLabelStyle: { size: '18px', weight: 'normal', color: '#0891b2' },
  accommodationCheckInTimeStyle: { size: '18px', weight: 'normal', color: '#1f2937' },
  accommodationCheckOutLabelStyle: { size: '18px', weight: 'normal', color: '#ca8a04' },
  accommodationCheckOutTimeStyle: { size: '18px', weight: 'normal', color: '#1f2937' },
  accommodationNightsStyle: { size: '18px', weight: 'normal', color: '#ffffff' },
  accommodationRoomTypeLabelStyle: { size: '18px', weight: 'normal', color: '#6b7280' },
  accommodationRoomTypeStyle: { size: '18px', weight: 'normal', color: '#1f2937' },
  accommodationBreakfastLabelStyle: { size: '18px', weight: 'normal', color: '#6b7280' },
  accommodationBreakfastStatusStyle: { size: '18px', weight: 'normal', color: '#16a34a' },
  accommodationFacilitiesLabelStyle: { size: '18px', weight: 'normal', color: '#6b7280' },
  accommodationFacilityItemStyle: { size: '16px', weight: 'normal', color: '#0e7490' },
  accommodationAttractionsLabelStyle: { size: '18px', weight: 'normal', color: '#6b7280' },
  accommodationAttractionItemStyle: { size: '16px', weight: 'normal', color: '#374151' },
  accommodationCityTaxLabelStyle: { size: '18px', weight: 'normal', color: '#6b7280' },
  accommodationCityTaxStyle: { size: '18px', weight: 'normal', color: '#1f2937' },

  services: [
    {
      title: '코어플랜 (CORE PLAN) - 예약대행과 케어서비스가 빠진 부분 플랜입니다.',
      description: '구매 후 1개월 안 수정 2회 가능, 일정 수령 후 환불 불가',
      includes: '일차별 일정\n세부 이동 수단\n맛집 리스트\n대중교통 패스권 요약집\n관광지 리스트 전달',
      color: 'cyan'
    },
    {
      title: '맥스플랜 (MAX PLAN) - 예약대행과 케어서비스가 포함된 올케어 플랜 입니다.',
      description: '예약 전까지 얼마든지 수정가능하나 예약 후 수정시 변경 수수료 발생 될 수 있습니다.',
      includes: '일차별 일정 제공\n세부 이동수단 안내\n항공, 호텔, 일일투어 예약\n일정 예약대행 및 케어서비스\n여행굿즈 서비스\n맛집 리스트 전달',
      color: 'yellow'
    }
  ],

  // Process specific
  processTitle: '유니나는 유럽 여행 디자인 프로세스',
  processLabels: [
    '문의',
    '1차 일정 및 견적서 전달',
    '진행확정 및 서비스 선택',
    '계약서 작성, 결제',
    '1차 내 협의된 사항 예약 대행 진행 (항공권 및 숙소 예약대행)',
    '2차 세부일정 전달, 수정 및 세부일정 예약 대행 진행',
    '방문 미팅 및 바우처, 유니나 굿즈 전달'
  ],
  processSubtext1: '문의를 주시면 전화로 자세한 상담을 진행합니다. ',
  processSubtext2: '견적금액 완불 후 일정 진행됩니다.',
  processSubtext3: '직접 방문해 자세한 플랜을 안내드립니다. 10만 원 상당의 유니나 자체 제작 상품 포함 굿즈 전달드립니다.',
  processNote: '* 여행 1개월 전 완료 예정',
  processPageTitle: '여행 진행 프로세스',
  serviceOptionsTitle: '서비스 옵션',
  serviceIncludesTitle: '포함 내역',

  // Tourist spot
  touristSpotPickTitle: "TODAY'S PICK",

  // Process styles
  processPageTitleStyle: { size: '35px', weight: 'semibold', color: '#0891b2' },
  processTitleStyle: { size: '20px', weight: 'bold', color: '#0891b2' },
  processLabelStyle: { size: '18px', weight: 'normal', color: '#1f2937' },
  processSubtextStyle: { size: '16px', weight: 'normal', color: '#6b7280' },
  processNoteStyle: { size: '16px', weight: 'normal', color: '#4b5563' },
  serviceOptionsTitleStyle: { size: '25px', weight: 'semibold', color: '#0891b2' },
  serviceTitleStyle: { size: '18px', weight: 'normal', color: '#0e7490' },
  serviceDescriptionStyle: { size: '16px', weight: 'normal', color: '#4b5563' },
  serviceIncludesTitleStyle: { size: '18px', weight: 'normal', color: '#6b7280' },
  serviceIncludesItemStyle: { size: '16px', weight: 'normal', color: '#374151' },

  // Payment data
  paymentMethodsAddButtonText: '결제 방법 추가',
  paymentMethods: [
    {
      title: '카드 결제',
      details: '안전한 카드 결제를 통해 편리하게 결제할 수 있습니다.\n카드 결제 시 해외 공급사 결제처리로 인하여 카드사 해외 결제 수수료(2%)가 부과됩니다.'
    },
    {
      title: '계좌 입금',
      details: '100-038-034779 신한은행 (예금주: 주식회사 유니나투어)\n현금영수증 발행 시 여행사 수수료에 한해 발행이 가능하며, 입금 후 현금영수증 번호 전달해주시면 신속한 처리 도와드리겠습니다.  '
    }
  ],
  paymentNoticesTitle: '주의사항',
  paymentNotices: '카드 결제 시 해외 공급사 결제처리로 인하여 카드사 해외 결제 수수료(2%)가 부과됩니다.\n\n유니나투어에서는 여행상품 특성상 항공·호텔 등 외부 공급사 비용을 제외한 \'여행사 수수료(대행료)\' 금액에 한해 현금영수증 발행이 가능합니다. 이는 관련 세법 기준에 따른 것으로, 여행 일정 및 공급 구조에 따라 발행 금액이 달라질 수 있습니다. 현금영수증 발행을 원하시는 경우, 예약 시점에 미리 요청해 주시면 신속히 처리 도와드리겠습니다.\n\n환불 및 변경은 출발 30일 이전까지 가능합니다. 변경·취소·환불 요청 시에는 **유니나투어 수수료(1인 200,000원)**가 적용되며, 여기에 더해 각 공급사(항공/호텔/현지사)의 규정에 따라 추가 수수료가 발생할 수 있습니다. ',
  contactEmail: 'uninatour@naver.com',
  contactPhone: '010-8988-5545',
  contactTitle: '문의하기',
  contactPerson: '황이나',
  paymentDeadlineTitle: '총 비용',
  paymentDeadline: '유니나투어 여행상품은 항공·호텔·현지 서비스 등 해외 공급사와의 즉시 확정 결제(예약 대행비 선지급)가 필요한 구조입니다.\n\n따라서 견적 확정 후에는 전체 금액 100% 결제 확인 후 예약 진행이 가능합니다.\n결제 순으로 확정되며, 미결제 시 예약이 보장되지 않는 점 양해 부탁드립니다.',
  paymentCardReceipt: '여행상품 특성상 항공·호텔 등 외부 공급사 비용을 제외한 \'여행사 수수료(대행료)\' 금액에 한해 현금영수증 발행이 가능합니다. 이는 관련 세법 기준에 따른 것으로, 여행 일정 및 공급 구조에 따라 발행 금액이 달라질 수 있습니다. 현금영수증 발행을 원하시는 경우, 예약 시점에 미리 요청해 주시면 신속히 처리 도와드리겠습니다.\n\n카드 결제 영수증은 이메일 또는 카카오톡으로 전송됩니다.',
  paymentCardReceiptTitle: '영수증 발행 안내',
  paymentCancellation: '여행 취소 시 환불은 출발 30일 이전까지 가능하며, 유니나투어 수수료 (1인 200,000원)가 적용되며, 각 공급사 (항공/호텔/현지사)의 규정에 따라 추가 수수료가 발생되니 신중한 결정 부탁드립니다.',
  paymentCancellationTitle: '취소 및 환불 규정',

  // Contact page styles
  contactTitleStyle: { size: '20px', weight: 'normal', color: '#fafcff' },
  contactInfoStyle: { size: '20px', weight: 'normal', color: '#f4f6fa' },
  contactPageTitle: '문의 하기',
  contactPageTitleStyle: { size: '35px', weight: 'semibold', color: '#0891b2' },
  contactPageSubtitle: '담당자 연락처',
  contactPageSubtitleStyle: { size: '20px', weight: 'normal', color: '#374151' },

  // Detailed schedule
  detailedSchedules: [
    {
      day: 1,
      title: '인천 출발',
      scheduleItems: [
        {
          id: '1',
          time: '08:00',
          title: '호텔에서 출발',
          location: '인천 호텔',
          activity: '체크아웃 및 준비',
          notes: '항공편 시간 확인'
        },
        {
          id: '2',
          time: '09:00',
          title: '인천국제공항 도착',
          location: '인천국제공항',
          activity: '보안 검색 및 탑승',
          notes: '항공편 시간 확인'
        }
      ]
    },
    {
      day: 2,
      title: '니스 도착',
      scheduleItems: [
        {
          id: '1',
          time: '14:00',
          title: '니스국제공항 도착',
          location: '니스국제공항',
          activity: '보안 검색 및 탑승',
          notes: '항공편 시간 확인'
        },
        {
          id: '2',
          time: '15:00',
          title: '호텔 도착',
          location: 'Hotel Negresco Nice',
          activity: '체크인 및 준비',
          notes: '호텔 위치 확인'
        }
      ]
    }
  ],

  // Payment style specific
  paymentPageTitle: '결제 안내',
  paymentPageTitleStyle: { size: '35px', weight: 'semibold', color: '#0891b2' },
  paymentInfoTitleStyle: { size: '20px', weight: 'normal', color: '#111827' },
  paymentInfoContentStyle: { size: '18px', weight: 'normal', color: '#111827' },
  paymentMethodsTitle: '결제 방법',
  paymentMethodsTitleStyle: { size: '20px', weight: 'normal', color: '#111827' },
  paymentMethodItemTitleStyle: { size: '18px', weight: 'normal', color: '#111827' },
  paymentMethodItemDetailStyle: { size: '18px', weight: 'normal', color: '#111827' },
  paymentNoticesTitleStyle: { size: '20px', weight: 'normal', color: '#111827' },
  paymentNoticesItemStyle: { size: '18px', weight: 'normal', color: '#111827' },

  // Transportation
  transportationTicketTitle: '교통편 안내',
  transportationCardPageTitle: '교통카드 안내'
};