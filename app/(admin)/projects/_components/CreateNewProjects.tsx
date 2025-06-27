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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Role } from '@prisma/client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { transformNameToInitials } from '@/lib/helper/formatAvatarName';
import { Separator } from '@/components/ui/separator';

interface ProjectUser {
  id: string;
  name: string | null;
  role: Role;
  email: string;
  image: string | null;
}

const CreateNewProjects = ({ userId }: { userId: string }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<ProjectUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  console.log(userId);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUserToOwnerProject();
        setUsers(usersData);
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
  }, [open]);

  const form = useForm<z.infer<typeof CreateProjectSchema>>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      ownerId: userId,
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset({
        name: '',
        description: '',
        ownerId: userId,
      });
    }
  }, [open, form, userId]);

  async function onSubmit(payload: z.infer<typeof CreateProjectSchema>) {
    console.log(payload);

    startTransition(async () => {
      try {
        await createProject({ payload });
        toast.success('Project created successfully');
        form.reset();
        setOpen(false);
      } catch (err) {
        toast.error('Failed to create project');
      }
    });
  }

  console.log(users);

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
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isPending || isLoadingUsers}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue className="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingUsers ? (
                        <SelectItem value="loading" disabled>
                          Loading users...
                        </SelectItem>
                      ) : users.length === 0 ? (
                        <SelectItem value="no-users" disabled>
                          No users available
                        </SelectItem>
                      ) : (
                        users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <AvatarImage
                                  src={user.image || undefined}
                                  alt="user image"
                                />
                                <AvatarFallback>
                                  {transformNameToInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="font-medium">
                                  {user.name || user.email}
                                </span>
                                <span className="text-muted-foreground ml-2 text-xs">
                                  ({user.role.toLowerCase()})
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    You may assign someone else as the project owner.
                  </FormDescription>
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
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewProjects;
