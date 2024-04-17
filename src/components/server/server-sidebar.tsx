import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ChannelType, MemberRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import type { FC } from 'react';
import ServerHeader from './server-header';
import { ScrollArea } from '@/components/ui/scroll-area';
import ServerSearch from './server-search';
import { Hash, Mic, Radio, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Separator } from '../ui/separator';
import ServerSection from './server-section';
import ServerChannel from './server-channel';
import ServerMember from './server-member';

interface ServerSidebarProps {
  serverId: string;
}

export enum ChannelEnum {
  CHANNEL = 'channel',
  CHANNELID = 'channelId',
  CONVERSATION = 'conversation',
  CONVERSATIONID = 'conversationId',
  MEMBER = 'member',
  TEXT = 'Text Channel',
  VOICE = 'Voice Channel',
  AUDIO = 'Audio Channel',
  MEMBERS = 'Members',
}

export enum SectionEnum {
  CHANNELS = 'channels',
  MEMBERS = 'members',
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className='mr-2 h4 -w-4' />,
  [ChannelType.VOICE]: <Mic className='mr-2 h4 -w-4' />,
  [ChannelType.AUDIO]: <Radio className='mr-2 h4 -w-4' />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className='mr-2 h4 -w-4 text-indigo-500' />,
  [MemberRole.ADMIN]: <ShieldAlert className='mr-2 h4 -w-4 text-rose-500' />,
};

const ServerSidebar: FC<ServerSidebarProps> = async ({
  serverId,
}): Promise<JSX.Element> => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect('/');
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc'
        }
      },
      members: {
        include: {
          profile: true
        },
        orderBy: {
          role: 'asc'
        }
      }
    }
  });

  const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);

  const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);

  const voiceChannels = server?.channels.filter((channel) => channel.type === ChannelType.VOICE);

  const members = server?.members.filter((member) => member.profileId !== profile.id);

  if (!server) {
    return redirect('/');
  }

  const role = server.members.find((member) => member.profileId === profile.id)?.role ?? MemberRole.GUEST;


  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#F2F3F5]'>
      <ServerHeader
        role={role}
        server={server}
      />
      <ScrollArea className='flex-1 px-3'>
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: ChannelEnum.TEXT,
                type: ChannelEnum.CHANNEL,
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: ChannelEnum.AUDIO,
                type: ChannelEnum.CHANNEL,
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: ChannelEnum.VOICE,
                type: ChannelEnum.CHANNEL,
                data: voiceChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: ChannelEnum.MEMBERS,
                type: ChannelEnum.MEMBER,
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role]
                }))
              }
            ]}
          />
        </div>
        <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md-my-2' />
        {!!textChannels?.length ? (
          <div className='mb-2'>
            <ServerSection
              channelType={ChannelType.TEXT}
              label={ChannelEnum.TEXT}
              role={role}
              sectionType={SectionEnum.CHANNELS}
            />
            {textChannels.map((channel) => (
              <div key={channel.id} className='space-y-[2px]'>
                <ServerChannel
                  channel={channel}
                  role={role}
                  server={server}
                />
              </div>
            ))}
          </div>
        ) : (null)}

        {!!audioChannels?.length ? (
          <div className='mb-2'>
            <ServerSection
              channelType={ChannelType.AUDIO}
              label={ChannelEnum.AUDIO}
              role={role}
              sectionType={SectionEnum.CHANNELS}
            />
            {audioChannels.map((channel) => (
              <div key={channel.id} className='space-y-[2px]'>
                <ServerChannel
                  channel={channel}
                  role={role}
                  server={server}
                />
              </div>
            ))}
          </div>
        ) : (null)}

        {!!voiceChannels?.length ? (
          <div className='mb-2'>
            <ServerSection
              channelType={ChannelType.VOICE}
              label={ChannelEnum.VOICE}
              role={role}
              sectionType={SectionEnum.CHANNELS}
            />
            {voiceChannels.map((channel) => (
              <div key={channel.id} className='space-y-[2px]'>
                <ServerChannel
                  channel={channel}
                  role={role}
                  server={server}
                />
              </div>
            ))}
          </div>
        ) : (null)}

        {!!members?.length ? (
          <div className='mb-2'>
            <ServerSection
              label={ChannelEnum.MEMBERS}
              role={role}
              sectionType={SectionEnum.MEMBERS}
              server={server}
            />
            {members.map((member) => (
              <div key={member.id} className='space-y-[2px]'>
                <ServerMember
                  member={member}
                  server={server}
                />
              </div>
            ))}
          </div>
        ) : (null)}


      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;