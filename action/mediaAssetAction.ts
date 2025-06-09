'use server';

import prisma from '@/lib/prisma';
import { addAssetSchema, UpdateAssetInfoSchema } from '@/lib/zod';
import { MediaAsset } from '@prisma/client';
import { z } from 'zod';
import cloudinary from '@/lib/cloudinary';

type MediaAssetInput = Partial<
  Omit<MediaAsset, 'id' | 'uploadedAt' | 'uploader' | 'usages'>
> &
  z.infer<typeof addAssetSchema>;

export const saveMediaAssetInfo = async (dataAsset: MediaAssetInput) => {
  // console.log('saveMediaAssetInfo => 14', dataAsset);

  if (!dataAsset) {
    throw new Error('No data to save');
  }

  // chek if uploader exist
  const uploader = await prisma.user.findUnique({
    where: { id: dataAsset.uploadedBy },
  });

  if (!uploader) {
    throw new Error('Uploader not exist');
  }

  try {
    const saved = await prisma.mediaAsset.create({
      data: {
        url: dataAsset.url,
        public_id: dataAsset.public_id,
        secure_url: dataAsset.secure_url,
        resource_type: dataAsset.resource_type,
        format: dataAsset.format,
        caption: dataAsset.caption,
        width: dataAsset.width,
        height: dataAsset.height,
        uploadedBy: dataAsset.uploadedBy,
        thumbnail_url: dataAsset.thumbnail_url,
      },
    });
    return saved;
  } catch (error) {
    console.error('Failed to save media asset:', error);
    throw error;
  }
};

// HANDLE UPDATE ASSET INFO
type UpdateMediaAssetProps = z.infer<typeof UpdateAssetInfoSchema>;
export const updateMediaAssetInfo = async (asset: UpdateMediaAssetProps) => {
  console.log(asset.id, asset.title, asset.caption);
  if (!asset.id) {
    throw new Error('Asset ID is required');
  }

  try {
    const updated = await prisma.mediaAsset.update({
      where: {
        id: asset.id,
      },
      data: {
        title: asset.title,
        caption: asset.caption,
      },
    });

    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    console.error('Failed to update media asset:', error);
    return {
      success: false,
      error: 'Failed to update asset info',
    };
  }
};

// DELETE CLOUDINARY ASSET

type DeleteMediaAssetProps = {
  public_id: string;
  id: string;
};

export const deleteMediaAsset = async ({
  public_id,
  id,
}: DeleteMediaAssetProps) => {
  console.log('deleteMediaAsset =>>', public_id, id);

  if (!public_id || !id) {
    return { success: false, error: 'publicId is required' };
  }

  try {
    // Hapus dari Cloudinary
    const cloudinaryRes = await cloudinary.uploader.destroy(public_id);

    if (cloudinaryRes.result !== 'ok' && cloudinaryRes.result !== 'not found') {
      return {
        success: false,
        error: `Cloudinary error: ${cloudinaryRes.result}`,
      };
    }

    const media = await prisma.mediaAsset.findUnique({ where: { id } });
    console.log('Media in DB:', media);

    // Hapus dari DB
    const deleted = await prisma.mediaAsset.delete({
      where: { id },
    });

    return { success: true, data: deleted };
  } catch (error: any) {
    console.error('Delete error:', error);

    // handle error Prisma
    if (error.code === 'P2025') {
      return { success: false, error: 'Asset not found in database' };
    }

    return { success: false, error: 'Unexpected error during deletion' };
  }
};

export const getAllMediaAsset = async (): Promise<
  { success: true; data: MediaAsset[] } | { success: false; error: string }
> => {
  try {
    const allAsset = await prisma.mediaAsset.findMany();
    return { success: true, data: allAsset };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
};

// GET ALL UPLOADER

export const getAllUploader = async () => {
  try {
    const allUploader = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return { success: true, data: allUploader };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
};

// HANDLE GE ALL ASSET
interface GetAllAssetsProps {
  search?: string;
  uploadedBy?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

interface GetAllAssetsProps {
  search?: string;
  uploadedBy?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export async function getAllAssets({
  search,
  uploadedBy,
  sortBy = 'uploadedAt', // Ganti default sortBy ke field yang valid
  sortOrder = 'desc',
  page = 1,
  pageSize = 10,
}: GetAllAssetsProps) {
  const allowedSortFields = ['uploadedAt', 'title', 'caption']; // Tambah sesuai field model
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'uploadedAt';

  const where = {
    ...(search && {
      OR: [{ title: { contains: search } }, { caption: { contains: search } }],
    }),
    ...(uploadedBy && { uploadedBy }),
  };

  const [assets, total] = await Promise.all([
    prisma.mediaAsset.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: {
        uploader: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      orderBy: {
        [sortField]: sortOrder,
      },
    }),
    prisma.mediaAsset.count({ where }),
  ]);

  return {
    assets,
    total,
    totalPages: Math.ceil(total / pageSize),
    page,
    limit: pageSize,
  };
}

///////////////////////

// type MediaAssetInput = Partial<
//   Omit<MediaAsset, 'id' | 'uploadedAt' | 'uploader' | 'usages'>
// > & {
//   url: string;
//   resource_type: string;
//   uploadedBy: string;
// };
