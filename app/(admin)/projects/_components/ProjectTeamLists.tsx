'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const ProjectTeamLists = () => {
  return (
    <div className="flex items-center gap-2 w-fit ml-auto sm:ml-0 ">
      <div className="*:data-[slot=avatar]:ring-background flex hover:space-x-0.5 -space-x-2 *:data-[slot=avatar]:ring-2 ">
        <Avatar className="transition-all duration-500 ease-in-out ">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar className="transition-all duration-500 ease-in-out ">
          <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar className="transition-all duration-500 ease-in-out ">
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>+5</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <Button className="flex items-center" size={'sm'}>
          <Plus /> <span>Invite</span>
        </Button>
      </div>
    </div>
  );
};

export default ProjectTeamLists;
