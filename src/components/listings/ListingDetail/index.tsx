'use client';

import styled from '@emotion/styled';
import Image from 'next/image';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import { YoutubeListingDetail } from '@/types/listings';
import { mediaQueries } from '@/styles/theme/breakpoints';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import LoginModal from '@/components/auth/LoginModal';

const PLACEHOLDER_THUMBNAIL = 'https://placeholderjs.com/400x225&text=No+Image&background=_F5F6FA&color=_888888&fontsize=24';

const Container = styled.div`
  display: flex;
  gap: ${spacing[12]};
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing[6]} ${spacing[4]};
  @media (max-width: 1024px) {
    flex-direction: column;
    gap: ${spacing[6]};
  }
  ${mediaQueries.lg} {
    padding: ${spacing[8]} ${spacing[6]};
  }
`;

const Main = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: ${spacing[8]};
`;

const Side = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${spacing[6]};
`;

const TopSection = styled.div`
  display: flex;
  gap: ${spacing[10]};
  align-items: flex-start;
  @media (max-width: 1024px) {
    flex-direction: column;
    gap: ${spacing[6]};
    align-items: stretch;
  }
`;

const ThumbnailWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: ${spacing[4]};
  overflow: hidden;
  background: ${colors.gray[100]};
  
  ${mediaQueries.md} {
    width: 320px;
    flex-shrink: 0;
  }
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]};
  flex: 1;
`;

const Title = styled.h1`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin: 0;
  ${mediaQueries.sm} {
    font-size: ${typography.fontSize['2xl']};
  }
  @media (max-width: 767px) {
    font-size: ${typography.fontSize.xl};
  }
`;

const Category = styled.div`
  color: ${colors.text.secondary};
  font-size: ${typography.fontSize.sm};
`;

const ChannelLink = styled.a`
  color: ${colors.primary[600]};
  font-size: ${typography.fontSize.sm};
  margin-left: ${spacing[2]};
  text-decoration: underline;
`;

const MetricsWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0;
`;

const MetricsLine = styled.div`
  width: 2px;
  height: 4.375rem;
  background: ${colors.primary[600]};
  border-radius: ${spacing[1]};
  margin-right: ${spacing[3]};
`;

const Metrics = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[1]};
  color: ${colors.text.secondary};
  font-size: ${typography.fontSize.sm};
  margin-top: 0;
`;

const Price = styled.div`
  font-size: ${typography.fontSize.xl};
  color: ${colors.primary[600]};
  font-weight: ${typography.fontWeight.bold};
  margin-top: ${spacing[2]};
`;

const Actions = styled.div`
  display: flex;
  gap: ${spacing[3]};
  margin-top: ${spacing[2]};
`;

const ActionButton = styled.button`
  padding: ${spacing[2]} ${spacing[6]};
  border-radius: 999px;
  font-weight: ${typography.fontWeight.semibold};
  font-size: ${typography.fontSize.sm};
  border: 2px solid ${colors.primary[600]};
  background: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border 0.2s;
  outline: none;
`;

const BuyButton = styled(ActionButton)`
  color: ${colors.primary[600]};
  &:hover {
    background: ${colors.primary[600]};
    color: #fff;
  }
`;

const FavoriteButton = styled(ActionButton)`
  color: ${colors.gray[600]};
  border-color: ${colors.gray[400]};
  &:hover {
    background: ${colors.gray[600]};
    color: #fff;
    border-color: ${colors.gray[600]};
  }
`;

const Description = styled.div`
  margin-top: ${spacing[6]};
  color: ${colors.text.secondary};
  font-size: ${typography.fontSize.base};
  line-height: ${typography.lineHeight.relaxed};
`;

const SellerCard = styled.div`
  border: 1px solid ${colors.gray[200]};
  border-radius: ${spacing[3]};
  padding: ${spacing[6]};
  background: ${colors.background.paper};
`;

const SellerName = styled.div`
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.lg};
  color: ${colors.text.primary};
`;

const SellerMeta = styled.div`
  color: ${colors.text.secondary};
  font-size: ${typography.fontSize.sm};
  margin-top: ${spacing[1]};
`;

const SellerButton = styled.button`
  margin-top: ${spacing[3]};
  padding: ${spacing[2]} ${spacing[5]};
  background: ${colors.primary[600]};
  color: #fff;
  border-radius: ${spacing[2]};
  border: none;
  font-weight: ${typography.fontWeight.semibold};
  font-size: ${typography.fontSize.sm};
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${colors.primary[700]};
  }
