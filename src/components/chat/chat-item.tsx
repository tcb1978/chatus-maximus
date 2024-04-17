import * as z from 'zod';
import axios from 'axios';
import qs from 'query-string';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Member, MemberRole, Profile } from '@prisma/client';
import { useEffect, useState, type FC } from 'react';
import UserAvatar from '@/components/user-avatar';
import ActionTooltip from '@/components/action-tooltip';
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

const formSchema = z.object({
  content: z.string().min(1),
});

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

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'escape' || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);
      setIsEditing(false);
    } catch (error) {
      console.error('[CHAT_ITEM]', error);
    } finally {
      form.reset();
    }
  };

  useEffect(() => {
    form.reset({ content });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const fileType = fileUrl?.split('.').pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === 'pdf' && fileUrl;
  const isImage = !isPDF && fileUrl;

  return (
    <div className='group flex items-center hover:bg-black/5 p-4 transition wi-full'>
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
              className='aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48'
              href={fileUrl}
              rel='noopener noreferrer'
              target='_blank'
            >
              <Image
                fill
                alt={content}
                className='object-cover'
                src={fileUrl}
              />
            </a>
          ) : (null)}

          {isPDF ? (
            <div className='relative p-2 mt-2 rounded-md flex items-center bg-background/10 w-fu;'>
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
              {(isUpdated && !deleted) ? (
                <span className='text-[10px] mx-2 text-zinc-500 dark:text-zinc-400'>
                  (edited)
                </span>
              ) : (null)}
            </p>
          ) : (null)}
          {(!fileUrl && isEditing) ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex items-center w-full gap-x-2 pt-2 bg-purple-500 min-w-[100%]'
              >
                <FormField
                  name='content'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormControl>
                        <div className='relative w-full'>
                          <Input
                            className='w-full p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
                            placeholder='Edited message...'
                            disabled={isLoading}
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button size='sm' variant='primary' disabled={isLoading}>
                  Save
                </Button>
              </form>
              <span className='text-[10px] mt-1 text-zinc-400'>
                Press escape to cancel, enter to save
              </span>
            </Form>
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
                onClick={() => setIsEditing(true)}
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