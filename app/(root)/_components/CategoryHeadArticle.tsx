'use client';

import { getExcerptFromHtml } from '@/lib/helper/excerptAricle';
import { Prisma } from '@prisma/client';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Props {
  article: Prisma.ArticleGetPayload<{
    include: {
      media: {
        select: {
          mediaAsset: true;
          role: true;
        };
      };
    };
  }>;
}

type MediaAsset = Props['article']['media'][number]['mediaAsset'];

const CategoryHeadArticle = ({ article }: Props) => {
  //   console.log(article.media);

  const [featureImage, setFeatureImage] = useState<MediaAsset>();
  const excerptArticle = getExcerptFromHtml(article.content, 30);

  useEffect(() => {
    const feature = article.media.find((item) => item.role === 'feature');
    if (feature) {
      setFeatureImage(feature.mediaAsset);
    }
  }, [article.media]);

  // console.log(article);

  return (
    <div className="flex gap-4 ">
      {featureImage && (
        <div className="flex-2/5 rounded-md overflow-hidden">
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
        </div>
      )}

      <div className="flex-3/5 space-y-4">
        <h1 className="text-xl font-semibold">
          <Link href={`/read/${article.slug}`}>{article.title}</Link>
        </h1>
        <p>{excerptArticle}</p>
      </div>
    </div>
  );
};

export default CategoryHeadArticle;
