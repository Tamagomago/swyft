import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id = '',
      type = 'text',
      placeholder = '',
      value = '',
      onChange,
      required,
      className = '',
      ...rest
    },
    ref,
  ) => {
    return (
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={onChange}
        ref={ref}
        className={`${className} w-full focus:outline-none py-2 px-3 border-border bg-input-background text-sm text-foreground placeholder-muted border-2 focus:ring-2 focus:ring-ring rounded-md`}
        {...rest}
      />
    );
  },
);

Input.displayName = 'Input';

export default Input;
