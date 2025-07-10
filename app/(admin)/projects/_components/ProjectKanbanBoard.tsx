'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Ellipsis, Flag, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProjectDetails } from '../[id]/context/ProjectDetailContex';
import KanbanBoard from './kanban/kanbanboard';
import { AddColumn } from './kanban/AddColumnKanban';

const columns = [
  { title: 'Baclog', taskItem: 2 },
  { title: 'Process', taskItem: 1 },
  { title: 'Review', taskItem: 2 },
  { title: 'Done', taskItem: 4 },
];

const ProjectKanbanBoard = () => {
  const { projectDetail } = useProjectDetails();
  // console.log(projectDetail.goals.flatMap((goal) => goal.tasks));

  // console.log(projectDetail);

  const allColum = projectDetail.kanbanColumns;

  console.log('KANBAN COLUM', allColum);

  //   const columns = columnsDB.map((col) => ({
  // //         id: col.id,
  // //         name: col.name,
  // //         tasks: [], // masih kosong
  // //       }));

  return (
    <div>
      <AddColumn projectId={projectDetail.id} />
      <KanbanBoard initialColumns={allColum} />
    </div>
    // <div className="w-full  overflow-hidden overflow-x-scroll">
    //   <div className="flex gap-2">
    //     {columns.map((colum) => (
    //       <div
    //         key={colum.title}
    //         className="min-w-60 border rounded-md p-2 w-full space-y-4 bg-accent"
    //       >
    //         <div className="flex gap-2 text-sm">
    //           <p>{colum.title}</p>
    //           <p className="bg-primary-foreground px-2 rounded-sm ">
    //             {colum.taskItem}
    //           </p>
    //         </div>
    //         {Array.from({ length: colum.taskItem }, (_, i) => (
    //           <Card key={i} className="rounded-sm p-2 gap-4 ">
    //             <div className="flex items-center justify-between">
    //               <div className="flex gap-2">
    //                 <Badge className="bg-red-500/40 text-primary text-xs">
    //                   Tag1
    //                 </Badge>
    //                 <Badge className="bg-yellow-500/40 text-primary text-xs">
    //                   Tag2
    //                 </Badge>
    //                 <button className="hover:cursor-pointer">+</button>
    //               </div>
    //               <Ellipsis />
    //             </div>

    //             <div className="space-y-2">
    //               <h1 className="text-sm">Lorem ipsum dolor sit amet.</h1>
    //               <p className="text-xs text-muted-foreground">
    //                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad
    //                 expedita impedit.
    //               </p>
    //             </div>
    //             <div className="text-xs flex items-center gap-4 ">
    //               <div className="px-2 py-1 bg-red-600/20 border border-red-600 max-w-fit rounded-sm">
    //                 {Priority.P0}
    //               </div>
    //               <div className=" flex items-center gap-2 px-2 py-1 bg-green-400/20 border border-green-400 max-w-fit rounded-sm">
    //                 <Flag size={12} />
    //                 <span> 12 Juli 2025</span>
    //               </div>
    //             </div>
    //             <div className="flex items-center justify-between">
    //               <div className="*:data-[slot=avatar]:ring-background flex hover:space-x-0.5 -space-x-2 *:data-[slot=avatar]:ring-2 ">
    //                 <Avatar className="transition-all duration-500 ease-in-out w-[24px] h-[24px]">
    //                   <AvatarImage
    //                     src="https://github.com/shadcn.png"
    //                     alt="@shadcn"
    //                   />
    //                   <AvatarFallback>CN</AvatarFallback>
    //                 </Avatar>
    //                 <Avatar className="transition-all duration-500 ease-in-out w-[24px] h-[24px] ">
    //                   <AvatarImage
    //                     src="https://github.com/leerob.png"
    //                     alt="@leerob"
    //                   />
    //                   <AvatarFallback>LR</AvatarFallback>
    //                 </Avatar>
    //                 <Avatar className="transition-all duration-500 ease-in-out w-[24px] h-[24px] ">
    //                   <AvatarImage
    //                     src="https://github.com/evilrabbit.png"
    //                     alt="@evilrabbit"
    //                   />
    //                   <AvatarFallback>ER</AvatarFallback>
    //                 </Avatar>
    //                 <Avatar className="transition-all duration-500 ease-in-out w-[24px] h-[24px] ">
    //                   <AvatarFallback>+5</AvatarFallback>
    //                 </Avatar>
    //               </div>

    //               <div className="text-xs text-muted-foreground flex gap-1 items-center">
    //                 <MessageSquare size={14} /> {14}
    //               </div>
    //             </div>
    //           </Card>
    //         ))}
    //       </div>
    //     ))}
    //   </div>
    // </div>
  );
};

export default ProjectKanbanBoard;

enum Priority {
  P0 = 'PO',
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
}
