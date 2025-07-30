import React from 'react';

function AuthContent({ children }: { children: React.ReactNode }) {
  return <div className={'flex flex-col items-center justify-center gap-5 w-full'}>{children}</div>;
}

export default AuthContent;
