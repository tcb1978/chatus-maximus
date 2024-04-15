import { Menu, Server } from 'lucide-react';
import type { FC } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import NavigationSidebar from '@/components/navigation/navigation-sidebar';
import ServerSidebar from '@/components/server/server-sidebar';

interface MobileToggleProps {
  serverId: string;
}

const MobileToggle: FC<MobileToggleProps> = ({
  serverId,
}): JSX.Element => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant={'ghost'}
          size='icon'
          className='md:hidden'
        >
          <Menu className='md:hidden' />
        </Button>
      </SheetTrigger>
      <SheetContent
        side='left'
        className='p-0 flex gap-0'
      >
        <div className='w-[72px]'>
          <NavigationSidebar />
          <ServerSidebar serverId={serverId} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;