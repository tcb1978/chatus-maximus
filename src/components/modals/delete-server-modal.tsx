'use client';

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

interface DeleteServerModalProps {

}

const DeleteServerModal: FC<DeleteServerModalProps> = ({ }): JSX.Element => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === ModalEnum.DeleteServer;
  const { server } = data;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/servers/${server?.id}`);
      onClose();
      router.refresh();
      router.push('/');
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
            Delete Server
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Are you sure you want to do this? <br />
            <span className='font-semibold text-indigo-500'>{server?.name}</span> will be permanently <span className='font-semibold text-rose-500'>deleted</span>.
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
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServerModal;