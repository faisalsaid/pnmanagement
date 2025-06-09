'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CldImage } from 'next-cloudinary';
import { MediaAsset } from '@prisma/client';

type ImageDetailDialogProps = {
  asset: MediaAsset & { uploader: { name: string | null } };
  trigger?: React.ReactNode;
};

export const ImageDetailDialog = ({
  asset,
  trigger,
}: ImageDetailDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">View Detail</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
        <DialogHeader className="p-4">
          <DialogTitle className="text-xl">
            {asset.title || 'Untitled Image'}
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Uploader : {asset.uploader.name}
          </p>
          <DialogDescription className="text-sm text-muted-foreground">
            {asset.caption || 'No caption provided.'}
          </DialogDescription>
        </DialogHeader>

        <div className="w-full max-h-[80vh] overflow-auto flex justify-center items-center bg-black">
          <CldImage
            alt={asset.title || 'Media Asset'}
            src={asset.public_id as string}
            width={asset.width || 800}
            height={asset.height || 800}
            className="object-contain w-full h-full max-h-[80vh]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
