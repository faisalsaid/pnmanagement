'use client';

import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { useState } from 'react';
import Column from './Column'; // Komponen untuk 1 kolom
import { KanbanColumn } from '../../project.type'; // kamu bisa sesuaikan tipe datanya
import { updateTaskColumn } from '@/actions/projecActions';

type KanbanBoardProps = {
  initialColumns: KanbanColumn[];
};

export default function KanbanBoard({ initialColumns }: KanbanBoardProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const onDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeType = active.data.current?.type;
    const taskId = active.id;
    const sourceColumnId = active.data.current?.columnId;
    const targetColumnId = over.data.current?.columnId;

    // Validasi jenis drag
    if (activeType !== 'task') return;

    if (!targetColumnId || !sourceColumnId) return;

    if (sourceColumnId !== targetColumnId) {
      await updateTaskColumn(taskId, targetColumnId);
    }

    setColumns((prev) => {
      const updated = [...prev];

      const movedTask = prev
        .flatMap((c) => c.tasks)
        .find((t) => t.id === taskId);

      if (!movedTask) return prev;

      const from = updated.find((c) => c.id === sourceColumnId);
      if (from) {
        from.tasks = from.tasks.filter((t) => t.id !== taskId);
      }

      const to = updated.find((c) => c.id === targetColumnId);
      if (to) {
        to.tasks.push({ ...movedTask, columnId: targetColumnId });
      }

      return updated;
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <SortableContext
            key={col.id}
            items={col.tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <Column column={col} />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
}
