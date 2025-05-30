'use client';
import Link from 'next/link';
import Image from 'next/image';

// 타입 및 숫자 포맷 함수 직접 정의
interface MyYoutubeChannelSummary {
  channelId: string;
  channelName: string;
  thumbnailUrl: string | null;
  subscriberCount: number | null;
  status: string;
  platformCoOwnerStatus: string;
}

interface Page<T> {
  content: T[];
  empty: boolean;
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

interface MyChannelsProps {
  user: { userId: string } | null;
  channels: Page<MyYoutubeChannelSummary> | null;
}

export default function MyChannels({ user, channels }: MyChannelsProps) {
  if (!user || !channels || channels.empty) {
    return user ? null : null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {channels.content.map((channel) => (
        <Link 
          key={channel.channelId}
          href={`/mypage/channels/${channel.channelId}`}
          className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
        >
          <div className="flex items-start space-x-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              {channel.thumbnailUrl ? (
                <Image
                  src={channel.thumbnailUrl}
                  alt={channel.channelName}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold truncate">{channel.channelName}</h3>
              <p className="text-gray-600">
                구독자 {formatNumber(channel.subscriberCount || 0)}명
              </p>
              <div className="mt-2 flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  channel.status === 'ACTIVE' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {channel.status === 'ACTIVE' ? '활성' : '비활성'}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  channel.platformCoOwnerStatus === 'APPROVED'
                    ? 'bg-blue-100 text-blue-800'
                    : channel.platformCoOwnerStatus === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {channel.platformCoOwnerStatus === 'APPROVED'
                    ? '승인됨'
                    : channel.platformCoOwnerStatus === 'PENDING'
                    ? '대기중'
                    : '거절됨'}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 