
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Clock, Gauge, Flame, Loader2, ChefHat, ArrowRight, CheckCircle2, Circle, UtensilsCrossed } from 'lucide-react';
import { generateRecipe } from '../services/geminiService';
import { UserProfile, Recipe } from '../types';

export default function RecipePage({ user }: { user: UserProfile }) {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  
  // Mobile Tab State: 'ingredients' or 'steps'
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');

  // Auto generate if query is present in URL on mount
  useEffect(() => {
    if (initialQuery) {
      handleGenerate(initialQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async (q: string = query) => {
    if (!q.trim()) return;
    setLoading(true);
    setRecipe(null);
    setCheckedIngredients({});
    setActiveTab('ingredients'); // Reset to first tab
    try {
      const data = await generateRecipe(q, user);
      setRecipe(data);
    } catch (error) {
      alert("Không thể tạo công thức. Thử lại nhé!");
    } finally {
      setLoading(false);
    }
  };

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients(prev => ({...prev, [idx]: !prev[idx]}));
  };

  return (
    <div className="pb-24 sm:pb-10">
      <div className="mb-6 sm:mb-8 px-2 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Bếp trưởng AI</h1>
        <p className="text-sm sm:text-base text-gray-500">Nhập tên món hoặc nguyên liệu bạn có để bắt đầu.</p>
      </div>

      {/* Search Input Area - Restyled for Light/Soft UI */}
      <div className="relative mb-8 group px-2 sm:px-0">
        {/* Decorative background blur */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-300 to-pink-300 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-200"></div>
        
        <div className="relative flex items-center bg-white rounded-2xl shadow-lg shadow-orange-100 border border-orange-50 p-1.5">
          <Search className="absolute left-4 text-orange-400" size={22} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ví dụ: Gà kho gừng, trứng..."
            className="w-full py-3 pl-10 pr-28 sm:pr-40 rounded-xl bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-base sm:text-lg font-medium"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button 
            onClick={() => handleGenerate()}
            disabled={loading || !query}
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-6 rounded-xl font-bold shadow-md shadow-orange-200 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <ArrowRight size={20} />
            )}
            <span className="hidden sm:inline text-sm">{loading ? "Đang nấu..." : "Tạo món"}</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse px-4 text-center">
          <div className="bg-white p-4 rounded-full shadow-xl mb-4 border border-orange-50">
            <ChefHat size={48} className="text-orange-500 animate-bounce" />
          </div>
          <p className="text-gray-800 font-bold text-lg">Đang suy nghĩ công thức...</p>
          <p className="text-sm text-gray-500 mt-1">AI đang cân nhắc sở thích & nguyên liệu của bạn</p>
        </div>
      )}

      {recipe && !loading && (
        <div className="animate-fade-in-up space-y-6 px-2 sm:px-0">
          
          {/* Header Card - Compact on Mobile */}
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 shadow-sm border border-orange-100">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-800 mb-2 sm:mb-3 tracking-tight leading-tight">
                  {recipe.name}
                </h2>
                <p className="text-gray-600 text-sm sm:text-lg leading-relaxed">
                  {recipe.description}
                </p>
              </div>
              
              {/* Stats Row */}
              <div className="flex gap-3 mt-2">
                <div className="flex-1 flex items-center justify-center gap-2 bg-orange-50 px-3 py-2 rounded-xl border border-orange-100">
                  <Clock size={18} className="text-orange-500" />
                  <div className="flex flex-col items-start leading-none">
                    <span className="font-bold text-gray-800 text-sm">{recipe.cookingTime}</span>
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center gap-2 bg-blue-50 px-3 py-2 rounded-xl border border-blue-100">
                  <Gauge size={18} className="text-blue-500" />
                  <div className="flex flex-col items-start leading-none">
                    <span className="font-bold text-gray-800 text-sm">{recipe.difficulty}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {recipe.quickVersion && (
              <div className="mt-4 sm:mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 p-3 sm:p-4 rounded-xl border border-yellow-100 flex items-start gap-3">
                <div className="p-1.5 bg-white rounded-full text-yellow-600 shadow-sm shrink-0">
                   <Flame size={16} fill="currentColor" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-0.5">Bản nấu nhanh</h4>
                  <p className="text-gray-700 text-sm leading-snug">{recipe.quickVersion}</p>
                </div>
              </div>
            )}
          </div>

          {/* MOBILE TABS (Visible only on lg and below) */}
          <div className="lg:hidden sticky top-20 z-10 bg-[#FFF7ED] py-2">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex text-sm font-bold">
              <button 
                onClick={() => setActiveTab('ingredients')}
                className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'ingredients' 
                    ? 'bg-green-50 text-green-700 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <UtensilsCrossed size={16} />
                Nguyên liệu
              </button>
              <button 
                onClick={() => setActiveTab('steps')}
                className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'steps' 
                    ? 'bg-orange-50 text-orange-700 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Flame size={16} />
                Cách làm
              </button>
            </div>
          </div>

          {/* Main Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            
            {/* Left Column: Ingredients */}
            <div className={`lg:col-span-4 ${activeTab === 'ingredients' ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 shadow-sm border border-gray-100 lg:sticky lg:top-24">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                   <span className="bg-green-100 text-green-600 p-1.5 rounded-lg"><ChefHat size={18} /></span>
                   Chuẩn bị
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {recipe.ingredients.map((ing, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => toggleIngredient(idx)}
                      className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        checkedIngredients[idx] 
                          ? 'bg-green-50 border-green-100' 
                          : 'bg-gray-50/50 border-transparent hover:bg-orange-50 hover:border-orange-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {checkedIngredients[idx] 
                          ? <CheckCircle2 size={20} className="text-green-500 shrink-0" /> 
                          : <Circle size={20} className="text-gray-300 group-hover:text-orange-400 shrink-0" />
                        }
                        <span className={`font-medium truncate ${checkedIngredients[idx] ? 'text-green-800 line-through opacity-60' : 'text-gray-700'}`}>
                          {ing.name}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-gray-500 bg-white px-2 py-1 rounded-md whitespace-nowrap ml-2 shadow-sm">
                        {ing.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Steps */}
            <div className={`lg:col-span-8 ${activeTab === 'steps' ? 'block' : 'hidden lg:block'}`}>
               <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-10 shadow-sm border border-gray-100 min-h-[50vh]">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center gap-2">
                    <span className="bg-orange-100 text-orange-600 p-1.5 rounded-lg"><Flame size={18} /></span>
                    Thực hiện
                  </h3>
                  
                  <div className="relative pl-3 sm:pl-6 space-y-8 sm:space-y-10">
                    {/* Vertical Line */}
                    <div className="absolute left-3 sm:left-6 top-4 bottom-4 w-0.5 bg-gray-100"></div>

                    {recipe.steps.map((step, idx) => (
                      <div key={idx} className="relative flex gap-4 sm:gap-6 group">
                        {/* Step Number Bubble */}
                        <div className="shrink-0 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white border-4 border-orange-50 text-orange-500 font-extrabold text-sm sm:text-lg flex items-center justify-center shadow-sm z-10 group-hover:scale-110 group-hover:border-orange-100 transition-transform">
                          {idx + 1}
                        </div>
                        
                        {/* Step Content */}
                        <div className="flex-1 pt-0.5 sm:pt-2">
                          <p className="text-gray-700 text-base sm:text-lg leading-relaxed group-hover:text-gray-900 transition-colors text-justify sm:text-left">
                            {step}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-10 p-5 bg-orange-50/50 rounded-2xl text-center border border-orange-100 border-dashed">
                    <p className="text-orange-800 font-medium mb-3 text-sm">Bạn đã nấu xong chưa?</p>
                    <button className="bg-white text-orange-600 px-6 py-2.5 rounded-full font-bold text-sm shadow-sm hover:shadow-md transition-all border border-orange-100">
                      Đánh dấu hoàn thành 🏆
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
