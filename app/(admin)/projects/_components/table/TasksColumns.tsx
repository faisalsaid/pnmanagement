'use client';

import { ColumnDef } from '@tanstack/react-table';
import { TaskItem } from '../AllTaskByProject';
import { CircleCheck, Eye, GripHorizontal, List, Loader } from 'lucide-react';
import UserAvatar from '@/components/UserAvatar';
import { cn } from '@/lib/utils';
import TaskTableActionsCell from './TaskTableActionsCell';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const TaskColumns: ColumnDef<TaskItem>[] = [
  {
    id: 'sort',
    header: () => <GripHorizontal size={16} />,
    cell: () => <GripHorizontal size={16} />,
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger>
          <div className="line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap max-w-52 ">
            {row.original.title}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{row.original.title}</p>
        </TooltipContent>
      </Tooltip>
    ),
  },
  {
    accessorKey: 'assignedTo',
    header: 'Assignet To',
    cell: ({ row }) => {
      const { teamMemberships, ...user } = {
        ...row.original.assignedTo,
        memberRole: row.original.assignedTo?.teamMemberships[0].role,
      };

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
                  `capitalize text-muted-foreground text-xs border px-1 rounded-sm dark:text-white`,
                  user.memberRole === 'OWNER'
                    ? 'bg-amber-500/20  border-amber-500 text-amber-800'
                    : user.memberRole === 'ADMIN'
                    ? 'bg-green-800/30 border-green-800 text-green-800'
                    : user.memberRole === 'EDITOR'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-500'
                    : 'bg-red-500/20 border-red-500 text-rose-800',
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
      return (
        <div className="line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap max-w-52">
          {row.original.goal.title}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div
          className={cn(
            `flex items-center gap-1 text-sm capitalize border px-2 rounded-sm w-fit dark:text-slate-300`,
            status === 'DONE'
              ? 'bg-green-800/20 border-green-800 text-green-800  '
              : status === 'IN_PROGRESS'
              ? 'bg-yellow-400/20 border-yellow-600 text-yellow-600'
              : status === 'REVIEW'
              ? 'bg-purple-400/20 border-purple-600 text-purple-600'
              : 'bg-sky-400/20 border-sky-600 text-sky-600',
          )}
        >
          {status === 'DONE' ? (
            <CircleCheck size={14} />
          ) : status === 'IN_PROGRESS' ? (
            <Loader size={14} />
          ) : status === 'REVIEW' ? (
            <Eye size={14} />
          ) : (
            <List size={14} />
          )}

          {status === 'IN_PROGRESS'
            ? 'In Progress'
            : status.toLocaleLowerCase()}
        </div>
      );
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
    cell: ({ row }) => <TaskTableActionsCell task={row.original} />,
  },
];
