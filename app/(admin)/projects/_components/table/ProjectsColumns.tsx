'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Prisma } from '@prisma/client';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import AuthorCard from '@/components/AuthorCard';
import ProjectsActionsCell from './ProjectsActionsCell';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import UserAvatar from '@/components/UserAvatar';

export type ProjectsTable = Prisma.ProjectGetPayload<{
  select: {
    id: true;
    name: true;
    createdAt: true;
    description: true;
    createdBy: {
      select: {
        id: true;
        email: true;
        name: true;
        role: true;
        image: true;
        articles: {
          select: {
            id: true;
          };
        };
      };
    };
    members: {
      select: {
        role: true;
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            image: true;
          };
        };
      };
    };
  };
}>;

export const columns: ColumnDef<ProjectsTable>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'createdBy',
    header: 'Creator',
    cell: ({ row }) => {
      const cretor = row.original.createdBy;
      return (
        <HoverCard>
          <HoverCardTrigger>{cretor?.name ?? cretor.name}</HoverCardTrigger>
          <HoverCardContent className="p-0">
            <AuthorCard author={cretor} />
          </HoverCardContent>
        </HoverCard>
      );
    },
  },

  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) =>
      row.original.createdAt.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
  },
  {
    accessorKey: 'members',
    header: 'Member',
    cell: ({ row }) => {
      const members = row.original.members;

      return (
        <div className="*:data-[slot=avatar]:ring-background flex hover:space-x-0.5 -space-x-2 *:data-[slot=avatar]:ring-2 ">
          {members.map((member) => {
            const user = {
              id: member.user.id,
              name: member.user.name,
              image: member.user.image,
            };
            return (
              <Tooltip key={member.user.id}>
                <TooltipTrigger
                  className={`transition-all duration-500 ease-in-out`}
                >
                  <UserAvatar user={user} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {member.role} | {member.user.name}
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      );
    },
  },
  {
    id: 'action',
    header: 'Actions',
    cell: ({ row, table }) => {
      return (
        <ProjectsActionsCell
          projectCreator={row.original.createdBy}
          currentUser={table.options.meta?.currentUser}
          projectId={row.original.id}
        />
      );
    },
  },
];
