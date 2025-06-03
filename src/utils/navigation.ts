import { useRouter } from 'next/navigation';

export function useLoginModalCloseHandler() {
  const router = useRouter();
  return () => {
    if (typeof window !== 'undefined' && document.referrer) {
      router.back();
    } else {
      router.push('/');
    }
  };
} 