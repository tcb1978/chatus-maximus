import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params: { serverId } }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!serverId) {
      return new NextResponse('Server ID Not Found', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id, // Ensure the server belongs to the current user
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(server);

  } catch (error) {
    console.log('[SERVERS_ID_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {

  }
}