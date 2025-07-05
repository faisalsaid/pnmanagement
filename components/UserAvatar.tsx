'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { transformNameToInitials } from '@/lib/helper/formatAvatarName';

type User = {
  id: string;
  name: string | null;
  image: string | null;
};

interface Props {
  user: User;
  size?: number;
}

const UserAvatar = ({ user, size = 24 }: Props) => {
  return (
    <Avatar
      style={{ width: size, height: size }}
      className={`transition-all duration-500 ease-in-out`}
    >
      <AvatarImage src={user.image || undefined} alt="user image" />
      <AvatarFallback>{transformNameToInitials(user.name)}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
