import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  as?: 'button' | 'a';
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    as = 'button', 
    href, 
    icon, 
    iconPosition = 'right', 
    children, 
    ...props 
  }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none text-center";

    const variantStyles = {
      primary: "bg-brand-navy hover:bg-brand-navy-700 text-white shadow-soft-sm hover:shadow-soft-md focus-visible:ring-brand-navy",
      secondary: "bg-brand-blue-soft text-brand-navy hover:bg-brand-navy-100 focus-visible:ring-brand-blue",
      amber: "bg-brand-amber hover:bg-brand-amber-600 text-slate-900 font-semibold shadow-soft-sm hover:shadow-soft-md focus-visible:ring-brand-amber",
      outline: "border border-slate-200 hover:border-brand-navy text-slate-700 hover:text-brand-navy bg-white/80 hover:bg-slate-50 focus-visible:ring-brand-navy",
      ghost: "text-slate-600 hover:text-brand-navy hover:bg-slate-100/60 focus-visible:ring-brand-navy",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-2 gap-1.5",
      md: "text-sm px-5 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5 font-semibold",
    };

    const combinedClasses = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

    if (as === 'a' && href) {
      return (
        <a href={href} className={combinedClasses}>
          {icon && iconPosition === 'left' && <span className="transition-transform duration-200 group-hover:-translate-x-0.5">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="transition-transform duration-200 group-hover:translate-x-0.5">{icon}</span>}
        </a>
      );
    }

    return (
      <button ref={ref} className={combinedClasses} {...props}>
        {icon && iconPosition === 'left' && <span>{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <span>{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
