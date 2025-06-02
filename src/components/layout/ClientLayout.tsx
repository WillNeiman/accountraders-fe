"use client";

import { memo, useCallback, useState, KeyboardEvent, useEffect, useRef, useLayoutEffect } from 'react';
import styled from "@emotion/styled";
import { colors } from "@/styles/theme/colors";
import { spacing } from "@/styles/theme/spacing";
import { zIndex } from "@/styles/theme/zIndex";
import { mediaQueries } from "@/styles/theme/breakpoints";
import { FiMenu, FiUser, FiLogOut, FiActivity } from 'react-icons/fi';
import Footer from './Footer';
import LoginModal from '../auth/LoginModal';
import SignupModal from '../auth/SignupModal';
import { useAuth } from '@/contexts/AuthContext';
import { typography } from "@/styles/theme/typography";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import isPropValid from '@emotion/is-prop-valid';

// 메뉴 아이템 타입 정의
interface MenuItem {
  label: string;
  href: string;
}

// 메뉴 아이템 상수 정의
const MENU_ITEMS: MenuItem[] = [
  {
    label: '유튜브 채널 거래',
    href: '/',
  },
  {
    label: '서비스 안내',
    href: '/guide',
  },
];

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
  position: relative;

  @media (max-width: 767px) {
    justify-content: center;
  }
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

  @media (max-width: 767px) {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[4]};
  flex: 1;
  justify-content: flex-start;
  margin-left: ${spacing[8]};
  position: relative;
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
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
  }
  &:focus-visible {
    outline: 2px solid ${colors.primary[500]};
    outline-offset: 2px;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.text.primary};
  font-size: 1.5rem;
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

const MobileMenuLink = styled.button<{ isActive?: boolean }>`
  /* Layout */
  display: flex;
  align-items: center;
  
  /* Box Model */
  padding: ${spacing[2]};
  
  /* Typography */
  font-size: ${typography.fontSize.base};
  color: ${props => props.isActive ? colors.primary[600] : colors.text.primary};
  font-weight: ${props => props.isActive ? typography.fontWeight.semibold : typography.fontWeight.normal};
  
  /* Visual */
  background: none;
  border: none;
  position: relative;
  
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

  ${props => props.isActive && `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: ${colors.primary[600]};
      border-radius: 1px;
    }
  `}
`;

const MobileMenuLinkWrapper = styled(Link)`
  text-decoration: none;
  width: 100%;
`;

const UserInfoTextWrapper = styled.span`
  display: flex;
  align-items: baseline;
`;

const UserNameCard = styled.button`
  display: inline-flex;
  align-items: center;
  background: ${colors.primary[50]};
  color: ${colors.primary[700]};
  font-weight: ${typography.fontWeight.bold};
  font-size: 1rem;
  border-radius: 999px;
  cursor: pointer;
  border: 1.5px solid ${colors.primary[200]};
  transition: background 0.15s, color 0.15s;
  padding: 0.3rem 1.0rem;
  &:hover, &:focus-visible {
    background: ${colors.primary[100]};
    color: ${colors.primary[800]};
    outline: none;
  }
  @media (max-width: 1023px) {
    font-size: 0.95rem;
    padding: 0.2rem 0.8rem;
  }
  @media (max-width: 767px) {
    background: none;
    color: ${colors.primary[600]};
    font-size: 1rem;
    border: none;
    padding: 0.4rem 0.1;
    font-weight: ${typography.fontWeight.bold};
  }
`;

const NicknameText = styled.span`
  color: ${colors.primary[600]};
  font-weight: ${typography.fontWeight.bold};
  margin-right: 2px;
  @media (max-width: 767px) {
    display: none;
  }
`;
const NimText = styled.span`
  color: ${colors.text.primary};
  font-weight: ${typography.fontWeight.normal};
  margin-right: 6px;
  @media (max-width: 767px) {
    display: none;
  }
`;
const UserIcon = styled(FiUser)`
  font-size: 1.5rem;
  margin-left: 2px;
  color: ${colors.primary[400]};
  display: flex;
  align-items: center;
`;

const DropdownMenu = styled.div<{ open: boolean }>`
  position: absolute;
  top: calc(100% + ${spacing[2]});
  right: 0;
  min-width: 180px;
  background: ${colors.background.paper};
  border-radius: ${spacing[2]};
  box-shadow: 0 4px 16px ${colors.gray[200]};
  padding: ${spacing[2]} 0;
  opacity: ${({ open }) => (open ? 1 : 0)};
  transform: ${({ open }) => (open ? 'translateY(0)' : 'translateY(-8px)')};
  pointer-events: ${({ open }) => (open ? 'auto' : 'none')};
  transition: opacity 0.2s, transform 0.2s;
  z-index: 100;
  font-size: ${typography.fontSize.sm};
`;

const DropdownMenuItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  text-align: left;
  padding: ${spacing[2]} ${spacing[4]};
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
  cursor: pointer;
  font-weight: ${typography.fontWeight.medium};
  border-radius: ${spacing[1]};
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.15s;
  &:hover {
    background: ${colors.primary[50]};
  }
  &:disabled {
    color: ${colors.text.disabled};
    cursor: not-allowed;
    background: none;
  }
`;

const DropdownLogoutButton = styled(DropdownMenuItem)`
  color: ${colors.error.main};
  background: none;
  &:hover {
    background: none;
    color: ${colors.error.dark};
  }
`;

const Main = styled.main<{ hasHeader: boolean; headerHeight: number }>`
  display: flex;
  flex-direction: column;
  position: relative;
  margin-top: ${props => props.hasHeader ? `${props.headerHeight}px` : '0'};
  min-height: ${props => props.hasHeader ? `calc(100vh - ${props.headerHeight}px)` : '100vh'};
  overflow-y: auto;
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

// 밑줄 인디케이터(애벌레 애니메이션)
const UnderlineIndicator = styled.div<{
  left: number;
  right: number;
  animating: boolean;
}>`
  position: absolute;
  bottom: -${spacing[4]};
  height: 2px;
  background: ${colors.primary[600]};
  border-radius: 1px;
  left: ${props => props.left}px;
  right: ${props => props.right}px;
  transition:
    left 0.25s cubic-bezier(0.7,0,0.3,1),
    right 0.25s cubic-bezier(0.7,0,0.3,1);
  z-index: 2;
  pointer-events: none;
`;

const MenuLink = styled(Link, {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'isActive',
})<{ isActive?: boolean }>`
  color: ${props => props.isActive ? colors.primary[600] : colors.text.secondary};
  text-decoration: none;
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  padding: ${spacing[2]} ${spacing[3]};
  border-radius: ${spacing[2]};
  transition: all 0.2s;
  position: relative;
  background: none;
  &:hover {
    color: ${colors.text.primary};
    background-color: ${colors.gray[50]};
  }
  &:focus-visible {
    outline: 2px solid ${colors.primary[500]};
    outline-offset: 2px;
  }
`;

const AuthLinks = styled.div`
  display: flex;
  gap: ${spacing[4]};
  margin-left: auto;

  @media (max-width: 767px) {
    position: absolute;
    right: 0;
  }
`;

// Header 컴포넌트 수정
interface HeaderProps {
  onHeightChange: (height: number) => void;
}

