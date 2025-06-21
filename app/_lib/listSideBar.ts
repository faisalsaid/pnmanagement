import {
  Inbox,
  Settings,
  Plus,
  Newspaper,
  HandCoins,
  Mail,
  GalleryThumbnails,
  LayoutDashboard,
  Users,
} from 'lucide-react';

export const adminMenuList = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Posts',
    url: '#',
    icon: Newspaper,
    sub: [
      {
        title: 'All Posts',
        url: '/posts',
        icon: Newspaper,
      },
      {
        title: 'Add New Post',
        url: '/posts/create',
        icon: Plus,
      },
    ],
  },
  {
    title: 'Assets',
    url: '/assets',
    icon: GalleryThumbnails,
  },
  {
    title: 'Inbox',
    url: '#',
    icon: Inbox,
    sub: [
      {
        title: 'Payment',
        url: '/payment',
        icon: HandCoins,
      },
      {
        title: 'Mail',
        url: '/mail',
        icon: Mail,
      },
    ],
  },

  {
    title: 'Users',
    url: '/users',
    icon: Users,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];
