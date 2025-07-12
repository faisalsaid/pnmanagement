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
import { updateProjectArchived } from '@/actions/projecActions';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

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
  const [permission, setPermission] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  console.log(openAlert);

  useEffect(() => {
    if (currentUser) {
      const isAllowed =
        currentUser.id === projectCreator.id || currentUser.role === 'ADMIN';
      setPermission(isAllowed);
    }
  }, [currentUser, projectCreator.id]);

  // handle soft delete project

  const handleDeleteProject = async () => {
    setLoading(true);
    try {
      await updateProjectArchived(projectId, true);
      toast.success('Project deleted');
      //eslint-disable-next-line
    } catch (error) {
      toast.error('Fail delete project');
    } finally {
      setOpenAlert(false);
      setLoading(false);
    }
  };

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
              onClick={() => setOpenAlert(true)}
              className="text-red-600 cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ALERT DIALOG DELETE  */}
      <AlertDialog open={openAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              disabled={loading}
              variant={'destructive'}
              onClick={handleDeleteProject}
            >
              Delete
            </Button>
            <Button disabled={loading} onClick={() => setOpenAlert(false)}>
              Cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectsActionsCell;
