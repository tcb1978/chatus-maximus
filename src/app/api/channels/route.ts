import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Profile is required", { status: 401 });
    }

    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Server ID is required", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse('Channel name cannot be "general"', {
        status: 400,
      });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!type) {
      return new NextResponse("Type is required", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        channels: {
          create: {
            name,
            type,
            profileId: profile.id,
          },
        },
      },
    });

    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(server), { status: 200 });

  } catch (error) {
    console.log("[CHANNELS_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
