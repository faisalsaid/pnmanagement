import { Separator } from '@/components/ui/separator';
import WebFooter from './_components/footer';
import WebHeader from './_components/header';

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="container mx-auto min-h-screen flex flex-col relative">
      <WebHeader />
      <Separator />
      {children}
      <WebFooter />
    </main>
  );
};

export default layout;
