'use client';

import { Eye } from 'lucide-react';

const CategoryHomePage = () => {
  return (
    <div className="space-y-4">
      <div>Category Title</div>
      <HeadCategory />
      <div className="space-y-2">
        {Array.from({ length: 3 }, (_, i) => (
          <PostCard key={i} />
        ))}
      </div>
    </div>
  );
};

export default CategoryHomePage;

const HeadCategory = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="w-full min-h-36 bg-amber-300 rounded-lg"></div>
      <div className="space-y-2">
        <h1 className="text-lg line-clamp-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </h1>
        <p className="text-sm line-clamp-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa labore,
          quos ratione recusandae accusamus atque hic nemo vero deleniti? Saepe,
          temporibus odio.
        </p>
        <div className="flex items-center gap-2 text-xs ">
          <p className="text-xs text-muted-foreground">07/03/2025</p>|
          <p className="text-xs text-muted-foreground flex gap-1 items-center">
            <Eye size={12} /> <span>2.K</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const PostCard = () => {
  return (
    <div className="flex items-center gap-4">
      <div className="w-28 aspect-video bg-amber-400 rounded-md"></div>
      <div>
        <h1>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</h1>
        <div className="flex items-center gap-2 text-xs ">
          <p className="text-xs text-muted-foreground">07/03/2025</p>|
          <p className="text-xs text-muted-foreground flex gap-1 items-center">
            <Eye size={12} /> <span>2.K</span>
          </p>
        </div>
      </div>
    </div>
  );
};
