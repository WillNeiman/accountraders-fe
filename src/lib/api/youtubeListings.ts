import axios from 'axios';
import { Listing, ListingParams, ListingResponse } from '@/types/listings';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
});

export const fetchYoutubeListings = async (params: ListingParams): Promise<ListingResponse> => {
  const queryParams = new URLSearchParams();

  // 카테고리 ID 목록
  if (params.categoryIds && params.categoryIds.length > 0) {
    params.categoryIds.forEach(id => {
      queryParams.append('categoryIds', id);
    });
  }

  // 가격 범위
  if (params.minPrice !== undefined) {
    queryParams.append('minPrice', params.minPrice.toString());
  }
  if (params.maxPrice !== undefined) {
    queryParams.append('maxPrice', params.maxPrice.toString());
  }

  // 구독자 수 범위
  if (params.minSubscribers !== undefined) {
    queryParams.append('minSubscribers', params.minSubscribers.toString());
  }
  if (params.maxSubscribers !== undefined) {
    queryParams.append('maxSubscribers', params.maxSubscribers.toString());
  }

  // 정렬
  if (params.sort && params.sort.length > 0) {
    const sortParams = [...params.sort];
    const createdAtIndex = sortParams.findIndex(sort => sort.startsWith('createdAt,'));
    
    if (createdAtIndex !== -1) {
      // createdAt 정렬 조건을 제거하고 마지막에 추가
      const createdAtSort = sortParams.splice(createdAtIndex, 1)[0];
      sortParams.push(createdAtSort);
    }
    
    queryParams.append('sort', sortParams.join(','));
  }

  // 페이지네이션
  if (params.page !== undefined) {
    queryParams.append('page', params.page.toString());
  }
  if (params.size !== undefined) {
    queryParams.append('size', params.size.toString());
  }

  const response = await apiClient.get<ListingResponse>(`/api/v1/youtube-listings?${queryParams.toString()}`);
  return response.data;
};

export async function fetchYoutubeListingById(id: string): Promise<Listing> {
  const response = await apiClient.get(`/api/v1/youtube-listings/${id}`);
  return response.data;
} 