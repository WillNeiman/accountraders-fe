export interface Listing {
  listingId: string;
  channelId: string;
  sellerUserId: string;
  title: string;
  listingDescription: string;
  askingPrice: number;
  currency: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SOLD' | 'PENDING_SALE';
  expiresAt: string;
  viewCountOnPlatform: number;
  updatedAt: string;
  createdAt: string;
}

export interface ListingParams {
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  minSubscribers?: number;
  maxSubscribers?: number;
  sort?: string[];
  page?: number;
  size?: number;
}

export interface PageableResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export type ListingResponse = PageableResponse<Listing>;

export interface YoutubeChannel {
  channelId: string;
  channelName: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: number;
  totalViews: number;
  averageWatchTimeMinutes: number;
  engagementRateMetrics: {
    likes: number;
    comments: number;
    shares: number;
  };
  monetizationStatus: 'ENABLED' | 'DISABLED' | 'LIMITED' | 'UNKNOWN';
  strikeHistoryVerified: boolean;
  warningHistoryVerified: boolean;
  strikeWarningDetailsNotes: string;
  channelCreationDate: string;
  categories: Array<{
    categoryId: string;
    categoryName: string;
  }>;
}

export type ListingStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING_SALE' | 'SOLD' | 'WITHDRAWN' | 'EXPIRED';

export interface YoutubeListingDetail {
  listingId: string;
  channelId: string;
  sellerUserId: string;
  title: string;
  listingDescription: string | null;
  askingPrice: number;
  currency: string | null;
  status: ListingStatus | null;
  expiresAt: string | null;
  viewCountOnPlatform: number | null;
  updatedAt: string | null;
  createdAt: string | null;
  youtubeChannel: YoutubeChannel;
  seller: {
    userId: string;
    nickname: string;
    rating?: number;
    transactionCount?: number;
  };
} 