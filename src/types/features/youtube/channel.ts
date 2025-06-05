export interface YoutubeChannel {
  channelId: string;
  channelName: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: number;
  totalViews: number;
  averageWatchTimeMinutes: number;
  engagementRateMetrics: {
    likes: number;
    comments: number;
    shares: number;
  };
  monetizationStatus: 'ENABLED' | 'DISABLED' | 'LIMITED' | 'UNKNOWN';
  strikeHistoryVerified: boolean;
  warningHistoryVerified: boolean;
  strikeWarningDetailsNotes: string;
  channelCreationDate: string;
  categories: Array<{
    categoryId: string;
    categoryName: string;
  }>;
} 