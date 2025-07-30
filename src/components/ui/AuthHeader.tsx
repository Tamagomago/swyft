import React from 'react';

function AuthHeader({ children }: { children: React.ReactNode }) {
  return <header className={'mb-10'}>{children}</header>;
}

export default AuthHeader;
