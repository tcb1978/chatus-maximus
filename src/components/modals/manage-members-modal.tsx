'use client';

import { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModalEnum, useModal } from '@/hooks/use-modal-store';
import { ServerWithMembersWithProfiles } from '../../../types';
import UserAvatar from '../user-avatar';
import { ShieldCheck, ShieldAlert } from 'lucide-react';


interface MembersModalProps {

}

const roleIconMap = {
  'GUEST': null,
  'MODERATOR': <ShieldCheck className='w-4 h-4 ml-2' />,
  'ADMIN': <ShieldAlert className='w-4 h-4 ml-2 text-rose-500 ' />,
};

const MembersModal: FC<MembersModalProps> = ({ }): JSX.Element => {
  const { onOpen, isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === ModalEnum.Members;
  const { server } = data as { server: ServerWithMembersWithProfiles; };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Manage Members
          </DialogTitle>
          <DialogDescription
            className='text-center text-zinc-500'
          >
            {server?.members && server?.members.length} members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='mt-8 max-h-[420px] pr-6'>
          {server?.members && server?.members.map((member) => (
            <div
              key={member.id}
              className='flex items-center gap-x-2 mb-6'
            >
              <UserAvatar
                src={member.profile?.imageUrl}
                alt={member.profile?.name}
              />
              <div className='flex flex-col gap-y-1'>
                <div className='text-xs font-semibold flex items-center gap-x-1'>
                  {member.profile?.name}
                  {roleIconMap[member.role]}
                </div>
                <p className='text-xs text-zinc-500'>
                  {member.profile?.email}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;