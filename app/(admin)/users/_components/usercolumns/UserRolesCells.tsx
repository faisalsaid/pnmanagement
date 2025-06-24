'use client';

import { updateUserRole, UpdateUserRoleInput } from '@/action/usersActions';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Role } from '@prisma/client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  user: {
    id: string;
    role: string;
  };

  currentUser?: {
    id: string;
    name: string | null | undefined;
    email: string | null | undefined;
    role: string;
  } | null;
};

const role: Role[] = [
  'ADMIN',
  'PEMRED',
  'REDAKTUR',
  'REPORTER',
  'USER',
  'TESTER',
];

const UserRolesCells = ({ user, currentUser }: Props) => {
  const [permission, setPermission] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);

  useEffect(() => {
    if (currentUser) {
      const isAllowed = ['ADMIN'].includes(currentUser.role);
      setPermission(isAllowed);
    }
  }, [currentUser, user]);

  const handleChangeRole = async ({ userId, role }: UpdateUserRoleInput) => {
    const toastId = toast.loading('Updating role...');
    try {
      await updateUserRole({ userId, role });
      toast.success(`User role updated to ${role}`, { id: toastId });
    } catch (error) {
      toast.error('Failed to update user role', { id: toastId });
      // rollback
      setSelectedRole(user.role);
    }
  };
  if (!permission) return <div>{user.role}</div>;

  return (
    <div>
      <Select
        value={user.role}
        onValueChange={(newRole: Role) => {
          setSelectedRole(newRole); // Optimistic update
          handleChangeRole({ userId: user.id, role: newRole });
        }}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder={user.role} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Role</SelectLabel>
            {role.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserRolesCells;
