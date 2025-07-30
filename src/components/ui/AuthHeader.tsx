import React from 'react';

function AuthHeader({ children }: { children: React.ReactNode }) {
  return <h1 className={'font-600 text-foreground pb-3 text-2xl sm:text-3xl'}>{children}</h1>;
}

export default AuthHeader;
