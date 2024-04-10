import { currentProfile } from '@/lib/current-profile';
import { redirect } from 'next/navigation';
import type { FC } from 'react';
import { db } from '@/lib/db';
import NavigationAction from './navigation-action';

interface NavigationSidebarProps {

}

const NavigationSidebar: FC<NavigationSidebarProps> = async ({ }): Promise<JSX.Element> => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect('/');
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        }
      }
    }
  });


  return (
    <div className='space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22]'>
      <NavigationAction />
    </div>
  );
};

export default NavigationSidebar;