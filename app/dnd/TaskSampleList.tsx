import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TaskSample } from './page';
import { CSS } from '@dnd-kit/utilities';

import { GripVertical } from 'lucide-react';

const TaskSampleList = ({
  taskslist,
  activeTaskId,
}: {
  taskslist: TaskSample[];
  activeTaskId: number | null;
}) => {
  return (
    <SortableContext
      items={taskslist.map((task) => task.id)}
      strategy={verticalListSortingStrategy}
    >
      <div className="flex flex-col gap-1 min-h-10">
        {taskslist.length === 0 ? (
          <div className="border border-dashed rounded p-2 text-center text-gray-400">
            Drop here
          </div>
        ) : (
          taskslist.map((task) => (
            <TaskSampleCard
              activeTaskId={activeTaskId}
              key={task.id}
              task={task}
            />
          ))
        )}
      </div>
    </SortableContext>
  );
};

export default TaskSampleList;

export const TaskSampleCard = ({
  task,
  isOverlay = false,
  activeTaskId,
}: {
  task: TaskSample;
  isOverlay?: boolean;
  activeTaskId?: number | null;
}) => {
  const { id, title } = task;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    // opacity: isOverlay ? 0.8 : 1,
    opacity: activeTaskId === id ? 0.4 : 1,
    cursor: isOverlay ? 'grabbing' : undefined,
  };

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 border rounded bg-white shadow-sm"
    >
      {!isOverlay && <input type="checkbox" />}
      <p className="flex-1 text-sm">{title}</p>
      {!isOverlay && (
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab p-1 active:cursor-grabbing"
          aria-label="Drag Task"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
