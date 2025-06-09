'use client';

import { postFormSchema } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Prisma } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import slugify from 'slugify';
import { useEffect, useState, useTransition } from 'react';

// improt component
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';
import RitchTextEditor from '@/components/RitchTextEditor';
import { Separator } from '@/components/ui/separator';
import { createArticle, getAllTags, updateArticle } from '@/action/postActions';
import { TagSelector } from './TagSelector';
import AssetPicker from './AssetPicker';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const postStatus: string[] = ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'];

type Tag = { id: string; name: string; slug: string };

type Props = {
  initialData?: z.infer<typeof postFormSchema>;
  categories?: Prisma.CategoryGetPayload<true>[];
  authorId: string | undefined;
  //   onSubmit: (data: FormSchema) => void;
};

const ArticelForm = ({ initialData, categories, authorId }: Props) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // handle roles
  const userRoleId =
    session?.user.role &&
    ['ADMIN', 'PEMRED', 'REDAKTUR'].includes(session?.user.role);

  const filteredStatus = userRoleId
    ? postStatus
    : postStatus.filter(
        (status) => status === 'DRAFT' || status === 'ARCHIVED',
      );

  // console.log('ArticelForm =>> ', userRoleId, '==>', filteredStatus);

  // Handle fullfield form if edit mode
  const transformedInitialData = initialData
    ? {
        ...initialData,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        media: initialData.media?.map((item: any) => ({
          id: item.mediaAsset?.id ?? item.id,
          role: item.role,
        })),
      }
    : undefined;

  // INIT FORM
  const form = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: transformedInitialData || {
      title: '',
      slug: '',
      summary: '',
      content: '',
      categoryId: '',
      status: 'DRAFT',
      tags: [],
      authorId: authorId || '',
      media: [],
    },
  });

  // Handle generate slug title based
  const titleValue = form.watch('title');
  useEffect(() => {
    if (!initialData && titleValue) {
      const slug = slugify(titleValue, {
        lower: true,
        strict: true,
      });
      form.setValue('slug', slug, { shouldValidate: true });
    }
  }, [titleValue, form, initialData]);

  // hadle tag
  useEffect(() => {
    const fetchTags = async () => {
      const data = await getAllTags();
      setTags(data);
    };
    fetchTags();
  }, []);

  // Handle submit
  const onSubmit = async (data: z.infer<typeof postFormSchema>) => {
    console.log(data);

    if (initialData) {
      startTransition(() => {
        updateArticle(data)
          .then((res) => {
            if (res?.message) {
              setError(res.message);
              toast.error(res.message);
            } else {
              toast.success('Article updated!');
              router.push(`/posts/${data.slug}`);
            }
          })
          .catch(() => {
            setError('Something went wrong');
            console.log(error);
            toast.error('Something went wrong');
          });
      });
    } else {
      startTransition(() => {
        createArticle(data)
          .then((res) => {
            if (res?.message) {
              console.log(error);
              setError(res.message);
              toast.error(res.message);
            } else {
              toast.success('Article created!');
              form.reset();
              router.push('/posts');
            }
          })
          .catch(() => {
            setError('Something went wrong');
            toast.error('Something went wrong');
          });
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col xl:flex-row gap-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="w-full xl:w-2/3">
          <div className="bg-primary-foreground rounded-lg ">
            <div className="px-4 py-4 rounded-md space-y-4">
              <h1 className="text-xl font-semibold">Create New Arcicle</h1>

              <FormField
                disabled={isPending}
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title :</FormLabel>
                    <FormControl>
                      <Input
                        className="text-xl font-semibold p-4 py-6 bg-background"
                        placeholder="e.g: Text For Post Title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isPending}
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Slug :</FormLabel> */}
                    <p className="text-sm text-foreground bg-muted px-3 py-2  rounded italic">
                      <span className="font-semibold">Slug :</span>{' '}
                      {form.watch('slug')}
                    </p>
                    <FormControl className="text-2xl text-red-400">
                      <Input
                        hidden
                        className="text-xl text-blue-300 p-2"
                        placeholder="e.g: Text For Post Title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isPending}
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary :</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="resize-none bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isPending}
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content :</FormLabel>
                    <FormControl className="h-96">
                      <RitchTextEditor {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <div className="w-full space-y-6 xl:w-1/3">
          <div className="bg-primary-foreground p-4 rounded-lg ">
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload />
                )}
                {initialData ? 'Update Article' : 'Submit Article'}
              </Button>
            </div>
          </div>
          <div className="bg-primary-foreground p-4 rounded-lg ">
            <FormField
              control={form.control}
              name="media"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AssetPicker
                      value={field.value ?? []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="bg-primary-foreground p-4 rounded-lg space-y-4 ">
            <FormField
              disabled={isPending}
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Status :</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="min-w-fit bg-background w-full">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredStatus.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              disabled={isPending}
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category :</FormLabel>
                  <FormControl className="">
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="min-w-fit bg-background w-full">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <span className="capitalize">
                              {category.name.toLocaleLowerCase()}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              disabled={isPending}
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagSelector
                      value={field.value}
                      onChange={field.onChange}
                      availableTags={tags}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};
export default ArticelForm;
