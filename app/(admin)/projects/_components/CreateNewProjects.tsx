'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createProject, getUserToOwnerProject } from '@/actions/projecActions';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateProjectSchema } from '@/lib/zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
import { Role } from '@prisma/client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { transformNameToInitials } from '@/lib/helper/formatAvatarName';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProjectUser {
  id: string;
  name: string | null;
  role: Role;
  email: string;
  image: string | null;
}

const CreateNewProjects = ({ userId }: { userId: string | undefined }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<ProjectUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  // console.log('USER ID', userId);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUserToOwnerProject();
        // Filter: eliminate creator and selected owner

        if (usersData) {
          const filtered = usersData?.filter((user) => user.id !== userId);
          setUsers(filtered);
        }
      } catch (error) {
        toast.error('Failed to load users');
        console.error('Error fetching users:', error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    if (open) {
      fetchUsers();
    }
  }, [open, userId]);

  const form = useForm<z.infer<typeof CreateProjectSchema>>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      name: '',
      description: '',

      deadline: '',
      teamMembers: [],
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset({
        name: '',
        description: '',
      });
    }
  }, [open, form, userId]);

  async function onSubmit(payload: z.infer<typeof CreateProjectSchema>) {
    // console.log('PAYLOAD', payload);

    const finalPayload = {
      ...payload,
      deadline: payload.deadline
        ? new Date(payload.deadline).toISOString()
        : undefined,
    };
    // console.log('FINAL PAYLOAD', finalPayload);

    startTransition(async () => {
      try {
        const result = await createProject({ payload: finalPayload });

        if (!result?.success) {
          toast.error(result?.message);
          form.reset();
          setOpen(false);
          return;
        }

        toast.success('Project created successfully');
        form.reset();
        setOpen(false);
      } catch (err) {
        console.log(err);

        toast.error('Failed to create project');
      }
    });
  }

  // console.log(users);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> <span> New Project</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> New Project</DialogTitle>
        </DialogHeader>
        <Separator />

        <ScrollArea className=" h-[70vh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className=" ">
                    <FormLabel>Name :</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Enter Project Name"
                        {...field}
                        disabled={isPending || isLoadingUsers}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description : </FormLabel>
                    <Textarea
                      disabled={isPending || isLoadingUsers}
                      className="resize-none"
                      placeholder="Please provide a project description."
                      {...field}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teamMembers"
                render={() => (
                  <FormItem>
                    <FormLabel>Team Members</FormLabel>
                    <div className="space-y-2">
                      {users
                        .filter((user) => user.id !== userId)
                        .map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center gap-4"
                          >
                            <input
                              type="checkbox"
                              id={`user-${user.id}`}
                              value={user.id}
                              checked={
                                form
                                  .watch('teamMembers')
                                  ?.some((m) => m.userId === user.id) ?? false
                              }
                              onChange={(e) => {
                                const checked = e.target.checked;
                                const members =
                                  form.getValues('teamMembers') || [];

                                if (checked) {
                                  form.setValue('teamMembers', [
                                    ...members,
                                    { userId: user.id, role: 'VIEWER' },
                                  ]);
                                } else {
                                  form.setValue(
                                    'teamMembers',
                                    members.filter((m) => m.userId !== user.id),
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor={`user-${user.id}`}
                              className="flex gap-2 items-center"
                            >
                              <Avatar>
                                <AvatarImage src={user.image || undefined} />
                                <AvatarFallback>
                                  {transformNameToInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                {user.name || user.email}{' '}
                                <span className="text-muted-foreground text-xs ml-2">
                                  ({user.role.toLowerCase()})
                                </span>
                              </div>
                            </label>
                          </div>
                        ))}
                    </div>
                    <FormDescription>
                      Select team members. Roles can be edited later.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full flex">
                <Button
                  className="ml-auto"
                  type="submit"
                  disabled={isPending || isLoadingUsers}
                >
                  {isPending ? 'Processing...' : 'Create'}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewProjects;
