// page.tsx
import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: '채널링크 | 유튜브 채널 안전거래 마켓',
  description:
    '채널링크는 유튜브 채널을 안전하고 신뢰성 있게 거래할 수 있는 국내 대표 마켓입니다. 다양한 카테고리의 유튜브 채널을 빠르게 등록하고, 검증된 판매자와 안전하게 거래하세요. 채널 매매, 양도, 인수까지 한 번에!'
};

export default function Home() {
  return <HomeClient />;
}
