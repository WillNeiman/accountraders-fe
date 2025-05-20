"use client";

import styled from "@emotion/styled";
import { colors } from "@/styles/theme/colors";
import { spacing } from "@/styles/theme/spacing";
import Footer from './Footer';
import { useState } from 'react';
import LoginModal from '../auth/LoginModal';
import SignupModal from '../auth/SignupModal';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  padding: ${spacing[4]};
  border-bottom: 1px solid ${colors.gray[200]};
  z-index: 30;
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
`;

// ClientLayout.tsx 예시 (필요시 적용)
const HEADER_HEIGHT = '57px'; // 헤더 높이

const Main = styled.main<{ hasHeader: boolean }>`
  margin-top: ${props => props.hasHeader ? HEADER_HEIGHT : '0'};
  height: ${props => props.hasHeader ? `calc(100vh - ${HEADER_HEIGHT})` : '100vh'};
  overflow-y: auto;
  /* Footer가 Main 외부에 있다면 Footer 높이만큼 padding-bottom 추가 고려 */
`;

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  return (
    <>
      <HeaderContainer>
        <Nav>
          <Logo href="/">CHANNELINK</Logo>
          <NavLinks>
            <NavLink onClick={() => setIsLoginModalOpen(true)}>로그인</NavLink>
            <NavLink onClick={() => setIsSignupModalOpen(true)}>회원가입</NavLink>
          </NavLinks>
        </Nav>
      </HeaderContainer>
      <Main hasHeader>{children}</Main>
      <Footer />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <SignupModal isOpen={isSignupModalOpen} onClose={() => setIsSignupModalOpen(false)} />
    </>
  );
} 