"use client";

import { memo, useCallback, useState, KeyboardEvent, useEffect, useRef } from 'react';
import styled from "@emotion/styled";
import { colors } from "@/styles/theme/colors";
import { spacing } from "@/styles/theme/spacing";
import { zIndex } from "@/styles/theme/zIndex";
import { mediaQueries } from "@/styles/theme/breakpoints";
import Footer from './Footer';
import LoginModal from '../auth/LoginModal';
import SignupModal from '../auth/SignupModal';
import { useAuth } from '@/contexts/AuthContext';
import { typography } from "@/styles/theme/typography";
import Link from 'next/link';
import SidebarNav from '@/components/mypage/SidebarNav';

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
    width: 80vw;
    max-width: 240px;
    height: 100vh;
    background: ${colors.background.default};
    padding: ${spacing[6]};
    box-shadow: 0 0 ${spacing[2]} ${colors.gray[200]};
    z-index: ${zIndex.modal + 1};
    gap: ${spacing[1]};
    justify-content: flex-start;
    overflow-y: auto;
  }
`;

const MobileMenuLink = styled.button`
  /* Layout */
  display: flex;
  align-items: center;
  
  /* Box Model */
  padding: ${spacing[2]};
  
  /* Typography */
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};
  
  /* Visual */
  background: none;
  border: none;
  
  /* Others */
  cursor: pointer;
  width: 100%;
  text-align: left;
  
  &:hover {
    color: ${colors.primary[600]};
  }
  
  &:focus-visible {
    outline: 2px solid ${colors.primary[500]};
    outline-offset: 2px;
  }
`;

const UserName = styled.span`
  color: ${colors.text.primary};
  font-weight: ${typography.fontWeight.medium};
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

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownMenu = styled.div<{ open: boolean }>`
  position: absolute;
  top: calc(100% + ${spacing[2]});
  right: 0;
  min-width: 160px;
  background: ${colors.background.paper};
  border-radius: ${spacing[2]};
  box-shadow: 0 4px 16px ${colors.gray[200]};
  padding: ${spacing[2]} 0;
  opacity: ${({ open }) => (open ? 1 : 0)};
  transform: ${({ open }) => (open ? 'translateY(0)' : 'translateY(-8px)')};
  pointer-events: ${({ open }) => (open ? 'auto' : 'none')};
  transition: opacity 0.2s, transform 0.2s;
  z-index: 100;
`;

const DropdownItem = styled.button<{ disabled?: boolean }>`
  width: 100%;
  background: none;
  border: none;
  text-align: left;
  padding: ${spacing[1]} ${spacing[4]};
  font-size: ${typography.fontSize.base};
  color: ${({ disabled }) => disabled ? colors.text.disabled : colors.text.primary};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  font-weight: ${typography.fontWeight.medium};
  border-radius: ${spacing[1]};
  transition: background 0.15s;
  &:hover {
    background: ${({ disabled }) => disabled ? 'none' : colors.gray[100]};
  }
`;

const MobileLogoutButton = styled.button`
  width: 100%;
  margin-top: auto;
  background: ${colors.error.main};
  color: #fff;
  border: none;
  border-radius: ${spacing[2]};
  padding: ${spacing[3]} 0;
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.bold};
  cursor: pointer;
  box-shadow: 0 2px 8px ${colors.gray[200]};
  transition: background 0.15s;
  &:hover {
    background: ${colors.error.dark};
  }
`;

const Header = memo(() => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isDropdownOpen]);

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
          {user ? (
            <>
              <DropdownContainer ref={dropdownRef}>
                <UserName
                  aria-label={`${user.nickname}님`}
                  tabIndex={0}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setIsDropdownOpen(v => !v)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') setIsDropdownOpen(v => !v);
                  }}
                >
                  {user.nickname}님
                </UserName>
                <DropdownMenu open={isDropdownOpen}>
                  <Link href="/my/account">
                    <DropdownItem as="button" type="button">마이페이지</DropdownItem>
                  </Link>
                  <DropdownItem disabled>거래현황 (준비중)</DropdownItem>
                </DropdownMenu>
              </DropdownContainer>
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
              {isLoading && <span style={{ fontSize: '0.9em', color: colors.text.disabled, marginRight: spacing[2] }}>로딩중...</span>}
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
          {user ? (
            <>
              <SidebarNav className="mobile-menu-sidebar" />
              <MobileLogoutButton
                onClick={logout}
                aria-label="로그아웃"
              >
                로그아웃
              </MobileLogoutButton>
            </>
          ) : (
            <>
              <MobileMenuLink 
                onClick={handleLoginClick}
                onKeyDown={(e) => handleKeyDown(e, handleLoginClick)}
                aria-label="로그인"
              >
                로그인
              </MobileMenuLink>
              <MobileMenuLink 
                onClick={handleSignupClick}
                onKeyDown={(e) => handleKeyDown(e, handleSignupClick)}
                aria-label="회원가입"
              >
                회원가입
              </MobileMenuLink>
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