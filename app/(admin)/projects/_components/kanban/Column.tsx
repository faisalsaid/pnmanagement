import TaskCard from './TaskCard';
import { KanbanColumn } from '../../project.type';
import { assignTaskToColumn } from '@/actions/projecActions';
import { useProjectDetails } from '../../[id]/context/ProjectDetailContex';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDroppable } from '@dnd-kit/core';

type Props = {
  column: KanbanColumn;
};

export default function Column({ column }: Props) {
  const router = useRouter();
  const { projectDetail } = useProjectDetails();
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil semua task yang belum ada di kolom mana pun
  const allTask = projectDetail.goals.flatMap((goal) => goal.tasks);
  const unassignedTasks = allTask.filter((task) => !task.columnId);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      columnId: column.id,
    },
  });

  const handleAddExistingTask = async () => {
    if (!selectedTaskId) return;

    setIsSubmitting(true);
    await assignTaskToColumn(selectedTaskId, column.id);
    setIsSubmitting(false);
    // location.reload(); // bisa diganti dengan update state agar tidak reload
    router.refresh();
  };

  return (
    <div
      ref={setNodeRef}
      className={`rounded p-4 min-w-[300px] transition ${
        isOver ? 'bg-blue-50' : 'bg-white'
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold">{column.name}</h2>
      </div>

      {/* Dropdown + Button */}
      <div className="mb-2 flex gap-2">
        <select
          className="border px-2 py-1 rounded text-sm w-full"
          value={selectedTaskId}
          onChange={(e) => setSelectedTaskId(e.target.value)}
        >
          <option value="">-- Pilih Task --</option>
          {unassignedTasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddExistingTask}
          disabled={!selectedTaskId || isSubmitting}
          className="text-sm px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Tambah
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {column.tasks.map((task) => (
          <TaskCard task={task} />
        ))}
      </div>
    </div>
  );
}
