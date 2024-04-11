'use client';

import { MemberRole } from '@prisma/client';
import type { FC } from 'react';
import { ServerWithMembersWithProfiles } from '../../../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Settings, UserPlus } from 'lucide-react';

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

const ServerHeader: FC<ServerHeaderProps> = ({
  server,
  role,
}): JSX.Element => {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className='focus:outline-none'
        asChild
      >
        <button
          className='w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'
        >
          {server.name}
          <ChevronDown className='w-5 h-5 ml-auto' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]'
      >
        {isModerator ? (
          <DropdownMenuItem
            className='text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer'
          >
            Invite People
            <UserPlus className='w-4 h-4 ml-auto' />
          </DropdownMenuItem>
        ) : null}

        {isAdmin ? (
          <DropdownMenuItem
            className=' px-3 py-2 text-sm cursor-pointer'
          >
            Server Settings
            <Settings className='w-4 h-4 ml-auto' />
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;