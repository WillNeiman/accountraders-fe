'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import { YoutubeListing, ListingStatus } from '@/types/features/listings/listing';
import Button from '@/components/common/Button';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import {
  Section,
  SectionTitle,
  ItemList,
  Item,
  ItemLabel,
  ItemValue
} from '@/components/common/styles/ProfileStyles';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${spacing[4]};
  margin-bottom: ${spacing[6]};
`;

const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 16/9;
  border-radius: ${spacing[2]};
  overflow: hidden;
`;

const StyledImage = styled(Image)`
  object-fit: cover;
`;

const StatusBadge = styled.span<{ status: ListingStatus }>`
  display: inline-block;
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: ${spacing[1]};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ status }) => {
    if (status === 'ACTIVE') return colors.success.dark;
    if (status === 'PENDING_SALE') return colors.warning.dark;
    return colors.gray[600];
  }};
  background-color: ${({ status }) => {
    if (status === 'ACTIVE') return colors.success.light;
    if (status === 'PENDING_SALE') return colors.warning.light;
    return colors.gray[100];
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${spacing[2]};
  margin-top: ${spacing[6]};
`;

const STATUS_MAP: { [key in ListingStatus]: string } = {
  ACTIVE: '판매중',
  PENDING_SALE: '거래중',
  SOLD: '판매완료',
};

interface Props {
  listing: YoutubeListing;
  onDelete: () => void;
  onStatusChange: (status: ListingStatus) => void;
}

export default function ListingDetail({ listing, onDelete, onStatusChange }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Section>
      <SectionTitle>채널 상세 정보</SectionTitle>
      <ImageGrid>
        {listing.imageUrls.map((url, index) => (
          <ImageContainer key={index}>
            <StyledImage
              src={url || 'https://placeholderjs.com/800x450'}
              alt={`${listing.listingTitle} 이미지 ${index + 1}`}
              fill
            />
          </ImageContainer>
        ))}
      </ImageGrid>

      <ItemList>
        <Item>
          <ItemLabel>제목</ItemLabel>
          <ItemValue>{listing.listingTitle}</ItemValue>
        </Item>
        <Item>
          <ItemLabel>설명</ItemLabel>
          <ItemValue>{listing.listingDescription || '-'}</ItemValue>
        </Item>
        <Item>
          <ItemLabel>판매가</ItemLabel>
          <ItemValue>{formatCurrency(listing.askingPrice)}</ItemValue>
        </Item>
        <Item>
          <ItemLabel>상태</ItemLabel>
          <ItemValue>
            <StatusBadge status={listing.status}>
              {STATUS_MAP[listing.status]}
            </StatusBadge>
          </ItemValue>
        </Item>
        <Item>
          <ItemLabel>채널 주제</ItemLabel>
          <ItemValue>{listing.channelTopic}</ItemValue>
        </Item>
        <Item>
          <ItemLabel>수익화 상태</ItemLabel>
          <ItemValue>{listing.monetizationStatus ? '수익화 가능' : '수익화 불가'}</ItemValue>
        </Item>
        <Item>
          <ItemLabel>저작권 경고</ItemLabel>
          <ItemValue>{listing.copyrightStrikeCount}회</ItemValue>
        </Item>
        <Item>
          <ItemLabel>커뮤니티 가이드라인 경고</ItemLabel>
          <ItemValue>{listing.communityGuidelineStrikeCount}회</ItemValue>
        </Item>
        <Item>
          <ItemLabel>월 평균 수익</ItemLabel>
          <ItemValue>{listing.averageMonthlyIncome ? formatCurrency(listing.averageMonthlyIncome) : '-'}</ItemValue>
        </Item>
        <Item>
          <ItemLabel>원본 콘텐츠</ItemLabel>
          <ItemValue>{listing.isOriginalContent ? '예' : '아니오'}</ItemValue>
        </Item>
      </ItemList>

      <ActionButtons>
        <Button
          variant="outline"
          color="primary"
          onClick={() => router.push(`/my/listings/youtube-listings/${listing.listingId}/edit`)}
          disabled={isDeleting}
        >
          <FiEdit2 style={{ marginRight: spacing[2] }} />
          수정
        </Button>
        <Button
          variant="outline"
          color="primary"
          onClick={() => onStatusChange(listing.status === 'ACTIVE' ? 'PENDING_SALE' : 'ACTIVE')}
          disabled={isDeleting}
        >
          {listing.status === 'ACTIVE' ? '거래중으로 변경' : '판매중으로 변경'}
        </Button>
        <Button
          variant="outline"
          color="error"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <FiTrash2 style={{ marginRight: spacing[2] }} />
          삭제
        </Button>
      </ActionButtons>
    </Section>
  );
} 