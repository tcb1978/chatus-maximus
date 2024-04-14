'use client';

import { Search } from 'lucide-react';
import { type FC } from 'react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import useCommandK from '@/hooks/use-command-k';
import { useParams, useRouter } from 'next/navigation';
import { ChannelEnum } from './server-sidebar';

interface ServerSearchProps {
  data: {
    label: string;
    type: 'channel' | 'member',
    data: {
      icon: React.ReactNode;
      name: string;
      id: string;
    }[] | undefined;
  }[];
}

const ServerSearch: FC<ServerSearchProps> = ({
  data,
}): JSX.Element => {
  const [open, setOpen] = useCommandK();
  const router = useRouter();
  const params = useParams();

  const handleClick = ({ id, type }: { id: string, type: ChannelEnum.CHANNEL | ChannelEnum.MEMBER; }) => {
    setOpen(false);

    if (type === ChannelEnum.MEMBER) {
      return router.push(`/servers/${params?.serverId}/conversations/${id}`);
    }

    if (type === ChannelEnum.CHANNEL) {
      return router.push(`/servers/${params?.serverId}/channels/${id}`);
    }
  };

  return (
    <>
      <button
        className='group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'
        onClick={() => setOpen(true)}
      >
        <Search className='w-4 h-4 text-zinc-500 dark:text-zinc-500' />
        <p className='font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition'>
          Search
        </p>
        <kbd
          className='pointer-events-none inline-flex h-5 select-none itmes-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-forground ml-auto'
        >
          <span className='tesxt-xs'>⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Search all channels and members' />
        <CommandList>
          <CommandEmpty>
            No results found
          </CommandEmpty>
          {data.map(({ label, type, data }) => {
            if (!data?.length) return null;

            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ icon, name, id }) => {
                  return (
                    <CommandItem
                      onSelect={() => handleClick({ id, type: type === 'channel' ? ChannelEnum.CHANNEL : ChannelEnum.MEMBER })}
                      key={id}
                    >
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;