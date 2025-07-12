import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { GripVertical } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import { TaskWithSortingId } from './Kanbanboard';
import { Badge } from '@/components/ui/badge';
import { getWorkDuration } from '@/lib/helper/GetWorkDuration';
import UserAvatar from '@/components/UserAvatar';
import { useProjectDetails } from '../../[id]/context/ProjectDetailContex';

interface TaskListProp {
  tasklist: TaskWithSortingId[];
  activeTaskId: string | null;
}

const TasksList = ({ tasklist, activeTaskId }: TaskListProp) => {
  return (
    <SortableContext
      items={tasklist.map((task) => 'task-' + task.id)}
      strategy={verticalListSortingStrategy}
    >
      <div className="space-y-2">
        {tasklist.length === 0 ? (
          <div className="border border-dashed rounded p-2 text-center text-gray-400 h-32 flex items-center justify-center">
            Drop here
          </div>
        ) : (
          tasklist.map((task) => (
            <TaskItemCard
              key={task.id}
              task={task}
              activeTaskId={activeTaskId}
            />
          ))
        )}
      </div>
    </SortableContext>
  );
};

export default TasksList;

interface TaskListProps {
  task: TaskWithSortingId;
  isDragging?: boolean;
  isOverlay?: boolean;
  activeTaskId?: string | null;
}

export const TaskItemCard = ({
  task,
  isOverlay = false,
  activeTaskId,
}: TaskListProps) => {
  const { currentProjectMember } = useProjectDetails();
  const { sortingId } = task;

  const dragable =
    currentProjectMember.hasCrudAccess ||
    currentProjectMember.id === task.assignedToId;

  console.log(dragable);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: sortingId });

  const style = {
    transition,
    opacity: activeTaskId === sortingId ? 0.4 : 1,
    transform: CSS.Transform.toString(transform),
    cursor: isOverlay ? 'grabbing' : undefined,
  };
  return (
    <div
      ref={setNodeRef}
      className=" border p-4 rounded-sm bg-background space-y-4"
      style={style}
    >
      <div className="flex items-center gap-2">
        <input type="checkbox" />
        <Badge>{task.priority}</Badge>
        <p className="text-xs">{task.status}</p>
        {dragable ? (
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab p-1 active:cursor-grabbing ml-auto"
            aria-label="Drag Task"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      <div className="space-y-2">
        <p className="text-xs">
          Due date : {getWorkDuration(task.createdAt, task.dueDate)}
        </p>
        <div className=" font-semibold">{task.title}</div>
        <div className="bg-muted p-2 rounded-sm text-xs italic text-muted-foreground">
          {task.description ? task.description : 'No descreption'}
        </div>

        <div className="flex gap-2 items-center">
          <UserAvatar
            user={{
              id: task.assignedTo?.id as string,
              image: task.assignedTo?.image as string,
              name: task.assignedTo?.name as string,
            }}
          />
          <div className="flex gap-1 items-baseline">
            <p className="text-sm">{task.assignedTo?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
