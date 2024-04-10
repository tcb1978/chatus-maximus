import type { FC } from 'react';
import { redirect } from 'next/navigation';
import { initialProfile } from '@/lib/initial-profile';
import { db } from '@/lib/db';
import InitialModal from '@/components/modal/InitialModal';

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

  return (
    <InitialModal />
  );
};

export default SetupPage;