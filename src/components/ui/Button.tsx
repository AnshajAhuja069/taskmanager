import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          clsx(
            'inline-flex items-center justify-center rounded-md font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:pointer-events-none disabled:opacity-50',
            {
              'bg-purple-600 text-white hover:bg-purple-700 focus-visible:ring-purple-500':
                variant === 'primary',
              'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500':
                variant === 'secondary',
              'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500':
                variant === 'danger',
              'h-8 px-3 text-sm': size === 'sm',
              'h-10 px-4': size === 'md',
              'h-12 px-6 text-lg': size === 'lg',
            }
          ),
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';