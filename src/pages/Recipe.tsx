
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Clock, Gauge, Flame, Loader2, ChefHat, ArrowRight, CheckCircle2, Circle, UtensilsCrossed, HeartPulse, Info, Activity, Dumbbell, Save, History, BookmarkPlus, Sparkles } from 'lucide-react';
import { generateRecipe, remixRecipe } from '@/services/geminiService';
import { UserProfile, Recipe, SavedRecipe } from '@/types';
import { saveRecipe } from '@/services/recipeService';
import { useAuth } from '@/context/AuthContext';
import RecipeHistory from '@/components/RecipeHistory';
import RecipeRemixChat from '@/components/RecipeRemixChat';

export default function RecipePage({ user }: { user: UserProfile }) {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const { currentUser } = useAuth();

  const [query, setQuery] = useState(initialQuery);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showRemix, setShowRemix] = useState(false);
  const [isRemixing, setIsRemixing] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');

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
    setActiveTab('ingredients');
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
    setCheckedIngredients(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSaveRecipe = async () => {
    if (!recipe || !currentUser) return;
    setSaving(true);
    try {
      await saveRecipe(currentUser.uid, recipe, query);
      alert('Đã lưu công thức thành công! 🎉');
    } catch (error) {
      alert('Không thể lưu công thức. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectHistoryRecipe = (savedRecipe: SavedRecipe) => {
    setRecipe(savedRecipe);
    setQuery(savedRecipe.query);
    setCheckedIngredients({});
    setShowHistory(false);
    setActiveTab('ingredients');
  };

  const handleRemix = async (request: string) => {
    if (!recipe) return;
    setShowRemix(false);
    setIsRemixing(true);
    try {
      const newRecipe = await remixRecipe(recipe, request);
      setRecipe(newRecipe);
      setCheckedIngredients({});
      alert('Đã remix công thức thành công! 🎉');
    } catch (error) {
      console.error(error);
      alert('Remix thất bại. Bạn thử lại nhé!');
    } finally {
      setIsRemixing(false);
    }
  };

  return (
    <div className="pb-24 sm:pb-10">
      <div className="mb-6 sm:mb-8 px-2 sm:px-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Bếp trưởng AI</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Nhập tên món hoặc nguyên liệu bạn có để bắt đầu.</p>
        </div>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${showHistory
            ? 'bg-orange-500 text-white shadow-lg'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
        >
          <History size={18} />
          <span className="hidden sm:inline">Lịch sử</span>
        </button>
      </div>

      {/* Search Input Area */}
      <div className="relative mb-8 group px-2 sm:px-0">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-300 to-pink-300 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-200"></div>
        <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-orange-100 dark:shadow-none border border-orange-50 dark:border-gray-800 p-1.5">
          <Search className="absolute left-4 text-orange-400" size={22} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ví dụ: Gà kho gừng, trứng..."
            className="w-full py-3 pl-10 pr-28 sm:pr-40 rounded-xl bg-transparent text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-base sm:text-lg font-medium"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={() => handleGenerate()}
            disabled={loading || !query}
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-6 rounded-xl font-bold shadow-md shadow-orange-200 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
            <span className="hidden sm:inline text-sm">{loading ? "Đang nấu..." : "Tạo món"}</span>
          </button>
        </div>
      </div>

      {/* Recipe History Section */}
      {showHistory && currentUser && (
        <div className="mb-8 px-2 sm:px-0 animate-fadeInUp">
          <RecipeHistory userId={currentUser.uid} onSelectRecipe={handleSelectHistoryRecipe} />
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse px-4 text-center">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-xl mb-4 border border-orange-50 dark:border-gray-700">
            <ChefHat size={48} className="text-orange-500 animate-bounce" />
          </div>
          <p className="text-gray-800 dark:text-gray-200 font-bold text-lg">Đang suy nghĩ công thức...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">AI đang cân nhắc sở thích & nguyên liệu của bạn</p>
        </div>
      )}

      {recipe && !loading && (
        <div className="animate-fade-in-up space-y-6 px-2 sm:px-0">

          {/* Action Buttons Row */}
          <div className="flex flex-wrap justify-end gap-3">
            <button
              onClick={() => setShowRemix(true)}
              disabled={saving || isRemixing}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-purple-200 dark:shadow-none hover:shadow-xl transition-all disabled:opacity-50"
            >
              <Sparkles size={18} />
              <span className="hidden sm:inline">Bếp Phó Remix</span>
              <span className="sm:hidden">Remix</span>
            </button>

            {currentUser && (
              <button
                onClick={handleSaveRecipe}
                disabled={saving || isRemixing}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg shadow-green-200 dark:shadow-none hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <><Loader2 size={20} className="animate-spin" />Đang lưu...</>
                ) : (
                  <><BookmarkPlus size={20} />Lưu công thức</>
                )}
              </button>
            )}
          </div>

          {/* Header Card */}
          <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 shadow-sm border border-orange-100 dark:border-gray-800">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 tracking-tight leading-tight">
                  {recipe.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-lg leading-relaxed">
                  {recipe.description}
                </p>
              </div>

              <div className="flex gap-3 mt-2">
                <div className="flex-1 flex items-center justify-center gap-2 bg-orange-50 dark:bg-orange-950/30 px-3 py-2 rounded-xl border border-orange-100 dark:border-orange-900/50">
                  <Clock size={18} className="text-orange-500" />
                  <div className="flex flex-col items-start leading-none">
                    <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{recipe.cookingTime}</span>
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-950/30 px-3 py-2 rounded-xl border border-blue-100 dark:border-blue-900/50">
                  <Gauge size={18} className="text-blue-500" />
                  <div className="flex flex-col items-start leading-none">
                    <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{recipe.difficulty}</span>
                  </div>
                </div>
              </div>
            </div>

            {recipe.quickVersion && (
              <div className="mt-4 sm:mt-6 bg-gradient-to-r from-yellow-50 dark:from-yellow-950/30 to-orange-50 dark:to-orange-950/20 p-3 sm:p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/40 flex items-start gap-3">
                <div className="p-1.5 bg-white dark:bg-gray-800 rounded-full text-yellow-600 shadow-sm shrink-0">
                  <Flame size={16} fill="currentColor" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider mb-0.5">Bản nấu nhanh</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-snug">{recipe.quickVersion}</p>
                </div>
              </div>
            )}
          </div>

          {/* MOBILE TABS */}
          <div className="lg:hidden sticky top-20 z-10 bg-[#FFF7ED] dark:bg-gray-950 py-2">
            <div className="bg-white dark:bg-gray-900 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex text-sm font-bold">
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'ingredients'
                  ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 shadow-sm'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400'
                  }`}
              >
                <UtensilsCrossed size={16} />
                Nguyên liệu
              </button>
              <button
                onClick={() => setActiveTab('steps')}
                className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'steps'
                  ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 shadow-sm'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400'
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
              <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-800 lg:sticky lg:top-24">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6 flex items-center gap-2">
                  <span className="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 p-1.5 rounded-lg"><ChefHat size={18} /></span>
                  Chuẩn bị
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {recipe.ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleIngredient(idx)}
                      className={`group grid grid-cols-[auto,1fr] sm:grid-cols-[auto,1fr,auto] gap-x-3 gap-y-2 p-3 sm:p-4 rounded-xl border transition-all cursor-pointer select-none ${checkedIngredients[idx]
                        ? 'bg-green-50 dark:bg-green-950/30 border-green-100 dark:border-green-900/50'
                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:bg-orange-50/60 dark:hover:bg-orange-950/20 hover:border-orange-100 dark:hover:border-orange-900/40'
                        }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 col-span-2 sm:col-span-1">
                        {checkedIngredients[idx]
                          ? <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                          : <Circle size={20} className="text-gray-300 group-hover:text-orange-400 shrink-0" />
                        }
                        <span className={`font-semibold text-left leading-snug break-words text-base ${checkedIngredients[idx] ? 'text-green-800 dark:text-green-400 line-through opacity-60' : 'text-gray-800 dark:text-gray-200'}`}>
                          {ing.name}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-700 px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 sm:border-transparent w-full sm:w-auto sm:ml-2 sm:justify-self-end sm:self-start sm:shrink-0 col-span-2 sm:col-auto max-w-full sm:max-w-[220px] text-left sm:text-right break-words leading-snug">
                        {ing.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Steps */}
            <div className={`lg:col-span-8 ${activeTab === 'steps' ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-10 shadow-sm border border-gray-100 dark:border-gray-800 min-h-[50vh]">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 sm:mb-8 flex items-center gap-2">
                  <span className="bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 p-1.5 rounded-lg"><Flame size={18} /></span>
                  Thực hiện
                </h3>

                <div className="relative pl-3 sm:pl-6 space-y-8 sm:space-y-10">
                  <div className="absolute left-3 sm:left-6 top-4 bottom-4 w-0.5 bg-gray-100 dark:bg-gray-800"></div>

                  {recipe.steps.map((step, idx) => (
                    <div key={idx} className="relative flex gap-4 sm:gap-6 group">
                      <div className="shrink-0 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-gray-800 border-4 border-orange-50 dark:border-gray-700 text-orange-500 font-extrabold text-sm sm:text-lg flex items-center justify-center shadow-sm z-10 group-hover:scale-110 group-hover:border-orange-100 dark:group-hover:border-orange-800/50 transition-transform">
                        {idx + 1}
                      </div>
                      <div className="flex-1 pt-0.5 sm:pt-2">
                        <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors text-justify sm:text-left">
                          {step}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 p-5 bg-orange-50/50 dark:bg-orange-950/20 rounded-2xl text-center border border-orange-100 dark:border-orange-900/30 border-dashed">
                  <p className="text-orange-800 dark:text-orange-300 font-medium mb-3 text-sm">Bạn đã nấu xong chưa?</p>
                  <button className="bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 px-6 py-2.5 rounded-full font-bold text-sm shadow-sm hover:shadow-md transition-all border border-orange-100 dark:border-gray-700">
                    Đánh dấu hoàn thành 🏆
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Health Corner Section */}
          {recipe.healthInfo && (
            <div className="bg-gradient-to-b from-green-50 dark:from-green-950/30 to-white dark:to-gray-950 rounded-[2rem] p-6 sm:p-10 shadow-sm border border-green-200 dark:border-green-900/40 animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <HeartPulse size={32} className="text-green-700 dark:text-green-400" strokeWidth={2.5} />
                <h3 className="text-2xl sm:text-3xl font-extrabold text-green-800 dark:text-green-400">Góc sức khỏe & Dinh dưỡng</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800 h-full">
                    <div className="flex flex-col items-center mb-8">
                      <div className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-full border-[6px] flex items-center justify-center ${recipe.healthInfo.healthScore >= 80 ? 'border-green-500' :
                        recipe.healthInfo.healthScore >= 60 ? 'border-yellow-500' :
                          recipe.healthInfo.healthScore >= 40 ? 'border-orange-500' : 'border-red-500'
                        }`}>
                        <div className="text-center">
                          <div className={`text-5xl sm:text-6xl font-black ${recipe.healthInfo.healthScore >= 80 ? 'text-green-500' :
                            recipe.healthInfo.healthScore >= 60 ? 'text-yellow-500' :
                              recipe.healthInfo.healthScore >= 40 ? 'text-orange-500' : 'text-red-500'
                            }`}>
                            {recipe.healthInfo.healthScore}
                          </div>
                          <div className="text-sm text-gray-400 font-bold">/100</div>
                        </div>
                      </div>

                      <p className={`mt-4 font-bold text-center ${recipe.healthInfo.healthScore >= 80 ? 'text-green-700 dark:text-green-400' :
                        recipe.healthInfo.healthScore >= 60 ? 'text-yellow-700 dark:text-yellow-400' :
                          recipe.healthInfo.healthScore >= 40 ? 'text-orange-700 dark:text-orange-400' : 'text-red-700 dark:text-red-400'
                        }`}>
                        {recipe.healthInfo.healthScore >= 80 ? 'Rất phù hợp với mục tiêu' :
                          recipe.healthInfo.healthScore >= 60 ? 'Tốt cho sức khỏe' :
                            recipe.healthInfo.healthScore >= 40 ? 'Cân nhắc điều chỉnh' :
                              'Ít phù hợp'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between py-3 border-t border-b border-gray-100 dark:border-gray-800 mb-6">
                      <div className="flex items-center gap-2">
                        <Flame size={20} className="text-orange-500" />
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Calo ước tính</span>
                      </div>
                      <span className="font-black text-gray-900 dark:text-gray-100">{recipe.healthInfo.calories.min}-{recipe.healthInfo.calories.max} Kcal</span>
                    </div>

                    <div>
                      <h4 className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 mb-3 tracking-wide">Đặc điểm dinh dưỡng</h4>
                      <div className="flex flex-wrap gap-2">
                        {recipe.healthInfo.nutritionTags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-full text-xs font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-3 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Activity size={18} className="text-orange-500" />
                      <h4 className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wide">Gợi ý tập luyện để tiêu hao</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {recipe.healthInfo.exerciseEquivalents.map((exercise, idx) => (
                        <div
                          key={idx}
                          className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            <div className="bg-orange-100 dark:bg-orange-900/40 p-2.5 rounded-full shrink-0">
                              <Dumbbell size={18} className="text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-tight">{exercise.activity}</p>
                              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{exercise.duration}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative bg-green-600 dark:bg-green-800 rounded-2xl p-6 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
                    <div className="relative flex items-start gap-4">
                      <div className="shrink-0">
                        <Info size={24} className="text-green-100" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-2 text-lg">Lời khuyên cho bạn</h4>
                        <p className="text-green-50 leading-relaxed text-sm">{recipe.healthInfo.advice}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Remix Chat Modal */}
      {showRemix && recipe && (
        <RecipeRemixChat
          recipe={recipe}
          onClose={() => setShowRemix(false)}
          onRemix={handleRemix}
        />
      )}

      {/* Remix Loading Overlay */}
      {isRemixing && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white/80 dark:bg-gray-950/90 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-2xl border border-purple-100 dark:border-gray-700 flex flex-col items-center text-center max-w-sm animate-bounce-slow">
            <div className="bg-purple-100 dark:bg-purple-900/40 p-4 rounded-full mb-4">
              <Sparkles size={40} className="text-purple-600 dark:text-purple-400 animate-spin-slow" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Đang chế biến lại...</h3>
            <p className="text-gray-500 dark:text-gray-400">Bếp Phó đang điều chỉnh công thức theo ý bạn.</p>
          </div>
        </div>
      )}
    </div>
  );
}
