import prisma from '@/lib/prisma';
import AllAssetGalery from './_components/AllAssetGalery';

import { auth } from '@/auth';

import { redirect } from 'next/navigation';
import AssetFIlterBar from './_components/AssetFIlterBar';

import UploadImage from './_components/UploadImage';

interface AllAssetProps {
  searchParams: {
    search?: string;
    uploadedBy?: string;
    sortBy?: string | string[];
    sortOrder?: string | string[];
    page?: string;
    pageSize?: string;
  };
}

const AllAssetPage = async ({ searchParams }: AllAssetProps) => {
  const allUploader = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  const session = await auth();
  const params = await searchParams;
  const {
    search,
    uploadedBy,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = '1',
    pageSize = '10',
  } = params;

  const where = {
    ...(search && {
      OR: [{ title: { contains: search } }, { caption: { contains: search } }],
    }),
    ...(uploadedBy && { uploadedBy }),
  };

  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const pageSizeNumber = Math.max(parseInt(pageSize, 10) || 10, 1);

  const [AllAsset, totalAllAsset] = await Promise.all([
    prisma.mediaAsset.findMany({
      where,
      take: pageSizeNumber,
      skip: (pageNumber - 1) * pageSizeNumber,
      include: {
        uploader: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    }),
    prisma.mediaAsset.count({ where }),
  ]);

  const totalPageAllAsset = Math.ceil(totalAllAsset / pageSizeNumber);

  if (pageNumber > totalPageAllAsset && totalPageAllAsset > 0) {
    redirect(`/assets?page=1&pageSize=${pageSizeNumber}`);
  }

  return (
    <div className="w-full space-y-4">
      <div className="bg-primary-foreground rounded-md p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">All Asset</h1>
        <UploadImage />
      </div>

      <div className="bg-primary-foreground rounded-md p-4  space-y-4">
        <AssetFIlterBar uploadBy={allUploader} />
        <AllAssetGalery
          allAsset={AllAsset}
          pagination={{
            page: pageNumber,
            limit: pageSizeNumber,
            totalPages: totalPageAllAsset,
            total: totalAllAsset,
          }}
        />
      </div>
    </div>
  );
};

export default AllAssetPage;
