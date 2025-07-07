'use client';

import { useProjectDetails } from '../[id]/context/ProjectDetailContex';
import { TaskColumns } from './table/TasksColumns';
import { DataTable } from './table/TasksProjectTable';
import { Prisma } from '@prisma/client';

export type TaskItem = Prisma.TaskGetPayload<{
  include: {
    goal: {
      select: {
        title: true;
      };
    };
    assignedTo: {
      include: {
        teamMemberships: {
          select: {
            role: true;
          };
        };
      };
    };
    createdBy: {
      select: {
        id: true;
        name: true;
        email: true;
        image: true;
        role: true;
      };
    };
  };
}>;

const AllTaskByProject = () => {
  const { projectDetail } = useProjectDetails();

  //get all tasks count to triger task table
  const allTasks = (projectDetail?.goals ?? [])
    .flatMap((goal) => goal.tasks)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ) as TaskItem[];

  return (
    <div className="mx-auto rounded-xl overflow-hidden mt-2">
      {allTasks ? (
        <DataTable columns={TaskColumns} data={allTasks} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default AllTaskByProject;
