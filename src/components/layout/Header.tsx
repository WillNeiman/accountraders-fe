// components/Header.tsx
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react'; // lucide-react 아이콘 사용
import styles from './Header.module.css';
import LoginModal from '../auth/LoginModal';
import Button from '../common/Button';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, className = "", onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className={`${styles.navButton} ${className}`}
  >
    {children}
  </Link>
);

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
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
              <Button 
                variant="text"
                onClick={handleLoginClick}
              >
                로그인
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.location.href = '/signup'}
              >
                회원가입
              </Button>
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
              <Button 
                variant="text"
                onClick={handleLoginClick}
                fullWidth
              >
                로그인
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.location.href = '/signup'}
                fullWidth
              >
                회원가입
              </Button>
            </nav>
          </div>
        )}
      </header>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default Header;
