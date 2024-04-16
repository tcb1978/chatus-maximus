'use client';

import type { FC } from 'react';
import { useSocket } from '@/components/providers/socket-provider';
import { Badge } from '@/components/ui/badge';

interface SocketIndicatorProps {

}

const SocketIndicator: FC<SocketIndicatorProps> = ({ }): JSX.Element => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge
        className='bg-yellow-600 text-white border-none'
        variant='outline'
      >
        Fallback: Polling every 1s
      </Badge>
    );
  }

  return (
    <Badge
      className='bg-emerald-600 text-white border-none'
      variant='outline'
    >
      Live: Real-time updates
    </Badge>
  );
};

export default SocketIndicator;