import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Login | Swyft',
  description: 'Authentication layout for the application',
};

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center w-screen border-5 border-foreground h-screen bg-background">
      <div className={'md:w-[40%] border-foreground border-2'}>{children}</div>
      <div className="border-solid border-foreground border-2 hidden md:block">
        <h1 className={'text-foreground'}>PLACEHOLDER</h1>
      </div>
    </div>
  );
}

export default AuthLayout;
