import { CSS } from '@dnd-kit/utilities';
import { KanbanColumn } from '../../project.type';
import {
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { GripVertical } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import TasksList from './TaskList';
import { KanbanColumnWithSortingId } from './kanbanboard';

interface ColumsProps {
  columns: KanbanColumnWithSortingId[];
  activeTaskId: string | null;
}
const Columns = ({ columns, activeTaskId }: ColumsProps) => {
  return (
    <div className="bg-muted p-4 rounded-md flex gap-4 items-start overflow-auto w-full">
      <SortableContext
        items={columns.map((col) => 'column-' + col.id)}
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

export default Columns;

// COLUMNS CARD

interface Columcard {
  column: KanbanColumnWithSortingId;
  activeTaskId: string | null;
}

const ColumnCard = ({ column, activeTaskId }: Columcard) => {
  const { sortingId, name, tasks } = column;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: sortingId });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-full min-h-3 border-2 rounded-sm p-2 bg-slate-50 space-y-4"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">{name}</div>
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab p-1 active:cursor-grabbing"
          aria-label="Drag column"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </div>
      <Separator />
      <TasksList tasklist={tasks} activeTaskId={activeTaskId} />
    </div>
  );
};
