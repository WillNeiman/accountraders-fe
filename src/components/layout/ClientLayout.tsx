"use client";

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { spacing } from '@/styles/theme/spacing';
import { mediaQueries } from '@/styles/theme/breakpoints';
import Header from './Header';
import Footer from './Footer';

const Main = styled.main<{ hasHeader: boolean; headerHeight: number }>`
  display: flex;
  flex-direction: column;
  position: relative;
  margin-top: ${props => props.hasHeader ? `${props.headerHeight}px` : '0'};
  min-height: ${props => props.hasHeader ? `calc(100vh - ${props.headerHeight}px)` : '100vh'};
  overflow-y: auto;
`;

const LayoutContent = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  gap: ${spacing[6]};
  ${mediaQueries.md} { gap: ${spacing[8]}; }
  ${mediaQueries.lg} { gap: ${spacing[10]}; }
`;

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Header onHeightChange={setHeaderHeight} />
      <Main hasHeader={true} headerHeight={headerHeight}>
        <LayoutContent>
          {children}
        </LayoutContent>
      </Main>
      <Footer />
    </>
  );
};

ClientLayout.displayName = 'ClientLayout';

export default ClientLayout; 