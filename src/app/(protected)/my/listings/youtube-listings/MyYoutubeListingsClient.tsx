'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';
import { YoutubeListingResponse, ListingStatus, MyYoutubeListingParams } from '@/types/features/listings/listing';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import Image from 'next/image';
import Link from 'next/link';
import { Pagination } from '@/components/common/Pagination';
import { useCallback, useEffect, useState } from 'react';
import { fetchMyYoutubeListings } from '@/services/api/youtubeListings';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing[6]};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: ${spacing[2]};
  margin-bottom: ${spacing[4]};
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: ${spacing[2]} ${spacing[4]};
  border-radius: ${spacing[2]};
  border: 1px solid ${({ active }) => (active ? colors.primary[600] : colors.gray[300])};
  background: ${({ active }) => (active ? colors.primary[50] : 'white')};
  color: ${({ active }) => (active ? colors.primary[700] : colors.text.secondary)};
  font-weight: ${({ active }) => (active ? typography.fontWeight.semibold : typography.fontWeight.normal)};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${colors.primary[50]};
    border-color: ${colors.primary[500]};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${typography.fontSize.sm};
`;

const Th = styled.th`
  text-align: left;
  padding: ${spacing[3]} ${spacing[4]};
  border-bottom: 2px solid ${colors.gray[200]};
  color: ${colors.text.secondary};
  font-weight: ${typography.fontWeight.medium};
`;

const Td = styled.td`
  padding: ${spacing[3]} ${spacing[4]};
  border-bottom: 1px solid ${colors.gray[100]};
  vertical-align: middle;
`;

const ProductCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[4]};
`;

const Thumbnail = styled(Image)`
  border-radius: ${spacing[1]};
`;

const StatusBadge = styled.span<{ status: ListingStatus }>`
  display: inline-block;
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: ${spacing[1]};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ status }) => {
    if (status === 'ACTIVE') return colors.success.dark;
    if (status === 'PENDING_SALE') return colors.warning.dark;
    return colors.gray[600];
  }};
  background-color: ${({ status }) => {
    if (status === 'ACTIVE') return colors.success.light;
    if (status === 'PENDING_SALE') return colors.warning.light;
    return colors.gray[100];
  }};
`;

const STATUS_MAP: { [key in ListingStatus]: string } = {
  ACTIVE: '판매중',
  PENDING_SALE: '거래중',
  SOLD: '판매완료',
};

const FILTERS: { label: string; value: ListingStatus | 'ALL' }[] = [
  { label: '전체', value: 'ALL' },
  { label: '판매중', value: 'ACTIVE' },
  { label: '거래중', value: 'PENDING_SALE' },
  { label: '판매완료', value: 'SOLD' },
];

export default function MyYoutubeListingsClient({ initialData }: { initialData: MyYoutubeListingParams }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listingsData, setListingsData] = useState<YoutubeListingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMyYoutubeListings(initialData);
        setListingsData(data);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [initialData]);

  const handleStatusChange = useCallback((status: ListingStatus | 'ALL') => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === 'ALL') {
      params.delete('statuses');
    } else {
      params.set('statuses', status);
    }
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page + 1));
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const currentStatus = searchParams.get('statuses') || 'ALL';

  if (isLoading || !listingsData) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <FilterContainer>
        {FILTERS.map(filter => (
          <FilterButton
            key={filter.value}
            active={currentStatus === filter.value}
            onClick={() => handleStatusChange(filter.value)}
          >
            {filter.label}
          </FilterButton>
        ))}
      </FilterContainer>
      <Table>
        <thead>
          <tr>
            <Th>상품 정보</Th>
            <Th>상태</Th>
            <Th>가격</Th>
            <Th>등록일</Th>
          </tr>
        </thead>
        <tbody>
          {listingsData.content.map(listing => (
            <tr key={listing.listingId}>
              <Td>
                <Link href={`/my/listings/youtube/${listing.listingId}`} passHref>
                  <ProductCell>
                    <Thumbnail src={listing.thumbnailUrl} alt={listing.listingTitle} width={80} height={45} />
                    <span>{listing.listingTitle}</span>
                  </ProductCell>
                </Link>
              </Td>
              <Td>
                <StatusBadge status={listing.status}>{STATUS_MAP[listing.status]}</StatusBadge>
              </Td>
              <Td>{listing.askingPrice.toLocaleString()}원</Td>
              <Td>{new Date(listing.createdAt).toLocaleDateString()}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination
        currentPage={listingsData.number}
        totalPages={listingsData.totalPages}
        onPageChange={handlePageChange}
      />
    </Container>
  );
} 