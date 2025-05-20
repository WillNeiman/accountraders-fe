export interface Listing {
  listing_id: string;
  title: string;
  asking_price: number;
  channel: {
    channel_name: string;
    subscriber_count: number;
    total_views: number;
    thumbnail_url?: string;
  };
}

const categories = ['게임', '엔터테인먼트', '교육', '음악', '요리', '여행'];
const channelNamePrefixes = ['멋진', '즐거운', '신나는', '행복한', '재미있는'];
const channelNameSuffixes = ['채널', '스튜디오', 'TV', '방송', '미디어'];

function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDummyListing(index: number): Listing {
  const categoryIndex = index % categories.length;
  const prefixIndex = index % channelNamePrefixes.length;
  const suffixIndex = index % channelNameSuffixes.length;
  
  return {
    listing_id: `listing-${index + 1}`,
    title: `${categories[categoryIndex]} 채널 판매합니다`,
    asking_price: 300000 + (index * 100000),
    channel: {
      channel_name: `${channelNamePrefixes[prefixIndex]} ${channelNameSuffixes[suffixIndex]} ${index + 1}`,
      subscriber_count: 1000 + (index * 1000),
      total_views: 10000 + (index * 10000),
      thumbnail_url: `/images/thumbnails/thumbnail-${(index % 5) + 1}.jpg`
    }
  };
}

export function generateDummyListings(count: number = 30): Listing[] {
  return Array.from({ length: count }, (_, index) => generateDummyListing(index));
} 