const Header = memo(({ onHeightChange }: HeaderProps) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [indicator, setIndicator] = useState({ left: 0, right: 0, animating: false });
  const menuRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const animTimeout = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // 헤더 높이 측정 및 전달
  useEffect(() => {
    const measureHeight = () => {
      if (headerRef.current) {
        onHeightChange(headerRef.current.offsetHeight);
      }
    };
    measureHeight();
    window.addEventListener('resize', measureHeight);
    return () => window.removeEventListener('resize', measureHeight);
  }, [onHeightChange]);

  // 메뉴 위치 계산 함수
  const getMenuEdge = (idx: number) => {
    const el = menuRefs.current[idx];
    if (!el) return { left: 0, right: 0 };
    const rect = el.getBoundingClientRect();
    const parentRect = el.parentElement!.getBoundingClientRect();
    return {
      left: rect.left - parentRect.left,
      right: parentRect.right - rect.right,
    };
  };

  // 페이지 진입/경로 변경 시 밑줄 위치 초기화
  useLayoutEffect(() => {
    const idx = MENU_ITEMS.findIndex(item => item.href === pathname);
    if (idx !== -1) {
      const { left, right } = getMenuEdge(idx);
      setIndicator({ left, right, animating: false });
    }
  }, [pathname]);

  const handleLoginClick = useCallback(() => {
    setIsLoginModalOpen(true);
    setIsMenuOpen(false);
  }, []);

  const handleSignupClick = useCallback(() => {
    setIsSignupModalOpen(true);
    setIsLoginModalOpen(false);
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

  // 메뉴 클릭 시 애벌레 애니메이션
  const handleMenuClick = (targetIdx: number) => {
    if (!menuRefs.current[targetIdx]) return;
    const { left: targetLeft, right: targetRight } = getMenuEdge(targetIdx);
    const currentIdx = MENU_ITEMS.findIndex(item => item.href === pathname);
    if (currentIdx === -1) return;
    const { left: currentLeft, right: currentRight } = getMenuEdge(currentIdx);

    if (targetIdx > currentIdx) {
      // 왼→오: 오른쪽 먼저
      setIndicator({ left: currentLeft, right: targetRight, animating: true });
      if (animTimeout.current) clearTimeout(animTimeout.current);
      animTimeout.current = setTimeout(() => {
        setIndicator({ left: targetLeft, right: targetRight, animating: true });
      }, 250);
    } else if (targetIdx < currentIdx) {
      // 오→왼: 왼쪽 먼저
      setIndicator({ left: targetLeft, right: currentRight, animating: true });
      if (animTimeout.current) clearTimeout(animTimeout.current);
      animTimeout.current = setTimeout(() => {
        setIndicator({ left: targetLeft, right: targetRight, animating: true });
      }, 250);
    }
    // 같은 인덱스면 아무것도 안 함
  };

  return (
    <HeaderContainer role="banner" ref={headerRef}>
      <Nav role="navigation" aria-label="메인 네비게이션">
        <Logo href="/" aria-label="홈으로 이동">CHANNELINK</Logo>
        <MenuButton 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={isMenuOpen}
        >
          <IconWrapper>
            <FiMenu />
          </IconWrapper>
        </MenuButton>
        <NavLinks>
          {MENU_ITEMS.map((item, idx) => (
            <MenuLink
              key={item.href}
              href={item.href}
              isActive={pathname === item.href}
              aria-label={item.label}
              aria-current={pathname === item.href ? 'page' : undefined}
              ref={el => { menuRefs.current[idx] = el; }}
              onClick={() => handleMenuClick(idx)}
            >
              {item.label}
            </MenuLink>
          ))}
          <UnderlineIndicator left={indicator.left} right={indicator.right} animating={indicator.animating} />
        </NavLinks>
        <AuthLinks>
          {user ? (
            <DropdownContainer ref={dropdownRef}>
              <UserNameCard
                aria-label={`${user.nickname}님`}
                tabIndex={0}
                onClick={() => setIsDropdownOpen(v => !v)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') setIsDropdownOpen(v => !v);
                }}
              >
                <UserInfoTextWrapper>
                  <NicknameText>{user.nickname}</NicknameText>
                  <NimText>님</NimText>
                </UserInfoTextWrapper>
                <UserIcon />
              </UserNameCard>
              <DropdownMenu open={isDropdownOpen}>
                <DropdownMenuItem onClick={() => router.push('/my/account')}>
                  <FiUser style={{ minWidth: 18 }} /> 마이페이지
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <FiActivity style={{ minWidth: 18 }} /> 거래현황 (준비중)
                </DropdownMenuItem>
                <DropdownLogoutButton onClick={logout} aria-label="로그아웃">
                  <FiLogOut style={{ minWidth: 18 }} /> 로그아웃
                </DropdownLogoutButton>
              </DropdownMenu>
            </DropdownContainer>
          ) : (
            <>
              {isLoading && <span style={{ fontSize: '0.9em', color: colors.text.disabled, marginRight: spacing[2] }}>로딩중...</span>}
              <NavLink 
                onClick={handleLoginClick}
                onKeyDown={(e) => handleKeyDown(e, handleLoginClick)}
                aria-label="로그인"
              >
                <IconWrapper>
                  <FiUser />
                </IconWrapper>
              </NavLink>
            </>
          )}
        </AuthLinks>
        <MobileMenuOverlay isOpen={isMenuOpen} onClick={() => setIsMenuOpen(false)} />
        <MobileMenu isOpen={isMenuOpen}>
          {MENU_ITEMS.map((item) => (
            <MobileMenuLinkWrapper 
              key={item.href}
              href={item.href}
              aria-label={item.label}
            >
              <MobileMenuLink isActive={pathname === item.href}>
                {item.label}
              </MobileMenuLink>
            </MobileMenuLinkWrapper>
          ))}
        </MobileMenu>
      </Nav>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={handleLoginClose} 
        onSignupClick={handleSignupClick}
      />
      <SignupModal isOpen={isSignupModalOpen} onClose={handleSignupClose} />
    </HeaderContainer>
  );
});

Header.displayName = 'Header';

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