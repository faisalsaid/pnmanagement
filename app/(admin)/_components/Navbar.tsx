'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

// import ui
import {
  Globe,
  House,
  LogOutIcon,
  Moon,
  Settings,
  Sun,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const Navbar = ({ data }: { data: Session | null }) => {
  // console.log(data);

  const { setTheme } = useTheme();
  return (
    <nav className="p-4 flex items-center justify-between sticky top-0 z-10 bg-primary-foreground">
      {/* LEFT */}
      <div className="flex gap-2 items-center">
        <SidebarTrigger className="" />
      </div>
      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* <Link href={'/'}>Dashboard</Link> */}
        <div>
          <Link href={'/'}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={'outline'} size={'icon'}>
                  <Globe />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Visit Website</p>
              </TooltipContent>
            </Tooltip>
          </Link>
        </div>
        {/* THEME MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="hidden sm:block">
          <p className="capitalize">{data?.user.name}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {data?.user.role.toLocaleLowerCase()}
          </p>
        </div>
        {/* USER MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="hover:cursor-pointer">
              <AvatarImage src={data?.user.image as string} alt={'profile'} />
              <AvatarFallback>!</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10}>
            <DropdownMenuLabel>
              <div className=" sm:hidden">
                <p className="capitalize line-clamp-1 ">{data?.user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {data?.user.role.toLocaleLowerCase()}
                </p>
              </div>
              <p className="hidden sm:block">My Account</p>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <Link href={'/profile'}>
              <DropdownMenuItem>
                <User className="h-[1.2rem] w-[1.2rem] mr-2" />
                Profile
              </DropdownMenuItem>
            </Link>
            <Link href={'/room'}>
              <DropdownMenuItem>
                <House className="h-[1.2rem] w-[1.2rem] mr-2" />
                My Room
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem>
              <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <Button
                onClick={() => signOut({ redirectTo: '/' })}
                variant={'outline'}
              >
                <LogOutIcon className="h-[1.2rem] w-[1.2rem] mr-2" />
                Logout
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
