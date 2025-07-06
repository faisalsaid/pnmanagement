'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TaskFormSchema, TaskFormValues } from '@/lib/zod';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useProjectDetails } from '../[id]/context/ProjectDetailContex';

// components
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import UserAvatar from '@/components/UserAvatar';

// icons
import { Calendar as CalendarIcon } from 'lucide-react';
import { useEffect } from 'react';

type TaskFormProps = {
  onSubmit: (data: TaskFormValues) => void;
  onCancel: () => void;

  initialData?: Partial<TaskFormValues>;
  submitLabel?: string;
};

export const TaskForm = ({
  onSubmit,
  onCancel,
  initialData,
  submitLabel = 'Create Task',
}: TaskFormProps) => {
  const { projectDetail, currentProjectMember } = useProjectDetails();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      goalId: '',
      assignedToId: undefined,
      dueDate: undefined,
      createdById: '',
      ...initialData,
    },
  });

  useEffect(() => {
    if (currentProjectMember?.user?.id) {
      form.setValue('createdById', currentProjectMember.user.id);
    }
  }, [currentProjectMember?.user?.id, form]);

  const sortedGoals = projectDetail.goals.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const { handleSubmit } = form;

  const goalId = form.watch('goalId');
  const isDisabled = !goalId;
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Goal */}
        <FormField
          control={form.control}
          name="goalId"
          render={({ field }) => (
            <FormItem>
              <Label>Goal</Label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sortedGoals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!field.value && (
                <FormDescription className="text-xs">
                  Select a goal before assigning a task.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          disabled={isDisabled}
          render={({ field }) => (
            <FormItem>
              <Label className={`${isDisabled ? 'text-muted' : ''}`}>
                Title
              </Label>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          disabled={isDisabled}
          render={({ field }) => (
            <FormItem>
              <Label className={`${isDisabled ? 'text-muted' : ''}`}>
                Description
              </Label>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center">
          {/* Status */}
          {/* <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="w-full">
                <Label>Status</Label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TODO">TODO</SelectItem>
                    <SelectItem value="IN_PROGRESS">IN PROGRESS</SelectItem>
                    <SelectItem value="DONE">DONE</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* Due Date */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className={`${isDisabled ? 'text-muted' : ''}`}>
                  Due Date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        disabled={isDisabled}
                        variant={'outline'}
                        className={cn(
                          'w-[180px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Assigned To */}
          <FormField
            control={form.control}
            name="assignedToId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className={`${isDisabled ? 'text-muted' : ''}`}>
                  Assigned to
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isDisabled}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select user to assigen task" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projectDetail.members.map((member) => (
                      <SelectItem key={member.user.id} value={member.user.id}>
                        <div className="flex gap-4 items-center">
                          <UserAvatar user={member.user} size={18} />
                          <p>
                            {member.user.name}{' '}
                            <span className="text-xs text-muted-foreground capitalize">
                              {member.role.toLocaleLowerCase()}
                            </span>
                          </p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="text-red-500"
          >
            Cancel
          </Button>
          <Button
            className={`bg-green-400 text-green-950 hover:bg-green-300 ${
              isDisabled ? 'bg-muted' : ''
            }`}
            disabled={isDisabled}
            type="submit"
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};
