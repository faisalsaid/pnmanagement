'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectKanbanBoard from './ProjectKanbanBoard';
import ProjectOverview from './ProjectOverview';
import { Prisma } from '@prisma/client';
import { ProjectCurentUser } from './ProjectTeamLists';

export type GoalsItemWithProgress = Prisma.GoalGetPayload<true> & {
  progress: number;
};

export type UserMemberProject = Prisma.TeamMemberGetPayload<{
  select: {
    user: {
      select: {
        id: true;
        email: true;
        role: true;
        image: true;
        name: true;
      };
    };
    role: true;
  };
}>;

interface Props {
  goals: GoalsItemWithProgress[];
  projectId: string;
  projectMembers: UserMemberProject[];
  currentUser: ProjectCurentUser;
}

const ProjectTab = ({
  goals,
  projectId,
  projectMembers,
  currentUser,
}: Props) => {
  return (
    <div>
      <Tabs defaultValue="overview">
        <TabsList className="">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="calender">Calender</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <ProjectOverview
            goals={goals}
            projectId={projectId}
            projectMember={projectMembers}
            currentUser={currentUser}
          />
        </TabsContent>
        <TabsContent value="board">
          <ProjectKanbanBoard />
        </TabsContent>
        <TabsContent value="calender">Calender</TabsContent>
        <TabsContent value="files">Files</TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectTab;
