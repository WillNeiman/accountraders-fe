import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { typography } from '@/styles/theme/typography';
import { spacing } from '@/styles/theme/spacing';

interface ListingCardProps {
  listing: {
    listing_id: string;
    title: string;
    asking_price: number;
    channel: {
      channel_name: string;
      subscriber_count: number;
      total_views: number;
      thumbnail_url?: string;
    };
  };
}

const Card = styled.div`
  /* Layout */
  overflow: hidden;

  /* Box Model */
  border: 1px solid ${colors.gray[200]};
  border-radius: 12px;

  /* Visual */
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  /* Others */
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ThumbnailContainer = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  background: ${colors.gray[100]};
`;

const PlaceholderContent = styled.div`
  width: 100%;
  height: 100%;
  background: ${colors.gray[100]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${spacing[2]};
`;

const PlaceholderIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.gray[400]};
`;

const PlaceholderText = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.gray[400]};
`;

const Badge = styled.span`
  position: absolute;
  top: ${spacing[3]};
  right: ${spacing[3]};
  background: ${colors.primary[600]};
  color: white;
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: 20px;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  z-index: 1;
`;

const Content = styled.div`
  padding: ${spacing[4]};
`;

const Title = styled.h3`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[2]};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ChannelName = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing[2]};
`;

const Stats = styled.div`
  display: flex;
  gap: ${spacing[4]};
  margin-bottom: ${spacing[3]};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[1]};
`;

const StatLabel = styled.span`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

const StatValue = styled.span`
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
`;

const Price = styled.div`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[600]};
`;

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(price);
};

const ListingCard = ({ listing }: ListingCardProps) => {
  return (
    <Card>
      <ThumbnailContainer>
        <PlaceholderContent>
          <PlaceholderIcon>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" />
              <path d="M7 10L12 15L17 10" />
              <path d="M12 15V3" />
            </svg>
          </PlaceholderIcon>
          <PlaceholderText>채널 이미지</PlaceholderText>
        </PlaceholderContent>
        <Badge>판매중</Badge>
      </ThumbnailContainer>
      <Content>
        <Title>{listing.title}</Title>
        <ChannelName>{listing.channel.channel_name}</ChannelName>
        <Stats>
          <StatItem>
            <StatLabel>구독자</StatLabel>
            <StatValue>{formatNumber(listing.channel.subscriber_count)}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>총 조회수</StatLabel>
            <StatValue>{formatNumber(listing.channel.total_views)}</StatValue>
          </StatItem>
        </Stats>
        <Price>{formatPrice(listing.asking_price)}</Price>
      </Content>
    </Card>
  );
};

export default ListingCard; 