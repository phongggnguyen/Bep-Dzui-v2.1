// pages/Signup.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import AuthInput from '@/components/AuthInput';
import AuthButton from '@/components/AuthButton';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signup, error, loading, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      await signup(email, password, name || email.split('@')[0]);
      navigate('/');
    } catch (err) {
      console.error("Failed to sign up:", err);
    }
  };

  if (currentUser && !loading) {
    navigate('/');
    return null;
  }

  // Simple password strength indicator
  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { strength: 0, label: '', color: '' };
    if (pwd.length < 6) return { strength: 25, label: 'Quá yếu', color: 'bg-red-500' };
    if (pwd.length < 8) return { strength: 50, label: 'Yếu', color: 'bg-orange-500' };
    if (pwd.length < 12) return { strength: 75, label: 'Trung bình', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Mạnh', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <AuthLayout
      title="Tạo tài khoản mới"
      subtitle="Bắt đầu hành trình khám phá ẩm thực cùng AI"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Tên hiển thị"
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên của bạn"
          autoFocus
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
        <p className="text-xs text-gray-500 -mt-3 ml-1">
          Tùy chọn - để trống sẽ dùng tên từ email
        </p>

        <AuthInput
          label="Email"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          }
        />

        <div className="relative">
          <AuthInput
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            error={error || undefined}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[42px] text-gray-400 hover:text-orange-500 transition-colors z-10"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>

          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2 -mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Độ mạnh mật khẩu</span>
                <span className={`text-xs font-semibold ${passwordStrength.strength === 100 ? 'text-green-600' :
                    passwordStrength.strength >= 75 ? 'text-yellow-600' :
                      passwordStrength.strength >= 50 ? 'text-orange-600' :
                        'text-red-600'
                  }`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.color} transition-all duration-300`}
                  style={{ width: `${passwordStrength.strength}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 -mt-2 ml-1">
          Tối thiểu 6 ký tự. Khuyến nghị: 12+ ký tự, kết hợp chữ hoa, số và ký tự đặc biệt
        </p>

        <div className="pt-2">
          <AuthButton type="submit" loading={loading}>
            {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
          </AuthButton>
        </div>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/60 text-gray-500 font-medium">hoặc</span>
          </div>
        </div>

        {/* Social Signup Placeholder */}
        <AuthButton
          type="button"
          variant="outline"
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          }
        >
          Đăng ký với Google
        </AuthButton>

        {/* Login link */}
        <p className="text-center text-sm text-gray-600 pt-4">
          Đã có tài khoản?{' '}
          <Link
            to="/login"
            className="text-orange-500 hover:text-orange-600 font-bold transition-colors"
          >
            Đăng nhập
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
