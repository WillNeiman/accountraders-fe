'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import { User } from '@/types/user';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useToast } from '@/contexts/ToastContext';

const Section = styled.section`
  margin-bottom: ${spacing[8]};
`;

const SectionTitle = styled.h2`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[4]};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing[4]};
`;

const InfoItem = styled.div`
  margin-bottom: ${spacing[4]};
`;

const Label = styled.label`
  display: block;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing[2]};
`;

const Value = styled.div`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};
  padding: ${spacing[3]};
  background: ${colors.background.gray};
  border-radius: ${spacing[2]};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${spacing[4]};
  margin-top: ${spacing[6]};
`;

interface AccountInfoProps {
  userData: User;
  onUpdate: (data: Partial<User>) => Promise<void>;
}

export default function AccountInfo({ userData, onUpdate }: AccountInfoProps) {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nickname: userData.nickname || '',
    fullName: userData.fullName || '',
    contactNumber: userData.contactNumber || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdate(formData);
      showToast('계정 정보가 성공적으로 업데이트되었습니다.', 3000);
      setIsEditing(false);
    } catch (error) {
      showToast('계정 정보 업데이트에 실패했습니다.', 3000);
    }
  };

  const handleWithdraw = async () => {
    if (window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        await fetch('/api/v1/users/withdraw', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: userData.userId }),
        });
        showToast('계정이 성공적으로 탈퇴되었습니다.', 3000);
        // 로그아웃 처리 및 홈페이지로 리다이렉트
      } catch (error) {
        showToast('계정 탈퇴에 실패했습니다.', 3000);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Section>
        <SectionTitle>기본 정보</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <Label>이메일</Label>
            <Value>{userData.email}</Value>
          </InfoItem>
          <InfoItem>
            <Label>계정 상태</Label>
            <Value>{userData.status}</Value>
          </InfoItem>
          {isEditing ? (
            <>
              <InfoItem>
                <Label>닉네임</Label>
                <Input
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  placeholder="닉네임을 입력하세요"
                />
              </InfoItem>
              <InfoItem>
                <Label>이름</Label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="이름을 입력하세요"
                />
              </InfoItem>
              <InfoItem>
                <Label>연락처</Label>
                <Input
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="연락처를 입력하세요"
                />
              </InfoItem>
            </>
          ) : (
            <>
              <InfoItem>
                <Label>닉네임</Label>
                <Value>{userData.nickname || '-'}</Value>
              </InfoItem>
              <InfoItem>
                <Label>이름</Label>
                <Value>{userData.fullName || '-'}</Value>
              </InfoItem>
              <InfoItem>
                <Label>연락처</Label>
                <Value>{userData.contactNumber || '-'}</Value>
              </InfoItem>
            </>
          )}
        </InfoGrid>
      </Section>

      <ButtonGroup>
        {isEditing ? (
          <>
            <Button type="submit" variant="primary">
              저장
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  nickname: userData.nickname || '',
                  fullName: userData.fullName || '',
                  contactNumber: userData.contactNumber || '',
                });
              }}
            >
              취소
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="primary" onClick={() => setIsEditing(true)}>
              수정
            </Button>
            <Button type="button" variant="secondary" onClick={handleWithdraw}>
              회원 탈퇴
            </Button>
          </>
        )}
      </ButtonGroup>
    </form>
  );
} 