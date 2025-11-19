
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Home, Camera, ChefHat, CalendarDays, User, ShoppingBag, Menu } from 'lucide-react';
import HomePage from './pages/Home';
import AnalyzePage from './pages/Analyze';
import RecipePage from './pages/Recipe';
import MealPlanPage from './pages/MealPlan';
import ProfilePage from './pages/Profile';
import { UserProfile } from './types';
import SousChefChat from './components/SousChefChat';

// Default user profile
const defaultProfile: UserProfile = {
  name: 'Bạn mới',
  goal: 'healthy',
  dietaryNotes: '',
  cookingTime: 30,
};

// --- NEW LOGO COMPONENT ---
const BepDzuiLogo = ({ size = 32, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-sm ${className}`}
  >
    {/* Chef Hat Main Body */}
    <path d="M20 55C18 45 15 35 25 25C28 15 40 10 50 10C60 10 72 15 75 25C85 35 82 45 80 55" fill="#FFF7ED" stroke="#F97316" strokeWidth="4" strokeLinejoin="round"/>
    
    {/* Hat Brim / AI Band */}
    <path d="M20 55H80V75C80 80.5 75.5 85 70 85H30C24.5 85 20 80.5 20 75V55Z" fill="#F97316"/>
    
    {/* AI Circuit Lines on Band */}
    <path d="M25 65H35L38 70H42" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.9"/>
    <path d="M75 65H65L62 70H58" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.9"/>
    <circle cx="30" cy="65" r="1.5" fill="white"/>
    <circle cx="70" cy="65" r="1.5" fill="white"/>
    <circle cx="50" cy="70" r="2" fill="white"/>
    
    {/* Cute Face */}
    <circle cx="35" cy="40" r="3.5" fill="#1F2937"/>
    <circle cx="65" cy="40" r="3.5" fill="#1F2937"/>
    {/* Smile */}
    <path d="M45 45Q50 49 55 45" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Cheeks */}
    <circle cx="30" cy="46" r="3" fill="#FDBA74" opacity="0.5"/>
    <circle cx="70" cy="46" r="3" fill="#FDBA74" opacity="0.5"/>
  </svg>
);

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);

  // Load profile from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bepdzui_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserProfile({ ...defaultProfile, ...parsed });
      } catch (e) {
        console.error("Failed to load profile", e);
      }
    }
  }, []);

  const saveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('bepdzui_profile', JSON.stringify(profile));
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#FFF7ED] text-gray-800 font-sans pb-24 sm:pb-0 selection:bg-orange-200 selection:text-orange-900">
        
        {/* Header Mobile - Modern Glassmorphism */}
        <header className="sticky top-0 z-20 sm:hidden px-6 py-4 bg-white/80 backdrop-blur-md border-b border-orange-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-2xl tracking-tight">
             {/* Updated Logo */}
             <BepDzuiLogo size={36} />
             <span>Bếp Dzui</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-orange-100 overflow-hidden border-2 border-white shadow-sm">
             <div className="w-full h-full flex items-center justify-center text-orange-500 font-bold text-xs">
                {userProfile.name.charAt(0).toUpperCase()}
             </div>
          </div>
        </header>

        {/* Main Layout */}
        <div className="max-w-7xl mx-auto sm:flex min-h-screen">
          
          {/* Sidebar Desktop - Floating Style */}
          <aside className="hidden sm:flex flex-col w-72 h-screen sticky top-0 p-6">
             {/* Logo Area */}
             <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-sm mb-6 border border-white/50">
               <div className="flex items-center gap-3 text-orange-600 font-extrabold text-2xl tracking-tight">
                  {/* Updated Logo - Larger with background accent */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-200 blur-xl opacity-30 rounded-full"></div>
                    <BepDzuiLogo size={48} className="relative z-10" />
                  </div>
                  <span>Bếp Dzui</span>
               </div>
               <p className="text-xs text-gray-500 mt-2 font-medium pl-1">Trợ lý nấu ăn AI</p>
             </div>

             {/* Navigation */}
             <nav className="flex-1 flex flex-col gap-3 bg-white/60 backdrop-blur-sm rounded-3xl p-4 shadow-sm border border-white/50">
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Menu</div>
                <NavButton to="/" icon={<Home size={20} />} label="Khám phá" />
                <NavButton to="/analyze" icon={<Camera size={20} />} label="Scan món ăn" />
                <NavButton to="/recipe" icon={<ChefHat size={20} />} label="Tạo công thức" />
                <NavButton to="/meal-plan" icon={<CalendarDays size={20} />} label="Thực đơn tuần" />
                
                <div className="my-2 border-t border-gray-100"></div>
                
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Cá nhân</div>
                <NavButton to="/profile" icon={<User size={20} />} label="Hồ sơ vị giác" />
             </nav>

             {/* User Mini Card */}
             <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm border border-orange-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold shadow-md">
                  {userProfile.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{userProfile.name}</p>
                  <p className="text-xs text-gray-500 truncate">{userProfile.goal === 'healthy' ? 'Eat Clean' : 'Ăn ngon'}</p>
                </div>
             </div>
          </aside>

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto animate-fade-in">
              <Routes>
                <Route path="/" element={<HomePage user={userProfile} />} />
                <Route path="/analyze" element={<AnalyzePage />} />
                <Route path="/recipe" element={<RecipePage user={userProfile} />} />
                <Route path="/meal-plan" element={<MealPlanPage user={userProfile} />} />
                <Route path="/profile" element={<ProfilePage currentProfile={userProfile} onSave={saveProfile} />} />
              </Routes>
            </div>
          </main>
        </div>

        {/* Bottom Nav Mobile - Floating Island */}
        <nav className="fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 flex justify-around p-4 sm:hidden z-50">
          <MobileNavLink to="/" icon={<Home size={24} />} />
          <MobileNavLink to="/analyze" icon={<Camera size={24} />} />
          <div className="-mt-8">
            <NavLink to="/recipe" className={({isActive}) => `flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-orange-200 transition-transform active:scale-95 ${isActive ? 'bg-gray-800 text-white' : 'bg-orange-500 text-white'}`}>
              <ChefHat size={28} />
            </NavLink>
          </div>
          <MobileNavLink to="/meal-plan" icon={<CalendarDays size={24} />} />
          <MobileNavLink to="/profile" icon={<User size={24} />} />
        </nav>

        {/* Global AI Sous Chef Chat Widget */}
        <SousChefChat />
        
      </div>
    </Router>
  );
}

const NavButton = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
          isActive 
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
        `flex flex-col items-center justify-center w-10 h-10 rounded-xl transition-colors ${
          isActive ? 'text-orange-600 bg-orange-50' : 'text-gray-400'
        }`
      }
    >
      {icon}
    </NavLink>
  );
};
