'use client';

import UserAvatar from '@/components/UserAvatar';
import { MemberRole, Role } from '@prisma/client';
import { Plus } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AddProjectMembersForm from './AddProjectMembersForm';
import { useState } from 'react';
import { toast } from 'sonner';

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
  projectId: string;
  creatorId: string;
  ownerId: string;
};

const ProjectTeamLists = ({
  members,
  creatorId,
  ownerId,
  projectId,
}: Props) => {
  // console.log('MEMBERS', members);

  const [open, setOpen] = useState(false);
  const memeberId = members?.map((member) => member.user.id) ?? [];

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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-1 text-xs border rounded-sm px-2 py-1 bg-background shadow hover:bg-muted hover:cursor-pointer">
              <Plus size={12} /> <span>Invite</span>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invate some user to be project members</DialogTitle>
            </DialogHeader>
            <AddProjectMembersForm
              projectId={projectId}
              excludedUserIds={[creatorId, ownerId]}
              existingMemberIds={memeberId}
              open={open}
              onSuccess={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProjectTeamLists;
