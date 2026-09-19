import React from 'react';
import { cn } from '../../lib/utils';
import { Badge } from './Badge';

interface SectionTitleProps {
  tag?: string;
  tagVariant?: 'blue' | 'amber' | 'slate';
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  titleClassName?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  tag,
  tagVariant = 'blue',
  title,
  subtitle,
  align = 'center',
  className,
  titleClassName,
}) => {
  return (
    <div className={cn(
      "max-w-3xl mb-12 sm:mb-16",
      align === 'center' ? "mx-auto text-center" : "text-left",
      className
    )}>
      {tag && (
        <div className="mb-3.5">
          <Badge variant={tagVariant}>{tag}</Badge>
        </div>
      )}
      <h2 className={cn(
        "text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.18]",
        titleClassName
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};
