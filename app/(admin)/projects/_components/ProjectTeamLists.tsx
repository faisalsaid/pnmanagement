'use client';

import { useState } from 'react';
import { useProjectDetails } from '../[id]/context/ProjectDetailContex';

// components
import UserAvatar from '@/components/UserAvatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AddProjectMembersForm from './AddProjectMembersForm';
import EditProjectMembers from './EditProjectMembers';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// icons
import { Settings } from 'lucide-react';

const ProjectTeamLists = () => {
  const { currentProjectMember, projectDetail } = useProjectDetails();

  const [open, setOpen] = useState(false);
  const memeberId =
    projectDetail.members?.map((member) => member.user.id) ?? [];

  const listMembers = projectDetail.members.filter(
    (member) => member.user.id !== currentProjectMember.user.id,
  );

  return (
    <div className="flex items-center gap-2 w-fit ml-auto sm:ml-0 ">
      <div className="*:data-[slot=avatar]:ring-background flex hover:space-x-0.5 -space-x-2 *:data-[slot=avatar]:ring-2 ">
        {projectDetail.members?.map((member) => {
          const user = {
            id: member.user.id,
            name: member.user.name,
            image: member.user.image,
          };
          return (
            <Tooltip key={member.user.id}>
              <TooltipTrigger
                className={`transition-all duration-500 ease-in-out`}
              >
                <UserAvatar user={user} />
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
        {currentProjectMember.permission && (
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
                      projectId={projectDetail.id}
                      excludedUserIds={[projectDetail.createdById]}
                      existingMemberIds={memeberId}
                      open={open}
                      onSuccess={() => setOpen(false)}
                    />
                  </TabsContent>
                  <TabsContent value="manage">
                    {projectDetail.members &&
                    projectDetail.members.length > 0 ? (
                      <EditProjectMembers
                        members={listMembers}
                        projectId={projectDetail.id}
                        creatorId={projectDetail.id}
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
