import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { typography } from '@/styles/theme/typography';
import { spacing } from '@/styles/theme/spacing';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { useState, useEffect, useRef } from 'react';
import { fetchYoutubeCategories, YoutubeCategory } from '@/lib/api/youtubeCategories';
import { theme } from '@/styles/theme';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
}

interface FilterValues {
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  minSubscribers?: number;
  maxSubscribers?: number;
  sort?: string[];
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

const FilterSectionHeader = styled.div`
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
  /* Layout */
  width: 100%;

  /* Box Model */
  padding: ${spacing[1.5]} ${spacing[2]};
  border: 1px solid ${colors.gray[300]};
  border-radius: 4px;

  /* Visual */
  background-color: white;

  /* Typography */
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};

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

const SortOption = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  margin-bottom: ${spacing[2]};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SortLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  cursor: pointer;
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
`;

const SortDirection = styled.select`
  width: 136px;
  min-width: 120px;
  max-width: 100%;
  margin-left: auto;
  padding: ${spacing[1.5]} ${spacing[2]};
  border: 1px solid ${colors.gray[300]};
  border-radius: 4px;
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
  background-color: white;
  font-family: ${typography.fontFamily.sans};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 100%;
    min-width: 0;
  }
`;

const sortOptions = [
  {
    field: 'createdAt',
    label: '등록일',
    options: [
      { value: '', label: '선택 안 함' },
      { value: 'desc', label: '최신순' },
      { value: 'asc', label: '오래된순' },
    ],
  },
  {
    field: 'askingPrice',
    label: '가격',
    options: [
      { value: '', label: '선택 안 함' },
      { value: 'desc', label: '높은순' },
      { value: 'asc', label: '낮은순' },
    ],
  },
  {
    field: 'subscriberCount',
    label: '구독자 수',
    options: [
      { value: '', label: '선택 안 함' },
      { value: 'desc', label: '많은순' },
      { value: 'asc', label: '적은순' },
    ],
  },
  {
    field: 'viewCountOnPlatform',
    label: '조회수',
    options: [
      { value: '', label: '선택 안 함' },
      { value: 'desc', label: '많은순' },
      { value: 'asc', label: '적은순' },
    ],
  },
];

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: ${spacing[1.5]} ${spacing[2]};
  border: 1px solid ${colors.gray[300]};
  border-radius: 4px;
  background: white;
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DropdownList = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  max-height: 220px;
  overflow-y: auto;
  background: white;
  border: 1px solid ${colors.gray[300]};
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  z-index: 10;
`;

const DropdownItem = styled.label`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  padding: ${spacing[1.5]} ${spacing[2]};
  cursor: pointer;
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
  &:hover {
    background: ${colors.primary[50]};
  }
`;

const CategoryCheckbox = styled.input`
  margin: 0;
`;

const FilterModal = ({ isOpen, onClose, onFilterChange, initialFilters = {} }: FilterModalProps) => {
  const [localFilters, setLocalFilters] = useState<FilterValues>(initialFilters);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<YoutubeCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(initialFilters);
      setErrors({});
      loadCategories();
    }
  }, [isOpen, initialFilters]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }
    if (isCategoryOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoryOpen]);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await fetchYoutubeCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      sort: ['createdAt,desc']
    });
    setErrors({});
    onFilterChange({
      sort: ['createdAt,desc']
    });
  };

  const handleApply = () => {
    if (Object.keys(errors).length === 0) {
      onFilterChange(localFilters);
      onClose();
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setLocalFilters(prev => {
      const currentCategoryIds = prev.categoryIds || [];
      const newCategoryIds = currentCategoryIds.includes(categoryId)
        ? currentCategoryIds.filter(id => id !== categoryId)
        : [...currentCategoryIds, categoryId];
      
      return {
        ...prev,
        categoryIds: newCategoryIds.length > 0 ? newCategoryIds : undefined
      };
    });
  };

  const handleSortChange = (field: string, direction: string) => {
    setLocalFilters(prev => {
      let newSorts = (prev.sort || []).filter(sort => !sort.startsWith(field));
      if (direction) {
        newSorts.push(`${field},${direction}`);
      }
      return {
        ...prev,
        sort: newSorts.length > 0 ? newSorts : undefined,
      };
    });
  };

  const getSortDirection = (field: string) => {
    const sort = localFilters.sort?.find(s => s.startsWith(field));
    return sort ? sort.split(',')[1] : '';
  };

  const selectedCount = localFilters.categoryIds?.length || 0;
  const selectedLabel = selectedCount > 0 ? `카테고리 ${selectedCount}개 선택됨` : '카테고리 선택';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small" title="필터" titleAlign="center">
      <ModalContent>
        <FilterSection>
          <FilterTitle>카테고리</FilterTitle>
          <DropdownContainer ref={dropdownRef}>
            <DropdownButton type="button" onClick={() => setIsCategoryOpen(v => !v)}>
              {selectedLabel}
              <span style={{marginLeft: 8}}>{isCategoryOpen ? '▲' : '▼'}</span>
            </DropdownButton>
            {isCategoryOpen && (
              <DropdownList>
                {categories.map(category => (
                  <DropdownItem key={category.categoryId}>
                    <CategoryCheckbox
                      type="checkbox"
                      checked={localFilters.categoryIds?.includes(category.categoryId) || false}
                      onChange={() => handleCategoryChange(category.categoryId)}
                    />
                    {category.categoryName}
                  </DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownContainer>
        </FilterSection>

        <FilterSection>
          <FilterSectionHeader>
            <FilterTitle>가격 범위</FilterTitle>
            {(errors.minPrice || errors.maxPrice) && (
              <ErrorMessage>{errors.minPrice || errors.maxPrice}</ErrorMessage>
            )}
          </FilterSectionHeader>
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
          <FilterSectionHeader>
            <FilterTitle>구독자 수</FilterTitle>
            {(errors.minSubscribers || errors.maxSubscribers) && (
              <ErrorMessage>{errors.minSubscribers || errors.maxSubscribers}</ErrorMessage>
            )}
          </FilterSectionHeader>
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
          {sortOptions.map(option => (
            <SortOption key={option.field}>
              <SortLabel>{option.label}</SortLabel>
              <SortDirection
                value={getSortDirection(option.field)}
                onChange={e => handleSortChange(option.field, e.target.value)}
              >
                {option.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </SortDirection>
            </SortOption>
          ))}
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