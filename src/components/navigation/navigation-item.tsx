'use client';

import type { FC } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import ActionTooltip from '@/components/action-tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavigationItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

const NavigationItem: FC<NavigationItemProps> = ({
  id,
  name,
  imageUrl,
}): JSX.Element => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <ActionTooltip
      label={name}
      side='right'
      align='center'
    >
      <button
        onClick={onClick}
        className={cn(
          'group flex items-center relative',
        )}
      >
        <div className={cn(
          'absolute left-0 bg-primary rounded-r-full transition-all w-[4px]',
          params?.serverId !== id && 'group-hover:h-[20px]',
          params?.serverId === id ? 'h-[36px]' : 'h-[4px]',
        )} />
        <div className={cn(
          'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
          params?.serverId === id && 'bg-primary/10 text-primary rounded-[16px]',
        )}>
          <Avatar>
            <AvatarImage src={imageUrl} alt='Channel' />
            <AvatarFallback>
              {name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;