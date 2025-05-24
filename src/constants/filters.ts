export const SORT_OPTIONS: Record<string, string> = {
  'createdAt,desc': '최신순',
  'createdAt,asc': '오래된순',
  'askingPrice,desc': '가격 높은순',
  'askingPrice,asc': '가격 낮은순',
  'subscriberCount,desc': '구독자 많은순',
  'subscriberCount,asc': '구독자 적은순',
  'viewCountOnPlatform,desc': '조회수 많은순',
  'viewCountOnPlatform,asc': '조회수 적은순',
} as const;

export const DEFAULT_SORT = 'createdAt,desc' as const; 