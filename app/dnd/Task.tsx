import { useSortable } from '@dnd-kit/sortable';
import { TaskSample } from './page';
import { CSS } from '@dnd-kit/utilities';

const Task = ({ task }: { task: TaskSample }) => {
  const { id, title } = task;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="bg-white p-2 rounded-md flex gap-2 items-center drop-shadow-sm hover:cursor-pointer"
      style={style}
    >
      <input type="checkbox" />
      <p>{title}</p>
    </div>
  );
};

export default Task;
