import React from 'react';

interface MonoProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function Mono({ children, className = '', ...props }: MonoProps) {
  return (
    <span className={`font-mono tabular-nums ${className}`} {...props}>
      {children}
    </span>
  );
}
