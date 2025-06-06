'use client';

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import { mediaQueries } from '@/styles/theme/breakpoints';
import { YoutubeListingDetail } from '@/types/features/listings';
import { getYoutubeListingDetail, purchaseYoutubeListing } from '@/services/api/youtubeListings';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/auth/LoginModal';

interface OrderClientProps {
  listing: YoutubeListingDetail;
}

const OrderPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[8]};
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing[6]} ${spacing[4]};

  ${mediaQueries.lg} {
    padding: ${spacing[8]} ${spacing[6]};
  }
`;

const ContentRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[6]};

  ${mediaQueries.lg} {
    flex-direction: row;
    gap: ${spacing[8]};
  }
`;

const MainContent = styled.main`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: ${spacing[6]};
`;

const Sidebar = styled.aside`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${spacing[6]};
  position: sticky;
  top: ${spacing[6]}; // 헤더 높이만큼 조정 필요
`;

const Section = styled.section`
  background-color: ${colors.white};
  border: 1px solid ${colors.gray[200]};
  border-radius: ${spacing[3]};
  padding: ${spacing[6]};
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const SectionTitle = styled.h2`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[4]};
  padding-bottom: ${spacing[3]};
  border-bottom: 1px solid ${colors.gray[200]};
`;

const ProductInfoCard = styled(Section)`
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]};
  
  ${mediaQueries.md} {
    flex-direction: row;
  }
`;

const ProductImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: ${spacing[2]};
  overflow: hidden;
  & > img {
    color: transparent;
  }
  
  ${mediaQueries.md} {
    width: 320px;
    flex-shrink: 0;
  }
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
  flex: 1;
`;

const ProductName = styled.h3`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
`;

const ProductPrice = styled.p`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[600]};
`;

const SellerInfo = styled.p`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

const OrderSummaryCard = styled(Section)``;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing[3]} 0;
  border-bottom: 1px solid ${colors.gray[100]};

  &:last-child {
    border-bottom: none;
  }
`;

const SummaryLabel = styled.span`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.secondary};
`;

const SummaryValue = styled.span`
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
`;

const TotalPriceLabel = styled(SummaryLabel)`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
`;

const TotalPriceValue = styled(SummaryValue)`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[600]};
`;

const ImportantNoticeSection = styled(Section)`
  background-color: ${colors.primary[50]}; // 연한 primary 배경
  border-left: 4px solid ${colors.primary[500]}; // primary 강조선
`;

const NoticeTitle = styled.h3`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.primary[700]}; // primary 제목 색상
  margin-bottom: ${spacing[3]};
`;

const NoticeList = styled.ul`
  list-style-type: disc;
  padding-left: ${spacing[5]};
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
`;

const NoticeListItem = styled.li`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  line-height: ${typography.lineHeight.relaxed};
`;

const TermsAgreementSection = styled(Section)`
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]};
`;

const AgreementCheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  cursor: pointer;
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};

  input[type="checkbox"] {
    width: ${spacing[4]};
    height: ${spacing[4]};
    accent-color: ${colors.primary[600]};
  }
