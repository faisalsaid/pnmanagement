'use client';

import { ColumnDef } from '@tanstack/react-table';
import { TaskItem } from '../AllTaskByProject';
import { Ellipsis, GripHorizontal } from 'lucide-react';
import UserAvatar from '@/components/UserAvatar';
import { id } from 'date-fns/locale';

export const TaskColumns: ColumnDef<TaskItem>[] = [
  {
    id: 'sort',
    header: () => <GripHorizontal />,
    cell: ({ row }) => <GripHorizontal />,
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
            <p>{user.name}</p>
            <p className="capitalize text-muted-foreground">
              {user.memberRole?.toLocaleLowerCase()}
            </p>
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
        <Ellipsis />
      </div>
    ),
  },
];
