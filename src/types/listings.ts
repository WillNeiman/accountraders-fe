export interface Listing {
  listing_id: string;
  title: string;
  asking_price: number;
  channel: {
    channel_name: string;
    subscriber_count: number;
    total_views: number;
    thumbnail_url?: string;
  };
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