"use client";

import { memo, useCallback, useState, useEffect, KeyboardEvent } from 'react';
import styled from "@emotion/styled";
import { colors } from "@/styles/theme/colors";
import { spacing } from "@/styles/theme/spacing";
import { zIndex } from "@/styles/theme/zIndex";
import Footer from './Footer';
import LoginModal from '../auth/LoginModal';
import SignupModal from '../auth/SignupModal';
import { useAuth } from '@/contexts/AuthContext';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  padding: ${spacing[4]};
  border-bottom: 1px solid ${colors.gray[200]};
  z-index: ${zIndex.fixed};
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
`;

const Logo = styled.a`
  font-weight: bold;
  color: ${colors.text.primary};
  text-decoration: none;
  
  &:focus-visible {
    outline: 2px solid ${colors.primary[500]};
    outline-offset: 2px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${spacing[4]};
`;

const NavLink = styled.button`
  color: ${colors.text.secondary};
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  
  &:hover {
    color: ${colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary[500]};
    outline-offset: 2px;
  }
`;

// ClientLayout.tsx 예시 (필요시 적용)
const HEADER_HEIGHT = '57px'; // 헤더 높이

const Main = styled.main<{ hasHeader: boolean }>`
  /* Layout */
  display: flex;
  flex-direction: column;
  position: relative;

  /* Box Model */
  margin-top: ${props => props.hasHeader ? HEADER_HEIGHT : '0'};
  min-height: ${props => props.hasHeader ? `calc(100vh - ${HEADER_HEIGHT})` : '100vh'};

  /* Others */
  overflow-y: auto;
`;

const LayoutContent = styled.div`
  /* Layout */
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
`;

const Header = memo(() => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoginClick = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const handleSignupClick = useCallback(() => {
    setIsSignupModalOpen(true);
  }, []);

  const handleLoginClose = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const handleSignupClose = useCallback(() => {
    setIsSignupModalOpen(false);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLButtonElement>, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }, []);

  return (
    <HeaderContainer role="banner">
      <Nav role="navigation" aria-label="메인 네비게이션">
        <Logo href="/" aria-label="홈으로 이동">CHANNELINK</Logo>
        <NavLinks>
          {!mounted ? null : isLoading ? (
            <span>로딩중...</span>
          ) : user ? (
            <>
              <span aria-label={`${user.nickname}님`}>{user.nickname}님</span>
              <NavLink 
                onClick={logout}
                onKeyDown={(e) => handleKeyDown(e, logout)}
                aria-label="로그아웃"
              >
                로그아웃
              </NavLink>
            </>
          ) : (
            <>
              <NavLink 
                onClick={handleLoginClick}
                onKeyDown={(e) => handleKeyDown(e, handleLoginClick)}
                aria-label="로그인"
              >
                로그인
              </NavLink>
              <NavLink 
                onClick={handleSignupClick}
                onKeyDown={(e) => handleKeyDown(e, handleSignupClick)}
                aria-label="회원가입"
              >
                회원가입
              </NavLink>
            </>
          )}
        </NavLinks>
      </Nav>
      <LoginModal isOpen={isLoginModalOpen} onClose={handleLoginClose} />
      <SignupModal isOpen={isSignupModalOpen} onClose={handleSignupClose} />
    </HeaderContainer>
  );
});

Header.displayName = 'Header';

const ClientLayout = memo(({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <>
      <Header />
      <Main hasHeader role="main">
        <LayoutContent>
          {children}
        </LayoutContent>
        <Footer />
      </Main>
    </>
  );
});

ClientLayout.displayName = 'ClientLayout';

export default ClientLayout; 