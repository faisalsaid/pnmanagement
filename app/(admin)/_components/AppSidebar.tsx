'use client';

// import ui components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

import {
  User2,
  ChevronUp,
  User,
  Plus,
  ChevronDown,
  HelpCircle,
  Info,
  FolderOpenDot,
  LogOutIcon,
  HomeIcon,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { adminMenuList } from '@/app/_lib/listSideBar';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import Link from 'next/link';

const AppSidebar = ({ data }: { data: Session | null }) => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={'/dashboard'}>NEWS</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuList.map((menu) =>
                menu.sub ? (
                  <Collapsible key={menu.title}>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <CollapsibleTrigger asChild>
                          <Link href={'#'}>
                            <menu.icon />
                            <span>{menu.title}</span>
                          </Link>
                        </CollapsibleTrigger>
                      </SidebarMenuButton>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            {menu.sub.map((item) => (
                              <SidebarMenuSubButton asChild key={item.title}>
                                <Link href={item.url}>
                                  <item.icon />
                                  <span>{item.title}</span>
                                </Link>
                                {/* {item.title} */}
                              </SidebarMenuSubButton>
                            ))}
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={menu.title}>
                    <SidebarMenuButton asChild>
                      <Link href={menu.url}>
                        <menu.icon />
                        <span>{menu.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {menu.title === 'Inbox' && (
                      <SidebarMenuBadge>876</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>

            {/* <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.title === 'Inbox' && (
                    <SidebarMenuBadge>876</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu> */}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupAction>
            <Plus /> <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={'/projects'}>
                    <FolderOpenDot />
                    <span>See All Project</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={'#'}>
                    <Plus />
                    <span>Add Project</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />
        {/* COLLAPSABEL */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Help
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>

            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={'#'}>
                        <HelpCircle />
                        <span>FAQ</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <Collapsible>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <CollapsibleTrigger asChild>
                          <Link href={'#'}>
                            <Info />
                            <span>Help</span>
                          </Link>
                        </CollapsibleTrigger>
                      </SidebarMenuButton>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton>
                              Documentation
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton>Info</SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  {data?.user.name} <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href={'/profile'}>
                  <DropdownMenuItem className="hover:cursor-pointer">
                    <User />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <Link href={'/room'}>
                  <DropdownMenuItem className="hover:cursor-pointer">
                    <HomeIcon />
                    Room
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuItem asChild variant="destructive">
                  <Button
                    className="w-full hover:cursor-pointer"
                    onClick={() => signOut({ redirectTo: '/' })}
                    variant={'outline'}
                  >
                    <LogOutIcon className="h-[1.2rem] w-[1.2rem] mr-2" />
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
