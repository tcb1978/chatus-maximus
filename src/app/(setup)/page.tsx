import type { FC } from 'react';
import { redirect } from 'next/navigation';
import { initialProfile } from '@/lib/initial-profile';
import { db } from '@/lib/db';

interface SetupPageProps {

}

const SetupPage: FC<SetupPageProps> = async ({ }): Promise<JSX.Element> => {
  const profile = await initialProfile();
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile?.id,
        }
      }
    }
  });

  if (server) {
    redirect(`/servers/${server.id}`);
  }

  return (<div>Create a Server</div>);
};

export default SetupPage;