'use client';

import type { FC } from 'react';
import { Plus } from 'lucide-react';
import ActionTooltip from '@/components/action-tooltip';
import { ModalEnum, useModal } from '@/hooks/use-modal-store';

interface NavigationActionProps {

}

const NavigationAction: FC<NavigationActionProps> = ({ }) => {
  const { onOpen } = useModal();

  return (
    <div className='pt-4'>
      <ActionTooltip
        align='center'
        label='Create Server'
        side='left'
      >
        <button className='group flex items-center' onClick={() => onOpen(ModalEnum.CreateServer)}>
          <div className='flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500'>
            <Plus className='group-hover:text-white transition text-emerald-500 group-hover:animate-pulse' size={25} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationAction;