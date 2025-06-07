'use client';

import { memo, useCallback, useState, KeyboardEvent, useEffect, useRef, useLayoutEffect } from 'react';
import styled from "@emotion/styled";
import { colors } from "@/styles/theme/colors";
import { spacing, borderRadius } from "@/styles/theme/spacing";
import { zIndex } from "@/styles/theme/zIndex";
import { mediaQueries } from "@/styles/theme/breakpoints";
import { FiMenu, FiUser, FiLogOut, FiSettings, FiShield, FiYoutube, FiBarChart2, FiList, FiClock, FiCheckCircle } from 'react-icons/fi';
import LoginModal from '../auth/LoginModal';
import SignupModal from '../auth/SignupModal';
import { useAuth } from '@/contexts/AuthContext';
import { typography } from "@/styles/theme/typography";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import isPropValid from '@emotion/is-prop-valid';
import { shadows } from "@/styles/theme/shadows";

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

const UserNameCard = styled.button`
  display: inline-flex;
  align-items: center;
  background: ${colors.primary[50]};
  color: ${colors.primary[700]};
  font-weight: ${typography.fontWeight.bold};
  font-size: 1rem;
  border-radius: ${borderRadius.full};
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

const UserInfoTextWrapper = styled.span`
  display: flex;
  align-items: baseline;
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
  top: 100%;
  right: 0;
  width: 280px;
  background: white;
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.lg};
  padding: ${spacing[4]};
  margin-top: ${spacing[2]};
  opacity: ${({ open }) => (open ? 1 : 0)};
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  transform: ${({ open }) => (open ? 'translateY(0)' : 'translateY(-10px)')};
  transition: all 0.2s ease-in-out;
  z-index: ${zIndex.dropdown};
`;

const DropdownMenuSection = styled.div`
  margin-bottom: ${spacing[4]};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DropdownMenuTitle = styled.h3`
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.gray[700]};
  margin-bottom: ${spacing[2]};
  padding: 0 ${spacing[2]};
`;

const DropdownMenuItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${spacing[2]};
  color: ${colors.gray[700]};
  font-size: ${typography.fontSize.sm};
  border: none;
  background: none;
  cursor: pointer;
  border-radius: ${borderRadius.sm};
  transition: all 0.2s ease-in-out;
  gap: ${spacing[2]};

  &:hover {
    background: ${colors.gray[50]};
    color: ${colors.primary[600]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DropdownMenuDivider = styled.hr`
  border: none;
  border-bottom: 1px solid ${colors.gray[200]};
  margin: ${spacing[4]} 0;
`;

const DropdownLogoutButton = styled(DropdownMenuItem)`
  color: ${colors.red[600]};
  
  &:hover {
    background: ${colors.red[50]};
    color: ${colors.red[700]};
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

// 밑줄 인디케이터(애벌레 애니메이션)
const UnderlineIndicator = styled.div<{
  left: number;
  width: number;
  opacity: number;
}>`
  position: absolute;
  bottom: -${spacing[4]};
  height: 2px;
  background: ${colors.primary[600]};
  border-radius: 1px;
  left: ${props => props.left}px;
  width: ${props => props.width}px;
  transition: all 0.3s ease;
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
  onHeightChange?: (height: number) => void;
}

const Header = memo(({ onHeightChange = () => {} }: HeaderProps) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthLoading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const menuRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const router = useRouter();

  const navItems = {
    account: [
      { href: '/my/account', label: '로그인 정보', icon: FiUser },
      { href: '/my/profile', label: '프로필 설정', icon: FiSettings },
      { href: '/my/security', label: '보안 설정', icon: FiShield },
    ],
    seller: [
      { href: '/my/seller-profile', label: '판매자 프로필', icon: FiUser },
      { href: '/my/listings/youtube-listings', label: '채널 관리', icon: FiYoutube },
      { href: '/my/seller/settings', label: '판매자 설정', icon: FiSettings },
      { href: '/my/seller/analytics', label: '판매자 통계', icon: FiBarChart2 },
    ],
    transactions: [
      { href: '/my/transactions', label: '거래 내역', icon: FiList },
      { href: '/my/transactions/pending', label: '진행중인 거래', icon: FiClock },
      { href: '/my/transactions/completed', label: '완료된 거래', icon: FiCheckCircle },
    ],
  };

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
  const updateIndicator = (idx: number) => {
    const el = menuRefs.current[idx];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setIndicator({
      left: rect.left - el.parentElement!.getBoundingClientRect().left,
      width: rect.width
    });
  };

  // 페이지 진입/경로 변경 시 밑줄 위치 초기화
  useLayoutEffect(() => {
    const idx = MENU_ITEMS.findIndex(item => item.href === pathname);
    if (idx !== -1) {
      updateIndicator(idx);
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
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuItemClick = (href: string) => {
    setIsDropdownOpen(false);
    router.push(href);
  };

  // 메뉴 클릭 시 밑줄 이동
  const handleMenuClick = (targetIdx: number) => {
    updateIndicator(targetIdx);
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
          <UnderlineIndicator left={indicator.left} width={indicator.width} opacity={1} />
        </NavLinks>
        <AuthLinks>
          {user ? (
            <DropdownContainer ref={dropdownRef}>
              <UserNameCard
                aria-label={`${user.nickname}님`}
                tabIndex={0}
                onClick={handleDropdownToggle}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') handleDropdownToggle(e);
                }}
              >
                <UserInfoTextWrapper>
                  <NicknameText>{user.nickname}</NicknameText>
                  <NimText>님</NimText>
                </UserInfoTextWrapper>
                <UserIcon />
              </UserNameCard>
              <DropdownMenu open={isDropdownOpen}>
                <DropdownMenuSection>
                  <DropdownMenuTitle>계정 관리</DropdownMenuTitle>
                  {navItems.account.map((item) => (
                    <DropdownMenuItem key={item.href} onClick={() => handleMenuItemClick(item.href)}>
                      <item.icon style={{ minWidth: 18 }} /> {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSection>

                <DropdownMenuSection>
                  <DropdownMenuTitle>판매자 관리</DropdownMenuTitle>
                  {navItems.seller.map((item) => (
                    <DropdownMenuItem key={item.href} onClick={() => handleMenuItemClick(item.href)}>
                      <item.icon style={{ minWidth: 18 }} /> {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSection>

                <DropdownMenuSection>
                  <DropdownMenuTitle>거래 관리</DropdownMenuTitle>
                  {navItems.transactions.map((item) => (
                    <DropdownMenuItem key={item.href} onClick={() => handleMenuItemClick(item.href)}>
                      <item.icon style={{ minWidth: 18 }} /> {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSection>

                <DropdownMenuDivider />
                <DropdownLogoutButton onClick={logout} aria-label="로그아웃">
                  <FiLogOut style={{ minWidth: 18 }} /> 로그아웃
                </DropdownLogoutButton>
              </DropdownMenu>
            </DropdownContainer>
          ) : (
            <>
              {isAuthLoading && <span style={{ fontSize: '0.9em', color: colors.text.disabled, marginRight: spacing[2] }}>로딩중...</span>}
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

export default Header; 