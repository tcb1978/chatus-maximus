'use client';

import qs from 'query-string';
import axios from 'axios';
import { FC, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ModalEnum, useModal } from '@/hooks/use-modal-store';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface DeleteChannelModalProps {

}

const DeleteChannelModal: FC<DeleteChannelModalProps> = ({ }): JSX.Element => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === ModalEnum.DeleteChannel;
  const { channel, server } = data;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleOnClick = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      });

      await axios.delete(url);

      onClose();
      router.refresh();
      router.push(`/servers/${server?.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Delete Channel
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Are you sure you want to do this? <br />
            <span className='font-semibold text-indigo-500'>#{channel?.name}</span> will be permanently <span className='font-semibold text-rose-500'>deleted</span>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='bg-gray-100 px-6 py-4'>
          <div className='flex items-center justify-between w-full'>
            <Button
              disabled={isLoading}
              variant='ghost'
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant='primary'
              onClick={handleOnClick}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;