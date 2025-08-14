import React from 'react';

function ModalDescription({ children }: { children: React.ReactNode }) {
  return <h2 className={'text-muted font-medium text-sm mb-5'}>{children}</h2>;
}

export default ModalDescription;
