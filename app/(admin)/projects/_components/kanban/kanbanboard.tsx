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
import { KanbanColumn, Task } from '../../project.type'; // kamu bisa sesuaikan tipe datanya
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

    const taskId = active.id;
    const targetColumnId = over.data.current?.columnId;

    if (!targetColumnId) return;

    // Lakukan update columnId via server action
    await updateTaskColumn(taskId, targetColumnId);

    // Pindahkan task ke column baru di local state
    setColumns((prev) => {
      const updated = [...prev];

      // hapus dari kolom lama
      for (let col of updated) {
        col.tasks = col.tasks.filter((t) => t.id !== taskId);
      }

      // cari task
      const movedTask = initialColumns
        .flatMap((c) => c.tasks)
        .find((t) => t.id === taskId);

      if (!movedTask) return prev;

      // tambahkan ke kolom baru
      const newCol = updated.find((c) => c.id === targetColumnId);
      if (newCol) {
        newCol.tasks.push({ ...movedTask, columnId: targetColumnId });
      }

      return [...updated];
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
