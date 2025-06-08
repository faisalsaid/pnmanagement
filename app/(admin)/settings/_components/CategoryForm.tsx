'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useEffect } from 'react';
import { CreateCategorySchema } from '@/lib/zod';
import { createCategory } from '@/action/postActions';

type FormData = z.infer<typeof CreateCategorySchema>;

const CategoryForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  // Auto-generate the slug whenever name changes
  const nameValue = form.watch('name');

  useEffect(() => {
    if (!nameValue.trim()) {
      form.setValue('slug', '');
      return;
    }

    const generatedSlug = nameValue.toLowerCase().trim().replace(/\s+/g, '_'); // hanya ganti spasi
    form.setValue('slug', generatedSlug, { shouldValidate: true });
  }, [nameValue, form]);

  const onSubmit = async (data: FormData) => {
    console.log('Submitted data:', data);

    // You can send `data` to an API or save it locally
    try {
      await createCategory(data); // Jika ini async
      form.reset(); //  Reset form setelah berhasil
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-lg font-medium ">Add Category</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className=" ">
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="Enter category name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Display slug as read-only text (not input) */}
          <div>
            <FormLabel className="text-sm font-medium text-muted-foreground">
              Generated slug
            </FormLabel>
            <p className="text-sm text-foreground bg-muted px-3 py-2 rounded">
              {form.watch('slug') || '—'}
            </p>
          </div>

          {/* Hidden input to submit the slug value */}
          <input type="hidden" {...form.register('slug')} />

          <Button type="submit">
            {form.formState.isSubmitting ? 'Saving...' : 'Add Category'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CategoryForm;
