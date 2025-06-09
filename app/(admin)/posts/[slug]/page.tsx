import prisma from '@/lib/prisma';
import PostDetails from '../_components/PostDetails';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Edit } from 'lucide-react';
import AuthorCard from '@/components/AuthorCard';
import Link from 'next/link';
import { auth } from '@/auth';

interface Params {
  slug: string;
}

interface PostDetailsProps {
  params: Promise<Params>;
}

const PostsDetailsPage = async ({ params }: PostDetailsProps) => {
  const { slug } = await params;
  const session = await auth();

  // console.log(session);

  const post = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
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
      tags: {
        select: {
          tag: true,
        },
      },
      media: {
        select: {
          mediaAsset: true,
          role: true,
        },
      },
    },
  });
  // console.log(post);

  const permision =
    ['ADMIN', 'PEMRED', 'REDAKTUR'].includes(session?.user.role as string) ||
    post?.author.id === session?.user.id;

  if (!post) {
    return <div>Post not found.</div>;
  }
  return (
    <div className="flex flex-col xl:flex-row gap-8">
      <div className="w-full space-y-6 xl:w-2/3">
        <div className="bg-primary-foreground p-4 rounded-lg ">
          <PostDetails data={post} />
        </div>
      </div>
      <div className="w-full space-y-6 xl:w-1/3">
        <div className="bg-primary-foreground p-4 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <p>Article Info</p>
            {permision && (
              <Link href={`./${post.slug}/update`}>
                <Button>
                  <Edit /> <span>Edit Post</span>
                </Button>
              </Link>
            )}
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="text-sm">Author :</p>
            <div className="border rounded-lg overflow-hidden p-2 bg-background">
              <AuthorCard author={post.author} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostsDetailsPage;
