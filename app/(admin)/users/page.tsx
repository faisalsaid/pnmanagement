import prisma from '@/lib/prisma';
import { columns } from './_components/usercolumns/userColumns';
import { UserDataTable } from './_components/usercolumns/userDataTable';
import { Suspense } from 'react';
import { auth } from '@/auth';

const UserPage = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const session = await auth(); // hasil next‑auth
  const currentUser = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      }
    : null;

  return (
    <div className="space-y-4">
      <h1 className="text-xl lg:text-2xl ">All Users</h1>
      <div className="bg-primary-foreground rounded-md p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <UserDataTable
            columns={columns}
            data={users}
            currentUser={currentUser}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default UserPage;
