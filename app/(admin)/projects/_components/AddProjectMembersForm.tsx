'use client';

import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import { Role } from '@prisma/client';
import {
  addMembersToProject,
  getUserToOwnerProject,
} from '@/actions/projecActions';

import { Button } from '@/components/ui/button';
import {
  Form,
  // FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import UserAvatar from '@/components/UserAvatar';

const FormSchema = z.object({
  teamMembers: z
    .array(
      z.object({
        userId: z.string(),
        role: z.enum(['OWNER', 'ADMIN', 'EDITOR', 'VIEWER']),
      }),
    )
    .min(1, 'Select at least one member'),
});

type FormValues = z.infer<typeof FormSchema>;

interface ProjectUser {
  id: string;
  name: string | null;
  role: Role;
  email: string;
  image: string | null;
}

interface Props {
  projectId: string;
  excludedUserIds?: string[];
  existingMemberIds?: string[];
  onSuccess?: () => void;
  open: boolean;
}
const AddProjectMembersForm = ({
  projectId,
  excludedUserIds = [],
  existingMemberIds = [],
  onSuccess,
}: Props) => {
  const [users, setUsers] = useState<ProjectUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      teamMembers: [],
    },
  });

  const selectedMembers = form.watch('teamMembers') || [];

  useEffect(() => {
    if (!open) return;
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const usersData = await getUserToOwnerProject();
        const filtered = usersData.filter(
          (user) =>
            !excludedUserIds.includes(user.id) &&
            !existingMemberIds.includes(user.id),
        );
        setUsers(filtered);
      } catch (error) {
        toast.error('Failed to load users');
        console.error(error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
    //eslint-disable-next-line
  }, [open]);

  const handleToggle = (user: ProjectUser, checked: boolean) => {
    const members = form.getValues('teamMembers') || [];

    if (checked) {
      form.setValue('teamMembers', [
        ...members,
        { userId: user.id, role: 'VIEWER' }, // default role
      ]);
    } else {
      form.setValue(
        'teamMembers',
        members.filter((m) => m.userId !== user.id),
      );
    }
  };

  const isChecked = (userId: string) =>
    selectedMembers.some((m) => m.userId === userId);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await addMembersToProject({ projectId, members: data.teamMembers });
      toast.success('Members added successfully');
      form.reset();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add members');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="teamMembers"
            render={() => (
              <FormItem>
                <FormLabel>Team Members</FormLabel>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {users.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {isLoadingUsers ? 'Load users...' : 'No users available'}
                    </p>
                  ) : (
                    users.map((user) => (
                      <div key={user.id} className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          id={`user-${user.id}`}
                          checked={isChecked(user.id)}
                          onChange={(e) => handleToggle(user, e.target.checked)}
                        />
                        <label
                          htmlFor={`user-${user.id}`}
                          className="flex gap-2 items-center cursor-pointer"
                        >
                          <UserAvatar
                            user={{
                              id: user.id,
                              image: user.image,
                              name: user.name,
                            }}
                            size={20}
                          />
                          <div>
                            {user.name || user.email}
                            <span className="text-muted-foreground text-xs ml-2">
                              ({user.role.toLowerCase()})
                            </span>
                          </div>
                        </label>
                      </div>
                    ))
                  )}
                </div>
                <FormDescription>
                  Select users to invite. Default role: <b>viewer</b>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting || isLoadingUsers}>
            {isSubmitting ? 'Inviting...' : 'Invite Selected'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddProjectMembersForm;
