import ServerSidebar from '@/components/server/server-sidebar';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import type { FC } from 'react';

interface ServerIdLayoutProps {
  children: React.ReactNode;
  params: {
    serverId: string;
  };
}

const ServerIdLayout: FC<ServerIdLayoutProps> = async ({
  children,
  params: { serverId },
}): Promise<JSX.Element> => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      }
    },
  });

  if (!server) {
    return redirect('/');
  }

  return (
    <div className='h-full'>
      <div className='THISHERENOW hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0'>
        <ServerSidebar serverId={serverId} />
      </div>
      <main className='h-full md:pl-60'>
        {children}
      </main>
    </div>
  );
};

export default ServerIdLayout;