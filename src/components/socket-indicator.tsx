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
        variant='outline'
        className='bg-yellow-600 text-white border-none'
      >
        Fallback: Polling every 1s
      </Badge>
    );
  }

  return (
    <Badge
      variant='outline'
      className='bg-emerald-600 text-white border-none'
    >
      Live: Real-time updates
    </Badge>
  );
};

export default SocketIndicator;