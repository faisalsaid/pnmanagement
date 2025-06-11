'use client';

import { getExcerptFromHtml } from '@/lib/helper/excerptAricle';
import { Prisma } from '@prisma/client';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';

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

const CategoryHeadArticle = ({ article }: Props) => {
  //   console.log(article.media);

  const excerptArticle = getExcerptFromHtml(article.content, 30);

  const { mediaAsset: fetureImage } = article.media.filter(
    (item) => item.role === 'feature',
  )[0];

  //   console.log(fetureImage);

  return (
    <div className="flex gap-4 ">
      <div className="flex-2/5 rounded-md overflow-hidden">
        <CldImage
          className="w-full h-full object-cover"
          width={fetureImage.width as number}
          height={fetureImage.height as number}
          alt={fetureImage.public_id as string}
          src={fetureImage.public_id as string}
        />
      </div>
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
