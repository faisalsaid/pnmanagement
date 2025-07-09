'use client';

import { useState, useTransition } from 'react';
import { createColumn } from '@/actions/projecActions';

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
    <div className="p-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama kolom"
        className="border p-1 rounded"
      />
      <button
        onClick={handleAdd}
        disabled={isPending}
        className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
      >
        Tambah Kolom
      </button>
    </div>
  );
}
