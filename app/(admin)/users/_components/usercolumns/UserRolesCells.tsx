'use client';

import { updateUserRole, UpdateUserRoleInput } from '@/actions/usersActions';
import { Button } from '@/components/ui/button';
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
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Props = {
  user: {
    id: string;
    role: string;
    name: string | null;
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState<Role | null>(null);

  useEffect(() => {
    if (currentUser) {
      setPermission(currentUser.role === 'ADMIN');
    }
  }, [currentUser]);

  useEffect(() => {
    if (pendingRole) setDialogOpen(true);
  }, [pendingRole]);

  const handleChangeRole = async ({ userId, role }: UpdateUserRoleInput) => {
    const toastId = toast.loading('Updating role...');
    try {
      await updateUserRole({ userId, role });
      toast.success(`User role updated to ${role}`, { id: toastId });
      setSelectedRole(role); // Final update
    } catch (error) {
      console.log(error);
      toast.error('Failed to update user role', { id: toastId });
      // rollback
      // setSelectedRole(user.role);
    }
  };

  // console.log(pendingRole);

  return (
    <div className="flex  items-center">
      {/* <p>{user.role}</p> */}
      {/* <p className="capitalize">{user.role.toLocaleLowerCase()}</p> */}

      <RoleBadge role={user.role} />
      {permission && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'ghost'} size={'icon'}>
                <Pencil />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="space-y-2 p-2">
                <Label>Change Role</Label>
                <Select
                  value={user.role}
                  onValueChange={(newRole: Role) => {
                    if (newRole !== selectedRole) setPendingRole(newRole);
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder={selectedRole} />
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
            </DropdownMenuContent>
          </DropdownMenu>
          {/* confirm role changes */}
          {pendingRole && (
            <ConfirmDialog
              open={dialogOpen}
              onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) setPendingRole(null);
              }}
              title="Confirm Role Change"
              description={
                <span>
                  Are you sure you want to change{' '}
                  <span className="font-semibold uppercase">{user.name}</span>
                  {"'s role to "}
                  <span className="font-semibold uppercase">{pendingRole}</span>
                  ?
                </span>
              }
              confirmLabel="Yes, Change"
              cancelLabel="Cancel"
              onConfirm={() => {
                handleChangeRole({ userId: user.id, role: pendingRole });
                setPendingRole(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserRolesCells;

const RoleBadge = ({ role }: { role: string }) => {
  return (
    <Badge
      className={cn('bg-yellow-200/20 border border-yellow-200 text-primary')}
    >
      {role}
    </Badge>
  );
};
