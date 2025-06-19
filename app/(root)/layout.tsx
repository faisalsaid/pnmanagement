import { Separator } from '@/components/ui/separator';
import WebFooter from './_components/footer';
import WebHeader from './_components/header';
import prisma from '@/lib/prisma';
import GlobalLogger from '@/components/GlobalLogger.client';
import { auth } from '@/auth';

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();
  // console.log('layout web', session);

  const allCategories = await prisma.category.findMany();
  return (
    <main className="container mx-auto min-h-screen flex flex-col px-4">
      <WebHeader categories={allCategories} session={session} />
      <Separator />
      <div className="py-4">{children}</div>
      <WebFooter />
      <GlobalLogger />
    </main>
  );
};

export default layout;
