'use client';

import { useEffect } from 'react';
import { useProjectDetails } from '../[id]/context/ProjectDetailContex';

const AllTaskByProject = () => {
  // get project detail to get id
  const { projectDetail } = useProjectDetails();

  //   fetch all task

  useEffect(() => {
    console.log(projectDetail.id);
  }, [projectDetail.id]);
  return <div>AllTaskByProject</div>;
};

export default AllTaskByProject;
