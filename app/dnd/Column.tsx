import { ColumnsSampleProps } from './page';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';

import { GripVertical } from 'lucide-react';

import TaskSampleList from './TaskSampleList';

interface ColumnProps {
  columns: ColumnsSampleProps[];
  activeTaskId: number | null;
}

const Column = ({ columns, activeTaskId }: ColumnProps) => {
  return (
    <div className="bg-muted p-4 rounded-lg flex gap-4 items-start overflow-auto">
      <SortableContext
        items={columns.map((col) => col.id)}
        strategy={horizontalListSortingStrategy}
      >
        {columns.map((column) => (
          <ColumnCard
            key={column.id}
            column={column}
            activeTaskId={activeTaskId}
          />
        ))}
      </SortableContext>
    </div>
  );
};

export default Column;

interface Columcard {
  column: ColumnsSampleProps;
  activeTaskId: number | null;
}

const ColumnCard = ({ column, activeTaskId }: Columcard) => {
  const { id, title, tasks } = column;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-44 min-h-3 border-2 rounded-sm p-2 bg-slate-50"
    >
      {/* Drag Handle */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">{title}</div>
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab p-1 active:cursor-grabbing"
          aria-label="Drag column"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Task List */}
      <TaskSampleList taskslist={tasks} activeTaskId={activeTaskId} />
    </div>
  );
};
