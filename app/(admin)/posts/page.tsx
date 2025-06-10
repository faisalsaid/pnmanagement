import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import AllPostsColumns from './_components/AllPostColumns';
import AllPostTable from './_components/AllPostsTable';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import Link from 'next/link';
import { Prisma } from '@prisma/client';
import PostFilterBar from './_components/PostFilterBar';

interface ParamsProps {
  search?: string;
  authorId?: string;
  categoryId?: string;
  status?: string;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: string | string[];
  sortOrder?: string | string[];
  page?: string;
  pageSize?: string;
}

interface PostPageProps {
  searchParams: Promise<ParamsProps>;
}

const PostPage = async ({ searchParams }: PostPageProps) => {
  const params = await searchParams;
  const allAuthor = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  // console.log('POSTS PAGE ==> chec params', params);

  const {
    search,
    authorId,
    categoryId,
    createdFrom,
    createdTo,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = '1',
    pageSize = '10',
  } = params;

  const status = params.status as 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

  const where = {
    ...(search && {
      title: {
        contains: search,
        // mode: 'insensitive',
        mode: 'insensitive' as const,
      },
    }),
    ...(authorId && { authorId }),
    ...(categoryId && { categoryId }),
    ...(status && { status }),
    ...(createdFrom &&
      createdTo && {
        createdAt: {
          gte: new Date(createdFrom),
          lte: new Date(createdTo),
        },
      }),
  };

  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const pageSizeNumber = Math.max(parseInt(pageSize, 10) || 10, 1);

  // Normalize sortBy and sortOrder to arrays for multi-sort support
  const sortByFields = Array.isArray(sortBy) ? sortBy : sortBy.split(',');
  const sortOrders = Array.isArray(sortOrder)
    ? sortOrder
    : sortOrder.split(',');

  const orderBy: Prisma.ArticleOrderByWithRelationInput[] = [];

  sortByFields.forEach((field: string, idx: number) => {
    const order = (sortOrders[idx] || 'asc').toLowerCase();
    if (field === 'author') {
      orderBy.push({ author: { name: order as 'asc' | 'desc' } });
    } else if (field === 'category') {
      orderBy.push({ category: { name: order as 'asc' | 'desc' } });
    } else if (
      ['title', 'createdAt', 'status', 'publishedAt'].includes(field)
    ) {
      orderBy.push({ [field]: order as 'asc' | 'desc' });
    }
  });

  // Always add fallback sorting by createdAt desc
  orderBy.push({ createdAt: 'desc' });

  const [data, total] = await Promise.all([
    prisma.article.findMany({
      where,
      take: pageSizeNumber,
      skip: (pageNumber - 1) * pageSizeNumber,
      orderBy,
      select: {
        id: true,
        title: true,
        createdAt: true,
        status: true,
        slug: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            articles: {
              select: {
                id: true,
              },
            },
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),
    prisma.article.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSizeNumber);

  if (pageNumber > totalPages && totalPages > 0) {
    redirect(`/posts?page=1&pageSize=${pageSizeNumber}`);
  }
  return (
    <div className="flex flex-col xl:flex-row gap-8">
      <div className="w-full space-y-6 ">
        <div className="bg-primary-foreground p-4 rounded-lg space-y-4 ">
          <div className="mb-4 px-4 py-2 bg-secondary rounded-md flex justify-between items-center">
            <h1 className="text-xl font-semibold">All Post</h1>
            <Link href={'/posts/create'}>
              <Button>
                <FilePlus /> <span>Add New Post</span>
              </Button>
            </Link>
          </div>
          <div>
            <PostFilterBar author={allAuthor} categories={categories} />
          </div>
          <AllPostTable
            columns={AllPostsColumns}
            data={data}
            pagination={{
              page: pageNumber,
              limit: pageSizeNumber,
              totalPages,
              total,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PostPage;
