'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import SidebarNav from '@/components/mypage/SidebarNav';
import AccountInfo from '@/components/mypage/AccountInfo';
import SellerProfile from '@/components/mypage/SellerProfile';
import TransactionHistory from '@/components/mypage/TransactionHistory';
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

export default function MyPage() {
  const { section } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();

  if (!user) {
    return <div>로그인이 필요한 페이지입니다.</div>;
  }

  const handleAccountUpdate = async () => {
    showToast('회원 정보 업데이트(임시)', 3000);
  };

  let title = '';
  let description = '';
  if (section === 'account') {
    title = '마이페이지';
    description = `${user.nickname || user.email}님의 회원 정보를 관리하세요.`;
  } else if (section === 'seller-profile') {
    title = '판매자 관리';
    description = '판매자 정보를 관리하세요.';
  } else if (section === 'transactions') {
    title = '거래 내역';
    description = '회원님의 거래 내역을 확인할 수 있습니다.';
  } else {
    return <div>존재하지 않는 페이지입니다.</div>;
  }

  return (
    <MyContainer>
      <PageHeader>
        <PageTitle>{title}</PageTitle>
        <PageDescription>{description}</PageDescription>
      </PageHeader>
      <ContentGrid>
        <Sidebar>
          <SidebarNav />
        </Sidebar>
        <MainContent>
          {section === 'account' && (
            <AccountInfo userData={user} onUpdate={handleAccountUpdate} />
          )}
        </MainContent>
      </ContentGrid>
    </MyContainer>
  );
} 