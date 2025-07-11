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
import { TaskItemCard } from './TaskList';

export type TaskWithSortingId = KanbanColumn['tasks'][number] & {
  sortingId: string;
};

// Extend kolomnya, beserta tasks-nya yang sudah di-extend
export type KanbanColumnWithSortingId = KanbanColumn & {
  sortingId: string;
  tasks: TaskWithSortingId[];
};

type KanbanBoardProps = {
  initialColumns: KanbanColumnWithSortingId[];
};

export default function KanbanBoard({ initialColumns }: KanbanBoardProps) {
  const [columns, setColumns] =
    useState<KanbanColumnWithSortingId[]>(initialColumns);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  console.log('activeTaskId', activeTaskId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const findColumnIndexByTaskId = (taskId: string) => {
    return columns.findIndex((column) =>
      column.tasks.find((task) => 'task-' + task.id === taskId),
    );
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    // handle column never change
    if (!over) return;
    if (active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const isColumn =
      typeof active.id === 'string' && active.id.startsWith('column-');

    console.log(isColumn);

    if (isColumn) {
      // const activeId = String(active.id).replace('column-', '');
      // const overId = String(over.id).replace('column-', '');

      const oldIndex = columns.findIndex((col) => col.sortingId === activeId);
      const newIndex = columns.findIndex((col) => col.sortingId === overId);
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

    if (typeof over.id === 'string' && over.id.startsWith('column-')) {
      console.log('empty column');

      // console.log('ACTIVE ID', activeId, 'OVER ID', over.id);
      console.log(activeId);

      const sourceColIndex = findColumnIndexByTaskId(activeId);
      const destColIndex = columns.findIndex(
        (col) => col.sortingId === over.id,
      );

      console.log('sourceColIndex', sourceColIndex, destColIndex);

      if (sourceColIndex === -1 || destColIndex === -1) return;

      const sourceCol = columns[sourceColIndex];
      const destCol = columns[destColIndex];
      console.log('sourceCol', sourceCol, destCol);

      const activeTaskIndex = sourceCol.tasks.findIndex(
        (task) => 'task-' + task.id === activeId,
      );

      // console.log(sourceCol);

      const taskToMove = sourceCol.tasks[activeTaskIndex];
      console.log(taskToMove);
      console.log(destCol);

      const updatedColumns = [...columns];

      // Remove from source
      updatedColumns[sourceColIndex] = {
        ...sourceCol,
        tasks: sourceCol.tasks
          .filter((task) => `task-${task.id}` !== activeId)
          .map((task) => ({
            ...task,
            sortingId: `task-${task.id}`,
          })),
      };

      // Insert to empty column
      updatedColumns[destColIndex] = {
        ...destCol,
        tasks: [
          ...destCol.tasks,
          {
            ...taskToMove,
            sortingId: `task-${taskToMove.id}`,
          },
        ],
      };
      setColumns(updatedColumns);
      await updateTaskColumn(taskToMove.id, destCol.id);
      return;
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(event) => {
        if (
          typeof event.active.id === 'string' &&
          event.active.id.startsWith('task-')
        ) {
          setActiveTaskId(event.active.id);
        }
      }}
      onDragEnd={(event) => {
        handleDragEnd(event);
        setActiveTaskId(null); // Reset overlay
      }}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 w-full">
        <Column columns={columns} />
        <DragOverlay>
          {activeTaskId ? (
            <TaskItemCard
              // activeTaskId={activeTaskId}
              task={
                columns
                  .flatMap((col) => col.tasks)
                  .find((t) => t.sortingId === activeTaskId)!
              }
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
