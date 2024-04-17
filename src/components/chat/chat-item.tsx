import { Member, MemberRole, Profile } from '@prisma/client';
import { useState, type FC } from 'react';
import UserAvatar from '@/components/user-avatar';
import ActionTooltip from '@/components/action-tooltip';
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fileType = fileUrl?.split('.').pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === 'pdf' && fileUrl;
  const isImage = !isPDF && fileUrl;

  return (
    <div className='relatibe group flex items-center hover:bg-black/5 p-4 transition wi-full'>
      <div className='group flex gap-x-2 items-start w-full'>
        <div className='cursor-pointer hover:drop-shadow-md transition w-8 h-8'>
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className='flex flex-col items-start gap-x-2'>
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
          {isImage ? (
            <a
              href={fileUrl}
              rel='noopener noreferrer'
              target='_blank'
              className='relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48'
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className='object-cover'
              />
            </a>
          ) : (null)}

          {isPDF ? (
            <div className='relative p-2 mt-2 rounded-md flex items-center bg-background/10'>
              <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
              <a
                className='text-indigo-500 hover:underline dark:text-indigo-400 transition-colors ml-2 text-sm'
                href={fileUrl}
                rel='nopener noreferrer'
                target='_blank'
              >
                PDF File
              </a>
            </div>
          ) : (null)}

          {(!fileUrl && !isEditing) ? (
            <p
              className={cn(
                'text-sm text-zinc-600 dark:text-zinc-300',
                deleted && 'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1'
              )}>
              {content}
              {isUpdated ? (
                <span className='text-[10px] mx-2 text-zinc-500 dark:text-zinc-400'>
                  (edited)
                </span>
              ) : (null)}
            </p>
          ) : (null)}
        </div>
      </div>
      {canDeleteMessage ? (
        <div
          className='hidden group-hover:flex items-center gap-x-2 bg-white dark:bg-zinc-800 border rounded-sm'
        >
          {canEditMessage ? (
            <ActionTooltip label='Edit'>
              <Edit
                className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition'
              />
            </ActionTooltip>
          ) : (null)}
          <ActionTooltip label='Delete'>
            <Trash
              className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition'
            />
          </ActionTooltip>
        </div>
      ) : (null)}
    </div>
  );
};

export default ChatItem;