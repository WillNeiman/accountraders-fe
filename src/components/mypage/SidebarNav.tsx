'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import isPropValid from '@emotion/is-prop-valid';

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: ${spacing[2]};
`;

const NavSection = styled.div`
  margin-bottom: ${spacing[6]};
  padding-bottom: ${spacing[3]};
  border-bottom: 1px solid ${colors.gray[100]};

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const NavSectionTitle = styled.h3`
  /* Layout */
  display: block;
  padding: ${spacing[2]} ${spacing[3]};
  margin-bottom: ${spacing[2]};
  /* Visual */
  /* Typography */
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Sidebar = styled.nav`
  background: ${colors.background.paper};
  border-radius: ${spacing[2]};
  padding: ${spacing[4]};
  width: 180px;

  @media (max-width: 1023px) {
    width: 180px;
  }
  @media (max-width: 767px) {
    display: none;
  }

  &.mobile-menu-sidebar {
    display: block !important;
    width: 100%;
    min-width: 0;
    border-radius: 0;
    padding: 0;
    background: transparent;
    box-shadow: none;
  }
`;

const NavLink = styled(Link, {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'isActive',
})<{ isActive: boolean }>`
  /* Layout */
  display: flex;
  align-items: center;
  padding: ${spacing[2]} ${spacing[2]};
  margin: 0;

  /* Box Model */
  border-radius: ${spacing[2]};

  /* Visual */
  color: ${props => props.isActive ? colors.primary[600] : colors.text.primary};
  background: ${props => props.isActive ? colors.primary[50] : 'transparent'};
  transition: all 0.2s ease-in-out;
  box-shadow: ${props => props.isActive ? `0 0 0 2px ${colors.primary[100]}` : 'none'};

  /* Typography */
  font-size: ${typography.fontSize.sm};
  font-weight: ${props => props.isActive ? typography.fontWeight.semibold : typography.fontWeight.normal};
  text-decoration: none;

  &:hover {
    background: ${colors.primary[50]};
    color: ${colors.primary[600]};
    box-shadow: 0 0 0 2px ${colors.primary[100]};
  }

  @media (max-width: 640px) {
    padding: ${spacing[2]};
    margin: 0;
  }
`;

const navItems = {
  account: [
    { href: '/my/account', label: '로그인 정보' },
    { href: '/my/profile', label: '프로필 설정' },
    { href: '/my/security', label: '보안 설정' },
  ],
  seller: [
    { href: '/my/seller-profile', label: '판매자 프로필' },
    { href: '/my/youtube-channels', label: '채널 관리' },
    { href: '/my/seller/settings', label: '판매자 설정' },
    { href: '/my/seller/analytics', label: '판매자 통계' },
  ],
  transactions: [
    { href: '/my/transactions', label: '거래 내역' },
    { href: '/my/transactions/pending', label: '진행중인 거래' },
    { href: '/my/transactions/completed', label: '완료된 거래' },
  ],
};

export default function SidebarNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <Sidebar className={className}>
      <NavList>
        <NavSection>
          <NavSectionTitle>계정 관리</NavSectionTitle>
          {navItems.account.map((item) => (
            <NavItem key={item.href}>
              <NavLink href={item.href} isActive={pathname === item.href}>
                {item.label}
              </NavLink>
            </NavItem>
          ))}
        </NavSection>

        <NavSection>
          <NavSectionTitle>판매자 관리</NavSectionTitle>
          {navItems.seller.map((item) => (
            <NavItem key={item.href}>
              <NavLink href={item.href} isActive={pathname === item.href}>
                {item.label}
              </NavLink>
            </NavItem>
          ))}
        </NavSection>

        <NavSection>
          <NavSectionTitle>거래 관리</NavSectionTitle>
          {navItems.transactions.map((item) => (
            <NavItem key={item.href}>
              <NavLink href={item.href} isActive={pathname === item.href}>
                {item.label}
              </NavLink>
            </NavItem>
          ))}
        </NavSection>
      </NavList>
    </Sidebar>
  );
} 