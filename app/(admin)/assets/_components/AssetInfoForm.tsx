'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CldImage } from 'next-cloudinary';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UpdateAssetInfoSchema } from '@/lib/zod';
import {
  deleteMediaAsset,
  updateMediaAssetInfo,
} from '@/action/mediaAssetAction';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MediaAsset } from '@prisma/client';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const AssetInfoForm = ({
  asset,
}: {
  asset: MediaAsset & { uploader: { name: string | null; id: string } };
}) => {
  // console.log('AssetInfoForm ==>', asset);

  const { data: session } = useSession();
  const [permsion] = useState(
    session?.user.role &&
      (['ADMIN', 'PEMRED', 'REDAKTUR'].includes(session?.user.role) ||
        asset.uploader.id === session.user.id),
  );

  console.log(session);

  const router = useRouter();

  const form = useForm<z.infer<typeof UpdateAssetInfoSchema>>({
    resolver: zodResolver(UpdateAssetInfoSchema),
    defaultValues: {
      id: asset.id,
      title: asset.title || '',
      caption: asset.caption || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof UpdateAssetInfoSchema>) => {
    try {
      await updateMediaAssetInfo(values);
      toast.success('Asset updated');
      router.refresh();
    } catch {
      toast.error('Failed to update asset');
    }
  };

  const handleDelete = async () => {
    // alert(asset.id);
    if (!asset.id || !asset.public_id) {
      toast.success('Please select a asset');
      return;
    }
    try {
      await deleteMediaAsset({ id: asset.id, public_id: asset.public_id! });
      toast.success('Asset deleted');
      router.refresh();
    } catch {
      toast.error('Failed to delete asset');
    }
  };

  // console.log(asset.uploader.id, '==', session?.user.id);
  // console.log(permsion);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col justify-between h-full"
      >
        <div>
          <div className="max-h-52 overflow-hidden">
            <CldImage
              alt="thumbnail"
              src={
                (asset.thumbnail_url as string) || (asset.public_id as string)
              }
              width={asset.width!}
              height={asset.height!}
              className=" object-cover w-full h-full"
            />
          </div>
          <p className="mx-4 text-sm mt-2 text-muted-foreground">
            Uploader: {asset.uploader.name}
          </p>
        </div>
        <div className="p-4 space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!permsion as boolean} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caption</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="resize-none"
                    disabled={!permsion as boolean}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-2">
            {permsion && (
              <Button type="submit" className="flex-1">
                Save
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center mb-4 ">
          {(permsion as boolean) && (
            <ConfirmDialog
              title="Delete this asset?"
              description="This action cannot be undone. The asset will be permanently removed."
              onConfirm={handleDelete}
              confirmLabel="Yes, Delete"
              cancelLabel="Cancel Delete"
              trigger={
                <Button
                  type="button"
                  variant="link"
                  className="hover:text-red-500"
                >
                  Delete
                </Button>
              }
            />
          )}

          {/* <Button
            type="button"
            variant="link"
            onClick={handleDelete}
            className="hover:text-red-500"
          >
            Delete
          </Button> */}
        </div>
      </form>
    </Form>
  );
};

export default AssetInfoForm;
