import { Member, MemberRole, Profile } from '@prisma/client';
import type { FC } from 'react';
import UserAvatar from '@/components/user-avatar';
import ActionTooltip from '@/components/action-tooltip';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className='mx-2 h-4 w-4 text-indigo-500' />,
  [MemberRole.ADMIN]: <ShieldAlert className='mx-2 h-4 w-4 text-rose-500' />,

};

const ChatItem: FC<ChatItemProps> = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}): JSX.Element => {
  return (
    <div className='relatibe group flex items-center hover:bg-black/5 p-4 transition wi-full'>
      <div className='group flex gap-x-2 items-start w-full'>
        <div className='cursor-pointer hover:drop-shadow-md transition w-8 h-8'>
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className='flex flex-col w-full'>
          <div className='flex items-center gap-x-2'>
            <div className='flex items-center'>
              <p className='font-semibold text-sm hover:underline cursor-pointer'>
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
              <span className='text-xs text-zinc-500 dark:text-zinc-400'>
                {timestamp}
              </span>
            </div>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;