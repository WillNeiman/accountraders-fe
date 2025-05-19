// components/Header.tsx
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react'; // lucide-react 아이콘 사용
import styles from './Header.module.css';
import LoginModal from '../auth/LoginModal';
import SignupModal from '../auth/SignupModal';
import Button from '../common/Button';
import { getAccessToken, logout as logoutApi } from '@/services/auth';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getAccessToken());
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
    setIsSignupModalOpen(false);
  };

  const handleSignupClick = () => {
    setIsSignupModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleCloseSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  // 로그인 성공 시 호출될 함수
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  // 로그아웃 버튼 클릭 시
  const handleLogout = async () => {
    await logoutApi();
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            {/* 로고 */}
            <div className={styles.logo}>
              <Link
                href="/"
                className={styles.logoLink}
              >
                ACCOUNTRADERS
              </Link>
            </div>

            {/* 데스크탑 네비게이션 버튼 */}
            <nav className={styles.desktopNav}>
              {isLoggedIn ? (
                <Button variant="text" onClick={handleLogout}>
                  로그아웃
                </Button>
              ) : (
                <Button 
                  variant="text"
                  onClick={handleLoginClick}
                >
                  로그인
                </Button>
              )}
              {!isLoggedIn && (
                <Button
                  variant="secondary"
                  onClick={handleSignupClick}
                >
                  회원가입
                </Button>
              )}
            </nav>

            {/* 모바일 메뉴 버튼 */}
            <div className={styles.mobileMenuButton}>
              <Button
                variant="text"
                onClick={toggleMobileMenu}
                className={styles.menuToggle}
                aria-label="메뉴 열기/닫기"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <nav className={styles.mobileNav}>
              {isLoggedIn ? (
                <Button variant="text" onClick={handleLogout} fullWidth>
                  로그아웃
                </Button>
              ) : (
                <Button 
                  variant="text"
                  onClick={handleLoginClick}
                  fullWidth
                >
                  로그인
                </Button>
              )}
              {!isLoggedIn && (
                <Button
                  variant="secondary"
                  onClick={handleSignupClick}
                  fullWidth
                >
                  회원가입
                </Button>
              )}
            </nav>
          </div>
        )}
      </header>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={handleCloseLoginModal}
        onSignupClick={handleSignupClick}
        onLoginSuccess={handleLoginSuccess}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={handleCloseSignupModal}
      />
    </>
  );
};

export default Header;
