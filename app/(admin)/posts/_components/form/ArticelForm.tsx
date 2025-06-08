'use client';

import { postFormSchema } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const postStatus: string[] = ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'];

type Tag = { id: string; name: string; slug: string };

type Props = {
  initialData?: z.infer<typeof postFormSchema>;
  //   categories: { id: string; name: string }[];
  //   userId: string | undefined;
  //   onSubmit: (data: FormSchema) => void;
};

const ArticelForm = ({ initialData }: Props) => {
  const { data: session } = useSession();
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
      authorId: session?.user.id || '',
      media: [],
    },
  });
  return (
    <>
      <div className="w-full space-y-6 xl:w-2/3">
        <div className="bg-primary-foreground p-4 rounded-lg ">
          <div className="mb-4 px-4 py-2 bg-secondary rounded-md">
            <h1 className="text-xl font-semibold">Create New Post</h1>
          </div>
        </div>
      </div>
      <div className="w-full space-y-6 xl:w-1/3">
        <div className="bg-primary-foreground p-4 rounded-lg "></div>
        <div className="bg-primary-foreground p-4 rounded-lg "></div>
      </div>
    </>
  );
};
export default ArticelForm;
