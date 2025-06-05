'use client';

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { apiClient } from '@/services/api/client';
import Button from '@/components/common/Button';
import { FaYoutube, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import YoutubeChannelRegisterForm from './YoutubeChannelRegisterForm';
import { Section, SectionTitle } from '@/components/common/styles/ProfileStyles';

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

const ChannelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${spacing[5]};
  margin-top: ${spacing[4]};
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: ${spacing[3]};
  }
`;

const ChannelCard = styled.div`
  background: ${colors.background.paper};
  border-radius: 16px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.06);
  padding: ${spacing[5]};
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  border: 1.5px solid transparent;
  &:hover {
    box-shadow: 0 4px 20px 0 rgba(0,0,0,0.10);
    border-color: ${colors.primary[200]};
    transform: translateY(-2px) scale(1.01);
  }
`;

const ChannelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[4]};
`;

const ChannelThumbnail = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  background: ${colors.gray[100]};
  border: 1px solid ${colors.gray[200]};
`;

const ChannelInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ChannelName = styled.div`
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  font-size: ${typography.fontSize.lg};
  margin-bottom: 2px;
  word-break: break-all;
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 2px;
`;

const Badge = styled.span<{ color: string }>`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.medium};
  color: #fff;
  background: ${props => props.color};
`;

const ChannelStats = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[6]};
  margin-top: ${spacing[2]};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StatValue = styled.div`
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  font-size: 1.1rem;
`;

const StatLabel = styled.div`
  font-size: ${typography.fontSize.xs};
  color: ${colors.text.secondary};
`;

interface YoutubeChannel {
  channelId: string;
  channelName: string;
  thumbnailUrl: string | null;
  subscriberCount: number | null;
  status: string | null;
  platformCoOwnerStatus: string | null;
  createdAt: string | null;
}

function formatSubscribers(count: number | null) {
  if (!count) return '0';
  if (count >= 10000) return `${Math.floor(count / 10000)}만`;
  if (count >= 1000) return `${Math.floor(count / 1000)}천`;
  return count.toLocaleString();
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
}

function getStatusBadge(status: string | null) {
  if (status === 'ACTIVE') return <Badge color={colors.success.main}>활성</Badge>;
  if (status === 'INACTIVE') return <Badge color={colors.gray[400]}>비활성</Badge>;
  return null;
}

function getCoOwnerBadge(coOwner: string | null) {
  if (coOwner === 'GRANTED') return <Badge color={colors.primary[500]}>공동소유 승인</Badge>;
  if (coOwner === 'PENDING') return <Badge color={colors.warning.main}>공동소유 대기</Badge>;
  return null;
}

export default function YoutubeChannels() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [channels, setChannels] = useState<YoutubeChannel[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchChannels = async () => {
      try {
        const response = await apiClient.get(`/api/v1/users/${user.userId}/youtube-channels`);
        setChannels(response.data.content || []);
      } catch {
        showToast('채널 목록을 불러오는데 실패했습니다.', 3000);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChannels();
  }, [user, showToast]);

  const handleChannelClick = (channelId: string) => {
    router.push(`/youtube-channels/${channelId}`);
  };

  if (!user) return null;
  if (isLoading) return <div>로딩 중...</div>;
  if (showForm) {
    return (
      <Section>
        <SectionTitle>채널 등록</SectionTitle>
        <YoutubeChannelRegisterForm userId={user.userId} onSuccess={() => setShowForm(false)} />
      </Section>
    );
  }
  if (channels.length === 0) {
    return (
      <Section>
        <SectionTitle>채널 관리</SectionTitle>
        <EmptyContainer>
          <FaYoutube size={48} color={colors.primary[400]} style={{ marginBottom: 16 }} />
          <GuideText>아직 등록된 채널이 없어요.<br />유튜브 채널을 등록해보세요!</GuideText>
          <Button variant="primary" size="large" onClick={() => setShowForm(true)}>
            채널 등록하기
          </Button>
        </EmptyContainer>
      </Section>
    );
  }

  return (
    <Section>
      <SectionTitle>채널 관리</SectionTitle>
      <Button
        variant="primary"
        size="large"
        onClick={() => setShowForm(true)}
        style={{ marginBottom: spacing[4] }}
      >
        <FaPlus style={{ marginRight: spacing[2] }} />
        새 채널 등록
      </Button>
      <ChannelGrid>
        {channels.map((channel) => (
          <ChannelCard key={channel.channelId} onClick={() => handleChannelClick(channel.channelId)}>
            <ChannelHeader>
              <ChannelThumbnail
                src={channel.thumbnailUrl || '/images/default-channel.png'}
                alt={channel.channelName}
              />
              <ChannelInfo>
                <ChannelName>{channel.channelName}</ChannelName>
                <BadgeRow>
                  {getStatusBadge(channel.status)}
                  {getCoOwnerBadge(channel.platformCoOwnerStatus)}
                </BadgeRow>
              </ChannelInfo>
            </ChannelHeader>
            <ChannelStats>
              <StatItem>
                <StatValue>{formatSubscribers(channel.subscriberCount)}</StatValue>
                <StatLabel>구독자</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{formatDate(channel.createdAt)}</StatValue>
                <StatLabel>등록일</StatLabel>
              </StatItem>
            </ChannelStats>
          </ChannelCard>
        ))}
      </ChannelGrid>
    </Section>
  );
} 