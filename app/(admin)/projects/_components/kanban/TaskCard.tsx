'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../project.type';

type Props = {
  task: Task;
  // columnId: string;
};

export default function TaskCard({ task }: Props) {
  console.log('TASK CARD', task);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
      data: {
        type: 'task',
        columnId: task.columnId, // ini penting agar tahu kolom asal
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-100 p-2 rounded cursor-move"
    >
      {task.title}
    </div>
  );
}
