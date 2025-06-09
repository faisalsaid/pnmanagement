'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ReactNode, useState } from 'react';

type ConfirmDialogProps = {
  title?: string;
  description?: string;
  trigger: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
};

const ConfirmDialog = ({
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  trigger,
  confirmLabel = 'Yes, Delete',
  cancelLabel = 'Cancel',
  onConfirm,
}: ConfirmDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleConfirm}>
            {confirmLabel}
          </Button>
          <Button variant="default" onClick={() => setOpen(false)}>
            {cancelLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
