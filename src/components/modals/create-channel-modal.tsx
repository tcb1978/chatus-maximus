'use client';

import qs from 'query-string';
import { useParams, useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';
import axios from 'axios';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModalEnum, useModal } from '@/hooks/use-modal-store';
import { ChannelType } from '@prisma/client';

interface CreateChannelModalProps {

}

const CreateChannelModal: FC<CreateChannelModalProps> = ({ }): JSX.Element => {
  const router = useRouter();
  const params = useParams();

  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === ModalEnum.CreateChannel;
  const { channelType } = data;

  const formSchema = z.object({
    name: z.string().min(1, {
      message: 'Channel name is required',
    }).refine((name) => name !== 'general', {
      message: 'Channel name cannot be "general"',
    }),
    type: z.nativeEnum(ChannelType),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: channelType || ChannelType.TEXT
    }
  });

  useEffect(() => {
    if (channelType) {
      form.setValue('type', channelType);
    } else {
      form.setValue('type', ChannelType.TEXT);
    }
  }, [channelType, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: '/api/channels',
        query: {
          serverId: params?.serverId,
        },
      });
      await axios.post(url, values);
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Create Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className='space-y-8'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='space-y-8 px-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'
                    >
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                        disabled={isLoading}
                        placeholder='Enter a channel name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Channel Type
                    </FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        disabled={isLoading}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger
                            className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus-visible:ring-offset-0 capitalize outline-none'
                          >
                            <SelectValue
                              placeholder='Select a channel type'
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ChannelType).map((type) => (
                            <SelectItem
                              key={type}
                              className='capitalize'
                              value={type}
                            >
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter
              className='bg-gray-100 px-6 py-4'
            >
              <Button
                className='w-full'
                disabled={isLoading}
                type='submit'
                variant={'primary'}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>

      </DialogContent>
      {/* <DialogFooter>
        <button className='btn btn-primary'>Get started</button>
      </DialogFooter> */}
    </Dialog>
  );
};

export default CreateChannelModal;