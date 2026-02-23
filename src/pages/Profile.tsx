
import React, { useState } from 'react';
import { UserProfile } from '@/types';
import { Save, Pencil, Info, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileProps {
  currentProfile: UserProfile;
  onSave: (profile: UserProfile) => Promise<void>;
}

export default function ProfilePage({ currentProfile, onSave }: ProfileProps) {
  const [profile, setProfile] = useState<UserProfile>(currentProfile);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state with props when context updates (e.g. initial load complete)
  React.useEffect(() => {
    setProfile(currentProfile);
  }, [currentProfile]);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setSaved(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      console.log('Saving profile:', profile);
      await onSave(profile);
      console.log('Profile saved successfully');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error('Profile save error:', err);
      setError(err?.message || 'Lỗi khi lưu. Vui lòng thử lại.');
    }
  };

  const predefinedGoals = [
    { id: 'healthy', label: '🥗 Eat Clean / Healthy' },
    { id: 'weight_loss', label: '📉 Giảm cân' },
    { id: 'muscle_gain', label: '💪 Tăng cơ' },
    { id: 'maintain', label: '⚖️ Giữ cân' },
  ];

  const isPredefined = predefinedGoals.some(g => g.id === profile.goal);

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Hồ sơ khẩu vị</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">

        {/* Name */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Tên hiển thị</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-colors"
          />
        </div>

        {/* Goal */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Mục tiêu ăn uống</label>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {predefinedGoals.map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleChange('goal', opt.id)}
                className={`p-3 rounded-xl text-sm font-medium border transition-all ${profile.goal === opt.id
                  ? 'bg-orange-50 border-orange-500 text-orange-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {opt.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => { if (isPredefined) handleChange('goal', ''); }}
              className={`p-3 rounded-xl text-sm font-medium border transition-all flex items-center justify-center gap-2 ${!isPredefined
                ? 'bg-orange-50 border-orange-500 text-orange-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Pencil size={16} /> Khác
            </button>
          </div>

          {!isPredefined && (
            <div className="animate-fade-in">
              <input
                type="text"
                value={profile.goal}
                onChange={(e) => handleChange('goal', e.target.value)}
                placeholder="Nhập mục tiêu (ví dụ: Tiểu đường, Keto, Ăn chay...)"
                className="w-full p-3 rounded-xl border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-colors"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Cooking Time */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Thời gian nấu tối đa (phút/bữa)</label>
          <input
            type="range"
            min="15"
            max="120"
            step="5"
            value={profile.cookingTime}
            onChange={(e) => handleChange('cookingTime', parseInt(e.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="text-right text-sm text-orange-600 font-medium mt-1">
            {profile.cookingTime} phút
          </div>
        </div>

        {/* Consolidated Dietary Notes */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Sở thích hoặc hạn chế</label>
          <textarea
            value={profile.dietaryNotes || ''}
            onChange={(e) => handleChange('dietaryNotes', e.target.value)}
            placeholder="Ví dụ: Dị ứng tôm, hải sản. Rất thích ăn thịt bò. Không ăn được cay..."
            rows={4}
            className="w-full p-4 rounded-xl border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-colors resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">
            Ghi rõ những món bạn bị dị ứng hoặc đặc biệt yêu thích để AI phục vụ tốt hơn.
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
        >
          <Save size={20} /> Lưu thiết lập
        </button>

        {error && (
          <p className="text-red-500 text-center text-sm font-medium animate-pulse">
            {error}
          </p>
        )}
        {saved && (
          <p className="text-green-600 text-center text-sm font-medium animate-bounce">
            Đã lưu thành công!
          </p>
        )}
      </form>

      {/* Thông tin thêm (đặc biệt cho Mobile) */}
      <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Thông tin khác</h2>
        <div className="space-y-2">
          <Link
            to="/about"
            className="flex items-center justify-between p-4 rounded-xl hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors border border-gray-100 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600 group-hover:bg-orange-200 transition-colors">
                <Info size={20} />
              </div>
              <span className="font-medium">Về Bếp Dzui & Liên hệ</span>
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
