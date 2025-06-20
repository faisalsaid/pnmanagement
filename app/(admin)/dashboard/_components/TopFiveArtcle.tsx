'use client';

import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Prisma } from '@prisma/client';
import { Image } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';

type ArticleProps = Prisma.ArticleGetPayload<{
  select: {
    id: true;
    title: true;
    viewCount: true;
    category: true;
    createdAt: true;
    slug: true;
    media: {
      select: {
        mediaAsset: true;
        role: true;
      };
    };
  };
}>[];

const TopFiveArtcle = ({ articles }: { articles: ArticleProps }) => {
  return (
    <div>
      <h1 className="mb-4 text-lg font-medium">Top Five Articles</h1>
      <div className="space-y-2">
        {articles.map((article) => {
          const futureImage = article.media.find(
            (item) => item.role === 'feature',
          );

          // console.log('futureImage', futureImage);

          return (
            <Card key={article.id} className="p-0">
              <div className="flex gap-2 p-2 items-center">
                <div className="w-[50px] aspect-square bg-primary-foreground rounded-md overflow-hidden flex items-center justify-center">
                  {futureImage ? (
                    <CldImage
                      className="w-full h-full object-cover"
                      width={futureImage.mediaAsset.width as number}
                      height={futureImage.mediaAsset.height as number}
                      alt={
                        (futureImage.mediaAsset.public_id as string) ||
                        'Post Image'
                      }
                      src={
                        (futureImage.mediaAsset.public_id as string) ||
                        (futureImage.mediaAsset.secure_url as string)
                      }
                    />
                  ) : (
                    <Image className="text-muted-foreground" />
                  )}
                </div>
                <Link
                  target="_blank"
                  className="flex-1"
                  href={`/posts/${article.slug}`}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p id="title" className="line-clamp-1 text-sm">
                        {article.title}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{article.title}</p>
                    </TooltipContent>
                  </Tooltip>
                  <p className="text-xs text-muted-foreground">
                    {article.category.name} |{' '}
                    {article.createdAt.toLocaleString('id-ID', {
                      day: 'numeric',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </p>
                </Link>
                <div className="w-[50px] aspect-square bg-green-100 flex flex-col items-center justify-center rounded-md">
                  <p className="text-lg font-semibold text-green-900">
                    {article.viewCount}
                  </p>
                  <p className="text-xs text-green-700">Views</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TopFiveArtcle;
