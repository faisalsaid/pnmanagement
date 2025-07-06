'use client';

import { createContext, useContext } from 'react';
import { Prisma, MemberRole, Role } from '@prisma/client';

type ProjectDetailBase = Prisma.ProjectGetPayload<{
  include: {
    members: {
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
    };
    createdBy: {
      select: {
        id: true;
        email: true;
        role: true;
        image: true;
        name: true;
      };
    };
    goals: {
      include: {
        tasks: true;
      };
    };
  };
}>;

// custom getPojectPaylod add progress: number
type GoalWithProgress = ProjectDetailBase['goals'][number] & {
  progress: number;
};

export type ProjectDetailProps = Omit<ProjectDetailBase, 'goals'> & {
  goals: GoalWithProgress[];
};

export type CurrentProjectMember = {
  id: string | undefined;
  name: string | null | undefined;
  email: string | null | undefined;
  role: string | undefined;
  image: string | null | undefined;
  isMember: boolean;
  memberRole: MemberRole | undefined;
  hasCrudAccess: boolean;
};

type ProjectContextValue = {
  projectDetail: ProjectDetailProps;
  currentProjectMember: CurrentProjectMember;
};

const ProjectContext = createContext<ProjectContextValue | null>(null);

interface Props {
  projectDetail: ProjectDetailProps;
  currentProjectMember: CurrentProjectMember;
  children: React.ReactNode;
}

export const ProjectDetailProvider = ({
  projectDetail,
  currentProjectMember,
  children,
}: Props) => {
  return (
    <ProjectContext.Provider value={{ projectDetail, currentProjectMember }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectDetails = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
