'use client';

import { FC, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ModalEnum, useModal } from '@/hooks/use-modal-store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { UseOrigin } from '@/hooks/use-origin';
import axios from 'axios';

interface InviteModalProps {

}

const InviteModal: FC<InviteModalProps> = ({ }): JSX.Element => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const origin = UseOrigin();

  const isModalOpen = isOpen && type === ModalEnum.Invite;
  const { server } = data;

  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);

      onOpen(ModalEnum.Invite, { server: response.data });
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
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className='p-6'>
          <Label
            className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'
          >
            Server invite link
          </Label>
          <div className='flex items-center mt-2 gap-x-2'>
            <Input
              className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
              disabled={isLoading}
              value={inviteUrl}
              onChange={() => { }}
            />
            <Button
              disabled={isLoading}
              size='icon'
              onClick={onCopy}
            >
              {copied ? (<Check className='w-4 h-4 text-green-500' />) : (<Copy className='w-4 h-4' />)}
            </Button>
          </div>
          <Button
            className='text-xs text-zinc-500 mt-4'
            disabled={isLoading}
            size='sm'
            variant='link'
            onClick={onNew}
          >
            Generate a new link
            <RefreshCw className='w-4 h-4 ml-2' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;