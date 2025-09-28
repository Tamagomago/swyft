import React from 'react';
import Navbar from '@/components/navbar/navbar';

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center md:grid md:grid-cols-3  w-screen  h-screen bg-background">
        <div className={'md:col-span-1 h-full w-full md:border-r-2 md:border-border/30'}>
          {children}
        </div>
        <div className="col-span-2 h-full hidden md:block">
          <h1 className={'text-foreground'}>PLACEHOLDER</h1>
        </div>
      </div>
    </>
  );
}

export default AuthLayout;
