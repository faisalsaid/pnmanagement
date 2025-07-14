'use client';

import { HeadlineArticleType } from '@/types/article.type';
import { Eye } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';

interface HeroSectionProps {
  headlinePostLists: HeadlineArticleType[];
}

const HeroSection = ({ headlinePostLists }: HeroSectionProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-4 md:grid-rows-2">
      {headlinePostLists.map((artcile, i) => (
        <SectionCard
          key={artcile.id}
          artcile={artcile}
          classes={i === 0 ? 'md:row-span-2 md:col-span-2' : ''}
        />
      ))}
      {/* {Array.from({ length: 5 }, (_, i) => (
        <SectionCard
          key={i}
          classes={i === 0 ? 'md:row-span-2 md:col-span-2' : ''}
        />
      ))} */}
    </div>
  );
};

export default HeroSection;

interface SectionCardProps {
  classes?: string;
  artcile: HeadlineArticleType;
}

const SectionCard = ({ classes, artcile }: SectionCardProps) => {
  const theImage = artcile.media.find((media) => media.role === 'feature');
  console.log(theImage?.mediaAsset.public_id);

  return (
    <div
      className={`${classes} bg-amber-300 rounded-lg relative min-h-44 overflow-hidden`}
    >
      <div id="artcile-image" className="absolute inset-0">
        {theImage ? (
          <CldImage
            className="object-cover h-full w-full"
            alt="article image"
            src={theImage?.mediaAsset.public_id as string}
            height={theImage?.mediaAsset.height as number}
            width={theImage?.mediaAsset.width as number}
          />
        ) : null}
      </div>
      <div className="bg-black/50 p-2 absolute bottom-0 w-full space-y-2">
        <h1 className="text-slate-50 line-clamp-2">
          <Link href={`/read/${artcile.slug}`}>{artcile.title}</Link>
        </h1>
        <div className="flex items-center gap-2 text-xs text-slate-50 ">
          <p className="">{artcile.createdAt.toLocaleDateString()}</p>|
          <p className=" flex gap-1 items-center">
            <Eye size={12} /> <span>{artcile.viewCount}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
