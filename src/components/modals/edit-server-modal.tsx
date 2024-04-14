'use client';

import axios from 'axios';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FileUpload from '@/components/file-upload';
import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';
import { ModalEnum, useModal } from '@/hooks/use-modal-store';

interface EditServerModalProps {

}

const EditServerModal: FC<EditServerModalProps> = ({ }): JSX.Element => {
  const router = useRouter();

  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === ModalEnum.EditServer;
  const { server } = data;

  const formSchema = z.object({
    name: z.string().min(1, {
      message: 'Server name is required',
    }),
    imageUrl: z.string().min(1, {
      message: 'Server icon is required',
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    }
  });

  useEffect(() => {
    if (server) {
      form.setValue('name', server.name);
      form.setValue('imageUrl', server.imageUrl);
    }
  }, [server, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/servers/${server?.id}`, values);
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
            Customize your server
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Give your server a personality with a name and an icon.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className='space-y-8'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='space-y-8 px-6'>
              <div
                className='flex items-center justify-center text-center'
              >
                <FormField
                  control={form.control}
                  name='imageUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint='serverImage'
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'
                    >
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                        disabled={isLoading}
                        placeholder='Enter a server name'
                        {...field}
                      />
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
                Save
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

export default EditServerModal;