'use client';

import { removeProjectMember, updateMemberRole } from '@/actions/projecActions';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/UserAvatar';
import { MemberRole, Role } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type MemberItem = {
  role: MemberRole; // Role di team (EDITOR, VIEWER, dll)
  user: {
    id: string;
    email: string;
    role: Role; // Global app role: ADMIN, USER, dll
    image: string | null;
    name: string | null;
  };
};

type Props = {
  members: MemberItem[];
  projectId: string;
  creatorId: string;
};

const EditProjectMembers = ({ members, projectId, creatorId }: Props) => {
  const [updating, setUpdating] = useState(false);

  const filterMember = members.filter((user) => user.user.id !== creatorId);

  const router = useRouter();

  const handleChangeRole = async (userId: string, role: MemberRole) => {
    setUpdating(true);
    try {
      await updateMemberRole({ userId, role, projectId });
      toast.success('Role updated');
      router.refresh(); // atau mutate jika pakai SWR
    } catch (error) {
      toast.error('Failed to update role');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (userId: string) => {
    const confirm = window.confirm(
      'Are you sure you want to remove this member?',
    );
    if (!confirm) return;
    setUpdating(true);
    try {
      await removeProjectMember({ userId, projectId });
      toast.success('Member removed');
      router.refresh();
    } catch (error) {
      toast.error('Failed to remove member');
    } finally {
      setUpdating(false);
    }
  };
  return (
    <div className="space-y-3">
      {filterMember.map((member) => (
        <div
          key={member.user.id}
          className="flex justify-between items-center border p-2 rounded"
        >
          <div className="flex items-center gap-2">
            <UserAvatar user={member.user} />
            <div>
              <p className="text-sm">{member.user.name || member.user.email}</p>
              <p className="text-xs text-muted-foreground">
                {member.user.role}
              </p>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <select
              value={member.role}
              onChange={(e) =>
                handleChangeRole(member.user.id, e.target.value as MemberRole)
              }
              className="border rounded px-2 text-sm"
            >
              {(['OWNER', 'ADMIN', 'EDITOR', 'VIEWER'] as MemberRole[]).map(
                (role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ),
              )}
            </select>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(member.user.id)}
              disabled={updating}
              className="text-destructive"
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditProjectMembers;
