'use client';

import { ColumnDef } from '@tanstack/react-table';
import { TaskItem } from '../AllTaskByProject';
import { Ellipsis, GripHorizontal } from 'lucide-react';
import UserAvatar from '@/components/UserAvatar';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export const TaskColumns: ColumnDef<TaskItem>[] = [
  {
    id: 'sort',
    header: () => <GripHorizontal size={16} />,
    cell: ({ row }) => <GripHorizontal size={16} />,
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <div className="line-clamp-1">{row.original.title}</div>,
  },
  {
    accessorKey: 'assignedTo',
    header: 'Assignet To',
    cell: ({ row }) => {
      const { teamMemberships, ...user } = {
        ...row.original.assignedTo,
        memberRole: row.original.assignedTo?.teamMemberships[0].role,
      };
      const userAvatar = {
        id: user.id,
        name: user.name,
        image: user.image,
      };
      console.log(user);

      if (row.original.assignedTo) {
        return (
          <div className="flex gap-2 items-center">
            <UserAvatar
              user={{
                id: user.id as string,
                image: user.image as string,
                name: user.name as string,
              }}
            />
            <div className="flex gap-1 items-baseline">
              <p>{user.name}</p>
              <p
                className={cn(
                  `capitalize text-muted-foreground text-xs border px-1 rounded-sm`,
                  user.memberRole === 'OWNER'
                    ? 'bg-amber-500/20  border-amber-500'
                    : 'bg-sky-500/20 border-sky-500',
                )}
              >
                {user.memberRole?.toLocaleLowerCase()}
              </p>
            </div>
          </div>
        );
      } else {
        return <div>Not Assigned</div>;
      }
    },
  },
  {
    accessorKey: 'goal',
    header: 'Goal',
    cell: ({ row }) => {
      return <div className="line-clamp-1">{row.original.goal.title}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Goal',
    cell: ({ row }) => {
      return <div>{row.original.status}</div>;
    },
  },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
    cell: ({ row }) => {
      return <div>{row.original.dueDate?.toLocaleDateString()}</div>;
    },
  },
  {
    id: 'action',
    header: 'Actions',
    cell: ({ row }) => (
      <div>
        <Ellipsis size={20} />
      </div>
    ),
  },
];
