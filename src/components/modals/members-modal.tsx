'use client';

import { FC, useState } from 'react';
import qs from 'query-string';
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
import { ShieldCheck, ShieldAlert, MoreVertical, ShieldQuestion, Shield, Check, Gavel, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu';
import { MemberRole } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface MembersModalProps {

}

const roleIconMap = {
  'GUEST': null,
  'MODERATOR': <ShieldCheck className='w-4 h-4 ml-2' />,
  'ADMIN': <ShieldAlert className='w-4 h-4 ml-2 text-rose-500 ' />,
};

const MembersModal: FC<MembersModalProps> = ({ }): JSX.Element => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState<string | null>('');

  const isModalOpen = isOpen && type === ModalEnum.Members;
  const { server } = data as { server: ServerWithMembersWithProfiles; };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        }
      });
      const response = await axios.patch(url, { role });
      router.refresh();
      onOpen(ModalEnum.Members, { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId('');
    }
  };

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
              {(server.profileId !== member.profileId && loadingId !== member.id) ? (
                <div className='ml-auto'>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className='w-4 h-4 text-zinc-500' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side='left'>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger
                          className='flex items-center'
                        >
                          <ShieldQuestion className='w-4 h-4 mr-2' />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(member.id, MemberRole.GUEST)}
                            >
                              <Shield className='w-4 h-4 mr-2' />
                              Guest
                              {member.role === MemberRole.GUEST ? (
                                <Check className='w-4 h-4 ml-auto text-green-500' />
                              ) : null}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => onRoleChange(member.id, MemberRole.MODERATOR)}
                            >
                              <Shield className='w-4 h-4 mr-2' />
                              Moderator
                              {member.role === MemberRole.MODERATOR ? (
                                <Check className='w-4 h-4 ml-auto text-green-500' />
                              ) : null}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Gavel className='w-4 h-4 mr-2' />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : null}
              {loadingId === member.id ? (
                <Loader2 className='w-4 h-4 ml-auto animate-spin text-zinc-500' />
              ) : null}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;