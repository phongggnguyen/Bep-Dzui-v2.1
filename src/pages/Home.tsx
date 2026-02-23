
import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Utensils, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { UserProfile } from '@/types';

// Food emojis for the animated background decoration
const FOOD_EMOJIS = ['🍜', '🥘', '🍱', '🥗', '🍛', '🫕', '🥩', '🍤'];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11)
    return { emoji: '☀️', greeting: 'Chào buổi sáng', sub: 'Một bữa sáng đủ năng lượng sẽ bắt đầu ngày mới tuyệt vời!' };
  if (hour >= 11 && hour < 14)
    return { emoji: '🍚', greeting: 'Chào buổi trưa', sub: 'Hôm nay mình nấu món gì nhanh gọn cùng Bếp Dzui nhé?' };
  if (hour >= 14 && hour < 18)
    return { emoji: '☕', greeting: 'Chào buổi chiều', sub: 'Lên kế hoạch cho bữa tối gia đình thật ngon miệng nào!' };
  return { emoji: '🌙', greeting: 'Chào buổi tối', sub: 'Cùng chuẩn bị một bữa tối ấm cúng, sum vầy!' };
};

export default function HomePage({ user }: { user: UserProfile }) {
  const { emoji, greeting, sub } = getGreeting();

  const getGoalLabel = (goal: string) => {
    switch (goal) {
      case 'weight_loss': return '🥗 Giảm cân';
      case 'muscle_gain': return '💪 Tăng cơ';
      case 'healthy': return '😊 Healthy';
      case 'maintain': return '⚖️ Giữ cân';
      default: return `🎯 ${goal}`;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#111827] rounded-[2.5rem] p-8 sm:p-12 text-white shadow-xl shadow-orange-100/50">

        {/* === Animated Gradient Orbs === */}
        <div
          className="absolute -top-16 -right-16 w-80 h-80 rounded-full opacity-25 blur-[100px]"
          style={{
            background: 'radial-gradient(circle, #f97316, #ec4899)',
            animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
        <div
          className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full opacity-15 blur-[80px]"
          style={{
            background: 'radial-gradient(circle, #f59e0b, #84cc16)',
            animation: 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full opacity-10 blur-[60px]"
          style={{
            background: 'radial-gradient(circle, #a78bfa, #38bdf8)',
            animation: 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s',
          }}
        />

        {/* === Floating Food Emoji Decoration === */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {FOOD_EMOJIS.map((em, i) => (
            <span
              key={i}
              className="absolute text-2xl opacity-10"
              style={{
                top: `${10 + (i * 11) % 80}%`,
                left: `${5 + (i * 13) % 90}%`,
                animation: `float-${i % 3} ${4 + i}s ease-in-out infinite`,
                transform: `rotate(${(i % 5) * 15 - 30}deg)`,
              }}
            >
              {em}
            </span>
          ))}
        </div>

        {/* === Content === */}
        <div className="relative z-10">
          {/* Dynamic Greeting */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{emoji}</span>
            <p className="text-orange-300 text-sm font-semibold tracking-widest uppercase opacity-90">
              {greeting}
            </p>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 leading-tight">
            Xin chào, <span className="text-orange-400">{user.name}</span>!
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-md mb-8 leading-relaxed">
            {sub}
          </p>

          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles size={16} className="text-yellow-400" />
            <span>Mục tiêu: {getGoalLabel(user.goal)}</span>
          </div>
        </div>
      </section>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
          Khám phá tính năng
        </h2>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Feature - Wide */}
          <Link to="/analyze" className="sm:col-span-2 group relative bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-orange-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-orange-100"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                <Camera size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">AI Nhận diện món ăn</h3>
                <p className="text-gray-500 mb-4">Chụp ảnh món ăn bất kỳ, AI sẽ phân tích nguyên liệu và cách nấu ngay lập tức.</p>
                <div className="flex items-center text-orange-600 font-bold text-sm">
                  Thử ngay <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Feature 2 */}
          <Link to="/recipe" className="group bg-gradient-to-br from-green-50 to-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-green-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <Utensils size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Gợi ý công thức</h3>
            <p className="text-gray-500 text-sm">Bạn có nguyên liệu gì? Để AI gợi ý món ngon.</p>
          </Link>

          {/* Feature 3 */}
          <Link to="/meal-plan" className="group bg-gradient-to-br from-blue-50 to-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-blue-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <Calendar size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Thực đơn 7 ngày</h3>
            <p className="text-gray-500 text-sm">Lên lịch ăn cả tuần, không lo trùng món.</p>
          </Link>

          {/* Feature 4 - Coming soon */}
          <div className="hidden sm:flex bg-gray-50 p-6 sm:p-8 rounded-[2rem] border border-dashed border-gray-200 flex-col items-center justify-center text-center opacity-60">
            <div className="text-4xl mb-2">🔜</div>
            <p className="font-bold text-gray-500">Tính năng mới</p>
            <p className="text-xs text-gray-400">Sắp ra mắt...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
