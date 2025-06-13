'use client';

import { Prisma } from '@prisma/client';
import { CldImage } from 'next-cloudinary';

interface Props {
  asset: Prisma.MediaAssetGetPayload<true>;
}

const ArticelAsset = ({ asset }: Props) => {
  return (
    <div className=" w-full h-96 overflow-hidden">
      <CldImage
        className="w-full h-full object-cover"
        alt={asset.public_id as string}
        src={(asset.public_id as string) || (asset.secure_url as string)}
        width={asset.width as number}
        height={asset.height as number}
      />
    </div>
  );
};

export default ArticelAsset;
