import { Noto_Sans_Georgian } from 'next/font/google';
import React from 'react';
import { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/navbar/navbar';
import { cookies } from 'next/headers';

const georgian = Noto_Sans_Georgian({
  subsets: ['georgian'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-georgian',
});

export const metadata: Metadata = {
  title: 'Swyft | Fast & Simple Note Taking App',
  description: 'A fast and shortcut-based note-taking application with simplicity in mind.',
};

async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value || 'light';
  return (
    <html lang="en" data-theme={theme}>
      <body className={`${georgian.variable} w-full min-h-[100dvh] flex justify-center`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
