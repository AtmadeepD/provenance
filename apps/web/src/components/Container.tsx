import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ children, className = '', ...props }: ContainerProps) {
  return (
    <div className={`w-full max-w-[1200px] mx-auto px-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
