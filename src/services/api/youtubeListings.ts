import { ListingParams, YoutubeListingResponse, YoutubeListingDetail } from '@/types/features/listings/listing';
import { apiClient } from './client';

/**
 * 유튜브 리스팅 목록을 조회합니다.
 * @param params 검색 및 필터링 파라미터
 * @returns 페이지네이션된 리스팅 목록
 */
export const fetchYoutubeListings = async (params: ListingParams): Promise<YoutubeListingResponse> => {
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

  const response = await apiClient.get<YoutubeListingResponse>(`/api/v1/youtube-listings?${queryParams.toString()}`);
  return response.data;
};

/**
 * 특정 유튜브 리스팅의 상세 정보를 조회합니다.
 * @param listingId 리스팅 ID
 * @returns 리스팅 상세 정보
 */
export async function getYoutubeListingDetail(listingId: string): Promise<YoutubeListingDetail> {
  const response = await apiClient.get<YoutubeListingDetail>(`/api/v1/youtube-listings/${listingId}`);
  return response.data;
}

/**
 * 유튜브 리스팅을 구매합니다.
 * @param listingId 리스팅 ID
 * @param paymentData 결제 정보
 * @returns 구매 결과
 */
export async function purchaseYoutubeListing(listingId: string, paymentData: {
  paymentMethod: string;
  // 기타 결제 관련 정보
}) {
  const response = await apiClient.post(`/api/v1/youtube-listings/${listingId}/purchase`, paymentData);
  return response.data;
} 