`;

const PLACEHOLDER_THUMBNAIL = 'https://placeholderjs.com/400x225&text=No+Image&background=_F5F6FA&color=_888888&fontsize=24';

export default function OrderClient({ listing: initialListing }: OrderClientProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listing, setListing] = useState(initialListing);
  const [hasPriceChanged, setHasPriceChanged] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, isAuthLoading } = useAuth();
  const router = useRouter();

  // 로그인 체크
  useEffect(() => {
    if (!isAuthLoading && !user) {
      setIsLoginModalOpen(true);
    }
  }, [user, isAuthLoading]);

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginClose = () => {
    setIsLoginModalOpen(false);
    // Check if the referrer is from the same origin
    try {
      const referrer = document.referrer;
      if (referrer) {
        const referrerUrl = new URL(referrer);
        if (referrerUrl.hostname === window.location.hostname) {
          router.back();
        } else {
          router.push('/');
        }
      } else {
        // No referrer, go to home
        router.push('/');
      }
    } catch (error) {
      // Invalid URL or other error, go to home as a fallback
      console.error('Error processing referrer:', error);
      router.push('/');
    }
  };

  // 주문 페이지 진입 시 최신 데이터로 업데이트
  useEffect(() => {
    const fetchLatestListing = async () => {
      try {
        const latestListing = await getYoutubeListingDetail(initialListing.listingId);
        setListing(latestListing);
        
        // 가격이 변경되었는지 확인
        if (latestListing.askingPrice !== initialListing.askingPrice) {
          setHasPriceChanged(true);
        }
      } catch (error) {
        console.error('Failed to fetch latest listing:', error);
      }
    };

    fetchLatestListing();
  }, [initialListing.listingId, initialListing.askingPrice]);

  const handlePayment = async () => {
    if (!agreedToTerms) {
      alert('구매 조건 및 이용약관에 동의해주세요.');
      return;
    }

    if (hasPriceChanged) {
      const confirmed = window.confirm(
        `상품 가격이 ${initialListing.askingPrice.toLocaleString()}원에서 ${listing.askingPrice.toLocaleString()}원으로 변경되었습니다. 이 가격으로 계속 주문하시겠습니까?`
      );
      if (!confirmed) return;
    }

    setIsLoading(true);
    try {
      const result = await purchaseYoutubeListing(listing.listingId, {
        paymentMethod: 'INICIS', // 실제 구현 시 사용자가 선택한 결제 수단으로 변경
      });
      
      // 결제 성공 시 처리
      console.log('Purchase successful:', result);
      // TODO: 결제 성공 페이지로 이동
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = listing.askingPrice;

  return (
    <>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginClose}
        onLoginSuccess={handleLoginSuccess}
      />
      <OrderPageContainer>
        <SectionTitle>주문서 작성</SectionTitle>
        
        <ContentRow>
          <MainContent>
            <ProductInfoCard>
              <ProductImageWrapper>
                <Image 
                  src={PLACEHOLDER_THUMBNAIL}
                  alt={`${listing.listingTitle} 썸네일`} 
                  fill
                  style={{objectFit: 'cover'}}
                  priority
                  unoptimized={true}
                />
              </ProductImageWrapper>
              <ProductDetails>
                <ProductName>{listing.listingTitle}</ProductName>
                <ProductPrice>{listing.askingPrice.toLocaleString()}원</ProductPrice>
                <SellerInfo>판매자: {listing.seller?.nickname || '알 수 없음'}</SellerInfo>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: spacing[2]}}>
                  {listing.listingDescription}
                </p>
              </ProductDetails>
            </ProductInfoCard>

            {hasPriceChanged && (
              <ImportantNoticeSection>
                <NoticeTitle>⚠️ 가격 변경 알림</NoticeTitle>
                <NoticeList>
                  <NoticeListItem>
                    상품 가격이 {initialListing.askingPrice.toLocaleString()}원에서 {listing.askingPrice.toLocaleString()}원으로 변경되었습니다.
                    결제 전 최종 가격을 확인해주세요.
                  </NoticeListItem>
                </NoticeList>
              </ImportantNoticeSection>
            )}

            <ImportantNoticeSection>
              <NoticeTitle>📢 중요 안내사항</NoticeTitle>
              <NoticeList>
                <NoticeListItem>
                  본 거래는 안전한 계정 거래를 위해 <strong>에스크로 방식</strong>으로 진행됩니다. 결제하신 금액은 소유권 이전이 완료될 때까지 안전하게 보관됩니다.
                </NoticeListItem>
                <NoticeListItem>
                  판매자는 결제 완료 후 구매자님을 해당 유튜브 채널의 <strong>공동 소유자로 초대</strong>해야 합니다.
                </NoticeListItem>
                <NoticeListItem>
                  구매자님께서 공동 소유자 초대를 수락하시면, <strong>7일의 소유권 이전 대기 기간</strong>이 시작됩니다. 이 기간 동안에는 거래 취소가 불가능합니다.
                </NoticeListItem>
                <NoticeListItem>
                  7일 후 유튜브 채널의 <strong>주 소유권이 구매자님께 완전히 이전</strong>되면 거래가 최종 완료되며, 이후 판매자에게 대금이 정산됩니다.
                </NoticeListItem>
                <NoticeListItem>
                  자세한 거래 절차 및 약관은 관련 페이지를 참고해주시기 바랍니다. 궁금한 점은 고객센터로 문의해주세요.
                </NoticeListItem>
              </NoticeList>
            </ImportantNoticeSection>
          </MainContent>

          <Sidebar>
            <OrderSummaryCard>
              <SectionTitle>최종 결제 정보</SectionTitle>
              <SummaryRow>
                <SummaryLabel>상품명</SummaryLabel>
                <SummaryValue>{listing.listingTitle}</SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>상품 금액</SummaryLabel>
                <SummaryValue>{listing.askingPrice.toLocaleString()}원</SummaryValue>
              </SummaryRow>
              <SummaryRow style={{ paddingTop: spacing[4], marginTop:spacing[2] }}>
                <TotalPriceLabel>총 결제 예정 금액</TotalPriceLabel>
                <TotalPriceValue>{totalPrice.toLocaleString()}원</TotalPriceValue>
              </SummaryRow>
            </OrderSummaryCard>

            <TermsAgreementSection>
              <SectionTitle>약관 동의</SectionTitle>
              <AgreementCheckboxWrapper>
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <span>구매 조건 및 이용약관에 모두 동의합니다. (필수)</span>
              </AgreementCheckboxWrapper>
              <a href="/terms" target="_blank" style={{fontSize: typography.fontSize.sm, color: colors.primary[600], textDecoration: 'underline'}}>이용약관 전체보기</a>
            </TermsAgreementSection>

            <Button 
              variant="primary" 
              size="large" 
              fullWidth 
              onClick={handlePayment}
              disabled={!agreedToTerms || isLoading}
              isLoading={isLoading}
              loadingText="결제 진행 중..."
            >
              {totalPrice.toLocaleString()}원 결제하기
            </Button>
          </Sidebar>
        </ContentRow>
      </OrderPageContainer>
    </>
  );
} 