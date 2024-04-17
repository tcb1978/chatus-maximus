'use client';

import { Member, Message, Profile } from '@prisma/client';
import { Fragment, type FC } from 'react';
import { ChannelEnum } from '../server/server-sidebar';
import ChatWelcome from './chat-welcome';
import { useChatQuery } from '@/hooks/use-chat-query';
import { Loader2, ServerCrash } from 'lucide-react';
import ChatItem from './chat-item';
import { format } from 'date-fns';

const DATE_FORMAT = 'd MMM yyyy, HH:mm';

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: ChannelEnum.CHANNELID | ChannelEnum.CONVERSATIONID;
  paramValue: string;
  type: ChannelEnum.CHANNEL | ChannelEnum.CONVERSATION;
}

const ChatMessages: FC<ChatMessagesProps> = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}) => {

  const queryKey = `chat:${chatId}`;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  });

  if (status !== 'success' && status !== 'error') {
    return (
      <div className='flex-1 flex flex-col justify-center items-center'>
        <Loader2 className='h-7 w-7 text-zinc-500 animate-spin' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>Loading messages...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='flex-1 flex flex-col justify-center items-center'>
        <ServerCrash className='h-7 w-7 text-zinc-500' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>
          Something went wrong. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className='flex-1 flex flex-col py-4 overflow-y-auto'>
      <div className='flex-1'>
        <ChatWelcome name={name} type={type} />
        <div className='flex flex-col-reverse mt-auto'>
          {data.pages.map((group, i) => (
            <Fragment key={i}>
              {group?.messages.map((message: MessageWithMemberWithProfile) => (
                <ChatItem
                  key={message.id}
                  content={message.content}
                  currentMember={member}
                  deleted={message.deleted}
                  fileUrl={message.fileUrl}
                  id={message.id}
                  isUpdated={message.updatedAt !== message.createdAt}
                  member={message.member}
                  socketQuery={socketQuery}
                  socketUrl={socketUrl}
                  timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                />
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;