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

import KanbanSettingsBar from './KanbanSettingsBar';

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
      // console.log(activeId);

      const sourceColIndex = findColumnIndexByTaskId(activeId);
      const destColIndex = columns.findIndex(
        (col) => col.sortingId === over.id,
      );

      console.log('sourceColIndex', sourceColIndex, destColIndex);

      if (sourceColIndex === -1 || destColIndex === -1) return;

      const sourceCol = columns[sourceColIndex];
      const destCol = columns[destColIndex];
      // console.log('sourceCol', sourceCol, destCol);

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

    // Drag and drop tasks - betwen task

    const sourceColIndex = findColumnIndexByTaskId(activeId);
    const destColIndex = findColumnIndexByTaskId(overId);
    if (sourceColIndex === -1 || destColIndex === -1) return;

    console.log('sourceColIndex', sourceColIndex, 'destColIndex', destColIndex);

    const sourceCol = columns[sourceColIndex];
    const destCol = columns[destColIndex];

    const activeTaskIndex = sourceCol.tasks.findIndex(
      (task) => 'task-' + task.id === activeId,
    );

    const overTaskIndex = destCol.tasks.findIndex(
      (task) => 'task-' + task.id === overId,
    );

    const updatedColumns = [...columns];

    if (sourceColIndex === destColIndex) {
      // 👉 Drag dalam kolom yang sama: gunakan arrayMove
      const reorderedTasks = arrayMove(
        sourceCol.tasks,
        activeTaskIndex,
        overTaskIndex,
      );

      updatedColumns[sourceColIndex] = {
        ...sourceCol,
        tasks: reorderedTasks,
      };
    } else {
      // 👉 Drag antar kolom
      const taskToMove = sourceCol.tasks[activeTaskIndex];

      // Remove dari source
      updatedColumns[sourceColIndex] = {
        ...sourceCol,
        tasks: sourceCol.tasks
          .filter((task) => `task-${task.id}` !== activeId)
          .map((task) => ({
            ...task,
            sortingId: `task-${task.id}`,
          })),
      };

      // Insert ke destination dengan sortingId
      updatedColumns[destColIndex] = {
        ...destCol,
        tasks: [
          ...destCol.tasks.slice(0, overTaskIndex),
          {
            ...taskToMove,
            sortingId: `task-${taskToMove.id}`,
          },
          ...destCol.tasks.slice(overTaskIndex),
        ].map((task, index) => ({
          ...task,
          order: index,
          sortingId: `task-${task.id}`, // ← tambahkan ini
        })),
      };

      setColumns(updatedColumns);
      await updateTaskColumn(taskToMove.id, destCol.id);
    }
  };

  return (
    <div className="overflow-x-auto px-4 py-2 space-y-4 w-full bg-muted rounded-lg">
      <KanbanSettingsBar />{' '}
      {/* <- fungsi assign task to colum ada di sini <AssignTaskToColumn/> */}
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
        <div>
          <Column columns={columns} activeTaskId={activeTaskId} />
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
                // activeTaskId={activeTaskId}
              />
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>
    </div>
  );
}
