import { Eye, Images } from 'lucide-react';
import { ArticleCatgoryType } from '../[slug]/page';

interface Props {
  article: ArticleCatgoryType;
}

const CategoryPostCard = ({ article }: Props) => {
  return (
    <div className="space-y-2 ">
      <div className="bg-amber-400 h-32 w-full rounded-lg overflow-hidden">
        <div className="flex items-center justify-center w-full h-full">
          <Images className="text-amber-100" />
        </div>
      </div>
      <h1 className="line-clamp-2">{article.title}</h1>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <p className="">{article.createdAt.toLocaleDateString()}</p>|
        <p className=" flex gap-1 items-center">
          <Eye size={12} /> <span>{article.viewCount}</span>
        </p>
      </div>
    </div>
  );
};

export default CategoryPostCard;
