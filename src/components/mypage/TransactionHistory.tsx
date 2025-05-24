'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import Button from '@/components/common/Button';

const Section = styled.section`
  margin-bottom: ${spacing[8]};
`;

const SectionTitle = styled.h2`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[4]};
`;

const FilterBar = styled.div`
  display: flex;
  gap: ${spacing[4]};
  margin-bottom: ${spacing[6]};
  flex-wrap: wrap;
`;

const FilterButton = styled(Button)<{ isActive: boolean }>`
  background: ${props => props.isActive ? colors.primary[50] : colors.background.paper};
  color: ${props => props.isActive ? colors.primary[600] : colors.text.primary};
  border: 1px solid ${props => props.isActive ? colors.primary[200] : colors.gray[200]};

  &:hover {
    background: ${props => props.isActive ? colors.primary[100] : colors.gray[50]};
  }
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]};
`;

const TransactionItem = styled.div`
  background: ${colors.background.paper};
  border: 1px solid ${colors.gray[200]};
  border-radius: ${spacing[2]};
  padding: ${spacing[4]};
`;

const TransactionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing[3]};
`;

const TransactionTitle = styled.h3`
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
`;

const TransactionDate = styled.span`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

const TransactionDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing[4]};
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[1]};
`;

const DetailLabel = styled.span`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

const DetailValue = styled.span`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};
  font-weight: ${typography.fontWeight.medium};
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: ${spacing[1]};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  background: ${props => {
    switch (props.status) {
      case 'completed':
        return colors.success.light;
      case 'pending':
        return colors.warning.light;
      case 'cancelled':
        return colors.error.light;
      default:
        return colors.gray[100];
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'completed':
        return colors.success.dark;
      case 'pending':
        return colors.warning.dark;
      case 'cancelled':
        return colors.error.dark;
      default:
        return colors.gray[700];
    }
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${spacing[8]};
  background: ${colors.background.gray};
  border-radius: ${spacing[2]};
`;

const EmptyStateText = styled.p`
  color: ${colors.text.secondary};
  font-size: ${typography.fontSize.base};
  margin-bottom: ${spacing[4]};
`;

type TransactionStatus = 'all' | 'pending' | 'completed' | 'cancelled';

interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: TransactionStatus;
  type: 'purchase' | 'sale';
  counterparty: string;
}

export default function TransactionHistory() {
  const [activeFilter, setActiveFilter] = useState<TransactionStatus>('all');
  const [transactions] = useState<Transaction[]>([]);

  const filters: { label: string; value: TransactionStatus }[] = [
    { label: '전체', value: 'all' },
    { label: '진행중', value: 'pending' },
    { label: '완료', value: 'completed' },
    { label: '취소', value: 'cancelled' },
  ];

  const filteredTransactions = transactions.filter(
    transaction => activeFilter === 'all' || transaction.status === activeFilter
  );

  return (
    <Section>
      <SectionTitle>거래 내역</SectionTitle>
      
      <FilterBar>
        {filters.map(filter => (
          <FilterButton
            key={filter.value}
            variant="secondary"
            isActive={activeFilter === filter.value}
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
          </FilterButton>
        ))}
      </FilterBar>

      <TransactionList>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(transaction => (
            <TransactionItem key={transaction.id}>
              <TransactionHeader>
                <TransactionTitle>{transaction.title}</TransactionTitle>
                <TransactionDate>{transaction.date}</TransactionDate>
              </TransactionHeader>
              <TransactionDetails>
                <DetailItem>
                  <DetailLabel>거래 유형</DetailLabel>
                  <DetailValue>
                    {transaction.type === 'purchase' ? '구매' : '판매'}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>거래 금액</DetailLabel>
                  <DetailValue>{transaction.amount.toLocaleString()}원</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>상태</DetailLabel>
                  <StatusBadge status={transaction.status}>
                    {transaction.status === 'completed' && '완료'}
                    {transaction.status === 'pending' && '진행중'}
                    {transaction.status === 'cancelled' && '취소'}
                  </StatusBadge>
                </DetailItem>
              </TransactionDetails>
            </TransactionItem>
          ))
        ) : (
          <EmptyState>
            <EmptyStateText>거래 내역이 없습니다.</EmptyStateText>
            <Button variant="primary">새 거래 시작하기</Button>
          </EmptyState>
        )}
      </TransactionList>
    </Section>
  );
} 