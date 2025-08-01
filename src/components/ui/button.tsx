import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}
function Button({ children, className = '', type, disabled }: ButtonProps) {
  return (
    <button
      className={`${className} focus:outline-none py-2 px-3 hover:bg-button-hover placeholder-muted border-2 focus:ring-2 focus:ring-ring rounded-md`}
      disabled={disabled || false}
      type={type || 'button'}
    >
      {children}
    </button>
  );
}

export default Button;
