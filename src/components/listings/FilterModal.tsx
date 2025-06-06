import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { typography } from '@/styles/theme/typography';
import { spacing } from '@/styles/theme/spacing';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { useState, useEffect, useRef } from 'react';
import { fetchYoutubeCategories } from '@/services/api/youtubeCategories';
import { theme } from '@/styles/theme';
import { YoutubeCategory } from '@/types/features/youtube/category';

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

const sortFieldOptions = [
  { value: 'createdAt', label: '등록일' },
  { value: 'askingPrice', label: '가격' },
  { value: 'subscriberCount', label: '구독자 수' },
  { value: 'viewCountOnPlatform', label: '조회수' },
];

const sortDirectionLabelMap: Record<string, { asc: string; desc: string }> = {
  createdAt: { desc: '최신순', asc: '오래된순' },
  askingPrice: { desc: '높은순', asc: '낮은순' },
  subscriberCount: { desc: '많은순', asc: '적은순' },
  viewCountOnPlatform: { desc: '많은순', asc: '적은순' },
};

const SortRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing[2]};
  margin-bottom: ${spacing[2]};
`;

const SortLabelSmall = styled.label`
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.normal};
  color: ${colors.text.secondary};
  margin-right: ${spacing[1]};
`;

const SortRadioGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[4]};
  width: auto;
  flex-shrink: 0;
`;

const SortRadioLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  font-weight: ${typography.fontWeight.normal};
`;

const SortRadio = styled.input`
  margin-right: ${spacing[1]};
`;

const PriceInput = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  position: relative;
`;

const SubscriberInput = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  position: relative;
`;

const UnitLabel = styled.span`
  color: ${colors.gray[500]};
  font-size: ${typography.fontSize.sm};
  margin-left: ${spacing[1]};
`;

const FilterModal = ({ isOpen, onClose, onFilterChange, initialFilters = {} }: FilterModalProps) => {
  const [localFilters, setLocalFilters] = useState<FilterValues>(initialFilters);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<YoutubeCategory[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

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

  useEffect(() => {
    if (initialFilters.sort) {
      const main = initialFilters.sort[0] || 'createdAt,desc';
      const [field, direction] = main.split(',');
      setSortField(field || 'createdAt');
      setSortDirection(direction || 'desc');
    } else {
      setSortField('createdAt');
      setSortDirection('desc');
    }
  }, [initialFilters.sort, isOpen]);

  const loadCategories = async () => {
    try {
      setCategories(await fetchYoutubeCategories());
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleReset = () => {
    setLocalFilters({
      sort: ['createdAt,desc']
    });
    setErrors({});
    setSortField('createdAt');
    setSortDirection('desc');
  };

  const handleApply = () => {
    if (Object.keys(errors).length === 0) {
      const sort = [`${sortField},${sortDirection}`];
      onFilterChange({ ...localFilters, sort });
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

  const selectedCount = localFilters.categoryIds?.length || 0;
  const selectedLabel = selectedCount > 0 ? `카테고리 ${selectedCount}개 선택됨` : '카테고리 선택';

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const numericValue = value ? parseInt(value) * 10000 : undefined;
    
    setLocalFilters(prev => ({
      ...prev,
      [type === 'min' ? 'minPrice' : 'maxPrice']: numericValue
    }));
  };

  const handleSubscriberChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const numericValue = value ? parseInt(value) * 1000 : undefined;
    
    setLocalFilters(prev => ({
      ...prev,
      [type === 'min' ? 'minSubscribers' : 'maxSubscribers']: numericValue
    }));
  };

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
            <FilterTitle>
              가격 범위
              <UnitLabel>(만원)</UnitLabel>
            </FilterTitle>
            {(errors.minPrice || errors.maxPrice) && (
              <ErrorMessage>{errors.minPrice || errors.maxPrice}</ErrorMessage>
            )}
          </FilterSectionHeader>
          <PriceInput>
            <RangeInput
              type="text"
              placeholder="최소"
              value={localFilters.minPrice ? (localFilters.minPrice / 10000).toString() : ''}
              onChange={(e) => handlePriceChange(e, 'min')}
              aria-label="최소 가격"
            />
            <span>~</span>
            <RangeInput
              type="text"
              placeholder="최대"
              value={localFilters.maxPrice ? (localFilters.maxPrice / 10000).toString() : ''}
              onChange={(e) => handlePriceChange(e, 'max')}
              aria-label="최대 가격"
            />
          </PriceInput>
        </FilterSection>

        <FilterSection>
          <FilterSectionHeader>
            <FilterTitle>
              구독자 수
              <UnitLabel>(천명)</UnitLabel>
            </FilterTitle>
            {(errors.minSubscribers || errors.maxSubscribers) && (
              <ErrorMessage>{errors.minSubscribers || errors.maxSubscribers}</ErrorMessage>
            )}
          </FilterSectionHeader>
          <SubscriberInput>
            <RangeInput
              type="text"
              placeholder="최소"
              value={localFilters.minSubscribers ? (localFilters.minSubscribers / 1000).toString() : ''}
              onChange={(e) => handleSubscriberChange(e, 'min')}
              aria-label="최소 구독자 수"
            />
            <span>~</span>
            <RangeInput
              type="text"
              placeholder="최대"
              value={localFilters.maxSubscribers ? (localFilters.maxSubscribers / 1000).toString() : ''}
              onChange={(e) => handleSubscriberChange(e, 'max')}
              aria-label="최대 구독자 수"
            />
          </SubscriberInput>
        </FilterSection>

        <FilterSection>
          <FilterTitle>정렬</FilterTitle>
          <SortRow>
            <SortLabelSmall htmlFor="sortField">정렬 기준</SortLabelSmall>
            <SortDirection
              as="select"
              id="sortField"
              value={sortField}
              onChange={e => {
                setSortField(e.target.value);
                setSortDirection('desc');
              }}
              style={{ minWidth: 110 }}
            >
              {sortFieldOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </SortDirection>
          </SortRow>
          <SortRow>
            <SortLabelSmall>정렬 방식</SortLabelSmall>
            <SortRadioGroup>
              <SortRadioLabel>
                <SortRadio
                  type="radio"
                  name="sortDirection"
                  value="desc"
                  checked={sortDirection === 'desc'}
                  onChange={() => setSortDirection('desc')}
                />
                {sortDirectionLabelMap[sortField].desc}
              </SortRadioLabel>
              <SortRadioLabel>
                <SortRadio
                  type="radio"
                  name="sortDirection"
                  value="asc"
                  checked={sortDirection === 'asc'}
                  onChange={() => setSortDirection('asc')}
                />
                {sortDirectionLabelMap[sortField].asc}
              </SortRadioLabel>
            </SortRadioGroup>
          </SortRow>
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