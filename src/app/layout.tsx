import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';
import { ModalProvider } from '@/components/providers/modal-provider';
import { SocketProvider } from '@/components/providers/socket-provider';
import QueryProvider from '@/components/providers/query-provider';

const font = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Chatus Maximus',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html suppressHydrationWarning lang='en'>
        <body className={cn(
          font.className,
          'bg-white dark:bg-[#313338]'
        )}>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            enableSystem={false}
            storageKey='discord-theme'
          >
            <SocketProvider>
              <ModalProvider />
              <QueryProvider>
                {children}
              </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
