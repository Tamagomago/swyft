import React from 'react';

function AuthHeader({ children }: { children: React.ReactNode }) {
  return <header className={'mb-7'}>{children}</header>;
}

export default AuthHeader;
