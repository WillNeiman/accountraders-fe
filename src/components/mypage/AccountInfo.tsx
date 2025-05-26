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
import { useDupCheck } from '@/hooks/useDupCheck';
import { FaSpinner, FaCheckCircle } from 'react-icons/fa';

const Section = styled.section`
  /* Layout */
  margin-bottom: ${spacing[3]};
`;

const SectionTitle = styled.h2`
  /* Typography */
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[4]};
`;

const InfoGrid = styled.div`
  /* Layout */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing[4]};
`;

const InfoItem = styled.div`
  /* Layout */
  margin-bottom: ${spacing[1]};
`;

const Label = styled.label`
  /* Typography */
  display: block;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing[2]};
`;

const Value = styled.div`
  /* Typography */
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};
  /* Box Model */
  padding: ${spacing[3]};
  background: ${colors.background.gray};
  border-radius: ${spacing[2]};
`;

const ButtonGroup = styled.div`
  /* Layout */
  display: flex;
  gap: ${spacing[4]};
  margin-bottom: ${spacing[10]};
`;

const ValidationMessage = styled.span<{ isValid?: boolean; isError?: boolean }>`
  font-size: ${typography.fontSize.xs};
  color: ${props => {
    if (props.isError) return colors.error.main;
    return props.isValid ? colors.success.main : colors.gray[500];
  }};
`;

const InputRightIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 38px;
  display: flex;
  align-items: center;
  font-size: 16px;
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

  const isNicknameValid = formData.nickname.length >= 2 && formData.nickname.length <= 16;
  const dupCheck = useDupCheck(formData.nickname, isNicknameValid);

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
    } catch {
      showToast('계정 정보 업데이트에 실패했습니다.', 3000);
    }
  };

  return (
    <>
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
              <InfoItem style={{ position: 'relative' }}>
                <Label>닉네임</Label>
                <Input
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  onBlur={() => { dupCheck.check(); }}
                  placeholder="닉네임을 입력하세요"
                />
                <ValidationMessage
                  isError={!isNicknameValid || dupCheck.status === 'invalid'}
                  isValid={isNicknameValid && dupCheck.status === 'valid'}
                >
                  {!isNicknameValid
                    ? '닉네임은 2-16자 사이여야 합니다'
                    : dupCheck.status === 'invalid'
                      ? dupCheck.message
                      : dupCheck.status === 'valid'
                        ? dupCheck.message
                        : ''}
                </ValidationMessage>
                {dupCheck.status === 'checking' && (
                  <InputRightIcon><FaSpinner className="spin" /></InputRightIcon>
                )}
                {dupCheck.status === 'valid' && (
                  <InputRightIcon><FaCheckCircle color={colors.success.main} /></InputRightIcon>
                )}
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
                  placeholder="숫자만 입력해주세요 (예: 01012345678)"
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
          <form onSubmit={handleSubmit}>
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
          </form>
        ) : (
          <Button 
            type="button" 
            variant="primary" 
            onClick={(e) => {
              e.preventDefault();
              setIsEditing(true);
            }}
          >
            수정
          </Button>
        )}
      </ButtonGroup>
    </>
  );
} 