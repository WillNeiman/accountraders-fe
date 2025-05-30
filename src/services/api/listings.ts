import { YoutubeListingDetail } from '@/types/listings';
import { apiClient } from './client';

export async function getListingDetail(listingId: string): Promise<YoutubeListingDetail> {
  const response = await apiClient.get(`/api/v1/youtube-listings/${listingId}`);
  return response.data;
}

export async function purchaseListing(listingId: string, paymentData: {
  paymentMethod: string;
  // 기타 결제 관련 정보
}) {
  const response = await apiClient.post(`/api/v1/youtube-listings/${listingId}/purchase`, paymentData);
  return response.data;
} 