import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './_components/AppSidebar';
import Navbar from './_components/Navbar';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import PrintBreadcrumbs from './_components/PrintBreadcrumbs';

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  return (
    <>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <main className="w-full">
          <Navbar data={session} />
          <PrintBreadcrumbs />
          <div className="px-4 pb-4">{children}</div>
        </main>
      </SidebarProvider>
    </>
  );
};

export default layout;
