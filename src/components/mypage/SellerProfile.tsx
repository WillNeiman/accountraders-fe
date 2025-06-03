'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/common/Input';
import { useToast } from '@/contexts/ToastContext';
import { apiClient } from '@/lib/api/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import {
  Section,
  SectionTitle,
  ItemList,
  Item,
  ItemLabel,
  ItemValue,
  EditButton,
  InputWrap
} from '@/components/common/styles/ProfileStyles';
import SellerProfileEmpty from './SellerProfileEmpty';
import Label from '@/components/common/Label';
import { spacing } from '@/styles/theme/spacing';

interface SellerProfileData {
  sellerProfileId: string;
  userId: string;
  businessRegistrationNumber: string | null;
  isBankAccountRegistered: boolean;
  isPenaltyCardRegistered: boolean;
  penaltyStrikes: number;
  soldChannelsCount: number | null;
  createdAt: string;
  updatedAt: string;
}

export default function SellerProfile() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [editField, setEditField] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<SellerProfileData | null>(null);
  const [formData, setFormData] = useState({
    businessRegistrationNumber: '',
    bankAccount: '',
    card: '',
  });

  useEffect(() => {
    if (!user) return;
    const fetchSellerProfile = async () => {
      try {
        const response = await apiClient.get(`/api/v1/seller-profiles/users/${user.id}`);
        if (!response.data || Object.keys(response.data).length === 0) {
          setProfileData(null);
          return;
        }
        setProfileData(response.data);
        setFormData({
          businessRegistrationNumber: response.data.businessRegistrationNumber || '',
          bankAccount: '', // 실제 값이 있다면 여기에 할당
          card: '', // 실제 값이 있다면 여기에 할당
        });
      } catch {
        showToast('판매자 프로필을 불러오는데 실패했습니다.', 3000);
      }
    };
    fetchSellerProfile();
  }, [user, showToast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (field: string) => {
    try {
      const payload: Record<string, unknown> = {};
      if (field === 'businessRegistrationNumber') {
        payload.businessRegistrationNumber = formData.businessRegistrationNumber;
      }
      if (field === 'bankAccount') {
        payload.bankAccount = formData.bankAccount;
      }
      if (field === 'card') {
        payload.card = formData.card;
      }
      const { data } = await apiClient.put('/api/v1/users/seller-profiles/me', payload);
      setProfileData(data);
      showToast('판매자 프로필이 성공적으로 업데이트되었습니다.', 3000);
      setEditField(null);
    } catch {
      showToast('판매자 프로필 업데이트에 실패했습니다.', 3000);
    }
  };

  if (!user) return null;
  if (!profileData) {
    return <SellerProfileEmpty userId={user.id} />;
  }

  return (
    <Section>
      <SectionTitle>판매자 프로필</SectionTitle>
      <ItemList>
        {/* 사업자등록번호 */}
        <Item>
          <ItemLabel>사업자등록번호</ItemLabel>
          {editField === 'businessRegistrationNumber' ? (
            <InputWrap>
              <div style={{ flex: 'none', width: spacing[40] }}>
              <Input
                name="businessRegistrationNumber"
                value={formData.businessRegistrationNumber}
                onChange={handleInputChange}
                placeholder="사업자등록번호를 입력하세요"
                  style={{ height: spacing[8], width: '100%' }}
                  fullWidth={false}
                />
              </div>
              <div style={{ display: 'flex', gap: spacing[2], marginLeft: 'auto' }}>
                <EditButton type="button" variant="primary" onClick={() => handleSave('businessRegistrationNumber')}>저장</EditButton>
                <EditButton type="button" variant="errorOutline" onClick={() => setEditField(null)}>취소</EditButton>
              </div>
            </InputWrap>
          ) : (
            <>
              <ItemValue>{profileData.businessRegistrationNumber || '-'}</ItemValue>
              <EditButton type="button" onClick={() => setEditField('businessRegistrationNumber')}>변경</EditButton>
            </>
          )}
        </Item>
        {/* 정산 계좌 */}
        <Item>
          <ItemLabel>정산 계좌</ItemLabel>
          {editField === 'bankAccount' ? (
            <InputWrap>
              <div style={{ flex: 'none', width: spacing[40] }}>
              <Input
                  name="bankAccount"
                  value={formData.bankAccount}
                onChange={handleInputChange}
                  placeholder="정산 계좌 정보를 입력하세요"
                  style={{ height: spacing[8], width: '100%' }}
                  fullWidth={false}
                />
              </div>
              <div style={{ display: 'flex', gap: spacing[2], marginLeft: 'auto' }}>
                <EditButton type="button" variant="primary" onClick={() => handleSave('bankAccount')}>저장</EditButton>
                <EditButton type="button" variant="errorOutline" onClick={() => setEditField(null)}>취소</EditButton>
              </div>
            </InputWrap>
          ) : (
            <ItemValue style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Label colorType={profileData.isBankAccountRegistered ? 'success' : 'error'}>
                {profileData.isBankAccountRegistered ? '등록됨' : '미등록'}
              </Label>
              {profileData.isBankAccountRegistered ? (
                <EditButton type="button" variant="default" onClick={() => setEditField('bankAccount')}>변경</EditButton>
              ) : (
                <EditButton type="button" variant="success" onClick={() => setEditField('bankAccount')}>등록</EditButton>
              )}
            </ItemValue>
          )}
        </Item>
        {/* 결제 카드 */}
        <Item>
          <ItemLabel>결제 카드</ItemLabel>
          {editField === 'card' ? (
            <InputWrap>
              <div style={{ flex: 'none', width: spacing[40] }}>
              <Input
                  name="card"
                  value={formData.card}
                onChange={handleInputChange}
                  placeholder="결제 카드 정보를 입력하세요"
                  style={{ height: spacing[8], width: '100%' }}
                  fullWidth={false}
                />
              </div>
              <div style={{ display: 'flex', gap: spacing[2], marginLeft: 'auto' }}>
                <EditButton type="button" variant="primary" onClick={() => handleSave('card')}>저장</EditButton>
                <EditButton type="button" variant="errorOutline" onClick={() => setEditField(null)}>취소</EditButton>
              </div>
            </InputWrap>
          ) : (
            <ItemValue style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Label colorType={profileData.isPenaltyCardRegistered ? 'success' : 'error'}>
                {profileData.isPenaltyCardRegistered ? '등록됨' : '미등록'}
              </Label>
              {profileData.isPenaltyCardRegistered ? (
                <EditButton type="button" variant="default" onClick={() => setEditField('card')}>변경</EditButton>
              ) : (
                <EditButton type="button" variant="success" onClick={() => setEditField('card')}>등록</EditButton>
              )}
            </ItemValue>
          )}
        </Item>
        {/* 판매 완료 채널 수 */}
        <Item>
          <ItemLabel>판매 완료</ItemLabel>
          <ItemValue>{profileData.soldChannelsCount?.toLocaleString() ?? 0}개</ItemValue>
        </Item>
        {/* 거래 취소 */}
        <Item>
          <ItemLabel>거래 취소</ItemLabel>
          <ItemValue>{profileData.penaltyStrikes}회</ItemValue>
        </Item>
        {/* 생성일 */}
        <Item>
          <ItemLabel>생성일</ItemLabel>
          <ItemValue>{new Date(profileData.createdAt).toLocaleDateString()}</ItemValue>
        </Item>
        {/* 수정일 */}
        <Item>
          <ItemLabel>최종 수정일</ItemLabel>
          <ItemValue>{new Date(profileData.updatedAt).toLocaleDateString()}</ItemValue>
        </Item>
      </ItemList>
    </Section>
  );
} 