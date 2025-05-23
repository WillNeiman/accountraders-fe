"use client";

import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { typography } from '@/styles/theme/typography';
import { spacing } from '@/styles/theme/spacing';
import { mediaQueries } from '@/styles/theme/breakpoints';
import { Listing } from '@/types/listings';

interface ListingCardProps {
  listing: Listing;
}

const Card = styled.div`
  /* Layout */
  overflow: hidden;
  display: flex;
  flex-direction: column;

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
  padding-top: 56.25%; /* 16:9 비율 */
  background: ${colors.gray[100]};
`;

const PlaceholderContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
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
  padding: ${spacing[3]};
  flex: 1;
  display: flex;
  flex-direction: column;
  
  ${mediaQueries.md} {
    padding: ${spacing[4]};
  }
`;

const Title = styled.h3`
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[2]};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  ${mediaQueries.md} {
    font-size: ${typography.fontSize.lg};
  }
`;

const ChannelName = styled.p`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing[2]};
  
  ${mediaQueries.md} {
    font-size: ${typography.fontSize.base};
  }
`;

const Stats = styled.div`
  display: flex;
  gap: ${spacing[3]};
  margin-bottom: ${spacing[2]};
  
  ${mediaQueries.md} {
    gap: ${spacing[4]};
    margin-bottom: ${spacing[3]};
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[1]};
`;

const StatLabel = styled.span`
  font-size: ${typography.fontSize.xs};
  color: ${colors.text.secondary};
  
  ${mediaQueries.md} {
    font-size: ${typography.fontSize.sm};
  }
`;

const StatValue = styled.span`
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
  
  ${mediaQueries.md} {
    font-size: ${typography.fontSize.base};
  }
`;

const Price = styled.div`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[600]};
  margin-top: auto;
  
  ${mediaQueries.md} {
    font-size: ${typography.fontSize.xl};
  }
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
        <Badge>{listing.status === 'ACTIVE' ? '판매중' : '판매완료'}</Badge>
      </ThumbnailContainer>
      <Content>
        <Title>{listing.title}</Title>
        <ChannelName>{listing.listingDescription}</ChannelName>
        <Stats>
          <StatItem>
            <StatLabel>조회수</StatLabel>
            <StatValue>{formatNumber(listing.viewCountOnPlatform)}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>등록일</StatLabel>
            <StatValue>{new Date(listing.createdAt).toLocaleDateString()}</StatValue>
          </StatItem>
        </Stats>
        <Price>{formatPrice(listing.askingPrice)}</Price>
      </Content>
    </Card>
  );
};

export default ListingCard; 