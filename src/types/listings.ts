export interface Listing {
  listingId: string;
  channelId: string;
  sellerUserId: string;
  title: string;
  listingDescription: string;
  askingPrice: number;
  currency: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SOLD';
  expiresAt: string;
  viewCountOnPlatform: number;
  updatedAt: string;
  createdAt: string;
}

export interface ListingParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minSubscribers?: number;
  maxSubscribers?: number;
  sortBy?: 'price' | 'subscribers' | 'views' | 'recent';
  page?: number;
  limit?: number;
}

export interface ListingResponse {
  listings: Listing[];
  total: number;
  page: number;
  limit: number;
} 