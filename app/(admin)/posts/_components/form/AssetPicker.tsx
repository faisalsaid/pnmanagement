'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { getAllMediaAsset } from '@/action/mediaAssetAction';
import { MediaAsset } from '@prisma/client';
import { CldImage } from 'next-cloudinary';
import { Select } from '@radix-ui/react-select';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SelectedAsset = MediaAsset & { role: string };

type AssetWithRole = {
  id: string;
  role: string;
};

type AssetPickerProps = {
  value: AssetWithRole[];
  onChange: (value: AssetWithRole[]) => void;
};

export default function AssetPicker({ value, onChange }: AssetPickerProps) {
  const [selectedAssets, setSelectedAssets] = useState<SelectedAsset[]>([]);
  const [open, setOpen] = useState(false);
  const [allAsset, setAllAsset] = useState<SelectedAsset[]>([]);

  useEffect(() => {
    const fetchAllAsset = async () => {
      const response = await getAllMediaAsset();
      if (response?.success && response.data) {
        const dataWithRole = response.data.map((asset) => ({
          ...asset,
          role: 'default',
        }));
        setAllAsset(dataWithRole);
      } else {
        console.error('Failed to fetch assets', response);
      }
    };
    fetchAllAsset();
  }, []);

  useEffect(() => {
    if (value?.length && allAsset.length) {
      const selected = allAsset
        .filter((asset) => value.some((v) => v.id === asset.id))
        .map((asset) => {
          const matched = value.find((v) => v.id === asset.id);
          return {
            ...asset,
            role: matched?.role || 'default',
          };
        });

      setSelectedAssets(selected);
    }
  }, [value, allAsset]);

  const toggleSelect = (asset: MediaAsset) => {
    setSelectedAssets((prev) => {
      const exists = prev.find((a) => a.id === asset.id);
      if (exists) {
        return prev.filter((a) => a.id !== asset.id);
      } else {
        return [...prev, { ...asset, role: 'default' }];
      }
    });
  };

  const handleConfirm = () => {
    onChange(selectedAssets.map(({ id, role }) => ({ id, role })));
    setOpen(false);
    // console.log('Sending payload:', selectedAssets); // 🐞 Debug
  };

  return (
    <div className="space-y-4">
      {/* Button trigger modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Set Asset</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Media Assets</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2 max-h-96 overflow-auto">
            {allAsset.map((asset) => {
              const isSelected = selectedAssets.some((a) => a.id === asset.id);
              return (
                <div
                  key={asset.id}
                  onClick={() => toggleSelect(asset)}
                  className={`cursor-pointer border-2 w-full aspect-square rounded-sm p-2 ${
                    isSelected ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <CldImage
                    width={asset.width as number}
                    height={asset.height as number}
                    src={
                      (asset.thumbnail_url as string) ||
                      (asset.public_id as string)
                    }
                    alt={`Thumbnail ${asset.title}`}
                    className="w-full h-full object-cover rounded-sm"
                  />
                </div>
              );
            })}
          </div>
          <div className="text-right mt-4">
            <Button onClick={handleConfirm}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Selected Thumbnails Display */}
      <div className="grid grid-cols-2 gap-4">
        {selectedAssets.map((asset) => (
          <div
            key={asset.id}
            className="relative w-full aspect-square space-y-2"
          >
            <CldImage
              width={asset.width as number}
              height={asset.height as number}
              src={
                (asset.thumbnail_url as string) || (asset.public_id as string)
              }
              alt={`Thumbnail ${asset.title}`}
              className="w-full h-full object-cover rounded-sm"
            />

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 rounded-full"
              onClick={() => {
                const updated = selectedAssets.filter((a) => a.id !== asset.id);
                setSelectedAssets(updated);
                onChange(updated); // <- Sync ke parent
              }}
            >
              <X className="w-4 h-4 text-red-500  " />
            </Button>

            <Select
              value={asset.role}
              onValueChange={(newRole) => {
                const updated = selectedAssets.map((a) =>
                  a.id === asset.id ? { ...a, role: newRole } : a,
                );
                setSelectedAssets(updated);
                onChange(updated); // trigger change to parent
              }}
            >
              <SelectTrigger className="w-full text-xs py-1 px-2 h-8">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
                <SelectItem value="gallery">Gallery</SelectItem>
              </SelectContent>
            </Select>

            {/* <select
              className="mt-1 w-full text-xs border rounded py-1 px-2"
              value={asset.role}
              onChange={(e) => {
                const newRole = e.target.value;
                const updated = selectedAssets.map((a) =>
                  a.id === asset.id ? { ...a, role: newRole } : a,
                );
                setSelectedAssets(updated);
                onChange(updated); // <- trigger perubahan ke parent
              }}
            >
              <option value="default">Default</option>
              <option value="feature">Feature</option>
              <option value="gallery">Gallery</option>
            </select> */}
          </div>
        ))}
      </div>
    </div>
  );
}
