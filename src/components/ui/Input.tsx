import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, error, helperText, required, className, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        <label 
          htmlFor={inputId} 
          className="block text-sm font-semibold text-slate-700"
        >
          {label} {required && <span className="text-brand-amber-700 font-bold">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          required={required}
          className={cn(
            "w-full px-4 py-3 rounded-xl bg-white border text-slate-900 placeholder:text-slate-400 text-sm transition-all duration-200 outline-none",
            error 
              ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200" 
              : "border-slate-200 hover:border-slate-300 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-rose-600 font-medium">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
