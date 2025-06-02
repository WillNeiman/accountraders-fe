'use client';

import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/user';
import SidebarNav from '@/components/mypage/SidebarNav';
import AccountInfo from '@/components/mypage/AccountInfo';
import { useToast } from '@/contexts/ToastContext';
import {
  MyContainer,
  PageHeader,
  PageTitle,
  PageDescription,
  ContentGrid,
  Sidebar,
  MainContent
} from '@/components/common/styles/MyPageLayout';

export default function AccountClient() {
  const { user } = useAuth();
  const currentUser = user as User;
  const { showToast } = useToast();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAccountUpdate = async (_data: Partial<User>) => {
    showToast('회원 정보 업데이트(임시)', 3000);
  };

  return (
    <MyContainer>
      <PageHeader>
        <PageTitle>계정 관리</PageTitle>
        <PageDescription>
          {currentUser.nickname || currentUser.email}님의 회원 정보를 관리하세요.
        </PageDescription>
      </PageHeader>

      <ContentGrid>
        <Sidebar>
          <SidebarNav />
        </Sidebar>
        <MainContent>
          <AccountInfo userData={currentUser} onUpdate={handleAccountUpdate} />
        </MainContent>
      </ContentGrid>
    </MyContainer>
  );
} 