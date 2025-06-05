import { YoutubeCategory } from '@/types/features/youtube/category';
import { apiClient } from './client';

/**
 * 유튜브 카테고리 목록을 조회합니다.
 * @returns 카테고리 목록
 */
export const fetchYoutubeCategories = async (): Promise<YoutubeCategory[]> => {
  const response = await apiClient.get<YoutubeCategory[]>('/api/v1/youtube-categories');
  return response.data;
}; 