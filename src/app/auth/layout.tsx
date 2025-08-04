import type { Metadata } from 'next';
import React from 'react';

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center md:grid md:grid-cols-3  w-screen  h-screen bg-background">
      <div className={'md:col-span-1 h-full w-full md:border-r-2 md:border-border'}>{children}</div>
      <div className="col-span-2 h-full hidden md:block">
        <h1 className={'text-foreground'}>PLACEHOLDER</h1>
      </div>
    </div>
  );
}

export default AuthLayout;
