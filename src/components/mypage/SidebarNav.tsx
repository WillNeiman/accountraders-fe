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
  background: ${colors.background.gray};
  border-radius: ${spacing[1]};
  /* Typography */
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const NavLink = styled(Link, {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'isActive',
})<{ isActive: boolean }>`
  /* Layout */
  display: flex;
  align-items: center;
  padding: ${spacing[3]};
  margin: 0 ${spacing[1]};

  /* Box Model */
  border-radius: ${spacing[2]};

  /* Visual */
  color: ${props => props.isActive ? colors.primary[600] : colors.text.primary};
  background: ${props => props.isActive ? colors.primary[50] : 'transparent'};
  transition: all 0.2s ease-in-out;
  box-shadow: ${props => props.isActive ? `0 0 0 2px ${colors.primary[100]}` : 'none'};

  /* Typography */
  font-size: ${typography.fontSize.base};
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
    { href: '/mypage', label: '계정 정보' },
    { href: '/mypage/profile', label: '프로필 설정' },
    { href: '/mypage/security', label: '보안 설정' },
  ],
  seller: [
    { href: '/mypage/seller/profile', label: '판매자 프로필' },
    { href: '/mypage/seller/settings', label: '판매자 설정' },
    { href: '/mypage/seller/analytics', label: '판매자 통계' },
  ],
  transactions: [
    { href: '/mypage/transactions', label: '거래 내역' },
    { href: '/mypage/transactions/pending', label: '진행중인 거래' },
    { href: '/mypage/transactions/completed', label: '완료된 거래' },
  ],
};

export default function SidebarNav() {
  const pathname = usePathname();

  return (
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
  );
} 