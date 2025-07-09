import { TaskSample } from './page';

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Task from './Task';

const Column = ({ tasks }: { tasks: TaskSample[] }) => {
  return (
    <div className="bg-muted p-4 rounded-lg space-y-3">
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </SortableContext>
    </div>
  );
};

export default Column;
