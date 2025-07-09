import TaskCard from './TaskCard';
import { KanbanColumn } from '../../project.type';

type Props = {
  column: KanbanColumn;
};

export default function Column({ column }: Props) {
  return (
    <div className="min-w-[300px] bg-white border rounded-lg shadow-md p-4">
      <h2 className="font-bold text-lg mb-2">{column.name}</h2>
      <div className="flex flex-col gap-2">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} columnId={column.id} />
        ))}
      </div>
    </div>
  );
}
