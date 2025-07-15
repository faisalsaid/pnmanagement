import { Separator } from '@/components/ui/separator';
import HeroSection from './_components/HeroSection';
import PopularPosts from './_components/PopularPosts';
import CategoryHomePage from './_components/CategoryHomePage';
import React from 'react';
import {
  get3CategoriesForHome,
  getAllHeadlineArticle,
} from '@/actions/postActions';

const WebHomePage = async () => {
  const { success: headStatus, data: headData } = await getAllHeadlineArticle();

  const { success: categoryStatus, data: categoryData } =
    await get3CategoriesForHome();

  // console.log('headStatus', headStatus, headData);
  // console.log('categoryStatus', categoryStatus, categoryData);
  // // console.log(categoryHome);

  return (
    <main className="space-y-4">
      {headStatus && headData.length > 0 ? (
        <HeroSection headlinePostLists={headData} />
      ) : (
        <BlankHero />
      )}
      <Separator />
      {categoryStatus ? (
        <div className="md:grid grid-cols-3 gap-6">
          {/* List Category */}
          <div className="md:col-span-2 space-y-4">
            {categoryData && categoryData.length > 0 ? (
              categoryData.map((category) => (
                <React.Fragment key={category.name}>
                  <CategoryHomePage
                    category={category.data}
                    categoryName={category.name}
                  />
                  <Separator />
                </React.Fragment>
              ))
            ) : (
              <div>Empty post</div>
            )}
          </div>
          {/* sidebar */}
          <div>
            <PopularPosts />
          </div>
        </div>
      ) : (
        <div>Fail get data</div>
      )}
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
