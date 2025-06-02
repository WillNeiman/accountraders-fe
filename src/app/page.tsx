// page.tsx
import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: '채널링크 | 유튜브 채널 안전거래 마켓',
  description:
    '믿을 수 있는 유튜브 채널 거래의 시작, 채널링크. 다양한 카테고리의 채널을 쉽고 안전하게 사고팔 수 있는 신뢰받는 플랫폼입니다. 검증된 판매자와 안전 결제 시스템으로 채널 매매, 양도, 인수까지 한 번에 경험하세요!'
};

export default function Home() {
  return <HomeClient />;
}
