'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CldImage } from 'next-cloudinary';

import { MediaAsset } from '@prisma/client';
import AssetInfoForm from './AssetInfoForm';
import { ImageDetailDialog } from '@/components/ImageDetailDialog';

const AssetCard = ({
  asset,
}: {
  asset: MediaAsset & { uploader: { name: string | null; id: string } };
}) => {
  return (
    <div className="group relative aspect-square w-full overflow-hidden rounded-sm">
      <CldImage
        className="object-cover h-full w-full"
        alt="media asset"
        src={(asset.thumbnail_url as string) || (asset.public_id as string)}
        height={asset.height!}
        width={asset.width!}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 gap-2">
        <ImageDetailDialog
          asset={asset}
          trigger={
            <Button size="sm" variant="secondary">
              View
            </Button>
          }
        />
        <Sheet>
          <SheetTrigger asChild>
            <Button size="sm">Info</Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-[500px]">
            <SheetHeader>
              <SheetTitle>Asset Info</SheetTitle>
            </SheetHeader>

            <AssetInfoForm asset={asset} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default AssetCard;
