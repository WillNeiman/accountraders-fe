'use client';

import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import { mediaQueries } from '@/styles/theme/breakpoints';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/user';
import SidebarNav from '@/components/mypage/SidebarNav';
import AccountInfo from '@/components/mypage/AccountInfo';
import SellerProfile from '@/components/mypage/SellerProfile';
import TransactionHistory from '@/components/mypage/TransactionHistory';
import { useToast } from '@/contexts/ToastContext';

const MyPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing[6]};
`;

const PageHeader = styled.div`
  margin-bottom: ${spacing[8]};
`;

const PageTitle = styled.h1`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[2]};
`;

const PageDescription = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.secondary};
`;

const ContentGrid = styled.div`
  /* Layout */
  display: grid;
  grid-template-columns: 1fr;
  align-items: flex-start;
  gap: ${spacing[2]};

  /* Responsive */
  ${mediaQueries.lg} {
    grid-template-columns: 280px 1fr;
  }
`;

const Sidebar = styled.nav`
  /* Layout */
  background: ${colors.background.paper};
  border-radius: ${spacing[2]};
  padding: ${spacing[4]};
`;

const MainContent = styled.main`
  /* Layout */
  background: ${colors.background.paper};
  border-radius: ${spacing[2]};
  padding: ${spacing[6]};
  min-height: 600px;
`;

export default function MyPage() {
  const { user } = useAuth();
  const currentUser = user as User;
  const { showToast } = useToast();

  // 실제 onUpdate는 API 연동 필요. 임시로 토스트만 띄움
  const handleAccountUpdate = async (_data: Partial<User>) => {
    showToast('계정 정보 업데이트(임시)', 3000);
  };

  return (
    <MyPageContainer>
      <PageHeader>
        <PageTitle>마이페이지</PageTitle>
        <PageDescription>
          {currentUser.nickname || currentUser.email}님의 계정 정보를 관리하세요.
        </PageDescription>
      </PageHeader>

      <ContentGrid>
        <Sidebar>
          <SidebarNav />
        </Sidebar>
        <MainContent>
          <AccountInfo userData={currentUser} onUpdate={handleAccountUpdate} />
          <SellerProfile />
          <TransactionHistory />
        </MainContent>
      </ContentGrid>
    </MyPageContainer>
  );
} 