'use client';

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useToast } from '@/contexts/ToastContext';
import { apiClient } from '@/services/api/client';
import { useRouter } from 'next/navigation';
import { fetchYoutubeCategories } from '@/services/api/youtubeCategories';
import { YoutubeCategory } from '@/types/features/youtube/category';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]};
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 70px;
`;

const Label = styled.label`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
  font-weight: ${typography.fontWeight.medium};
  margin-bottom: ${spacing[1]};
`;

const RequiredMark = styled.span`
  color: ${colors.error.main};
  margin-left: 4px;
`;

const ValidationMessage = styled.span<{ isValid?: boolean; isError?: boolean }>`
  font-size: ${typography.fontSize.xs};
  color: ${props => props.isError ? colors.error.main : props.isValid ? colors.success.main : colors.gray[500]};
  margin-top: 2px;
`;

const CategorySelect = styled.select`
  width: 100%;
  padding: ${spacing[2]};
  border: 1px solid ${colors.gray[300]};
  border-radius: 4px;
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
  background-color: white;
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
  }
`;

interface Props {
  userId: string;
  onSuccess?: () => void;
}

interface FormData {
  youtubeChannelIdOnYoutube: string;
  youtubeBrandAccountEmail: string;
  categoryId: string;
}

export default function YoutubeChannelRegisterForm({ userId, onSuccess }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    youtubeChannelIdOnYoutube: '',
    youtubeBrandAccountEmail: '',
    categoryId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<YoutubeCategory[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const fetchedCategories = await fetchYoutubeCategories();
        setCategories(fetchedCategories);
      } catch {
        showToast('카테고리 목록을 불러오는데 실패했습니다.', 3000);
      }
    }
    loadCategories();
  }, [showToast]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.youtubeChannelIdOnYoutube) {
      newErrors.youtubeChannelIdOnYoutube = '채널 ID를 입력해주세요.';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = '카테고리를 선택해주세요.';
    }
    if (formData.youtubeBrandAccountEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.youtubeBrandAccountEmail)) {
      newErrors.youtubeBrandAccountEmail = '올바른 이메일 형식이 아닙니다.';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await apiClient.post('/api/v1/youtube-channels', {
        sellerUserId: userId,
        youtubeChannelIdOnYoutube: formData.youtubeChannelIdOnYoutube,
        youtubeBrandAccountEmail: formData.youtubeBrandAccountEmail || null,
        categoryIds: formData.categoryId ? [formData.categoryId] : []
      });
      showToast('채널이 성공적으로 등록되었습니다.', 3000);
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (err as any)?.response?.data?.message || '채널 등록에 실패했습니다. 다시 시도해 주세요.';
      setErrors({ form: errorMessage });
      showToast(errorMessage, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="youtubeChannelIdOnYoutube">
          채널 ID <RequiredMark>*</RequiredMark>
        </Label>
        <Input
          id="youtubeChannelIdOnYoutube"
          name="youtubeChannelIdOnYoutube"
          value={formData.youtubeChannelIdOnYoutube}
          onChange={handleChange}
          placeholder="UCxxxxxxxxxxxx"
          error={errors.youtubeChannelIdOnYoutube ? 'error' : undefined}
        />
        {errors.youtubeChannelIdOnYoutube && (
          <ValidationMessage isError>{errors.youtubeChannelIdOnYoutube}</ValidationMessage>
        )}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="categoryId">
          카테고리 <RequiredMark>*</RequiredMark>
        </Label>
        <CategorySelect
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          style={{ borderColor: errors.categoryId ? colors.error.main : colors.gray[300] }}
        >
          <option value="">카테고리 선택</option>
          {categories.map(category => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </option>
          ))}
        </CategorySelect>
        {errors.categoryId && (
          <ValidationMessage isError>{errors.categoryId}</ValidationMessage>
        )}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="youtubeBrandAccountEmail">
          브랜드 계정 이메일
        </Label>
        <Input
          id="youtubeBrandAccountEmail"
          name="youtubeBrandAccountEmail"
          value={formData.youtubeBrandAccountEmail}
          onChange={handleChange}
          placeholder="brand@example.com"
          error={errors.youtubeBrandAccountEmail ? 'error' : undefined}
        />
        {errors.youtubeBrandAccountEmail && (
          <ValidationMessage isError>{errors.youtubeBrandAccountEmail}</ValidationMessage>
        )}
      </FormGroup>

      {errors.form && <ValidationMessage isError>{errors.form}</ValidationMessage>}
      
      <Button type="submit" variant="primary" size="large" fullWidth disabled={isSubmitting}>
        {isSubmitting ? '등록 중...' : '채널 등록하기'}
      </Button>
    </Form>
  );
} 