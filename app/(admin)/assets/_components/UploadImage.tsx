'use client';

import { saveMediaAssetInfo } from '@/action/mediaAssetAction';
import { Button } from '@/components/ui/button';

import { useSession } from 'next-auth/react';
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from 'next-cloudinary';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { toast } from 'sonner';

const UploadImage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  // const [publicID, setPublicID] = useState<string>('/dummy-image-square.jpg');

  const handleUpload = (result: CloudinaryUploadWidgetResults) => {
    if (result.event !== 'success') {
      toast('The asset upload failed');
      return;
    }

    if (!session?.user.id) {
      toast.error('User not exist');
      return;
    }

    const info = result?.info;
    if (typeof info === 'object' && info.public_id) {
      // console.log('Uploaded to Cloudinary:', info.public_id);

      const data = {
        url: info.url,
        public_id: info.public_id,
        secure_url: info.secure_url,
        resource_type: info.resource_type,
        format: info.format,
        caption: '',
        width: info.width,
        height: info.height,
        uploadedBy: session?.user.id,
        thumbnail_url: info.thumbnail_url,
      };

      // save to DB
      startTransition(async () => {
        try {
          await saveMediaAssetInfo(data);
          // setPublicID(info.public_id);
          router.push('/assets');
          toast.success('Asset saved successfully!');
        } catch (error) {
          console.error('Failed to save asset:', error);
          toast.error('Asset save failed, try again.');
        }
      });
    } else {
      console.warn('Unexpected result from Cloudinary:', result);
    }
  };
  return (
    <div>
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          sources: ['local', 'url', 'camera', 'google_drive', 'unsplash'],
        }}
        signatureEndpoint="/api/sign-cloudinary-params"
        onSuccess={(result) => {
          handleUpload(result);
        }}
        onQueuesEnd={(result, { widget }) => {
          console.log(result);
          widget.close();
        }}
      >
        {({ open }) => {
          function handleOnClick() {
            open();
          }
          return (
            <Button className="w-full" onClick={handleOnClick}>
              Add Asset
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default UploadImage;
