'use client';

import { useProjectDetails } from '../[id]/context/ProjectDetailContex';
import KanbanBoard from './kanban/kanbanboard';
import { AddColumn } from './kanban/AddColumnKanban';
import { KanbanColumn } from '../project.type';

const columns = [
  { title: 'Baclog', taskItem: 2 },
  { title: 'Process', taskItem: 1 },
  { title: 'Review', taskItem: 2 },
  { title: 'Done', taskItem: 4 },
];

function addSortingId(data: KanbanColumn[]) {
  return data.map((column) => {
    // Tambahkan sortingId ke column
    const modifiedColumn = {
      ...column,
      sortingId: `column-${column.id}`,
      tasks: column.tasks.map((task) => ({
        ...task,
        sortingId: `task-${task.id}`,
      })),
    };
    return modifiedColumn;
  });
}

const ProjectKanbanBoard = () => {
  const { projectDetail } = useProjectDetails();

  const allColum = addSortingId(projectDetail.kanbanColumns);

  return (
    <div>
      <KanbanBoard initialColumns={allColum} />
    </div>
  );
};

export default ProjectKanbanBoard;

// enum Priority {
//   P0 = 'PO',
//   P1 = 'P1',
//   P2 = 'P2',
//   P3 = 'P3',
// }
