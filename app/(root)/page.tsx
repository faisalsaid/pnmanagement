import { Separator } from '@/components/ui/separator';
import HeroSection from './_components/HeroSection';
import PopularPosts from './_components/PopularPosts';
import CategoryHomePage from './_components/CategoryHomePage';
import React from 'react';

const WebHomePage = async () => {
  return (
    <main className="space-y-4">
      <HeroSection />
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
