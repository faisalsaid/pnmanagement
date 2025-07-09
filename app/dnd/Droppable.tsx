'use client';

import { useDroppable } from '@dnd-kit/core';

export default function Droppable({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const style = {
    border: '2px dashed gray',
    backgroundColor: isOver ? 'lightgreen' : 'white',
    padding: '20px',
    width: '150px',
    // textAlign: 'center',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}
