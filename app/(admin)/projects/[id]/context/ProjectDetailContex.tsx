'use client';

import { createContext, useContext } from 'react';
import { MemberRole } from '@prisma/client';
import { ProjectDetail } from '../../project.type';

// custom getPojectPaylod add progress: number
type GoalWithProgress = ProjectDetail['goals'][number] & {
  progress: number;
};

export type ProjectDetailProps = Omit<ProjectDetail, 'goals'> & {
  goals: GoalWithProgress[];
};

export type CurrentProjectMember = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  image: string | null;
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
