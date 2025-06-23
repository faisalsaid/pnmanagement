import prisma from '@/lib/prisma';
import { columns } from './_components/usercolumns/userColumns';
import { UserDataTable } from './_components/usercolumns/userDataTable';

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

  return (
    <div className="space-y-4">
      <h1 className="text-xl lg:text-2xl ">All Users</h1>
      <div className="bg-primary-foreground rounded-md p-4">
        <UserDataTable columns={columns} data={users} />
      </div>
    </div>
  );
};

export default UserPage;
