import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'bordered';
  hoverEffect?: boolean;
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default', 
    hoverEffect = true, 
    children, 
    ...props 
  }, ref) => {
    const variants = {
      default: "bg-white border border-slate-100 shadow-soft-sm",
      elevated: "bg-white border border-slate-100 shadow-soft-md",
      glass: "glass-card shadow-soft-sm",
      bordered: "bg-white border-2 border-slate-100 shadow-none",
    };

    const hoverClasses = hoverEffect 
      ? "transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1 hover:border-brand-navy-200" 
      : "";

    return (
      <div 
        ref={ref}
        className={cn(
          "rounded-2xl p-6 sm:p-8",
          variants[variant],
          hoverClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
