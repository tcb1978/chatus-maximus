'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FC } from 'react';
import { ModalEnum, useModal } from '@/hooks/use-modal-store';

interface InviteModalProps {

}

const InviteModal: FC<InviteModalProps> = ({ }): JSX.Element => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === ModalEnum.Invite;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Customize your server
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Give your server a personality with a name and an icon.
          </DialogDescription>
        </DialogHeader>
        Invite Modal
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;