"use client";

import { useEffect, useState } from 'react';
import { login, logout } from '@/lib/api';
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const [loginResult, setLoginResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await login({
        usernameOrEmail: 'testuser_alpha',
        password: 'password12345'
      });
      console.log('로그인 성공:', result);
      setLoginResult(result);
    } catch (error) {
      console.error('로그인 실패:', error);
      setError('로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setLoginResult(null);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>로그인 테스트</h1>
        
        {!loginResult ? (
          <div>
            <button 
              onClick={handleLogin} 
              disabled={isLoading}
              className={styles.loginButton}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        ) : (
          <div>
            <h2>로그인 성공!</h2>
            <button 
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              로그아웃
            </button>
          </div>
        )}

        {loginResult && (
          <div className={styles.result}>
            <h2>로그인 결과:</h2>
            <pre>{JSON.stringify(loginResult, null, 2)}</pre>
          </div>
        )}
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>src/app/page.tsx</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
