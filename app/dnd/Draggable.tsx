// 'use client';

// import { useDraggable } from '@dnd-kit/core';

// export default function Draggable({ id }: { id: string }) {
//   const { attributes, listeners, setNodeRef, transform } = useDraggable({
//     id,
//   });

//   const style = {
//     transform: transform
//       ? `translate(${transform.x}px, ${transform.y}px)`
//       : undefined,
//     border: '1px solid black',
//     padding: '8px',
//     width: '100px',
//     // textAlign: 'center',
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
//       Drag Me
//     </div>
//   );
// }
