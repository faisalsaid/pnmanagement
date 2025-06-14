import { Separator } from '@/components/ui/separator';
import WebFooter from './_components/footer';
import WebHeader from './_components/header';
import prisma from '@/lib/prisma';
import GlobalLogger from '@/components/GlobalLogger.client';

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const allCategories = await prisma.category.findMany();
  return (
    <main className="container mx-auto min-h-screen flex flex-col px-4">
      <WebHeader categories={allCategories} />
      <Separator />
      <div className="py-4">{children}</div>
      <WebFooter />
      <GlobalLogger />
    </main>
  );
};

export default layout;
