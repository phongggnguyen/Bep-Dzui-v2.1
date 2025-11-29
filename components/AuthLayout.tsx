// components/AuthLayout.tsx
import React, { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Food Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <pattern id="food-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            {/* Chef hat */}
            <text x="10" y="30" fontSize="30" opacity="0.5">👨‍🍳</text>
            {/* Food items */}
            <text x="60" y="30" fontSize="30" opacity="0.5">🍳</text>
            <text x="10" y="80" fontSize="30" opacity="0.5">🥗</text>
            <text x="60" y="80" fontSize="30" opacity="0.5">🍜</text>
          </pattern>
          <rect width="100%" height="100%" fill="url(#food-pattern)" />
        </svg>
      </div>

      {/* Main Card Container */}
      <div className="relative w-full max-w-md animate-fadeInUp">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-400 blur-2xl opacity-40 rounded-full"></div>
              <BepDzuiLogo size={56} />
            </div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
              Bếp Dzui
            </h1>
          </div>
          <p className="text-gray-600 text-sm font-medium">
            Trợ lý nấu ăn AI của bạn
          </p>
        </div>

        {/* Glassmorphism Card */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 relative overflow-hidden">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-pink-500/10 rounded-3xl"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
              {subtitle && (
                <p className="text-gray-600 text-sm">{subtitle}</p>
              )}
            </div>

            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Bằng việc tiếp tục, bạn đồng ý với{' '}
            <a href="#" className="text-orange-500 hover:text-orange-600 transition-colors">
              Điều khoản sử dụng
            </a>
            {' '}và{' '}
            <a href="#" className="text-orange-500 hover:text-orange-600 transition-colors">
              Chính sách bảo mật
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Logo Component (reused from App.tsx)
const BepDzuiLogo = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
    <path d="M20 55C18 45 15 35 25 25C28 15 40 10 50 10C60 10 72 15 75 25C85 35 82 45 80 55" fill="#FFF7ED" stroke="#F97316" strokeWidth="4" strokeLinejoin="round"/>
    <path d="M20 55H80V75C80 80.5 75.5 85 70 85H30C24.5 85 20 80.5 20 75V55Z" fill="#F97316"/>
    <path d="M25 65H35L38 70H42" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.9"/>
    <path d="M75 65H65L62 70H58" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.9"/>
    <circle cx="30" cy="65" r="1.5" fill="white"/>
    <circle cx="70" cy="65" r="1.5" fill="white"/>
    <circle cx="50" cy="70" r="2" fill="white"/>
    <circle cx="35" cy="40" r="3.5" fill="#1F2937"/>
    <circle cx="65" cy="40" r="3.5" fill="#1F2937"/>
    <path d="M45 45Q50 49 55 45" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="30" cy="46" r="3" fill="#FDBA74" opacity="0.5"/>
    <circle cx="70" cy="46" r="3" fill="#FDBA74" opacity="0.5"/>
  </svg>
);

export default AuthLayout;
