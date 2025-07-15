'use client';

import { TenPopularArticleType } from '@/types/article.type';
import { Images } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';

interface Props {
  post: TenPopularArticleType;
}

const PopularPostCard = ({ post }: Props) => {
  const media = post.media[0];

  return (
    <div className="flex items-center gap-2">
      <div className=" w-16 aspect-square  bg-orange-400 rounded-md overflow-hidden shrink-0 ">
        {media ? (
          <CldImage
            className="object-cover w-full h-full  "
            alt="articel image"
            src={media?.mediaAsset.public_id as string}
            width={64}
            height={64}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Images size={18} className="text-amber-100" />
          </div>
        )}
      </div>
      <h1 className="text-sm line-clamp-3 flex-grow ">
        <Link href={`/read/${post.slug}`}>{post.title}</Link>
      </h1>
      <div className="flex flex-col items-center p-2 bg-amber-100 rounded-sm justify-center text-amber-800">
        <span className="font-semibold">{post.viewCount}</span>
        <span className="text-xs">views</span>
      </div>
    </div>
  );
};

export default PopularPostCard;
