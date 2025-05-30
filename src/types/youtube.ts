export interface YoutubeListingDetail {
  id: string;
  channelName: string;
  channelUrl: string;
  channelDescription: string;
  subscribers: number;
  totalViews: number;
  categories: string[];
  totalVideos: number;
  averageViewsPerVideo: number;
  averageWatchTime: number;
  averageLikes: number;
  averageComments: number;
  engagementRate: number;
  price: number;
  pricePerSubscriber: number;
  pricePerView: number;
  pricePerVideo: number;
  strikeHistoryVerified: boolean;
  warningHistoryVerified: boolean;
  strikeWarningDetailsNotes: string;
  createdAt: string;
  updatedAt: string;
} 