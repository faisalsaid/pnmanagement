'use client';

import { useState, useTransition } from 'react';
import { createColumn } from '@/actions/projecActions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function AddColumn({ projectId }: { projectId: string }) {
  const [name, setName] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleAdd = () => {
    startTransition(() => {
      createColumn({ projectId, name }).then(() => {
        setName('');
        // opsional: refresh data dari parent
      });
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Column name"
        className="border p-1 rounded"
      />
      <Button onClick={handleAdd} disabled={isPending}>
        Add Column
      </Button>
    </div>
  );
}
