'use client';

import axios from 'axios';
import qs from 'query-string';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { type FC } from 'react';
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
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/file-upload';
import { useRouter } from 'next/navigation';
import { ModalEnum, useModal } from '@/hooks/use-modal-store';
import { on } from 'events';

interface MessageFileModalProps {

}

const MessageFileModal: FC<MessageFileModalProps> = ({ }): JSX.Element | null => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === ModalEnum.MessageFile;
  const { apiUrl, query } = data;

  const formSchema = z.object({
    fileUrl: z.string().min(1, {
      message: 'Attachment icon is required',
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: '',
    }
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query,
      });

      await axios.post(url, {
        ...values,
        content: values.fileUrl
      });
      form.reset();
      router.refresh();
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Add an attachment
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Send a file as a message
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
                  name='fileUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint={ModalEnum.MessageFile}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
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
                Send
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

export default MessageFileModal;