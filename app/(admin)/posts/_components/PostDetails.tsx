'use client';

import AuthorCard from '@/components/AuthorCard';
import RenderRichText from '@/components/RenderRIchText';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import { Dot, Edit } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';

export type PostDetail = Prisma.ArticleGetPayload<{
  include: {
    author: {
      include: {
        articles: {
          select: {
            id: true;
          };
        };
      };
    };
    category: {
      select: {
        id: true;
        name: true;
        slug: true;
      };
    };
    tags: {
      select: {
        tag: true;
      };
    };
    media: {
      select: {
        mediaAsset: true;
        role: true;
      };
    };
  };
}>;

const PostDetails = ({ data }: { data: PostDetail }) => {
  // console.log('PostDetails', data);

  const { data: session } = useSession();

  const permision =
    ['ADMIN', 'PEMRED', 'REDAKTUR'].includes(session?.user.role as string) ||
    data?.author.id === session?.user.id;

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      <div className="w-full space-y-6 xl:w-2/3">
        <div className="bg-primary-foreground p-4 rounded-lg ">
          <Card>
            <CardHeader>
              <h1 className="text-3xl font-semibold text-foreground mb-4">
                {data.title}
              </h1>
              <div className="flex flex-col sm:flex-row gap-2 text-sm text-muted-foreground mt-2">
                <span>Category : {data.category.name}</span>

                <Dot className="hidden sm:block" />
                <span>
                  Created at :{' '}
                  {data.createdAt.toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span
                  className={cn(
                    'px-2 border w-max rounded-sm capitalize',
                    data.status === 'DRAFT'
                      ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500'
                      : data.status === 'PUBLISHED'
                      ? 'bg-green-500/20 border-green-500 text-green-500'
                      : data.status === 'ARCHIVED'
                      ? 'bg-red-500/20 border-red-500 text-red-500'
                      : 'bg-sky-500/20 border-sky-500 text-sky-500',
                  )}
                >
                  {data.status.toLowerCase()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <RenderRichText content={data.content as string} />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="w-full space-y-6 xl:w-1/3">
        <div className="bg-primary-foreground p-4 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <p>Article Info</p>
            {permision && (
              <Link href={`./${data.slug}/update`}>
                <Button>
                  <Edit /> <span>Edit Post</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="bg-primary-foreground p-4 rounded-lg space-y-4">
          <div className="space-y-2">
            <p className="text-sm">Author :</p>
            <div className="border rounded-lg overflow-hidden p-2 bg-background">
              <AuthorCard author={data.author} />
            </div>
          </div>
        </div>

        <div className="bg-primary-foreground p-4 rounded-lg space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold">Summary :</p>
            <p className="italic text-muted-foreground text-sm">
              {data.summary}
            </p>
          </div>
        </div>

        <div className="bg-primary-foreground p-4 rounded-lg space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold">Asset :</p>
            <div className="grid grid-cols-2  gap-2 ">
              {data.media.map((asset) => (
                <div
                  key={asset.mediaAsset.id}
                  className="w-full aspect-square rounded-md overflow-hidden relative"
                >
                  <p className="absolute capitalize py-1 px-2 text-sm bg-accent-foreground rounded-md text-muted right-2 bottom-2">
                    {asset.role}
                  </p>
                  <CldImage
                    className="w-full h-full object-cover"
                    width={asset.mediaAsset.width as number}
                    height={asset.mediaAsset.height as number}
                    src={
                      (asset.mediaAsset.thumbnail_url as string) ||
                      (asset.mediaAsset.public_id as string)
                    }
                    alt="Description of my image"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-primary-foreground p-4 rounded-lg space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold">Tags :</p>
            {data.tags &&
              data.tags.map((data) => (
                <Badge key={data.tag.id}>{data.tag.name}</Badge>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
