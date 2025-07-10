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

    const oldIndex = columns.findIndex((c) => c.id === active.id);
    const newIndex = columns.findIndex((c) => c.id === over.id);

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
