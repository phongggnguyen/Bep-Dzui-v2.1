// components/RecipeHistory.tsx
import React, { useState, useEffect } from 'react';
import { SavedRecipe } from '@/types';
import { deleteRecipe, toggleFavorite } from '@/services/recipeService';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebaseService';
import { Clock, Gauge, Trash2, Heart, ChefHat, Calendar, Search } from 'lucide-react';

interface RecipeHistoryProps {
  userId: string;
  onSelectRecipe: (recipe: SavedRecipe) => void;
}

const RecipeHistory: React.FC<RecipeHistoryProps> = ({ userId, onSelectRecipe }) => {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const loadRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'recipes'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const recipesData: SavedRecipe[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        recipesData.push({ id: doc.id, ...data, createdAt: data.createdAt.toDate() } as SavedRecipe);
      });

      recipesData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setRecipes(recipesData);
    } catch (err: any) {
      setError(err.message || 'Không thể tải lịch sử công thức');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) loadRecipes();
  }, [userId]);

  const handleDelete = async (recipeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Bạn có chắc muốn xóa công thức này?')) return;
    try {
      await deleteRecipe(recipeId);
      setRecipes(recipes.filter(r => r.id !== recipeId));
    } catch (error) {
      alert('Không thể xóa công thức');
    }
  };

  const handleToggleFavorite = async (recipeId: string, currentStatus: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleFavorite(recipeId, currentStatus);
      setRecipes(recipes.map(r => r.id === recipeId ? { ...r, isFavorite: !currentStatus } : r));
    } catch (error) {
      alert('Không thể cập nhật yêu thích');
    }
  };

  const filteredRecipes = filter === 'favorites' ? recipes.filter(r => r.isFavorite) : recipes;

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải lịch sử...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-red-50 dark:bg-red-950/20 rounded-3xl border border-red-200 dark:border-red-900/40">
        <div className="bg-red-100 dark:bg-red-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">⚠️</span>
        </div>
        <h3 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Lỗi tải dữ liệu</h3>
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={loadRecipes}
          className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
        <div className="bg-orange-100 dark:bg-orange-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <ChefHat size={32} className="text-orange-500 dark:text-orange-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Chưa có công thức nào</h3>
        <p className="text-gray-600 dark:text-gray-400">Hãy tạo công thức đầu tiên của bạn!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${filter === 'all'
            ? 'bg-orange-500 text-white shadow-lg'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
        >
          Tất cả ({recipes.length})
        </button>
        <button
          onClick={() => setFilter('favorites')}
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${filter === 'favorites'
            ? 'bg-pink-500 text-white shadow-lg'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
        >
          <Heart size={16} />
          Yêu thích ({recipes.filter(r => r.isFavorite).length})
        </button>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => onSelectRecipe(recipe)}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:border-orange-200 dark:hover:border-orange-800 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-1 truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {recipe.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Search size={12} />
                  <span className="truncate">{recipe.query}</span>
                </div>
              </div>

              <button
                onClick={(e) => handleToggleFavorite(recipe.id, recipe.isFavorite || false, e)}
                className="ml-2 p-2 rounded-full hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-colors"
              >
                <Heart
                  size={20}
                  className={recipe.isFavorite ? 'text-pink-500 fill-pink-500' : 'text-gray-300 dark:text-gray-600'}
                />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {recipe.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <Clock size={14} className="text-orange-500" />
                  {recipe.cookingTime}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <Gauge size={14} className="text-blue-500" />
                  {recipe.difficulty}
                </div>
              </div>

              <button
                onClick={(e) => handleDelete(recipe.id, e)}
                className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-gray-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
              <Calendar size={12} />
              {new Date(recipe.createdAt).toLocaleDateString('vi-VN', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredRecipes.length === 0 && filter === 'favorites' && (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
          <Heart size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Chưa có công thức yêu thích nào</p>
        </div>
      )}
    </div>
  );
};

export default RecipeHistory;
