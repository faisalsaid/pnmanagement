'use client';

import { Prisma } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import UsersActionCells from './UsersActionCells';
import UserRolesCells from './UserRolesCells';
import { UserHeaderSortable } from './UserHeaderSortable';

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
    header: () => <UserHeaderSortable columnKey="role" label="role" />,
    cell: ({ row, table }) => (
      <UserRolesCells
        currentUser={table.options.meta?.currentUser}
        user={{ id: row.original.id, role: row.original.role }}
      />
    ),
  },
  {
    id: 'action',
    header: 'Actions',
    cell: ({ row, table }) => (
      <UsersActionCells
        currentUser={table.options.meta?.currentUser}
        user={row.original}
      />
    ),
  },
];
