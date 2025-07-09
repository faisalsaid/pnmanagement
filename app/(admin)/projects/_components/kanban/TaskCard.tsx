'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../project.type';

type Props = {
  task: Task;
  columnId: string;
};

export default function TaskCard({ task, columnId }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
      data: { columnId },
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
      className="p-3 bg-gray-100 rounded shadow"
    >
      <p className="text-sm font-semibold">{task.title}</p>
    </div>
  );
}
