'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
  projectCreator: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
  currentUser?: {
    id: string;
    name: string | null | undefined;
    email: string | null | undefined;
    role: string;
  } | null;
  projectId: string;
};

const ProjectsActionsCell = ({
  projectCreator,
  currentUser,
  projectId,
}: Props) => {
  const [permission, setPermission] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const isAllowed =
        currentUser.id === projectCreator.id || currentUser.role === 'ADMIN';
      setPermission(isAllowed);
    }
  }, [currentUser]);

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="text-muted-foreground">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/projects/${projectId}`}>View Detail</Link>
          </DropdownMenuItem>
          {permission && (
            <DropdownMenuItem asChild>
              {/* <Link href={`/posts/${post.slug}/update`}>Edit</Link> */}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {permission && (
            <DropdownMenuItem
              onClick={() => setOpen(true)}
              className="text-red-600 cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProjectsActionsCell;
