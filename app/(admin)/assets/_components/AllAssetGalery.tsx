'use client';

import { MediaAsset } from '@prisma/client';
import { startTransition, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AssetPagination from './AssetPagination';
import { deleteMediaAsset } from '@/action/mediaAssetAction';
import { toast } from 'sonner';
import { z } from 'zod';
import { UpdateAssetInfoSchema } from '@/lib/zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import AssetCard from './AssetCard';

type AllAssetProps = {
  allAsset: (MediaAsset & { uploader: { name: string | null; id: string } })[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const AllAssetGalery = ({ allAsset, pagination }: AllAssetProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', newPage.toString());
      params.set('limit', pagination.limit.toString());
      router.push(`?${params.toString()}`);
    },
    [router, searchParams, pagination.limit],
  );

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('pageSize', newLimit.toString());
      params.set('page', '1'); // reset ke page pertama
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  // handle delete asset

  interface DeleteAssetProps {
    id: string;
    public_id: string;
  }
  const handleDelete = async ({ id, public_id }: DeleteAssetProps) => {
    if (!id && !public_id) {
      toast.error('Please select asset to delete');
      return;
    }

    startTransition(async () => {
      try {
        await deleteMediaAsset({ id, public_id });
        router.push('/asset');
        toast.success('Asset delete successfully!');
      } catch (error) {
        console.error('Failed to delete asset:', error);
        toast.error('Asset delete failed, try again.');
      }
    });
  };

  const updateInfoForm = useForm<z.infer<typeof UpdateAssetInfoSchema>>({
    resolver: zodResolver(UpdateAssetInfoSchema),
    defaultValues: {
      id: '',
      title: '',
      caption: '',
    },
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {allAsset.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>

      <AssetPagination
        page={pagination.page}
        limit={pagination.limit}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
};

export default AllAssetGalery;
