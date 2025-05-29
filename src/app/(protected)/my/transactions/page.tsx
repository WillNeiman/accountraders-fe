'use client';

import SidebarNav from '@/components/mypage/SidebarNav';
import TransactionHistory from '@/components/mypage/TransactionHistory';
import {
  MyContainer,
  PageHeader,
  PageTitle,
  PageDescription,
  ContentGrid,
  Sidebar,
  MainContent
} from '@/components/common/styles/MyPageLayout';

export default function TransactionsPage() {
  return (
    <MyContainer>
      <PageHeader>
        <PageTitle>거래 내역</PageTitle>
        <PageDescription>회원님의 거래 내역을 확인할 수 있습니다.</PageDescription>
      </PageHeader>
      <ContentGrid>
        <Sidebar>
          <SidebarNav />
        </Sidebar>
        <MainContent>
          <TransactionHistory />
        </MainContent>
      </ContentGrid>
    </MyContainer>
  );
} 