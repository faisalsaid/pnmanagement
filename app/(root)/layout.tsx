import { Separator } from '@/components/ui/separator';
import WebFooter from './_components/footer';
import WebHeader from './_components/header';
import prisma from '@/lib/prisma';

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const allCategories = await prisma.category.findMany();
  return (
    <main className="container mx-auto min-h-screen flex flex-col relative">
      <WebHeader categories={allCategories} />
      <Separator />
      {children}
      <WebFooter />
    </main>
  );
};

export default layout;
