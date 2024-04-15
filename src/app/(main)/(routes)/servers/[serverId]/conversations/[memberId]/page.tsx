import ChatHeader from '@/components/chat/chat-header';
import { ChannelEnum } from '@/components/server/server-sidebar';
import { getOrCreateConversation } from '@/lib/conversation';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import type { FC } from 'react';

interface MemberIdPageProps {
  params: {
    serverId: string;
    memberId: string;
  };
}

const MemberIdPage: FC<MemberIdPageProps> = async ({
  params: {
    serverId,
    memberId,
  },
}): Promise<JSX.Element> => {

  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    }
  });

  if (!currentMember) {
    return redirect('/');
  }

  const { profileId } = currentMember;
  const conversation = await getOrCreateConversation(profileId, memberId);

  console.log('conversation', conversation);

  if (!conversation) {
    return redirect(`/servers/${serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={serverId}
        type={ChannelEnum.CONVERSATION}
      />
    </div>
  );
};

export default MemberIdPage;