import React, { ReactNode } from 'react';
import { HashRouter as Router, Routes, Route, NavLink, Link, useLocation, Navigate } from 'react-router-dom';
import { Home, Camera, ChefHat, CalendarDays, User, LogOut, LogIn } from 'lucide-react';

// Page Imports
import HomePage from '@/pages/Home';
import AnalyzePage from '@/pages/Analyze';
import RecipePage from '@/pages/Recipe';
import MealPlanPage from '@/pages/MealPlan';
import ProfilePage from '@/pages/Profile';
import LoginPage from '@/pages/Login';
import SignupPage from '@/pages/Signup';

import { UserProfile } from '@/types';
import SousChefChat from '@/components/SousChefChat';
import { useAuth } from '@/context/AuthContext';

// Default user profile (used for guests or as a fallback)
const defaultProfile: UserProfile = {
  name: 'Khách',
  goal: 'healthy',
  dietaryNotes: '',
  cookingTime: 30,
};

// --- LOGO COMPONENT ---
const BepDzuiLogo = ({ size = 32, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-sm ${className}`}
  >
    <path
      d="M20 55C18 45 15 35 25 25C28 15 40 10 50 10C60 10 72 15 75 25C85 35 82 45 80 55"
      fill="#FFF7ED"
      stroke="#F97316"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <path d="M20 55H80V75C80 80.5 75.5 85 70 85H30C24.5 85 20 80.5 20 75V55Z" fill="#F97316" />
    <path d="M25 65H35L38 70H42" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.9" />
    <path d="M75 65H65L62 70H58" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.9" />
    <circle cx="30" cy="65" r="1.5" fill="white" />
    <circle cx="70" cy="65" r="1.5" fill="white" />
    <circle cx="50" cy="70" r="2" fill="white" />
    <circle cx="35" cy="40" r="3.5" fill="#1F2937" />
    <circle cx="65" cy="40" r="3.5" fill="#1F2937" />
    <path d="M45 45Q50 49 55 45" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="30" cy="46" r="3" fill="#FDBA74" opacity="0.5" />
    <circle cx="70" cy="46" r="3" fill="#FDBA74" opacity="0.5" />
  </svg>
);

// --- CUSTOM LOGOUT ICON ---
const LogoutIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// --- PROTECTED ROUTE COMPONENT ---
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser, loading, isGuest } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Đang tải...</div>;
  }

  if (!currentUser && !isGuest) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default function App() {
  const { currentUser, isGuest, logout, userProfile: authUserProfile, saveProfile: authSaveProfile } = useAuth();
  const userProfile = authUserProfile || defaultProfile;

  const saveProfile = async (profile: UserProfile) => {
    try {
      await authSaveProfile(profile);
    } catch (error) {
      console.error('Failed to save profile:', error);
      throw error; // Re-throw to let component handle UI feedback
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#FFF7ED] text-gray-800 font-sans pb-24 sm:pb-0 selection:bg-orange-200 selection:text-orange-900">
        <header className="sticky top-0 z-20 sm:hidden px-6 py-4 bg-white/80 backdrop-blur-md border-b border-orange-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-orange-600 font-bold text-2xl tracking-tight hover:opacity-80 transition-opacity">
            <BepDzuiLogo size={36} />
            <span>Bếp Dzui</span>
          </Link>
          {(currentUser || isGuest) && (
            <div className="flex items-center gap-2">
              <button
                onClick={logout}
                className="p-2.5 rounded-xl text-orange-600 bg-orange-50 hover:bg-orange-100 active:scale-95 transition-all duration-200 border border-orange-100/50 shadow-sm flex items-center justify-center"
                aria-label="Đăng xuất"
                title="Đăng xuất"
              >
                <LogoutIcon size={18} />
              </button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold shadow-md border-2 border-white">
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </header>

        <div className="max-w-7xl mx-auto sm:flex min-h-screen">
          <aside className="hidden sm:flex flex-col w-72 h-screen sticky top-0 p-6">
            <Link
              to="/"
              className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-sm mb-6 border border-white/50 block group hover:bg-white/80 transition-all duration-300"
            >
              <div className="flex items-center gap-3 text-orange-600 font-extrabold text-2xl tracking-tight">
                <div className="relative group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-orange-200 blur-xl opacity-30 rounded-full"></div>
                  <BepDzuiLogo size={48} className="relative z-10" />
                </div>
                <span>Bếp Dzui</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 font-medium pl-1">Trợ lý nấu ăn AI</p>
            </Link>

            <nav className="flex-1 flex flex-col gap-3 bg-white/60 backdrop-blur-sm rounded-3xl p-4 shadow-sm border border-white/50 overflow-y-auto">
              <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Menu</div>
              <NavButton to="/" icon={<Home size={20} />} label="Khám phá" />
              <NavButton to="/analyze" icon={<Camera size={20} />} label="Scan món ăn" />
              <NavButton to="/recipe" icon={<ChefHat size={20} />} label="Tạo công thức" />
              {(currentUser || isGuest) && <NavButton to="/meal-plan" icon={<CalendarDays size={20} />} label="Thực đơn tuần" />}

              <div className="my-2 border-t border-gray-100"></div>

              <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Tài khoản</div>
              {(currentUser || isGuest) ? (
                <>
                  <NavButton to="/profile" icon={<User size={20} />} label="Hồ sơ cá nhân hóa" />
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <LogoutIcon size={20} />
                    <span className="font-medium">Đăng xuất</span>
                  </button>
                </>
              ) : (
                <NavButton to="/login" icon={<LogIn size={20} />} label="Đăng nhập" />
              )}
            </nav>

            {(currentUser || isGuest) && (
              <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm border border-orange-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold shadow-md">
                  {userProfile.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{userProfile.name}</p>
                  <p className="text-xs text-gray-500 truncate">{currentUser ? currentUser.email : 'Chế độ khách'}</p>
                </div>
              </div>
            )}
          </aside>

          <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto animate-fade-in">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><HomePage user={userProfile} /></ProtectedRoute>} />
                <Route path="/analyze" element={<ProtectedRoute><AnalyzePage /></ProtectedRoute>} />
                <Route path="/recipe" element={<ProtectedRoute><RecipePage user={userProfile} /></ProtectedRoute>} />
                <Route path="/meal-plan" element={<ProtectedRoute><MealPlanPage user={userProfile} /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage currentProfile={userProfile} onSave={saveProfile} /></ProtectedRoute>} />
              </Routes>
            </div>
          </main>
        </div>

        {/* --- Mobile Nav --- */}
        <nav className="fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 flex justify-around p-4 sm:hidden z-50">
          <MobileNavLink to="/" icon={<Home size={24} />} />
          <MobileNavLink to="/analyze" icon={<Camera size={24} />} />
          <div className="-mt-8">
            <NavLink
              to="/recipe"
              className={({ isActive }) =>
                `flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-orange-200 transition-transform active:scale-95 ${isActive ? 'bg-gray-800 text-white' : 'bg-orange-500 text-white'
                }`
              }
            >
              <ChefHat size={28} />
            </NavLink>
          </div>
          <MobileNavLink to="/meal-plan" icon={<CalendarDays size={24} />} />
          {(currentUser || isGuest) ? (
            <MobileNavLink to="/profile" icon={<User size={24} />} />
          ) : (
            <MobileNavLink to="/login" icon={<LogIn size={24} />} />
          )}
        </nav>

        {(currentUser || isGuest) && <SousChefChat />}
      </div>
    </Router>
  );
}

// --- Helper Components ---
const NavButton = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
          ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 font-semibold'
          : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
        }`
      }
    >
      {icon}
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

const MobileNavLink = ({ to, icon }: { to: string; icon: React.ReactNode }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center w-10 h-10 rounded-xl transition-colors ${isActive ? 'text-orange-600 bg-orange-50' : 'text-gray-400'
        }`
      }
    >
      {icon}
    </NavLink>
  );
};
