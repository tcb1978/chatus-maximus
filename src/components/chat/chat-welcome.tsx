import type { FC } from 'react';
import { ChannelEnum } from '../server/server-sidebar';
import { Hash } from 'lucide-react';

interface ChatWelcomeProps {
  name: string;
  type: ChannelEnum.CHANNEL | ChannelEnum.CONVERSATION;
}

const ChatWelcome: FC<ChatWelcomeProps> = ({
  name,
  type,
}): JSX.Element => {
  return (
    <div
      className='apace-y-2 px-4 mb-4'
    >
      {type === ChannelEnum.CHANNEL ? (
        <div
          className='h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center'
        >
          <Hash className='h-12 w-12 text-white' />
        </div>
      ) : (null)}

      <p className='text-xl md:text-3xl font-bold'>
        {type === ChannelEnum.CHANNEL ? 'Welcome to #' : ''}{name}
      </p>

      <p className='text-zin-600 dark:text-zinc-400 text-sm'>
        {type === ChannelEnum.CHANNEL ? `This is the start of #${name} the channel.` : `This is the beginning of your conversation with ${name}.`}
      </p>
    </div>
  );
};

export default ChatWelcome;