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