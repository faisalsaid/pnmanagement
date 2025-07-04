'use client';

import UserAvatar from '@/components/UserAvatar';
import { MemberRole, Role } from '@prisma/client';
import { Settings } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  Dialog,
  DialogContent,
  // DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AddProjectMembersForm from './AddProjectMembersForm';
import { useState } from 'react';
// import { toast } from 'sonner';
import EditProjectMembers from './EditProjectMembers';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

export type ProjectCurentUser = {
  permission: boolean;
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
  currentUser: ProjectCurentUser;
};

const ProjectTeamLists = ({
  members,
  creatorId,
  projectId,
  currentUser,
}: Props) => {
  // console.log('MEMBERS', members);

  // console.log(members);

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
          return (
            <Tooltip>
              <TooltipTrigger>
                <UserAvatar key={member.user.id} user={user} />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {member.role} | {member.user.name}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      <div>
        {currentUser.permission && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1 text-xs border rounded-sm px-2 py-1 bg-background shadow hover:bg-muted hover:cursor-pointer">
                <Settings size={12} /> <span>Manage</span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage project member</DialogTitle>
              </DialogHeader>
              <div className="max-h-[75svh]">
                <Tabs defaultValue="add" className="">
                  <TabsList className="w-full">
                    <TabsTrigger value="add">Add</TabsTrigger>
                    <TabsTrigger value="manage">Manage</TabsTrigger>
                  </TabsList>
                  <TabsContent value="add">
                    <AddProjectMembersForm
                      projectId={projectId}
                      excludedUserIds={[creatorId]}
                      existingMemberIds={memeberId}
                      open={open}
                      onSuccess={() => setOpen(false)}
                    />
                  </TabsContent>
                  <TabsContent value="manage">
                    {members && members.length > 0 ? (
                      <EditProjectMembers
                        members={members}
                        projectId={projectId}
                        creatorId={creatorId}
                      />
                    ) : (
                      <div>Empty member</div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ProjectTeamLists;
