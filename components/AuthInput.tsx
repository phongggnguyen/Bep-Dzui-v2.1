// components/AuthInput.tsx
import React, { InputHTMLAttributes, ReactNode } from 'react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
}

const AuthInput: React.FC<AuthInputProps> = ({ label, icon, error, className = '', ...props }) => {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3.5
            ${icon ? 'pl-12' : ''}
            bg-white/50 backdrop-blur-sm
            border-2 border-gray-200
            rounded-xl
            text-gray-800 placeholder-gray-400
            transition-all duration-300
            focus:outline-none focus:border-orange-500 focus:bg-white focus:shadow-lg focus:shadow-orange-100
            hover:border-gray-300
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1 animate-shake">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;
