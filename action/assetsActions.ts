'use server';

import cloudinary from '@/lib/cloudinary';
import prisma from '@/lib/prisma';

// DELETE CLOUDINARY ASSET

type DelteMediaAssetPorps = {
  public_id: string;
  id: string;
};

export const deleteMediaAsset = async ({
  public_id,
  id,
}: DelteMediaAssetPorps) => {
  if (!public_id) {
    return { success: false, error: 'publicId is required' };
  }

  try {
    // Hapus dari Cloudinary
    const cloudinaryRes = await cloudinary.uploader.destroy(public_id);

    if (cloudinaryRes.result !== 'ok') {
      return {
        success: false,
        error: `Cloudinary error: ${cloudinaryRes.result}`,
      };
    }

    // Hapus dari DB
    const deleted = await prisma.mediaAsset.delete({
      where: { id },
    });

    return { success: true, data: deleted };
  } catch (error: any) {
    console.error('Delete error:', error);

    // Tangani error Prisma
    if (error.code === 'P2025') {
      return { success: false, error: 'Asset not found in database' };
    }

    return { success: false, error: 'Unexpected error during deletion' };
  }
};
