import type { FC } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  src?: string;
  className?: string;
  alt?: string;
}

const UserAvatar: FC<UserAvatarProps> = ({
  src,
  className,
  alt,
}): JSX.Element => {
  return (
    <Avatar className={cn(
      'w-7 h-7 md:h-10 md:w-10',
      className
    )}>
      <AvatarImage
        alt={alt}
        className='rounded-full'
        src={src}
      />
    </Avatar>
  );
};

export default UserAvatar;