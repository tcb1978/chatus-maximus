'use client';

import { cn } from '@/lib/utils';
import { Member, MemberRole, Profile, Server } from '@prisma/client';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import type { FC } from 'react';
import UserAvatar from '../user-avatar';

interface ServerMemberProps {
  member: Member & {
    profile: Profile;
  };
  server: Server;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className='ml-2 h4 -w-4 text-indigo-500' />,
  [MemberRole.ADMIN]: <ShieldAlert className='ml-2 h4 -w-4 text-rose-500' />,
};

const ServerMember: FC<ServerMemberProps> = ({
  member,
  server,
}): JSX.Element => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  return (
    <button
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        params?.memberId === member.id && 'bg-zinc-700/20 dark:bg-zinc-700',
      )}
      onClick={onClick}
    >
      <UserAvatar
        className='h-8 w-8 md:h-8 md:w-8 rounded-full'
        src={member.profile.imageUrl}
      />
      <p
        className={cn(
          'line-clamp-1 font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition',
          params?.memberId === member.id && 'text-primary dark:text-zinc-200 dark:group-hover:text-white',
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};

export default ServerMember;