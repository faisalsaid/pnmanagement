'use client';

import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const TopFiveArtcle = () => {
  return (
    <div>
      <h1 className="mb-4 text-lg font-medium">Top Five Articles</h1>
      <div className="space-y-2">
        {Array.from({ length: 5 }, (_, i) => (
          <Card key={i} className="p-0">
            <div className="flex gap-2 p-2">
              <div className="w-[50px] aspect-square bg-primary-foreground rounded-md"></div>
              <div className="flex-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p id="title" className="line-clamp-1">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Nulla aut itaque.
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Nulla aut itaque.
                    </p>
                  </TooltipContent>
                </Tooltip>
                <p className="text-sm text-muted-foreground">
                  Category | 25 Februari 2025{' '}
                </p>
              </div>
              <div className="w-[50px] aspect-square bg-green-100 flex flex-col items-center justify-center rounded-md">
                <p className="text-lg font-semibold text-green-900">
                  {i % 2 ? '2.K' : '826'}
                </p>
                <p className="text-xs text-green-700">Views</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TopFiveArtcle;