`;

const ImagesSection = styled.div``;
const ImagesTitle = styled.div`
  font-weight: ${typography.fontWeight.semibold};
  margin-bottom: ${spacing[2]};
  color: ${colors.text.primary};
  font-size: ${typography.fontSize.sm};
`;
const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing[2]};
`;
const AttachImage = styled.img`
  width: 100%;
  border-radius: ${spacing[2]};
  background: ${colors.gray[100]};
  aspect-ratio: 1/1;
  object-fit: cover;
`;

const Notice = styled.div`
  background: ${colors.warning.light};
  color: ${colors.warning.dark};
  border-radius: ${spacing[2]};
  padding: ${spacing[3]};
  font-size: ${typography.fontSize.sm};
`;

interface Seller {
  nickname: string;
  rating: number;
  transactionCount: number;
}

interface Props {
  listing?: YoutubeListingDetail;
}

export default function ListingDetail({ listing }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleBuyClick = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    router.push(`/listings/${listing?.listingId}/order`);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    router.push(`/listings/${listing?.listingId}/order`);
  };

  const handleLoginClose = () => {
    setIsLoginModalOpen(false);
  };

  // 플레이스홀더 데이터
  const placeholder = {
    thumbnail: undefined,
    title: listing?.title || '대회 경험 풍부! 프로게이머 FPS 채널 판매',
    category: undefined,
    channelUrl: undefined,
    metrics: {
      subscribers: undefined,
      views: undefined,
      income: undefined,
    },
    price: listing?.askingPrice ?? 50000000,
    currency: listing?.currency || 'KRW',
    description: listing?.listingDescription || '구독자 2.5만, 월 평균 수익 500만원 이상. 안정적인 운영. 모든 권한 양도. 직접 만나서 인증 가능.',
    seller: (listing?.seller as Seller) || {
      nickname: '홍길동',
      rating: 4.8,
      transactionCount: 12,
    },
    images: undefined,
  };

  return (
    <>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginClose}
        onLoginSuccess={handleLoginSuccess}
      />
      <Container>
        <Main>
          <TopSection>
            <ThumbnailWrapper>
              <Image 
                src={PLACEHOLDER_THUMBNAIL}
                alt="채널 썸네일"
                fill
                style={{ objectFit: 'cover' }}
                unoptimized={true}
              />
            </ThumbnailWrapper>
            <InfoBlock>
              <Title>{placeholder.title}</Title>
              <Category>
                {(placeholder.category || '게임')} |
                <ChannelLink href={placeholder.channelUrl || 'https://youtube.com/@placeholder'} target="_blank" rel="noopener noreferrer">채널 바로가기</ChannelLink>
              </Category>
              <MetricsWrapper>
                <MetricsLine />
                <Metrics>
                  <div>구독자: {(placeholder.metrics.subscribers ?? 25000).toLocaleString()}명</div>
                  <div>조회수: {(placeholder.metrics.views ?? 1000000).toLocaleString()}회</div>
                  <div>월수익: {(placeholder.metrics.income ?? 5000000).toLocaleString()}원</div>
                </Metrics>
              </MetricsWrapper>
              <Price>
                {placeholder.price.toLocaleString()} {placeholder.currency}
              </Price>
              <Actions>
                <BuyButton onClick={handleBuyClick}>구매하기</BuyButton>
                <FavoriteButton>찜하기</FavoriteButton>
              </Actions>
            </InfoBlock>
          </TopSection>
          <Description>{placeholder.description}</Description>
        </Main>
        <Side>
          <SellerCard>
            <SellerName>{(placeholder.seller?.nickname) || '홍길동'}</SellerName>
            <SellerMeta>평점: {(placeholder.seller?.rating ?? 4.8)} / 거래 {(placeholder.seller?.transactionCount ?? 12)}건</SellerMeta>
            <SellerButton>판매자 문의</SellerButton>
          </SellerCard>
          <ImagesSection>
            <ImagesTitle>첨부 이미지</ImagesTitle>
            <ImagesGrid>
              {(placeholder.images ?? ['/placeholder1.png', '/placeholder2.png', '/placeholder3.png', '/placeholder4.png']).map((img: string, idx: number) => (
                <AttachImage key={idx} src={img} alt={`첨부${idx+1}`} />
              ))}
            </ImagesGrid>
          </ImagesSection>
          <Notice>
            안전거래를 위해 반드시 플랫폼 내 결제 시스템을 이용해 주세요.
          </Notice>
        </Side>
      </Container>
    </>
  );
} 