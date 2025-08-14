import React from 'react';

function AuthDescription({ children }: { children: React.ReactNode }) {
  return <h2 className={'text-muted font-medium text-sm'}>{children}</h2>;
}

export default AuthDescription;
