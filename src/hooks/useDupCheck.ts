import { useState, useCallback } from 'react';
import { apiClient } from '@/services/api/client';

export function useDupCheck(value: string, isValid: boolean) {
  const [status, setStatus] = useState<'idle'|'checking'|'valid'|'invalid'>('idle');
  const [message, setMessage] = useState('');

  const check = useCallback(async () => {
    if (!isValid) return;
    setStatus('checking');
    setMessage('');
    try {
      const { data } = await apiClient.get('/api/v1/users/nicknames/check', { params: { nickname: value } });
      if (data) {
        setStatus('valid');
        setMessage('사용 가능한 닉네임입니다.');
      } else {
        setStatus('invalid');
        setMessage('이미 사용 중인 닉네임입니다.');
      }
    } catch {
      setStatus('invalid');
      setMessage('닉네임 중복 확인 중 오류가 발생했습니다.');
    }
  }, [value, isValid]);

  // 값이 바뀌면 상태 초기화
  const reset = useCallback(() => {
    setStatus('idle');
    setMessage('');
  }, []);

  return { status, message, check, reset };
} 