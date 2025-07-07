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

  //get all tasks count to triger task table
  const taskCount = projectDetail.goals.flatMap((goal) => goal.tasks).length;
  // console.log(taskCount);

  useEffect(() => {
    const fetchTask = async () => {
      const result = await getTasksByProjectId(projectDetail.id);
      setTasks(result);
    };

    fetchTask();
  }, [projectDetail.id, taskCount]);

  // console.log(tasks);

  return (
    <div className="mx-auto rounded-xl overflow-hidden mt-2">
      {tasks ? (
        <DataTable columns={TaskColumns} data={tasks} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default AllTaskByProject;
