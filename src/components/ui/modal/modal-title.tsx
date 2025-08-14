import React from 'react';

function ModalTitle({ children }: { children: React.ReactNode }) {
  return <h1 className={'font-600 text-foreground pb-3 text-2xl'}>{children}</h1>;
}

export default ModalTitle;
