import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { typography } from '@/styles/theme/typography';
import { spacing } from '@/styles/theme/spacing';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { useState, useEffect } from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
}

interface FilterValues {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minSubscribers?: number;
  maxSubscribers?: number;
  sortBy?: 'price' | 'subscribers' | 'views' | 'recent';
}

type NumericFilterKey = 'minPrice' | 'maxPrice' | 'minSubscribers' | 'maxSubscribers';

const ModalContent = styled.div`
  padding: ${spacing[4]};
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
`;

const FilterSection = styled.div`
  margin-bottom: ${spacing[4]};
  width: 100%;
  
  &:last-of-type {
    margin-bottom: ${spacing[6]};
  }
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${spacing[2]};
`;

const FilterTitle = styled.h3`
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
  text-align: left;
`;

const Select = styled.select`
  width: 100%;
  padding: ${spacing[1.5]} ${spacing[2]};
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

const RangeInputContainer = styled.div`
  display: flex;
  gap: ${spacing[2]};
  align-items: center;
  width: 100%;
`;

const RangeInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: ${spacing[1.5]} ${spacing[2]};
  border: 1px solid ${colors.gray[300]};
  border-radius: 4px;
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
  text-align: left;

  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const Divider = styled.span`
  color: ${colors.gray[400]};
  font-size: ${typography.fontSize.sm};
  flex: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${spacing[2]};
  justify-content: center;
  margin-top: ${spacing[6]};
`;

const ErrorMessage = styled.p`
  color: ${colors.red[500]};
  font-size: ${typography.fontSize.xs};
  text-align: right;
  margin-left: ${spacing[2]};
`;

const FilterModal = ({ isOpen, onClose, onFilterChange, initialFilters = {} }: FilterModalProps) => {
  const [localFilters, setLocalFilters] = useState<FilterValues>(initialFilters);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(initialFilters);
      setErrors({});
    }
  }, [isOpen, initialFilters]);

  const validateAndUpdate = (key: NumericFilterKey, value: number | undefined, minKey: NumericFilterKey, maxKey: NumericFilterKey) => {
    const newFilters = { ...localFilters };
    const newErrors = { ...errors };
    
    if (value !== undefined && value < 0) {
      newErrors[key] = '0보다 작은 값은 입력할 수 없습니다';
      return;
    }
    
    if (key.startsWith('min')) {
      const maxValue = newFilters[maxKey] as number | undefined;
      if (value !== undefined && maxValue !== undefined && value > maxValue) {
        newErrors[key] = '최소값은 최대값보다 클 수 없습니다';
      } else {
        delete newErrors[key];
      }
    } else {
      const minValue = newFilters[minKey] as number | undefined;
      if (value !== undefined && minValue !== undefined && value < minValue) {
        newErrors[key] = '최대값은 최소값보다 작을 수 없습니다';
      } else {
        delete newErrors[key];
      }
    }

    newFilters[key] = value;
    setLocalFilters(newFilters);
    setErrors(newErrors);
  };

  const handleReset = () => {
    setLocalFilters({
      category: '',
      sortBy: 'recent'
    });
    setErrors({});
    onFilterChange({
      category: '',
      sortBy: 'recent'
    });
  };

  const handleApply = () => {
    if (Object.keys(errors).length === 0) {
      onFilterChange(localFilters);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small" title="필터" titleAlign="center">
      <ModalContent>
        <FilterSection>
          <FilterTitle>카테고리</FilterTitle>
          <Select
            value={localFilters.category || ''}
            onChange={(e) => {
              setLocalFilters({ ...localFilters, category: e.target.value });
            }}
          >
            <option value="">전체</option>
            <option value="game">게임</option>
            <option value="entertainment">엔터테인먼트</option>
            <option value="education">교육</option>
            <option value="music">음악</option>
          </Select>
        </FilterSection>

        <FilterSection>
          <FilterHeader>
            <FilterTitle>가격 범위</FilterTitle>
            {(errors.minPrice || errors.maxPrice) && (
              <ErrorMessage>{errors.minPrice || errors.maxPrice}</ErrorMessage>
            )}
          </FilterHeader>
          <RangeInputContainer>
            <RangeInput
              type="number"
              placeholder="최소"
              value={localFilters.minPrice || ''}
              onChange={(e) => validateAndUpdate(
                'minPrice',
                e.target.value ? Number(e.target.value) : undefined,
                'minPrice',
                'maxPrice'
              )}
            />
            <Divider>~</Divider>
            <RangeInput
              type="number"
              placeholder="최대"
              value={localFilters.maxPrice || ''}
              onChange={(e) => validateAndUpdate(
                'maxPrice',
                e.target.value ? Number(e.target.value) : undefined,
                'minPrice',
                'maxPrice'
              )}
            />
          </RangeInputContainer>
        </FilterSection>

        <FilterSection>
          <FilterHeader>
            <FilterTitle>구독자 수</FilterTitle>
            {(errors.minSubscribers || errors.maxSubscribers) && (
              <ErrorMessage>{errors.minSubscribers || errors.maxSubscribers}</ErrorMessage>
            )}
          </FilterHeader>
          <RangeInputContainer>
            <RangeInput
              type="number"
              placeholder="최소"
              value={localFilters.minSubscribers || ''}
              onChange={(e) => validateAndUpdate(
                'minSubscribers',
                e.target.value ? Number(e.target.value) : undefined,
                'minSubscribers',
                'maxSubscribers'
              )}
            />
            <Divider>~</Divider>
            <RangeInput
              type="number"
              placeholder="최대"
              value={localFilters.maxSubscribers || ''}
              onChange={(e) => validateAndUpdate(
                'maxSubscribers',
                e.target.value ? Number(e.target.value) : undefined,
                'minSubscribers',
                'maxSubscribers'
              )}
            />
          </RangeInputContainer>
        </FilterSection>

        <FilterSection>
          <FilterTitle>정렬</FilterTitle>
          <Select
            value={localFilters.sortBy || 'recent'}
            onChange={(e) => {
              setLocalFilters({ ...localFilters, sortBy: e.target.value as FilterValues['sortBy'] });
            }}
          >
            <option value="recent">최신순</option>
            <option value="price">가격순</option>
            <option value="subscribers">구독자순</option>
            <option value="views">조회수순</option>
          </Select>
        </FilterSection>

        <ButtonContainer>
          <Button variant="secondary" onClick={handleReset}>초기화</Button>
          <Button 
            variant="primary" 
            onClick={handleApply}
            disabled={Object.keys(errors).length > 0}
          >
            적용
          </Button>
        </ButtonContainer>
      </ModalContent>
    </Modal>
  );
};

export default FilterModal; 