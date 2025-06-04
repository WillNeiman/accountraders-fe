'use client';

import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing, borderRadius } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import { FaShieldAlt, FaHandshake, FaChartLine, FaUserShield, FaUserCheck, FaHistory, FaBell } from 'react-icons/fa';

const GuideContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing[6]};
`;

const HeroSection = styled.section`
  text-align: center;
  margin: ${spacing[12]};
  padding: ${spacing[8]} 0;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[6]};
  @media (max-width: 1023px) {
    font-size: 2rem;
  }
  @media (max-width: 767px) {
    font-size: 1.5rem;
  }
`;

const SubTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[4]};
  @media (max-width: 1023px) {
    font-size: 1.25rem;
  }
  @media (max-width: 767px) {
    font-size: 1.1rem;
  }
`;

const Description = styled.p`
  font-size: 1.25rem;
  line-height: 1.6;
  color: ${colors.text.secondary};
  max-width: 800px;
  margin: 0 auto;
  @media (max-width: 1023px) {
    font-size: 1.1rem;
  }
  @media (max-width: 767px) {
    font-size: 1rem;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${spacing[6]};
  margin: ${spacing[8]} 0;
  @media (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: ${colors.background.paper};
  border-radius: 12px;
  padding: ${spacing[6]};
  text-align: center;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: ${colors.primary[500]};
  margin-bottom: ${spacing[4]};
  @media (max-width: 1023px) {
    font-size: 2rem;
  }
  @media (max-width: 767px) {
    font-size: 1.5rem;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[3]};
  @media (max-width: 1023px) {
    font-size: 1rem;
  }
  @media (max-width: 767px) {
    font-size: 0.95rem;
  }
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${colors.text.secondary};
  @media (max-width: 1023px) {
    font-size: 0.95rem;
  }
  @media (max-width: 767px) {
    font-size: 0.9rem;
  }
`;

const ProcessSection = styled.section`
  margin: ${spacing[24]} 0;
`;

const ProcessStep = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${spacing[6]};
  padding: ${spacing[4]};
  background: ${colors.background.paper};
  border-radius: 12px;
`;

const StepNumber = styled.div`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[500]};
  margin-right: ${spacing[4]};
  min-width: 40px;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h4`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[2]};
`;

const StepDescription = styled.p`
  font-size: ${typography.fontSize.base};
  line-height: 1.6;
  color: ${colors.text.secondary};
`;

const PreparingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing[6]};
  margin: ${spacing[8]} 0;
  @media (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`;

const PreparingCard = styled.div`
  border: 1.5px dashed ${colors.orange[300]};
  border-radius: 12px;
  padding: ${spacing[6]};
  text-align: center;
  position: relative;
  opacity: 0.85;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 8px ${colors.orange[100]};
  &:hover {
    box-shadow: 0 4px 16px ${colors.orange[200]};
    opacity: 1;
  }
`;

const PreparingIcon = styled.div`
  font-size: 2.5rem;
  color: ${colors.orange[500]};
  margin-bottom: ${spacing[4]};
  @media (max-width: 1023px) {
    font-size: 2rem;
  }
  @media (max-width: 767px) {
    font-size: 1.5rem;
  }
`;

const PreparingTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: ${typography.fontWeight.semibold};
  margin-bottom: ${spacing[3]};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  @media (max-width: 1023px) {
    font-size: 1rem;
  }
  @media (max-width: 767px) {
    font-size: 0.95rem;
  }
`;

const PreparingDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  @media (max-width: 1023px) {
    font-size: 0.95rem;
  }
  @media (max-width: 767px) {
    font-size: 0.9rem;
  }
`;

const PreparingBadge = styled.span`
  display: inline-block;
  background: ${colors.orange[400]};
  color: #fff;
  font-size: 0.8rem;
  font-weight: ${typography.fontWeight.bold};
  border-radius: ${borderRadius.full};
  padding: 0.18em 0.9em;
  margin-left: 0.5em;
  letter-spacing: 0.02em;
  vertical-align: middle;
`;

export default function GuideClient() {
  return (
    <GuideContainer>
      <HeroSection>
        <Title>안전하고 신뢰할 수 있는<br />유튜브 채널 거래 플랫폼</Title>
        <Description>
          채널링크는 믿을 수 있는 유튜브 채널 거래 플랫폼입니다.<br/>
          전문가의 검증과 안전 결제 시스템으로 누구나 안심하고 거래할 수 있습니다.
        </Description>
      </HeroSection>

      <FeatureGrid>
        <FeatureCard>
          <FeatureIcon>
            <FaShieldAlt />
          </FeatureIcon>
          <FeatureTitle>안전한 거래 시스템</FeatureTitle>
          <FeatureDescription>
            전문 PG 시스템으로 결제 대금을 안전하게 보관해요.
            거래가 완료된 후에만 판매자에게 정산됩니다.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <FaHandshake />
          </FeatureIcon>
          <FeatureTitle>전문가 검증</FeatureTitle>
          <FeatureDescription>
            모든 채널은 전문 관리자의 검증을 거쳐 등록돼요.
            경고/주의 이력까지 철저히 확인하여 안전한 거래를 보장합니다.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <FaChartLine />
          </FeatureIcon>
          <FeatureTitle>자동화된 데이터 연동</FeatureTitle>
          <FeatureDescription>
            유튜브 API를 통해 채널 데이터를 자동으로 연동해요.
            정확한 정보로 안심하고 거래하세요.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <FaUserShield />
          </FeatureIcon>
          <FeatureTitle>분쟁 해결 시스템</FeatureTitle>
          <FeatureDescription>
            문제가 발생하면 전문 관리자가 즉시 개입해요.
            공정한 해결을 도와드립니다.
          </FeatureDescription>
        </FeatureCard>
      </FeatureGrid>

      {/* 준비중 기능 그리드 */}
      <PreparingGrid>
        <PreparingCard>
          <PreparingIcon><FaUserCheck /></PreparingIcon>
          <PreparingTitle>
            자동 채널 확인 기능<PreparingBadge>준비중</PreparingBadge>
          </PreparingTitle>
          <PreparingDescription>
            판매자가 실제로 소유한 채널인지 쉽게 확인할 수 있어요.
            간단한 인증 과정으로 안전한 거래를 보장합니다.
          </PreparingDescription>
        </PreparingCard>
        <PreparingCard>
          <PreparingIcon><FaHistory /></PreparingIcon>
          <PreparingTitle>
            판매자 신뢰도 확인<PreparingBadge>준비중</PreparingBadge>
          </PreparingTitle>
          <PreparingDescription>
            판매자의 이전 거래 내역과 구매자들의 후기를 확인할 수 있어요.
            신뢰할 수 있는 판매자와 안전하게 거래하세요.
          </PreparingDescription>
        </PreparingCard>
        <PreparingCard>
          <PreparingIcon><FaBell /></PreparingIcon>
          <PreparingTitle>
            조건 알림 기능 <PreparingBadge>준비중</PreparingBadge>
          </PreparingTitle>
          <PreparingDescription>
            원하는 조건의 매물이 올라오면 이메일, 카카오 채널 등으로 알림을 받을 수 있습니다.
          </PreparingDescription>
        </PreparingCard>
      </PreparingGrid>

      <ProcessSection>
        <SubTitle>거래 진행 과정</SubTitle>
        <ProcessStep>
          <StepNumber>1</StepNumber>
          <StepContent>
            <StepTitle>채널 등록 및 검증</StepTitle>
            <StepDescription>
              판매자는 채널 정보를 등록하고, 전문 관리자가 검증합니다.
              경고/주의 이력까지 철저히 확인하여 안전한 거래를 보장합니다.
            </StepDescription>
          </StepContent>
        </ProcessStep>

        <ProcessStep>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>안전한 결제</StepTitle>
            <StepDescription>
              구매자는 KG이니시스를 통해 안전하게 결제합니다.
              결제 대금은 거래 완료 전까지 플랫폼에서 보관됩니다.
            </StepDescription>
          </StepContent>
        </ProcessStep>

        <ProcessStep>
          <StepNumber>3</StepNumber>
          <StepContent>
            <StepTitle>소유권 이전</StepTitle>
            <StepDescription>
              판매자가 구매자를 공동 소유자로 초대하고,
              7일의 대기 기간 후 소유권 이전이 완료됩니다.
            </StepDescription>
          </StepContent>
        </ProcessStep>

        <ProcessStep>
          <StepNumber>4</StepNumber>
          <StepContent>
            <StepTitle>거래 완료 및 정산</StepTitle>
            <StepDescription>
              소유권 이전이 완료되면 판매자에게 대금이 정산됩니다.
              모든 과정은 전문 관리자의 감독 하에 진행됩니다.
            </StepDescription>
          </StepContent>
        </ProcessStep>
      </ProcessSection>
    </GuideContainer>
  );
} 