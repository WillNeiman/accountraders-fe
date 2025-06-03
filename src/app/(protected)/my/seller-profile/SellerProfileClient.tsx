'use client';

import { useAuth } from '@/contexts/AuthContext';
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
  const { user } = useAuth();
  if (!user) return null;
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