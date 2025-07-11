'use client';

import {
  CurrentProjectMember,
  ProjectDetailProvider,
  ProjectDetailProps,
} from '../[id]/context/ProjectDetailContex';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  projectDetail: ProjectDetailProps;
  currentProjectMember: CurrentProjectMember;
};

const WraperProjectDetailContext = ({
  children,
  projectDetail,
  currentProjectMember,
}: Props) => {
  return (
    <ProjectDetailProvider
      projectDetail={projectDetail}
      currentProjectMember={currentProjectMember}
    >
      {children}
    </ProjectDetailProvider>
  );
};

export default WraperProjectDetailContext;
