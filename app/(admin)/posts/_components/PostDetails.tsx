'use client';

import RenderRichText from '@/components/RenderRIchText';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import { Dot } from 'lucide-react';
import { CldImage } from 'next-cloudinary';

export type PostDetail = Prisma.ArticleGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        email: true;
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

  return (
    <Card>
      <CardHeader>
        <h1 className="text-3xl font-semibold text-foreground">{data.title}</h1>
        <div className="flex gap-2 text-sm text-muted-foreground mt-2">
          <span>Category : {data.category.name}</span>
          <Dot />
          <span>
            Created at :
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
        <div className="space-y-2">
          <p>List Asset : </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:grid-cols-5">
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
      </CardContent>
      <CardFooter>
        <div>
          <p>Tags :</p>
          <div className="flex items-center gap-2 mt-2">
            {data.tags.map((item) => (
              <Badge
                className="bg-muted text-accent-foreground"
                key={item.tag.id}
              >
                {item.tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostDetails;
