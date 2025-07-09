'use client';

import { closestCorners, DndContext } from '@dnd-kit/core';
import { useState } from 'react';
import Column from './Column';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import {
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

export type TaskSample = { id: number; title: string };
const page = () => {
  const [tasks, setTasks] = useState<TaskSample[]>([
    {
      id: 1,
      title: 'Task One',
    },
    {
      id: 2,
      title: 'Task Two',
    },
    {
      id: 3,
      title: 'Task Three',
    },
  ]);

  const getTaskPos = (id: any) => tasks.findIndex((task) => task.id === id);
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    setTasks((task) => {
      const orginalPost = getTaskPos(active.id);
      const newPost = getTaskPos(over.id);
      return arrayMove(tasks, orginalPost, newPost);
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  return (
    <div>
      <h1>DND Tes</h1>

      <div className="container mx-auto">
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          <Column tasks={tasks} />
        </DndContext>
      </div>
    </div>
  );
};

export default page;
