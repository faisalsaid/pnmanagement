'use client';

import { useEffect, useState } from 'react';
import { useProjectDetails } from '../[id]/context/ProjectDetailContex';
import { TaskColumns } from './table/TasksColumns';
import { DataTable } from './table/TasksProjectTable';
import { getTasksByProjectId } from '@/actions/projecActions';
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
  };
}>;

const AllTaskByProject = () => {
  const { projectDetail } = useProjectDetails();
  const [tasks, setTasks] = useState<TaskItem[]>();
  useEffect(() => {
    const fetchTask = async () => {
      const result = await getTasksByProjectId(projectDetail.id);
      setTasks(result);
    };

    fetchTask();
  }, [projectDetail.id]);

  console.log(tasks);

  return (
    <div className="container mx-auto py-10">
      {tasks ? (
        <DataTable columns={TaskColumns} data={tasks} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default AllTaskByProject;
