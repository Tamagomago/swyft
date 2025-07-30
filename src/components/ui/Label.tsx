import React from 'react';

interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
}

function Label({ children, htmlFor }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={'text-muted font-medium text-sm'}>
      {children}
    </label>
  );
}

export default Label;
