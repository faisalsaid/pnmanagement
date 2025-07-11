import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { GripVertical } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import { TaskWithSortingId } from './kanbanboard';

interface TaskListProp {
  tasklist: TaskWithSortingId[];
}

const TasksList = ({ tasklist }: TaskListProp) => {
  return (
    <SortableContext
      items={tasklist.map((task) => 'task-' + task.id)}
      strategy={verticalListSortingStrategy}
    >
      <div className="space-y-2">
        {tasklist.length === 0 ? (
          <div className="border border-dashed rounded p-2 text-center text-gray-400">
            Drop here
          </div>
        ) : (
          tasklist.map((task) => <TaskItemCard key={task.id} task={task} />)
        )}
      </div>
    </SortableContext>
  );
};

export default TasksList;

interface TaskListProps {
  task: TaskWithSortingId;
  isOverlay?: boolean;
  activeTaskId?: number | null;
}

export const TaskItemCard = ({
  task,
  isOverlay = false,
  activeTaskId,
}: TaskListProps) => {
  const { sortingId, title } = task;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: sortingId });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div
      ref={setNodeRef}
      className="flex items-center gap-2 border p-2 rounded-sm bg-background "
      style={style}
    >
      <input type="checkbox" />

      <div className="line-clamp-1">{title}</div>

      <button
        {...attributes}
        {...listeners}
        className="cursor-grab p-1 active:cursor-grabbing ml-auto"
        aria-label="Drag Task"
      >
        <GripVertical className="w-4 h-4" />
      </button>
    </div>
  );
};
