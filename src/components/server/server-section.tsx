'use client';

import { ChannelType, MemberRole } from '@prisma/client';
import type { FC } from 'react';
import { ServerWithMembersWithProfiles } from '../../../types';
import { SectionEnum } from './server-sidebar';
import ActionTooltip from '../action-tooltip';
import { Plus, Settings } from 'lucide-react';
import { ModalEnum, useModal } from '@/hooks/use-modal-store';

interface ServerSectionProps {
  label: string;
  role: MemberRole;
  sectionType: SectionEnum.CHANNELS | SectionEnum.MEMBERS;
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

export enum ActionLabel {
  CREATE_CHANNEL = 'Create Channel',
  CREATE_TEXT_CHANNEL = 'Create Text Channel',
  CREATE_VOICE_CHANNEL = 'Create Voice Channel',
  CREATE_AUDIO_CHANNEL = 'Create Audio Channel',
  CREATE_MEMBER = 'Create Member',
  MANAGE_MEMBERS = 'Manage Members',
  EDIT_SERVER = 'Edit',
  LEAVE_SERVER = 'Leave',
  DELETE_SERVER = 'Delete',
}

const ServerSection: FC<ServerSectionProps> = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}): JSX.Element => {

  const { onOpen } = useModal();

  return (
    <div className='flex items-center justify-between py-2'>
      <p className='text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400'>
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === SectionEnum.CHANNELS && (
        <ActionTooltip
          label={ActionLabel.CREATE_CHANNEL}
          side='top'
        >
          <button
            onClick={() => onOpen(ModalEnum.CreateChannel, { channelType })}
            className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
          >
            <Plus className='h-4 w-4' />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === SectionEnum.MEMBERS && (
        <ActionTooltip
          label={ActionLabel.MANAGE_MEMBERS}
          side='top'
        >
          <button
            onClick={() => onOpen(ModalEnum.Members)}
            className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
          >
            <Settings className='h-4 w-4' />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;