'use client';

import UserAvatar from '@/components/UserAvatar';
import { MemberRole, Role } from '@prisma/client';
import { Plus } from 'lucide-react';

type MemberItem = {
  role: MemberRole;
  user: {
    id: string;
    email: string;
    role: Role;
    image: string | null;
    name: string | null;
  };
};

type Props = {
  members?: MemberItem[];
};

const ProjectTeamLists = ({ members }: Props) => {
  // console.log('MEMBERS', members);

  return (
    <div className="flex items-center gap-2 w-fit ml-auto sm:ml-0 ">
      <div className="*:data-[slot=avatar]:ring-background flex hover:space-x-0.5 -space-x-2 *:data-[slot=avatar]:ring-2 ">
        {members?.map((member) => {
          const user = {
            id: member.user.id,
            name: member.user.name,
            image: member.user.image,
          };
          return <UserAvatar key={member.user.id} user={user} />;
        })}
      </div>
      <div>
        <button className="flex items-center gap-1 text-xs border rounded-sm px-2 py-1 bg-background shadow hover:bg-muted hover:cursor-pointer">
          <Plus size={12} /> <span>Invite</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectTeamLists;
