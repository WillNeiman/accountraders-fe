import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import Button from '@/components/common/Button';
import { FaUserPlus } from 'react-icons/fa';
import { useState } from 'react';
import SellerProfileRegisterForm from './SellerProfileRegisterForm';
import { SectionTitle } from '@/components/common/styles/ProfileStyles';

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: ${colors.background.paper};
  border-radius: 12px;
  padding: 40px 16px;
  text-align: center;
  @media (max-width: 640px) {
    min-height: 200px;
    padding: 24px 8px;
  }
`;

const GuideText = styled.div`
  color: ${colors.text.secondary};
  font-size: 1.1rem;
  margin-bottom: 24px;
  @media (max-width: 640px) {
    font-size: 1rem;
    margin-bottom: 16px;
  }
`;

interface SellerProfileEmptyProps {
  userId: string;
}

export default function SellerProfileEmpty({ userId }: SellerProfileEmptyProps) {
  const [showForm, setShowForm] = useState(false);
  if (showForm) {
    return <>
      <SectionTitle>판매자 프로필</SectionTitle>
      <SellerProfileRegisterForm userId={userId} onSuccess={() => setShowForm(false)} />
    </>;
  }
  return (
    <>
      <SectionTitle>판매자 프로필</SectionTitle>
      <EmptyContainer>
        <FaUserPlus size={48} color={colors.primary[400]} style={{ marginBottom: 16 }} />
        <GuideText>아직 셀러 등록이 되지 않았어요.<br />판매자 프로필을 등록해보세요!</GuideText>
        <Button variant="primary" size="large" onClick={() => setShowForm(true)}>
          셀러 프로필 등록하기
        </Button>
      </EmptyContainer>
    </>
  );
} 