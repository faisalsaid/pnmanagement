'use client';

import { getExcerptFromHtml } from '@/lib/helper/excerptAricle';
import { ArticleCategoryHomeType } from '@/types/article.type';
import { Eye, Images } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';

interface CategoryHomePageProps {
  category: ArticleCategoryHomeType[];
  categoryName: string;
}

const CategoryHomePage = ({
  category,
  categoryName,
}: CategoryHomePageProps) => {
  const [headCategoryList, ...post] = category;

  // console.log(category);

  if (!category || category.length === 0) {
    return <div>No Post</div>;
  }

  return (
    <div className="space-y-2">
      <div className="capitalize font-semibold text-xl text-orange-600">
        {categoryName}
      </div>
      <HeadCategory article={headCategoryList} />
      <div className="space-y-2">
        {post.map((article) => (
          <PostCard key={article.id} article={article} />
        ))}
        {/* {Array.from({ length: 3 }, (_, i) => (
          <PostCard key={i} />
        ))} */}
      </div>
    </div>
  );
};

export default CategoryHomePage;

interface HeadCategoryProps {
  article: ArticleCategoryHomeType;
}
const HeadCategory = ({ article }: HeadCategoryProps) => {
  const excerptArticle = getExcerptFromHtml(article.content, 100);

  const image = article.media[0];
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="w-full min-h-36 bg-amber-300 rounded-lg overflow-hidden">
        {image ? (
          <CldImage
            className="object-cover w-full h-full"
            alt="image"
            src={image.mediaAsset.public_id as string}
            width={image.mediaAsset.width as number}
            height={image.mediaAsset.height as number}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Images size={24} className="text-amber-100" />
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h1 className="text-lg line-clamp-2">
          <Link href={`/read/${article.slug}`}>{article.title}</Link>
        </h1>
        <p className="text-sm line-clamp-4">{excerptArticle}</p>
        <div className="flex items-center gap-2 text-xs ">
          <p className="text-xs text-muted-foreground">
            {article.createdAt.toLocaleDateString()}
          </p>
          |
          <p className="text-xs text-muted-foreground flex gap-1 items-center">
            <Eye size={12} /> <span>{article.viewCount}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

interface PostCardProps {
  article: ArticleCategoryHomeType;
}
const PostCard = ({ article }: PostCardProps) => {
  const image = article.media[0];
  return (
    <div className="flex items-start gap-4">
      <div className=" min-w-28 w-28 aspect-video bg-amber-400 rounded-md overflow-hidden">
        {image ? (
          <CldImage
            className="object-cover w-full h-full"
            alt="image"
            src={image.mediaAsset.public_id as string}
            width={image.mediaAsset.width as number}
            height={image.mediaAsset.height as number}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Images size={18} className="text-amber-100" />
          </div>
        )}
      </div>
      <div className="grow">
        <Link href={`/read/${article.slug}`}>
          <h1>{article.title}</h1>
        </Link>
        <div className="flex items-center gap-2 text-xs ">
          <p className="text-xs text-muted-foreground">
            {article.createdAt.toLocaleDateString()}
          </p>
          |
          <p className="text-xs text-muted-foreground flex gap-1 items-center">
            <Eye size={12} /> <span>{article.viewCount}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
