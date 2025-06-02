'use client';

import SidebarNav from '@/components/mypage/SidebarNav';
import SellerProfile from '@/components/mypage/SellerProfile';
import {
  MyContainer,
  PageHeader,
  PageTitle,
  PageDescription,
  ContentGrid,
  Sidebar,
  MainContent
} from '@/components/common/styles/MyPageLayout';

export default function SellerProfileClient() {
  return (
    <MyContainer>
      <PageHeader>
        <PageTitle>판매자 관리</PageTitle>
        <PageDescription>판매자 정보를 관리하세요.</PageDescription>
      </PageHeader>
      <ContentGrid>
        <Sidebar>
          <SidebarNav />
        </Sidebar>
        <MainContent>
          <SellerProfile />
        </MainContent>
      </ContentGrid>
    </MyContainer>
  );
} 