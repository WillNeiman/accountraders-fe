'use client';

import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import Image from 'next/image';
import Link from 'next/link';
import { Pagination } from '@/components/common/Pagination';
import { YoutubeListing, ListingStatus } from '@/types/features/listings/listing';

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

interface ListingsTableProps {
  listings: YoutubeListing[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ListingsTable({ 
  listings, 
  currentPage, 
  totalPages, 
  onPageChange 
}: ListingsTableProps) {
  return (
    <>
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
          {listings.map(listing => (
            <tr key={listing.listingId}>
              <Td>
                <Link href={`/my/listings/youtube-listings/${listing.listingId}`} passHref>
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
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
} 