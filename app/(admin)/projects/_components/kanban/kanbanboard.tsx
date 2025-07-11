'use client';

import {
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import { useState } from 'react';
import Column from './Column';
import { KanbanColumn } from '../../project.type';
import { updateKanbanColumns, updateTaskColumn } from '@/actions/projecActions';

type KanbanBoardProps = {
  initialColumns: KanbanColumn[];
};

export default function KanbanBoard({ initialColumns }: KanbanBoardProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    // handle column never change
    if (!over) return;
    if (active.id === over.id) return;

    // const activeId = String(active.id);
    // const overId = String(over.id);

    const isColumn =
      typeof active.id === 'string' && active.id.startsWith('column-');

    console.log(isColumn);

    if (isColumn) {
      const activeId = String(active.id).replace('column-', '');
      const overId = String(over.id).replace('column-', '');

      const oldIndex = columns.findIndex((col) => col.id === activeId);
      const newIndex = columns.findIndex((col) => col.id === overId);
      if (oldIndex === -1 || newIndex === -1) return;

      const newColumns = arrayMove(columns, oldIndex, newIndex).map(
        (col, index) => ({
          ...col,
          order: index,
        }),
      );

      // ⏩ Update column ui
      setColumns(newColumns);

      const updateColumOrder = newColumns.map((col) => ({
        id: col.id,
        order: col.order,
      }));

      await updateKanbanColumns(updateColumOrder);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(event) => {
        // if (typeof event.active.id === 'number') {
        //   setActiveTaskId(event.active.id);
        // }
      }}
      onDragEnd={(event) => {
        handleDragEnd(event);
      }}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 w-full">
        <Column columns={columns} />
        {/* {columns.map((col) => (
          <SortableContext
            key={col.id}
            items={col.tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <Column column={col} />
          </SortableContext>
        ))} */}
      </div>
    </DndContext>
  );
}
