'use client';

import { useAuth } from '@/contexts/AuthContext';
import SidebarNav from '@/components/mypage/SidebarNav';
import YoutubeChannels from '@/components/mypage/YoutubeChannels';
import {
  MyContainer,
  PageHeader,
  PageTitle,
  PageDescription,
  ContentGrid,
  Sidebar,
  MainContent
} from '@/components/common/styles/MyPageLayout';

export default function YoutubeChannelsClient() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <MyContainer>
      <PageHeader>
        <PageTitle>판매자 관리</PageTitle>
        <PageDescription>등록된 유튜브 채널을 관리하세요.</PageDescription>
      </PageHeader>
      <ContentGrid>
        <Sidebar>
          <SidebarNav />
        </Sidebar>
        <MainContent>
          <YoutubeChannels />
        </MainContent>
      </ContentGrid>
    </MyContainer>
  );
} 