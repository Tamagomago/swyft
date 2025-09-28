import React from 'react';
import Sidebar from '@/components/sidebar/sidebar';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background lg:grid lg:grid-cols-5 w-full min-h-screen overflow-hidden">
      <Sidebar className="lg:col-span-1 fixed lg:relative" />
      <div className="lg:col-span-4 min-h-screen w-full flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}

export default Layout;
