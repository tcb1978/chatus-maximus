import type { FC } from 'react';
import { ChannelEnum } from '../server/server-sidebar';
import { Hash } from 'lucide-react';
import MobileToggle from '@/components/mobile-toggle';
import UserAvatar from '@/components/user-avatar';
import SocketIndicator from '@/components/socket-indicator';

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: ChannelEnum.CHANNEL | ChannelEnum.CONVERSATION;
  imageUrl?: string;
}

const ChatHeader: FC<ChatHeaderProps> = ({
  serverId,
  name,
  type,
  imageUrl,
}): JSX.Element => {

  return (
    <div className='text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2'>
      <MobileToggle serverId={serverId} />
      {type === ChannelEnum.CHANNEL && (
        <Hash
          className='w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2'
        />
      )}
      {type === ChannelEnum.CONVERSATION && (
        <UserAvatar
          src={imageUrl}
          className='w-8 h-8 md:h-8 me:w-8 rounded-full mr-2'
        />
      )}
      <p className='font-semibold text-md text-black dark:text-white'>
        {name}
      </p>
      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;