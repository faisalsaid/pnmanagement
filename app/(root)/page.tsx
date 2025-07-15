// import { Separator } from '@/components/ui/separator';
// import HeroSection from './_components/HeroSection';
// import PopularPosts from './_components/PopularPosts';
// import CategoryHomePage from './_components/CategoryHomePage';
// import React from 'react';
// import {
//   get3CategoriesForHome,
//   getAllHeadlineArticle,
// } from '@/actions/postActions';

const WebHomePage = async () => {
  return <BlankHero />;
  // const { success: headStatus, result } = await getAllHeadlineArticle();

  // const { success: categoryStatus, data } = await get3CategoriesForHome();

  // // console.log(categoryHome);

  // return (
  //   <main className="space-y-4">
  //     {headStatus && result.length > 0 ? (
  //       <HeroSection headlinePostLists={result} />
  //     ) : (
  //       <BlankHero />
  //     )}
  //     <Separator />
  //     {categoryStatus ? (
  //       <div className="md:grid grid-cols-3 gap-6">
  //         {/* List Category */}
  //         <div className="md:col-span-2 space-y-4">
  //           {data && data.length > 0 ? (
  //             data.map((category) => (
  //               <React.Fragment key={category.name}>
  //                 <CategoryHomePage
  //                   category={category.data}
  //                   categoryName={category.name}
  //                 />
  //                 <Separator />
  //               </React.Fragment>
  //             ))
  //           ) : (
  //             <div>Empty post</div>
  //           )}
  //         </div>
  //         {/* sidebar */}
  //         <div>
  //           <PopularPosts />
  //         </div>
  //       </div>
  //     ) : (
  //       <div>Fail get data</div>
  //     )}
  //   </main>
  // );
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
