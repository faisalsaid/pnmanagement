import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import { ThemeProvider } from '@/components/themeProvider';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'News Portal Manager',
    template: '%s | News Portal Manager',
  },
  description:
    'Portal berita terkini, akurat, dan terpercaya. Dapatkan update terbaru dari dunia politik, ekonomi, teknologi, olahraga, hiburan, dan nasional setiap hari.',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'My Blog',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@myblog',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>{children}</SessionProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
