'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import { User } from '@/types/user';
import Input from '@/components/common/Input';
import { useToast } from '@/contexts/ToastContext';
import { useDupCheck } from '@/hooks/useDupCheck';
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
import Label from '@/components/common/Label';

const ToggleLabel = styled.label`
  font-size: ${typography.fontSize.sm};
  color: ${colors.gray[400]};
  font-weight: ${typography.fontWeight.medium};
`;

const Toggle = styled.input`
  width: 40px;
  height: 20px;
  appearance: none;
  background: ${colors.gray[200]};
  border-radius: 20px;
  position: relative;
  outline: none;
  cursor: pointer;
  transition: background 0.2s;
  &:checked {
    background: ${colors.primary[400]};
  }
  &::before {
    content: '';
    position: absolute;
    left: 2px;
    top: 2px;
    width: 16px;
    height: 16px;
    background: #fff;
    border-radius: 50%;
    transition: transform 0.2s;
    transform: translateX(0);
  }
  &:checked::before {
    transform: translateX(20px);
  }
`;

const MaskedPassword = ({ length = 8 }: { length?: number }) => <span>{'●'.repeat(length)}</span>;

interface AccountInfoProps {
  userData: User;
  onUpdate: (data: Partial<User>) => Promise<void>;
}

export default function AccountInfo({ userData, onUpdate }: AccountInfoProps) {
  const { showToast } = useToast();
  const [editField, setEditField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nickname: userData.nickname || '',
    fullName: userData.fullName || '',
    contactNumber: userData.contactNumber || '',
    password: '',
  });
  const [adSms, setAdSms] = useState(false);
  const [adEmail, setAdEmail] = useState(false);

  const isNicknameValid = formData.nickname.length >= 2 && formData.nickname.length <= 16;
  const dupCheck = useDupCheck(formData.nickname, isNicknameValid);

  const handleSave = async (field: string) => {
    try {
      if (field === 'nickname') {
        if (!isNicknameValid) {
          showToast('닉네임은 2-16자 사이여야 합니다.', 3000);
          return;
        }
        if (dupCheck.status === 'invalid') {
          showToast(dupCheck.message, 3000);
          return;
        }
      }
      await onUpdate({ [field]: formData[field as keyof typeof formData] });
      showToast('정보가 성공적으로 업데이트되었습니다.', 3000);
      setEditField(null);
    } catch {
      showToast('정보 업데이트에 실패했습니다.', 3000);
    }
  };

  return (
    <>
      <Section>
        <SectionTitle>로그인 정보</SectionTitle>
        <ItemList>
          {/* 내 계정 섹션 */}
          <Item as="div" style={{ fontWeight: 600, fontSize: typography.fontSize.lg, border: 'none', paddingBottom: spacing[2] }}>내 계정</Item>
          {/* 이메일(아이디) */}
          <Item>
            <ItemLabel>이메일 주소</ItemLabel>
            <ItemValue>{userData.email}</ItemValue>
          </Item>
          {/* 비밀번호 */}
          <Item>
            <ItemLabel>비밀번호</ItemLabel>
            {editField === 'password' ? (
              <InputWrap>
                <div style={{ flex: 'none', width: spacing[40] }}>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData(f => ({ ...f, password: e.target.value }))}
                  placeholder="새 비밀번호 입력"
                    style={{ height: spacing[8], width: '100%' }}
                    fullWidth={false}
                  />
                </div>
                <div style={{ display: 'flex', gap: spacing[2], marginLeft: 'auto' }}>
                  <EditButton type="button" variant="primary" onClick={() => handleSave('password')}>저장</EditButton>
                  <EditButton type="button" variant="errorOutline" onClick={() => setEditField(null)}>취소</EditButton>
                </div>
              </InputWrap>
            ) : (
              <>
                <ItemValue><MaskedPassword length={8} /></ItemValue>
                <EditButton type="button" onClick={() => setEditField('password')}>변경</EditButton>
              </>
            )}
          </Item>
          {/* 닉네임 */}
          <Item>
            <ItemLabel>닉네임</ItemLabel>
            {editField === 'nickname' ? (
              <InputWrap>
                <div style={{ flex: 'none', width: spacing[40] }}>
                <Input
                  name="nickname"
                  value={formData.nickname}
                  onChange={e => setFormData(f => ({ ...f, nickname: e.target.value }))}
                  onBlur={() => { dupCheck.check(); }}
                  placeholder="닉네임을 입력하세요"
                    style={{ height: spacing[8], width: '100%' }}
                    fullWidth={false}
                  />
                </div>
                <div style={{ display: 'flex', gap: spacing[2], marginLeft: 'auto' }}>
                  <EditButton type="button" variant="primary" onClick={() => handleSave('nickname')}>저장</EditButton>
                  <EditButton type="button" variant="errorOutline" onClick={() => setEditField(null)}>취소</EditButton>
                </div>
              </InputWrap>
            ) : (
              <>
                <ItemValue>{userData.nickname || '-'}</ItemValue>
                <EditButton type="button" onClick={() => setEditField('nickname')}>변경</EditButton>
              </>
            )}
          </Item>

          {/* 개인 정보 섹션 */}
          <Item as="div" style={{ fontWeight: 600, fontSize: typography.fontSize.lg, border: 'none', paddingTop: spacing[8], paddingBottom: spacing[2] }}>개인 정보</Item>
          {/* 휴대폰 번호 */}
          <Item>
            <ItemLabel>휴대폰 번호</ItemLabel>
            {editField === 'contactNumber' ? (
              <InputWrap>
                <div style={{ flex: 'none', width: spacing[40] }}>
                <Input
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={e => setFormData(f => ({ ...f, contactNumber: e.target.value }))}
                  placeholder="숫자만 입력해주세요 (예: 01012345678)"
                    style={{ height: spacing[8], width: '100%' }}
                    fullWidth={false}
                  />
                </div>
                <div style={{ display: 'flex', gap: spacing[2], marginLeft: 'auto' }}>
                  <EditButton type="button" variant="primary" onClick={() => handleSave('contactNumber')}>저장</EditButton>
                  <EditButton type="button" variant="errorOutline" onClick={() => setEditField(null)}>취소</EditButton>
                </div>
              </InputWrap>
            ) : (
              <>
                <ItemValue>
                  {userData.contactNumber ? (
                    userData.contactNumber
                  ) : (
                    <Label colorType="error">미등록</Label>
                  )}
                </ItemValue>
                <EditButton type="button" variant={userData.contactNumber ? undefined : 'success'} onClick={() => setEditField('contactNumber')}>
                  {userData.contactNumber ? '변경' : '등록'}
                </EditButton>
              </>
            )}
          </Item>
          {/* 이름 */}
          <Item>
            <ItemLabel>이름</ItemLabel>
            {editField === 'fullName' ? (
              <InputWrap>
                <div style={{ flex: 'none', width: spacing[40] }}>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={e => setFormData(f => ({ ...f, fullName: e.target.value }))}
                  placeholder="이름을 입력하세요"
                    style={{ height: spacing[8], width: '100%' }}
                    fullWidth={false}
                  />
                </div>
                <div style={{ display: 'flex', gap: spacing[2], marginLeft: 'auto' }}>
                  <EditButton type="button" variant="primary" onClick={() => handleSave('fullName')}>저장</EditButton>
                  <EditButton type="button" variant="errorOutline" onClick={() => setEditField(null)}>취소</EditButton>
                </div>
              </InputWrap>
            ) : (
              <>
                <ItemValue>
                  {userData.fullName ? (
                    userData.fullName
                  ) : (
                    <Label colorType="error">미등록</Label>
                  )}
                </ItemValue>
                <EditButton type="button" variant={userData.fullName ? undefined : 'success'} onClick={() => setEditField('fullName')}>
                  {userData.fullName ? '변경' : '등록'}
                </EditButton>
              </>
            )}
          </Item>

          {/* 광고성 정보 수신 섹션 */}
          <Item as="div" style={{ fontWeight: 600, fontSize: typography.fontSize.lg, border: 'none', paddingTop: spacing[8], paddingBottom: spacing[2] }}>광고성 정보 수신</Item>
          <Item>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <ToggleLabel htmlFor="adSms">문자 메시지</ToggleLabel>
              <div style={{ marginLeft: 'auto' }}>
              <Toggle id="adSms" type="checkbox" checked={adSms} onChange={() => setAdSms(v => !v)} />
              </div>
            </div>
          </Item>
          <Item>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <ToggleLabel htmlFor="adEmail">이메일</ToggleLabel>
              <div style={{ marginLeft: 'auto' }}>
              <Toggle id="adEmail" type="checkbox" checked={adEmail} onChange={() => setAdEmail(v => !v)} />
              </div>
            </div>
          </Item>
        </ItemList>
      </Section>
    </>
  );
} 