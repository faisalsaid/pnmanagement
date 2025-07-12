'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateProjectSingleFieldById } from '@/actions/projecActions';
import { useProjectDetails } from '../[id]/context/ProjectDetailContex';

// components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

// icons
import { Pen, Upload } from 'lucide-react';

const FormSchema = z.object({
  description: z.string(),
});

const ProjectDetailDescription = () => {
  const { currentProjectMember, projectDetail } = useProjectDetails();
  const { description, id } = projectDetail;

  const [editMode, setEditMode] = useState(false);

  const [displayDescription, setDisplayDesctiption] = useState(
    description as string,
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: displayDescription,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const result = await updateProjectSingleFieldById({
        field: 'description',
        data: data.description,
        id,
      });

      if (result && result.status === 'success') {
        setDisplayDesctiption(result.data?.description as string);
        setEditMode(false);
        toast.success('Project description updated');
      } else {
        toast.error(
          (result && result.message) || 'Failed to update description',
        );
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('onSubmit error:', error);
    }
  }

  return (
    <div className="text-sm text-muted-foreground">
      {editMode ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <textarea
                      autoFocus
                      className=" border-0 outline-none border-b"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="ml-auto w-fit flex items-center gap-2">
              <Button
                type="reset"
                onClick={(event) => {
                  event.preventDefault();
                  form.reset();
                  setEditMode(false);
                }}
                size={'sm'}
                className="flex gap-2 items-center   mt-2"
              >
                <span>Cancel</span>
              </Button>
              <Button
                size={'sm'}
                type="submit"
                className="flex gap-2 items-center bg-green-500 hover:bg-green-600 text-white  mt-2"
              >
                <Upload size={16} /> <span>Update</span>
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <span>
          {!displayDescription || displayDescription === ''
            ? 'No description'
            : displayDescription}{' '}
        </span>
      )}

      {currentProjectMember.hasCrudAccess && !editMode && (
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

export default ProjectDetailDescription;
