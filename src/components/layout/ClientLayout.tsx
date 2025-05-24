"use client";

import { memo, useCallback, useState, KeyboardEvent, useEffect } from 'react';
import styled from "@emotion/styled";
import { colors } from "@/styles/theme/colors";
import { spacing } from "@/styles/theme/spacing";
import { zIndex } from "@/styles/theme/zIndex";
import { mediaQueries } from "@/styles/theme/breakpoints";
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
  font-size: 1.25rem;
  
  ${mediaQueries.md} {
    font-size: 1.5rem;
  }
  
  &:focus-visible {
    outline: 2px solid ${colors.primary[500]};
    outline-offset: 2px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${spacing[4]};
  @media (max-width: 767px) {
    display: none;
  }
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

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: ${spacing[2]};
  cursor: pointer;
  color: ${colors.text.primary};
  @media (max-width: 767px) {
    display: block;
  }
  &:focus-visible {
    outline: 2px solid ${colors.primary[500]};
    outline-offset: 2px;
  }
`;

const MobileMenuOverlay = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: ${zIndex.modal};
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: none;
  @media (max-width: 767px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    width: 240px;
    height: 100vh;
    background: #fff;
    padding: ${spacing[6]};
    box-shadow: -2px 0 8px rgba(0,0,0,0.1);
    z-index: ${zIndex.modal + 1};
    gap: ${spacing[4]};
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
  padding: ${spacing[4]};

  /* Others */
  overflow-y: auto;

  ${mediaQueries.md} {
    padding: ${spacing[6]};
  }

  ${mediaQueries.lg} {
    padding: ${spacing[8]};
  }
`;

const LayoutContent = styled.div`
  /* Layout */
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  gap: ${spacing[6]};

  ${mediaQueries.md} {
    gap: ${spacing[8]};
  }

  ${mediaQueries.lg} {
    gap: ${spacing[10]};
  }
`;

const Header = memo(() => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();

  const handleLoginClick = useCallback(() => {
    setIsLoginModalOpen(true);
    setIsMenuOpen(false);
  }, []);

  const handleSignupClick = useCallback(() => {
    setIsSignupModalOpen(true);
    setIsMenuOpen(false);
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

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return (
    <HeaderContainer role="banner">
      <Nav role="navigation" aria-label="메인 네비게이션">
        <Logo href="/" aria-label="홈으로 이동">CHANNELINK</Logo>
        <MenuButton 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? '✕' : '☰'}
        </MenuButton>
        <NavLinks>
          {isLoading ? (
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
        <MobileMenuOverlay isOpen={isMenuOpen} onClick={() => setIsMenuOpen(false)} />
        <MobileMenu isOpen={isMenuOpen}>
          {isLoading ? (
            <span>로딩중...</span>
          ) : user ? (
            <>
              <span aria-label={`${user.nickname}님`}>{user.nickname}님</span>
              <NavLink 
                onClick={() => { setIsMenuOpen(false); logout(); }}
                onKeyDown={(e) => handleKeyDown(e, () => { setIsMenuOpen(false); logout(); })}
                aria-label="로그아웃"
              >
                로그아웃
              </NavLink>
            </>
          ) : (
            <>
              <NavLink 
                onClick={() => { setIsMenuOpen(false); handleLoginClick(); }}
                onKeyDown={(e) => handleKeyDown(e, () => { setIsMenuOpen(false); handleLoginClick(); })}
                aria-label="로그인"
              >
                로그인
              </NavLink>
              <NavLink 
                onClick={() => { setIsMenuOpen(false); handleSignupClick(); }}
                onKeyDown={(e) => handleKeyDown(e, () => { setIsMenuOpen(false); handleSignupClick(); })}
                aria-label="회원가입"
              >
                회원가입
              </NavLink>
            </>
          )}
        </MobileMenu>
      </Nav>
      <LoginModal isOpen={isLoginModalOpen} onClose={handleLoginClose} />
      <SignupModal isOpen={isSignupModalOpen} onClose={handleSignupClose} />
    </HeaderContainer>
  );
});

Header.displayName = 'Header';

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Header />
      <Main hasHeader={true}>
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