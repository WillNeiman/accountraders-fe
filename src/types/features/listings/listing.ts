import { PageableResponse } from '../../common/api';

export type ListingStatus = 'ACTIVE' | 'PENDING_SALE' | 'SOLD';

export type MonetizationStatus = 'ENABLED' | 'LIMITED' | 'DISABLED';

export interface SimpleUserDto {
  userId: string;
  nickname: string;
}

export interface CategoryDto {
  categoryId: string;
  categoryName: string;
}

export interface YoutubeListing {
  listingId: string;
  seller: SimpleUserDto;
  status: ListingStatus;
  listingTitle: string;
  listingDescription: string | null;
  askingPrice: number;
  viewCountOnPlatform: number;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl: string;
  channelId: string;
  channelTitle: string;
  subscriberCount: number;
  totalViewCount: number;
  totalVideoCount: number;
  channelTopic: string | null;
  channelPublishedAt: string;
  monetizationStatus: MonetizationStatus;
  isOriginalContent: boolean;
  copyrightStrikeCount: number;
  communityGuidelineStrikeCount: number;
  averageMonthlyIncome: number | null;
  categories: CategoryDto[];
  imageUrls: string[];
}

export type YoutubeListingResponse = PageableResponse<YoutubeListing>;

export type YoutubeListingDetail = YoutubeListing;

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

export interface MyYoutubeListingParams {
  page?: number;
  size?: number;
  sort?: string[];
  statuses?: ListingStatus[];
} 