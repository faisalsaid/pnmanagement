'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Pen } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { updateProjectSingleFieldById } from '@/actions/projecActions';
// import { getSession } from 'next-auth/react';
// import { MemberRole, Prisma, Role } from '@prisma/client';

const FormSchema = z.object({
  title: z.string().min(3, {
    message: 'Title must be at least 3 characters.',
  }),
});

// export type UserProjectMember = {
//   role: MemberRole;
//   user: {
//     name: string | null;
//     id: string;
//     role: Role;
//     email: string;
//     image: string | null;
//   };
// };

interface Props {
  title: string;
  id: string;
  // currentUser: UserProjectMember;
  userPermision: boolean;
}

const ProjectTitle = ({ title, id, userPermision }: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [displayTitle, setDisplayTitle] = useState(title);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: displayTitle,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // handle if project name never change
    const payloadName = data.title.trim();
    if (title === payloadName) {
      setEditMode(false);
      return;
    }

    try {
      const result = await updateProjectSingleFieldById({
        data: data.title,
        field: 'name',
        id,
      });
      if (result.status === 'success') {
        setDisplayTitle(result.data?.name as string);
        toast.success('Project name updated');
        setEditMode(false);
      }
      console.log(result);
    } catch (error) {
      setEditMode(false);
      toast.error('Fail');
    }
  }

  return (
    <div className="flex items-end gap-1 w-full ">
      {editMode ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="text-2xl font-semibold-full w-full"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      autoFocus
                      className=" border-0 outline-none border-b"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button hidden type="submit">
              Submit
            </button>
          </form>
        </Form>
      ) : (
        <h1 className="text-2xl font-semibold">{displayTitle}</h1>
      )}

      {userPermision && !editMode && (
        <button
          onClick={() => setEditMode(true)}
          className="hover:cursor-pointer bg-green-500 p-1 rounded-full"
        >
          <Pen size={12} color="white" />
        </button>
      )}
    </div>
  );
};

export default ProjectTitle;
