'use client';

import { Prisma } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import UsersActionCells from './UsersActionCells';

export type UsersTable = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    role: true;
  };
}>;

export const columns: ColumnDef<UsersTable>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    id: 'action',
    header: 'Actions',
    cell: ({ row }) => <UsersActionCells user={row.original} />,
  },
];
