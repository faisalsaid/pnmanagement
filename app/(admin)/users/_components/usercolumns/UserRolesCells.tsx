import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';

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

const role = ['ADMIN', 'PEMRED', 'REDAKTUR', 'REPORTER', 'USER', '  TESTER'];

const UserRolesCells = ({ user, currentUser }: Props) => {
  const [permission, setPermission] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const isAllowed = ['ADMIN'].includes(currentUser.role);
      setPermission(isAllowed);
    }
  }, [user.id]);

  if (!permission) return <div>{user.role}</div>;
  return (
    <Select>
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
  );
};

export default UserRolesCells;
