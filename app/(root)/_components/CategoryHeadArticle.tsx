'use client';

import { getExcerptFromHtml } from '@/lib/helper/excerptAricle';
import { Prisma } from '@prisma/client';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArticleCatgoryType } from '../category/[slug]/page';
import { Eye, Images } from 'lucide-react';

interface Props {
  article: ArticleCatgoryType;
}

type MediaAsset = Props['article']['media'][number]['mediaAsset'];

const CategoryHeadArticle = ({ article }: Props) => {
  //   console.log(article.media);

  const [featureImage, setFeatureImage] = useState<MediaAsset>();
  const excerptArticle = getExcerptFromHtml(article.content, 100);

  useEffect(() => {
    const feature = article.media.find((item) => item.role === 'feature');
    if (feature) {
      setFeatureImage(feature.mediaAsset);
    }
  }, [article.media]);

  // console.log(article);

  return (
    <div className="flex gap-4 ">
      <div className="flex-2/5 rounded-md overflow-hidden w-full aspect-video bg-amber-400">
        {featureImage ? (
          <CldImage
            className="w-full h-full object-cover"
            width={featureImage.width as number}
            height={featureImage.height as number}
            alt={featureImage.public_id as string}
            src={
              (featureImage.public_id as string) ||
              (featureImage.secure_url as string)
            }
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Images className="text-amber-100" />
          </div>
        )}
      </div>

      <div className="flex-3/5 space-y-4">
        <h1 className="text-2xl font-semibold">
          <Link href={`/read/${article.slug}`}>{article.title}</Link>
        </h1>
        <p className="line-clamp-4">{excerptArticle}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground ">
          <p className="">{article.createdAt.toLocaleDateString()}</p>|
          <p className=" flex gap-1 items-center">
            <Eye size={12} /> <span>{article.viewCount}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryHeadArticle;
