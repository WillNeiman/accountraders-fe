import { apiClient } from './apiClient';
import { ListingParams, ListingResponse, Listing } from '@/types/listings';

export async function fetchYoutubeListings(params?: ListingParams): Promise<ListingResponse> {
  const response = await apiClient.get('/api/v1/youtube-listings', { params });
  return response.data;
}

export async function fetchYoutubeListingById(id: string): Promise<Listing> {
  const response = await apiClient.get(`/api/v1/youtube-listings/${id}`);
  return response.data;
} 