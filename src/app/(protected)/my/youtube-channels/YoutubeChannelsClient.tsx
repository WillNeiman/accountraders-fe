'use client';

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