'use client';

import { useState } from 'react';
import Column from './Column';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
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
import { TaskSampleCard } from './TaskSampleList';

export type TaskSample = { id: number; title: string };

export type ColumnsSampleProps = {
  id: string;
  title: string;
  tasks: TaskSample[];
};

const tasklist: TaskSample[] = [
  { id: 1, title: 'Task One' },
  { id: 2, title: 'Task Two' },
  { id: 3, title: 'Task Three' },
];

const columnsSample: ColumnsSampleProps[] = [
  { id: 'todo-column', title: 'TODO', tasks: tasklist },
  { id: 'progress-column', title: 'PROGRESS', tasks: [] },
  { id: 'done-column', title: 'DONE', tasks: [] },
];

const Page = () => {
  const [columns, setColumns] = useState<ColumnsSampleProps[]>(columnsSample);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const findColumnIndexByTaskId = (taskId: number) => {
    return columns.findIndex((column) =>
      column.tasks.find((task) => task.id === taskId),
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    const activeId = Number(active.id);
    const overId = Number(over.id);

    console.log(activeId, overId);

    // Drag antar column
    const isColumn =
      typeof active.id === 'string' && active.id.endsWith('-column');

    if (isColumn) {
      const oldIndex = columns.findIndex((col) => col.id === active.id);
      const newIndex = columns.findIndex((col) => col.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const newCols = arrayMove(columns, oldIndex, newIndex);
      setColumns(newCols);
      return;
    }

    // Jika drop ke column kosong
    if (typeof over.id === 'string' && over.id.endsWith('-column')) {
      console.log('Colum kosong');

      const sourceColIndex = findColumnIndexByTaskId(activeId);
      const destColIndex = columns.findIndex((col) => col.id === over.id);
      if (sourceColIndex === -1 || destColIndex === -1) return;

      const sourceCol = columns[sourceColIndex];
      const destCol = columns[destColIndex];

      const activeTaskIndex = sourceCol.tasks.findIndex(
        (task) => task.id === activeId,
      );
      const taskToMove = sourceCol.tasks[activeTaskIndex];

      const updatedColumns = [...columns];

      // Remove from source
      updatedColumns[sourceColIndex] = {
        ...sourceCol,
        tasks: [...sourceCol.tasks.filter((task) => task.id !== activeId)],
      };

      // Insert to empty column
      updatedColumns[destColIndex] = {
        ...destCol,
        tasks: [...destCol.tasks, taskToMove],
      };

      setColumns(updatedColumns);
      return;
    }

    // Drag antar task
    const sourceColIndex = findColumnIndexByTaskId(activeId);
    const destColIndex = findColumnIndexByTaskId(overId);

    console.log('HANDLE TASK DRAG => ', sourceColIndex, '=>', destColIndex);

    if (sourceColIndex === -1 || destColIndex === -1) return;

    const sourceCol = columns[sourceColIndex];
    const destCol = columns[destColIndex];

    const activeTaskIndex = sourceCol.tasks.findIndex(
      (task) => task.id === activeId,
    );
    const overTaskIndex = destCol.tasks.findIndex((task) => task.id === overId);

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
        tasks: sourceCol.tasks.filter((task) => task.id !== activeId),
      };

      // Insert ke destination
      updatedColumns[destColIndex] = {
        ...destCol,
        tasks: [
          ...destCol.tasks.slice(0, overTaskIndex),
          taskToMove,
          ...destCol.tasks.slice(overTaskIndex),
        ],
      };
    }

    setColumns(updatedColumns);
  };

  return (
    <div>
      <h1>DND Test</h1>
      <div className="container mx-auto">
        <DndContext
          sensors={sensors}
          onDragStart={(event) => {
            if (typeof event.active.id === 'number') {
              setActiveTaskId(event.active.id);
            }
          }}
          onDragEnd={(event) => {
            handleDragEnd(event);
            setActiveTaskId(null); // Reset overlay
          }}
          collisionDetection={closestCorners}
        >
          <Column columns={columns} activeTaskId={activeTaskId} />
          <DragOverlay>
            {activeTaskId ? (
              <TaskSampleCard
                // activeTaskId={activeTaskId}
                task={
                  columns
                    .flatMap((col) => col.tasks)
                    .find((t) => t.id === activeTaskId)!
                }
                isOverlay
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default Page;
