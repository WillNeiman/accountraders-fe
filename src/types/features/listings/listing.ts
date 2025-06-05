import { YoutubeChannel } from '../youtube/channel';
import { PageableResponse } from '../../common/api';

export interface Listing {
  listingId: string;
  channelId: string;
  sellerUserId: string;
  title: string;
  listingDescription: string;
  askingPrice: number;
  currency: string;
  status: ListingStatus;
  expiresAt: string;
  viewCountOnPlatform: number;
  updatedAt: string;
  createdAt: string;
}

export type ListingStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING_SALE' | 'SOLD' | 'WITHDRAWN' | 'EXPIRED';

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

export type ListingResponse = PageableResponse<Listing>;

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