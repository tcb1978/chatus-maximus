import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import { ChannelEnum } from '@/components/server/server-sidebar';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import type { FC } from 'react';

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage: FC<ChannelIdPageProps> = async ({
  params: {
    serverId,
    channelId,
  },
}): Promise<JSX.Element | null> => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    }
  });

  const member = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    redirect('/');
  }

  return (
    <div
      className='bg-white dark:bg-[#313338] flex flex-col h-full'
    >
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type={ChannelEnum.CHANNEL}
      />
      <div className='flex-1'>Future Messages</div>
      <ChatInput
        apiUrl={`/api/socket/messages`}
        name={channel.name}
        query={{
          serverId,
          channelId,
        }}
        type={ChannelEnum.CHANNEL}
      />
    </div>
  );
};

export default ChannelIdPage;