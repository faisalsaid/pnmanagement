import { Separator } from '@/components/ui/separator';
import HeroSection from './_components/HeroSection';
import PopularPosts from './_components/PopularPosts';
import CategoryHomePage from './_components/CategoryHomePage';
import React from 'react';
import { getAllHeadlineArticle } from '@/actions/postActions';

const WebHomePage = async () => {
  const { result } = await getAllHeadlineArticle();
  // console.log(result);

  return (
    <main className="space-y-4">
      {result && result.length > 0 ? (
        <HeroSection headlinePostLists={result} />
      ) : (
        <BlankHero />
      )}
      <Separator />
      <div className="md:grid grid-cols-3 gap-6">
        {/* List Category */}
        <div className="md:col-span-2 space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <React.Fragment key={i}>
              <CategoryHomePage />
              <Separator />
            </React.Fragment>
          ))}
        </div>
        {/* sidebar */}
        <div>
          <PopularPosts />
        </div>
      </div>
    </main>
  );
};

export default WebHomePage;

const BlankHero = () => {
  return (
    <div className="flex items-center justify-center bg-muted h-48 rounded-xl">
      <p className="text-2xl capitalize font-semibold text-muted-foreground">
        Headline post is empty
      </p>
    </div>
  );
};
