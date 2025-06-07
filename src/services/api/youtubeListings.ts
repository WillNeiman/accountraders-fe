import { ListingParams, YoutubeListingResponse, YoutubeListingDetail, MyYoutubeListingParams, ListingStatus, YoutubeListingUpdateDto } from '@/types/features/listings/listing';
import { apiClient } from './client';

/**
 * 공개 유튜브 리스팅 관련 API
 */

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
export const getYoutubeListingDetail = async (listingId: string): Promise<YoutubeListingDetail> => {
  const { data } = await apiClient.get<YoutubeListingDetail>(`/api/v1/youtube-listings/${listingId}`);
  return data;
};

/**
 * 유튜브 리스팅을 구매합니다.
 * @param listingId 리스팅 ID
 * @param paymentData 결제 정보
 * @returns 구매 결과
 */
export const purchaseYoutubeListing = async (listingId: string, paymentData: {
  paymentMethod: string;
  // 기타 결제 관련 정보
}) => {
  const response = await apiClient.post(`/api/v1/youtube-listings/${listingId}/purchase`, paymentData);
  return response.data;
};

/**
 * 내 유튜브 리스팅 관련 API
 */

/**
 * 내 유튜브 리스팅 목록을 조회합니다.
 * @param params 검색 및 필터링 파라미터
 * @returns 페이지네이션된 리스팅 목록
 */
export const fetchMyYoutubeListings = async (params: MyYoutubeListingParams): Promise<YoutubeListingResponse> => {
  const queryParams = new URLSearchParams();

  // 상태 필터
  if (params.statuses && params.statuses.length > 0) {
    params.statuses.forEach((status: ListingStatus) => {
      queryParams.append('statuses', status);
    });
  }

  // 정렬
  if (params.sort && params.sort.length > 0) {
    queryParams.append('sort', params.sort.join(','));
  }

  // 페이지네이션
  if (params.page !== undefined) {
    queryParams.append('page', params.page.toString());
  }
  if (params.size !== undefined) {
    queryParams.append('size', params.size.toString());
  }

  const response = await apiClient.get<YoutubeListingResponse>(`/api/v1/my/youtube-listings?${queryParams.toString()}`);
  return response.data;
};

/**
 * 내 유튜브 리스팅의 상세 정보를 조회합니다.
 * @param listingId 리스팅 ID
 * @returns 리스팅 상세 정보
 */
export const getMyYoutubeListingDetail = async (listingId: string): Promise<YoutubeListingDetail> => {
  const { data } = await apiClient.get<YoutubeListingDetail>(`/api/v1/my/youtube-listings/${listingId}`);
  return data;
};

/**
 * 내 유튜브 리스팅을 수정합니다.
 * @param listingId 리스팅 ID
 * @param payload 수정할 데이터
 * @returns 수정된 리스팅 정보
 */
export const updateMyYoutubeListing = async (listingId: string, payload: YoutubeListingUpdateDto): Promise<YoutubeListingDetail> => {
  const { data } = await apiClient.put<YoutubeListingDetail>(`/api/v1/my/youtube-listings/${listingId}`, payload);
  return data;
};

/**
 * 내 유튜브 리스팅을 삭제합니다.
 * @param listingId 리스팅 ID
 */
export const deleteMyYoutubeListing = async (listingId: string): Promise<void> => {
  await apiClient.delete(`/api/v1/my/youtube-listings/${listingId}`);
};

export const updateYoutubeListing = async (listingId: string, payload: Partial<YoutubeListingDetail>): Promise<YoutubeListingDetail> => {
  const { data } = await apiClient.put<YoutubeListingDetail>(`/api/v1/youtube-listings/${listingId}`, payload);
  return data;
};

export const deleteYoutubeListing = async (listingId: string): Promise<void> => {
  await apiClient.delete(`/api/v1/youtube-listings/${listingId}`);
}; 