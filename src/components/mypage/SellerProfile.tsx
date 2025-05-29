'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
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
  const [editField, setEditField] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<SellerProfileData | null>(null);
  const [formData, setFormData] = useState({
    businessRegistrationNumber: '',
    method: '',
    dayOfMonth: '',
    minAmount: '',
  });

  useEffect(() => {
    if (!user) return;
    const fetchSellerProfile = async () => {
      try {
        const { data } = await apiClient.get(`/api/v1/seller-profiles/users/${user.userId}`);
        setProfileData(data);
        setFormData({
          businessRegistrationNumber: data.businessRegistrationNumber || '',
          method: data.payoutPreference?.method || '',
          dayOfMonth: data.payoutPreference?.dayOfMonth?.toString() || '',
          minAmount: data.payoutPreference?.minAmount?.toString() || '',
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
      } else if (field === 'method' || field === 'dayOfMonth' || field === 'minAmount') {
        payload.payoutPreference = {
          method: formData.method,
          dayOfMonth: formData.dayOfMonth ? Number(formData.dayOfMonth) : null,
          minAmount: formData.minAmount ? Number(formData.minAmount) : null,
        };
      }
      const { data } = await apiClient.put('/api/v1/users/seller-profiles/me', payload);
      setProfileData(data);
      showToast('판매자 프로필이 성공적으로 업데이트되었습니다.', 3000);
      setEditField(null);
    } catch {
      showToast('판매자 프로필 업데이트에 실패했습니다.', 3000);
    }
  };

  if (!profileData || Object.keys(profileData).length === 0) {
    return <SellerProfileEmpty userId={user?.userId ?? ''} />;
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
              <Input
                name="businessRegistrationNumber"
                value={formData.businessRegistrationNumber}
                onChange={handleInputChange}
                placeholder="사업자등록번호를 입력하세요"
              />
              <Button size="small" type="button" onClick={() => handleSave('businessRegistrationNumber')}>저장</Button>
              <Button size="small" type="button" variant="secondary" onClick={() => setEditField(null)}>취소</Button>
            </InputWrap>
          ) : (
            <>
              <ItemValue>{profileData.businessRegistrationNumber || '-'}</ItemValue>
              <EditButton type="button" onClick={() => setEditField('businessRegistrationNumber')}>변경</EditButton>
            </>
          )}
        </Item>
        {/* 정산 방식 */}
        <Item>
          <ItemLabel>정산 방식</ItemLabel>
          {editField === 'method' ? (
            <InputWrap>
              <Input
                name="method"
                value={formData.method}
                onChange={handleInputChange}
                placeholder="정산 방식을 입력하세요"
              />
              <Button size="small" type="button" onClick={() => handleSave('method')}>저장</Button>
              <Button size="small" type="button" variant="secondary" onClick={() => setEditField(null)}>취소</Button>
            </InputWrap>
          ) : (
            <>
              <ItemValue>{profileData.payoutPreference?.method || '-'}</ItemValue>
              <EditButton type="button" onClick={() => setEditField('method')}>변경</EditButton>
            </>
          )}
        </Item>
        <Item>
          <ItemLabel>매월 정산일</ItemLabel>
          {editField === 'dayOfMonth' ? (
            <InputWrap>
              <Input
                name="dayOfMonth"
                value={formData.dayOfMonth}
                onChange={handleInputChange}
                placeholder="정산일(숫자)"
              />
              <Button size="small" type="button" onClick={() => handleSave('dayOfMonth')}>저장</Button>
              <Button size="small" type="button" variant="secondary" onClick={() => setEditField(null)}>취소</Button>
            </InputWrap>
          ) : (
            <>
              <ItemValue>{profileData.payoutPreference?.dayOfMonth ? `${profileData.payoutPreference.dayOfMonth}일` : '-'}</ItemValue>
              <EditButton type="button" onClick={() => setEditField('dayOfMonth')}>변경</EditButton>
            </>
          )}
        </Item>
        <Item>
          <ItemLabel>최소 금액</ItemLabel>
          {editField === 'minAmount' ? (
            <InputWrap>
              <Input
                name="minAmount"
                value={formData.minAmount}
                onChange={handleInputChange}
                placeholder="최소 금액"
              />
              <Button size="small" type="button" onClick={() => handleSave('minAmount')}>저장</Button>
              <Button size="small" type="button" variant="secondary" onClick={() => setEditField(null)}>취소</Button>
            </InputWrap>
          ) : (
            <>
              <ItemValue>{profileData.payoutPreference?.minAmount ? `${profileData.payoutPreference.minAmount.toLocaleString()}원` : '-'}</ItemValue>
              <EditButton type="button" onClick={() => setEditField('minAmount')}>변경</EditButton>
            </>
          )}
        </Item>
        {/* 페널티 */}
        <Item>
          <ItemLabel>거래 페널티 횟수</ItemLabel>
          <ItemValue>{profileData.penaltyStrikes || 0}회</ItemValue>
        </Item>
      </ItemList>
    </Section>
  );
} 