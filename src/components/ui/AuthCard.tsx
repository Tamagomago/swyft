import React from 'react';

function AuthCard({ children }: { children: React.ReactNode }) {
  return <div className={'border-1 border-border px-10'}>{children}</div>;
}

export default AuthCard;
