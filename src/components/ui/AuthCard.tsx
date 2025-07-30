import React from 'react';

function AuthCard({ children }: { children: React.ReactNode }) {
  return <div className={'mx-10 w-[80%] md:w-[70%]'}>{children}</div>;
}

export default AuthCard;
