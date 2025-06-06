"use client";

import styled from '@emotion/styled';
import Image from 'next/image';
import { colors } from '@/styles/theme/colors';
import { typography } from '@/styles/theme/typography';
import { spacing, borderRadius } from '@/styles/theme/spacing';
import { mediaQueries } from '@/styles/theme/breakpoints';
import { YoutubeListing } from '@/types/features/listings/listing';
import Link from 'next/link';

interface ListingCardProps {
  listing: YoutubeListing;
}

const PLACEHOLDER_THUMBNAIL = 'https://placeholderjs.com/400x225&text=No+Image&background=_F5F6FA&color=_888888&fontsize=24';

const Card = styled.div`
  /* Layout */
  overflow: hidden;
  display: flex;
  flex-direction: column;

  /* Box Model */
  border: 1px solid ${colors.gray[200]};
  border-radius: ${borderRadius.lg};

  /* Visual */
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  /* Others */
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const ThumbnailContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 비율 */
  background: ${colors.gray[100]};
  overflow: hidden;
`;

const Badge = styled.div<{ status: 'ACTIVE' | 'PENDING_SALE' | 'SOLD' }>`
  position: absolute;
  top: ${spacing[2]};
  right: ${spacing[2]};
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: ${borderRadius.full};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.medium};
  line-height: ${typography.lineHeight.tight};
  color: ${({ status }) => {
    switch (status) {
      case 'ACTIVE':
        return colors.success.dark;
      case 'PENDING_SALE':
        return colors.warning.dark;
      case 'SOLD':
        return colors.gray[600];
      default:
        return colors.gray[600];
    }
  }};
  background-color: ${({ status }) => {
    switch (status) {
      case 'ACTIVE':
        return colors.success.light;
      case 'PENDING_SALE':
        return colors.warning.light;
      case 'SOLD':
        return colors.gray[100];
      default:
        return colors.gray[100];
    }
  }};
  border: 1px solid ${({ status }) => {
    switch (status) {
      case 'ACTIVE':
        return colors.success.main;
      case 'PENDING_SALE':
        return colors.warning.main;
      case 'SOLD':
        return colors.gray[300];
      default:
        return colors.gray[300];
    }
  }};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(4px);
  z-index: 1;
`;

const Content = styled.div`
  padding: ${spacing[3]};
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
  
  ${mediaQueries.md} {
    padding: ${spacing[4]};
    gap: ${spacing[3]};
  }
`;

const Title = styled.h3`
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: center;
  
  ${mediaQueries.md} {
    font-size: ${typography.fontSize.base};
  }
`;

const Topic = styled.p`
  font-size: ${typography.fontSize.xs};
  color: ${colors.text.secondary};
  text-align: center;
  margin-top: -${spacing[1]};
  
  ${mediaQueries.md} {
    font-size: ${typography.fontSize.xs};
  }
`;

const Price = styled.div`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[600]};
  text-align: center;
  margin: ${spacing[1]} 0;
  
  ${mediaQueries.md} {
    font-size: ${typography.fontSize.xl};
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing[2]};
  margin-top: ${spacing[2]};
  
  ${mediaQueries.md} {
    gap: ${spacing[3]};
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[1]};
  align-items: center;
  text-align: center;
`;

const StatLabel = styled.span`
  font-size: ${typography.fontSize.xs};
  color: ${colors.text.secondary};
  
  ${mediaQueries.md} {
    font-size: ${typography.fontSize.xs};
  }
`;

const StatValue = styled.span`
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
  
  ${mediaQueries.md} {
    font-size: ${typography.fontSize.sm};
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

const formatSubscriberCount = (count: number) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M+`;
  }
  if (count >= 1000) {
    return `${Math.round(count / 1000) * 1000}+`;
  }
  return `${count}+`;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(price);
};

const formatMonthlyIncome = (income: number | null) => {
  if (!income) return '정보 없음';
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(income);
};

const ListingCard = ({ listing }: ListingCardProps) => {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '거래가능';
      case 'PENDING_SALE':
        return '거래중';
      case 'SOLD':
        return '거래완료';
      default:
        return '거래가능';
    }
  };

  return (
    <Link href={`/listings/${listing.listingId}`}>
      <Card>
        <ThumbnailContainer>
          <Image 
            src={listing.thumbnailUrl || PLACEHOLDER_THUMBNAIL}
            alt={`${listing.listingTitle} 썸네일`}
            fill
            style={{ objectFit: 'cover' }}
            unoptimized={true}
          />
          <Badge status={listing.status}>
            {getStatusText(listing.status)}
          </Badge>
        </ThumbnailContainer>
        <Content>
          <Title>{listing.listingTitle}</Title>
          <Topic>{listing.channelTopic || '주제 없음'}</Topic>
          <Price>{formatPrice(listing.askingPrice)}</Price>
          <Stats>
            <StatItem>
              <StatLabel>구독자 수</StatLabel>
              <StatValue>{formatSubscriberCount(listing.subscriberCount)}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>총 조회수</StatLabel>
              <StatValue>{formatNumber(listing.totalViewCount)}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>월 평균 수익</StatLabel>
              <StatValue>{formatMonthlyIncome(listing.averageMonthlyIncome)}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>등록일</StatLabel>
              <StatValue>{new Date(listing.createdAt).toLocaleDateString()}</StatValue>
            </StatItem>
          </Stats>
        </Content>
      </Card>
    </Link>
  );
};

export default ListingCard; 