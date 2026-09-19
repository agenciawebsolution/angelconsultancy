import React from 'react';
import { cn } from '../../lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, error, helperText, required, className, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        <label 
          htmlFor={textareaId} 
          className="block text-sm font-semibold text-slate-700"
        >
          {label} {required && <span className="text-brand-amber-700 font-bold">*</span>}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          rows={rows}
          className={cn(
            "w-full px-4 py-3 rounded-xl bg-white border text-slate-900 placeholder:text-slate-400 text-sm transition-all duration-200 outline-none resize-y min-h-[100px]",
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

Textarea.displayName = 'Textarea';
