'use client';

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useToast } from '@/contexts/ToastContext';
import { apiClient } from '@/lib/api/apiClient';
import { useAuth } from '@/contexts/AuthContext';

const PayoutCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[1]};
  background: ${colors.background.gray};
  border-radius: ${spacing[2]};
  padding: ${spacing[3]};
  width: 100%;
  max-width: 100%;
`;

const PayoutRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
`;

const PayoutLabel = styled.span`
  min-width: 80px;
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.secondary};
  font-size: ${typography.fontSize.sm};
`;

const PayoutValue = styled.span`
  color: ${colors.text.primary};
  font-size: ${typography.fontSize.base};
`;

const Section = styled.section`
  /* Layout */
  margin-bottom: ${spacing[5]};
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

const WarningText = styled.p`
  /* Typography */
  color: ${colors.error.main};
  font-size: ${typography.fontSize.sm};
  margin-top: ${spacing[2]};
`;

interface SellerProfileData {
  sellerProfileId: string;
  userId: string;
  businessRegistrationNumber: string | null;
  payoutPreference: {
    method: string;
    day: number | null;
    dayOfMonth: number | null;
    minAmount: number | null;
  } | null;
  penaltyStrikes: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export default function SellerProfile() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<SellerProfileData | null>(null);
  const [formData, setFormData] = useState({
    businessRegistrationNumber: '',
  });

  useEffect(() => {
    if (!user) return;
    const fetchSellerProfile = async () => {
      try {
        const { data } = await apiClient.get(`/api/v1/seller-profiles/users/${user.userId}`);
        setProfileData(data);
        setFormData({
          businessRegistrationNumber: data.businessRegistrationNumber || '',
        });
      } catch (error) {
        showToast('판매자 프로필을 불러오는데 실패했습니다.', 3000);
      }
    };
    fetchSellerProfile();
  }, [user, showToast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await apiClient.put('/api/v1/users/seller-profiles/me', formData);
      setProfileData(data);
      showToast('판매자 프로필이 성공적으로 업데이트되었습니다.', 3000);
      setIsEditing(false);
    } catch (error) {
      showToast('판매자 프로필 업데이트에 실패했습니다.', 3000);
    }
  };

  if (!profileData) {
    return <div>로딩 중...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Section>
        <SectionTitle>판매자 프로필</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <Label>사업자등록번호</Label>
            {isEditing ? (
              <Input
                name="businessRegistrationNumber"
                value={formData.businessRegistrationNumber}
                onChange={handleInputChange}
                placeholder="사업자등록번호를 입력하세요"
              />
            ) : (
              <Value>{profileData.businessRegistrationNumber || '-'}</Value>
            )}
          </InfoItem>
          <InfoItem>
            <Label>정산 방식</Label>
            {profileData.payoutPreference ? (
              <PayoutCard>
                <PayoutRow>
                  <PayoutLabel>방식</PayoutLabel>
                  <PayoutValue>{profileData.payoutPreference.method}</PayoutValue>
                </PayoutRow>
                {profileData.payoutPreference.dayOfMonth && (
                  <PayoutRow>
                    <PayoutLabel>매월 정산일</PayoutLabel>
                    <PayoutValue>{profileData.payoutPreference.dayOfMonth}일</PayoutValue>
                  </PayoutRow>
                )}
                {profileData.payoutPreference.minAmount && (
                  <PayoutRow>
                    <PayoutLabel>최소 금액</PayoutLabel>
                    <PayoutValue>{profileData.payoutPreference.minAmount.toLocaleString()}원</PayoutValue>
                  </PayoutRow>
                )}
              </PayoutCard>
            ) : (
              <Value>-</Value>
            )}
          </InfoItem>
          <InfoItem>
            <Label>거래 페널티 횟수</Label>
            <Value>
              {profileData.penaltyStrikes === 0
                ? '페널티 이력이 없어요.'
                : profileData.penaltyStrikes}
            </Value>
            {typeof profileData.penaltyStrikes === 'number' && profileData.penaltyStrikes > 0 && (
              <WarningText>
                페널티가 {profileData.penaltyStrikes}회 누적되었습니다.
              </WarningText>
            )}
          </InfoItem>
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
                  businessRegistrationNumber: profileData.businessRegistrationNumber || '',
                });
              }}
            >
              취소
            </Button>
          </>
        ) : (
          <Button type="button" variant="primary" onClick={() => setIsEditing(true)}>
            수정
          </Button>
        )}
      </ButtonGroup>
    </form>
  );
} 