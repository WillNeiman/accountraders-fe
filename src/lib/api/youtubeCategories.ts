import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
});

export interface YoutubeCategory {
  categoryId: string;
  categoryName: string;
  description: string | null;
  createdAt: string | null;
}

export const fetchYoutubeCategories = async (): Promise<YoutubeCategory[]> => {
  const response = await apiClient.get<YoutubeCategory[]>('/api/v1/youtube-categories');
  return response.data;
}; 