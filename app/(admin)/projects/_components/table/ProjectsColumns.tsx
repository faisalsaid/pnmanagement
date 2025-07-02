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
