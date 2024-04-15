'use client';

import { cn } from '@/lib/utils';
import { Channel, Server, MemberRole, ChannelType } from '@prisma/client';
import { Edit, Hash, Mic, Radio, Trash, Lock } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import type { FC } from 'react';
import ActionTooltip from '@/components/action-tooltip';
import { ActionLabelEnum } from './server-section';
import { ModalEnum, ModalType, useModal } from '@/hooks/use-modal-store';

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
};

const iconographyClasses = 'flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400';

const iconMap = {
  [ChannelType.TEXT]: <Hash className={iconographyClasses} />,
  [ChannelType.VOICE]: <Mic className={iconographyClasses} />,
  [ChannelType.AUDIO]: <Radio className={iconographyClasses} />,
};

const ServerChannel: FC<ServerChannelProps> = ({
  channel,
  server,
  role,
}): JSX.Element => {
  const { onOpen } = useModal();
  const router = useRouter();
  const params = useParams();

  const Icon = iconMap[channel.type];

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
  };

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();

    onOpen(action, {
      channel,
      server,
    });
  };

  return (
    <button
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        params?.channelId === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700',
      )}
      onClick={onClick}
    >
      {Icon}
      <p
        className={cn(
          'line-clamp-1 font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition',
          params?.channelId === channel.id && 'text-primary dark:text-zinc-200 dark:group-hover:text-white',
        )}
      >
        {channel.name}
      </p>
      {channel.name !== 'general' && role !== MemberRole.GUEST ? (
        <div className='ml-auto flex items-center gap-x-3'>
          <ActionTooltip
            label={ActionLabelEnum.EDIT_SERVER} side='top'
          >
            <Edit
              className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
              onClick={((e) => onAction(e, ModalEnum.EditChannel))}
            />
          </ActionTooltip>

          <ActionTooltip
            label={ActionLabelEnum.DELETE_SERVER} side='top'
          >
            <Trash
              className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
              onClick={(e) => onAction(e, ModalEnum.DeleteChannel)}
            />
          </ActionTooltip>
        </div>
      ) : (
        <Lock
          className='ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400'
        />
      )}
    </button>
  );
};

export default ServerChannel;