
import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Utensils, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { UserProfile } from '@/types';

export default function HomePage({ user }: { user: UserProfile }) {
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
      <section className="relative overflow-hidden bg-[#1F2937] rounded-[2.5rem] p-8 sm:p-12 text-white shadow-xl shadow-orange-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3 opacity-90">
            <span className="text-2xl">👋</span>
            <h1 className="text-3xl font-bold tracking-tight">Chào {user.name},</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-md mb-8 leading-relaxed">
            Hôm nay bạn muốn nấu món gì? Bếp Dzui đã sẵn sàng hỗ trợ bạn.
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

          {/* Feature 2 - Tall/Square */}
          <Link to="/recipe" className="group bg-gradient-to-br from-green-50 to-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-green-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <Utensils size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Gợi ý công thức</h3>
            <p className="text-gray-500 text-sm">Bạn có nguyên liệu gì? Để AI gợi ý món ngon.</p>
          </Link>

          {/* Feature 3 - Square */}
          <Link to="/meal-plan" className="group bg-gradient-to-br from-blue-50 to-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-blue-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <Calendar size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Thực đơn 7 ngày</h3>
            <p className="text-gray-500 text-sm">Lên lịch ăn cả tuần, không lo trùng món.</p>
          </Link>

          {/* Feature 4 - Square (Placeholder for consistency or future feature) */}
          <div className="hidden sm:block bg-gray-50 p-6 sm:p-8 rounded-[2rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center opacity-60">
            <div className="text-4xl mb-2">🔜</div>
            <p className="font-bold text-gray-500">Tính năng mới</p>
            <p className="text-xs text-gray-400">Sắp ra mắt...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
