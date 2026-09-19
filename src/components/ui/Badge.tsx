import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  variant?: 'blue' | 'amber' | 'slate' | 'outline';
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'blue', 
  className, 
  children 
}) => {
  const styles = {
    blue: "bg-brand-blue-soft text-brand-navy border border-brand-navy-100",
    amber: "bg-brand-amber-soft text-brand-amber-800 border border-brand-amber-200",
    slate: "bg-slate-100 text-slate-700 border border-slate-200",
    outline: "bg-transparent text-slate-600 border border-slate-200",
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
      styles[variant],
      className
    )}>
      {children}
    </span>
  );
};
