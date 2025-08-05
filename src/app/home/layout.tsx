import React from 'react';
import Sidebar from '@/components/sidebar';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={'bg-background md:grid md:grid-cols-5 w-full min-h-screen'}>
      <div className={'md:col-span-1 h-full w-full md:border-r-2 md:border-border text-foreground'}>
        <Sidebar />
      </div>
      <div className={'col-span-4 min-h-screen w-full hidden md:flex justify-center items-center'}>
        {children}
      </div>
    </div>
  );
}

export default Layout;
