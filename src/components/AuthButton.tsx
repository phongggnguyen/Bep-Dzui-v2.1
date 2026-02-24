// components/AuthButton.tsx
import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  variant = 'primary',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = `
    w-full px-6 py-3.5 rounded-xl font-semibold
    transition-all duration-300
    flex items-center justify-center gap-2
    disabled:cursor-not-allowed disabled:opacity-50
    focus:outline-none focus:ring-4 focus:ring-orange-200 dark:focus:ring-orange-900
    relative overflow-hidden group
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-orange-500 to-orange-600
      hover:from-orange-600 hover:to-orange-700
      active:scale-95
      text-white shadow-lg shadow-orange-200 dark:shadow-orange-900/30
      hover:shadow-xl hover:shadow-orange-300 dark:hover:shadow-orange-900/50
    `,
    secondary: `
      bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
      text-gray-700 dark:text-gray-300
      active:scale-95
    `,
    outline: `
      bg-transparent border-2 border-gray-300 dark:border-gray-600
      hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30
      text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400
      active:scale-95
    `
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shine effect on hover */}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      )}

      <span className="relative flex items-center gap-2">
        {loading ? (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : icon}
        {children}
      </span>
    </button>
  );
};

export default AuthButton;
