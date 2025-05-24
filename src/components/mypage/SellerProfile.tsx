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

const WarningText = styled.p`
  color: ${colors.error.main};
  font-size: ${typography.fontSize.sm};
  margin-top: ${spacing[2]};
`;

interface SellerProfileData {
  sellerProfileId: string;
  userId: string;
  businessRegistrationNumber: string | null;
  bankAccountInfoEncrypted: string | null;
  payoutPreference: string | null;
  kgInicisBillingKey: string | null;
  penaltyStrikes: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export default function SellerProfile() {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<SellerProfileData | null>(null);
  const [formData, setFormData] = useState({
    businessRegistrationNumber: '',
    bankAccountInfoEncrypted: '',
    payoutPreference: '',
  });

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        const { data } = await apiClient.get('/api/v1/users/seller-profiles/me');
        setProfileData(data);
        setFormData({
          businessRegistrationNumber: data.businessRegistrationNumber || '',
          bankAccountInfoEncrypted: data.bankAccountInfoEncrypted || '',
          payoutPreference: data.payoutPreference || '',
        });
      } catch (error) {
        showToast('판매자 프로필을 불러오는데 실패했습니다.', 3000);
      }
    };

    fetchSellerProfile();
  }, [showToast]);

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
            <Label>계좌 정보</Label>
            {isEditing ? (
              <Input
                name="bankAccountInfoEncrypted"
                value={formData.bankAccountInfoEncrypted}
                onChange={handleInputChange}
                placeholder="계좌 정보를 입력하세요"
              />
            ) : (
              <Value>{profileData.bankAccountInfoEncrypted ? '****' : '-'}</Value>
            )}
          </InfoItem>
          <InfoItem>
            <Label>출금 선호도</Label>
            {isEditing ? (
              <Input
                name="payoutPreference"
                value={formData.payoutPreference}
                onChange={handleInputChange}
                placeholder="출금 선호도를 입력하세요"
              />
            ) : (
              <Value>{profileData.payoutPreference || '-'}</Value>
            )}
          </InfoItem>
          <InfoItem>
            <Label>벌점</Label>
            <Value>{profileData.penaltyStrikes || 0}</Value>
            {profileData.penaltyStrikes && profileData.penaltyStrikes > 0 && (
              <WarningText>
                벌점이 {profileData.penaltyStrikes}회 누적되었습니다.
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
                  bankAccountInfoEncrypted: profileData.bankAccountInfoEncrypted || '',
                  payoutPreference: profileData.payoutPreference || '',
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