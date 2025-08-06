import React from 'react';
import Sidebar from '@/components/sidebar';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background md:grid md:grid-cols-5 w-full min-h-screen overflow-hidden">
      <Sidebar className="md:col-span-1 fixed md:relative" />
      <div className="col-span-4 min-h-screen w-full flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}

export default Layout;
