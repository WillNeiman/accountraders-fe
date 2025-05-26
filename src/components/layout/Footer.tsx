'use client';

import styled from '@emotion/styled';
import Link from 'next/link';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import { mediaQueries } from '@/styles/theme/breakpoints';

const MAX_WIDTH = '1280px';
const MOBILE_BREAKPOINT = '767px';

const FooterWrapper = styled.footer`
  /* Layout */
  width: 100%;

  /* Box Model */
  padding: ${spacing[8]} 0;
  border-top: 1px solid ${colors.gray[200]};

  /* Visual */
  background-color: ${colors.gray[50]};
`;

const FooterContainer = styled.div`
  max-width: ${MAX_WIDTH};
  margin: 0 auto;
  padding: 0 ${spacing[4]};

  ${mediaQueries.md} {
    padding: 0 ${spacing[6]};
  }
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${spacing[8]};
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
`;

const CompanyName = styled.h2`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[2]};
`;

const Text = styled.p`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  line-height: 1.6;
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
`;

const FooterLink = styled(Link)`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: ${colors.primary[600]};
  }
`;

const SectionTitle = styled.h3`
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[2]};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${colors.gray[200]};
  margin: ${spacing[6]} 0;
`;

const BottomText = styled.p`
  font-size: ${typography.fontSize.xs};
  color: ${colors.text.secondary};
  text-align: center;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterContent>
          <FooterSection>
            <CompanyName>채널링크</CompanyName>
            <Text>
              사업자등록번호: {'{business_number}'}<br />
              대표: {'{ceo_name}'}<br />
              주소: {'{address}'}<br />
              이메일: {'{email}'}<br />
              전화: {'{phone}'}
            </Text>
          </FooterSection>

          <FooterSection>
            <SectionTitle>회사 정보</SectionTitle>
            <LinkList>
              <li><FooterLink href="/about">회사 소개</FooterLink></li>
              <li><FooterLink href="/careers">채용</FooterLink></li>
              <li><FooterLink href="/press">보도자료</FooterLink></li>
              <li><FooterLink href="/contact">제휴문의</FooterLink></li>
            </LinkList>
          </FooterSection>

          <FooterSection>
            <SectionTitle>고객 지원</SectionTitle>
            <LinkList>
              <li><FooterLink href="/faq">자주 묻는 질문</FooterLink></li>
              <li><FooterLink href="/support">고객센터</FooterLink></li>
              <li><FooterLink href="/terms">이용약관</FooterLink></li>
              <li><FooterLink href="/privacy">개인정보처리방침</FooterLink></li>
            </LinkList>
          </FooterSection>
        </FooterContent>

        <Divider />

        <Text>
          개인정보관리책임자: {'{privacy_officer_name}'} ({'{privacy_officer_email}'})<br />
          호스팅 서비스: {'{hosting_service}'}
        </Text>

        <BottomText>
          © {new Date().getFullYear()} 채널링크. All rights reserved.
        </BottomText>
      </FooterContainer>
    </FooterWrapper>
  );
};

export default Footer; 