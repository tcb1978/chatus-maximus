'use client';

import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { ChannelEnum } from '../server/server-sidebar';
import * as z from 'zod';
import axios from 'axios';
import qs from 'query-string';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { ModalEnum, useModal } from '@/hooks/use-modal-store';
import EmojiPicker from '@/components/ui/emoji-picker';

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: ChannelEnum.CONVERSATION | ChannelEnum.CHANNEL;
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput: FC<ChatInputProps> = ({
  apiUrl,
  query,
  name,
  type,
}): JSX.Element => {
  const { onOpen } = useModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (
    values: z.infer<typeof formSchema>,
  ) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });
      await axios.post(url, values);
      form.reset();
      router.refresh();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name={'content'}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='releative p-4 pb-6'>
                  <Input
                    {...field}
                    className='px-14 py-6 pl-20 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
                    disabled={isLoading}
                    placeholder={`Message ${type === ChannelEnum.CONVERSATION ? name : '#' + name}`}
                  />
                  <button
                    className='absolute bottom-9 left-[21.5rem] w-[24px] h-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center'
                    type='button'
                    onClick={() => {
                      onOpen(ModalEnum.MessageFile, {
                        apiUrl,
                        query
                      });
                    }}
                  >
                    <Plus className='h-6 w-6 text-white dark:text-[#313338]' />
                  </button>
                  <div className='absolute bottom-8 right-8'>
                    <EmojiPicker
                      onChange={(emoji: string) => {
                        field.onChange(`${field.value} ${emoji}`);
                      }} />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;