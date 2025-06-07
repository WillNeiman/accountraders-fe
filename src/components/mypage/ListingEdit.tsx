'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import { YoutubeListing } from '@/types/features/listings/listing';
import Button from '@/components/common/Button';
import { FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const Section = styled.section`
  margin-bottom: ${spacing[8]};

`;

const SectionTitle = styled.h2`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[12]};
`;

const SubSectionTitle = styled.h3`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
  margin-top: ${spacing[4]};
  margin-bottom: ${spacing[2]};
`;

const Form = styled.form`
  padding: ${spacing[2]};
`;

const FormGroup = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: ${spacing[4]};
  margin-bottom: ${spacing[4]};
  align-items: start;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: ${spacing[2]};
  }
`;

const Label = styled.label`
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.gray[400]};
  padding-top: ${spacing[2]};
`;

const Input = styled.input`
  width: 100%;
  padding: ${spacing[3]};
  border: 1px solid ${colors.gray[200]};
  border-radius: ${spacing[1]};
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
  background-color: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }

  &::placeholder {
    color: ${colors.gray[400]};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${spacing[3]};
  border: 1px solid ${colors.gray[200]};
  border-radius: ${spacing[1]};
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
  background-color: white;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${spacing[3]};
  border: 1px solid ${colors.gray[300]};
  border-radius: ${spacing[1]};
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
  background-color: white;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right ${spacing[3]} center;
  background-size: 16px;

  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${spacing[3]};
  margin-top: ${spacing[6]};
  padding-top: ${spacing[4]};
  border-top: 1px solid ${colors.gray[200]};

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const StatusButton = styled(Button)`
  margin-left: auto;
`;

const FormattedValue = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  margin: ${spacing[1]} 0 0 ${spacing[3]};
`;

interface Props {
  listing: YoutubeListing;
  onSubmit: (data: Partial<YoutubeListing>) => Promise<void>;
}

export default function ListingEdit({ listing, onSubmit }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    listingTitle: listing.listingTitle,
    askingPrice: listing.askingPrice,
    listingDescription: listing.listingDescription || '',
    channelTopic: listing.channelTopic || '',
    monetizationStatus: listing.monetizationStatus,
    copyrightStrikeCount: listing.copyrightStrikeCount,
    communityGuidelineStrikeCount: listing.communityGuidelineStrikeCount,
    averageMonthlyIncome: listing.averageMonthlyIncome || 0,
    isOriginalContent: listing.isOriginalContent,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleCancel = () => {
    router.back();
  };

  const formatCurrency = (amount: number) => {
    const units = ['', '만', '억', '조'];
    const digits = String(amount).split('').reverse();
    let result = '';
    let unitIndex = 0;

    for (let i = 0; i < digits.length; i += 4) {
      const chunk = digits.slice(i, i + 4).reverse().join('');
      if (chunk !== '0000') {
        result = Number(chunk) + units[unitIndex] + result;
      }
      unitIndex++;
    }

    return result + '원';
  };

  return (
    <>
      <Section>
        <SectionTitle>매물 수정</SectionTitle>
        <SubSectionTitle>매물 정보</SubSectionTitle>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>제목</Label>
            <Input
              type="text"
              name="listingTitle"
              value={formData.listingTitle}
              onChange={handleChange}
              required
              placeholder="매물 제목을 입력하세요"
            />
          </FormGroup>
          <FormGroup>
            <Label>설명</Label>
            <TextArea
              name="listingDescription"
              value={formData.listingDescription}
              onChange={handleChange}
              placeholder="매물에 대한 상세 설명을 입력하세요"
            />
          </FormGroup>

          <FormGroup>
            <Label>판매가</Label>
            <div>
              <Input
                type="number"
                name="askingPrice"
                value={formData.askingPrice}
                onChange={handleChange}
                required
                min={0}
                placeholder="판매희망가격을 입력하세요"
              />
              <FormattedValue>{formatCurrency(formData.askingPrice)}</FormattedValue>
            </div>
          </FormGroup>

        </Form>
        <SubSectionTitle>채널 정보</SubSectionTitle>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>채널 주제</Label>
            <Input
              type="text"
              name="channelTopic"
              value={formData.channelTopic}
              onChange={handleChange}
              required
              placeholder="채널의 주요 주제를 입력하세요"
            />
          </FormGroup>

          <FormGroup>
            <Label>수익화 상태</Label>
            <Select
              name="monetizationStatus"
              value={formData.monetizationStatus ? 'true' : 'false'}
              onChange={handleChange}
            >
              <option value="true">수익화 가능</option>
              <option value="false">수익화 불가</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>저작권 경고</Label>
            <Input
              type="number"
              name="copyrightStrikeCount"
              value={formData.copyrightStrikeCount}
              onChange={handleChange}
              min={0}
              max={3}
              placeholder="저작권 경고 횟수를 입력하세요"
            />
          </FormGroup>

          <FormGroup>
            <Label>커뮤니티 가이드라인 경고</Label>
            <Input
              type="number"
              name="communityGuidelineStrikeCount"
              value={formData.communityGuidelineStrikeCount}
              onChange={handleChange}
              min={0}
              max={3}
              placeholder="커뮤니티 가이드라인 경고 횟수를 입력하세요"
            />
          </FormGroup>

          <FormGroup>
            <Label>월 평균 수익</Label>
            <div>
              <Input
                type="number"
                name="averageMonthlyIncome"
                value={formData.averageMonthlyIncome}
                onChange={handleChange}
                min={0}
                placeholder="월 평균 수익을 입력하세요"
              />
              <FormattedValue>{formatCurrency(formData.averageMonthlyIncome)}</FormattedValue>
            </div>
          </FormGroup>

          <FormGroup>
            <Label>원본 콘텐츠</Label>
            <Select
              name="isOriginalContent"
              value={formData.isOriginalContent ? 'true' : 'false'}
              onChange={handleChange}
            >
              <option value="true">예</option>
              <option value="false">아니오</option>
            </Select>
          </FormGroup>

          <ButtonGroup>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              <FiArrowLeft style={{ marginRight: spacing[2] }} />
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              저장
            </Button>
            <StatusButton
              type="button"
              variant="secondary"
            >
              매물 비활성화
            </StatusButton>
          </ButtonGroup>
        </Form>
      </Section>
    </>
  );
} 