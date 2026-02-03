import React, { useState } from 'react';
import { CalendarDays, ShoppingCart, RefreshCw, Loader2, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { generateMealPlan, generateShoppingList } from '@/services/geminiService';
import { UserProfile, DailyPlan, ShoppingItem } from '@/types';
import { Link } from 'react-router-dom';
import { MealPlanStorage } from '@/utils/storage';

export default function MealPlanPage({ user }: { user: UserProfile }) {
  // Lazy initialization from localStorage
  const [plan, setPlan] = useState<DailyPlan[]>(() => MealPlanStorage.loadPlan());
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => MealPlanStorage.loadShoppingList());
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'plan' | 'shopping'>('plan');
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const createPlan = async () => {
    setLoading(true);
    setShoppingList([]); // reset shopping list when new plan created
    MealPlanStorage.clearShoppingList(); // clear from storage too
    try {
      const newPlan = await generateMealPlan(user);
      setPlan(newPlan);
      MealPlanStorage.savePlan(newPlan); // persist to localStorage
    } catch (error) {
      alert("Không thể tạo thực đơn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const createShoppingList = async () => {
    if (plan.length === 0) return;
    setLoading(true);
    try {
      const list = await generateShoppingList(plan);
      setShoppingList(list);
      MealPlanStorage.saveShoppingList(list); // persist to localStorage
      setView('shopping');
    } catch (error) {
      alert("Lỗi tạo danh sách mua sắm.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ thực đơn không?')) {
      setPlan([]);
      setShoppingList([]);
      MealPlanStorage.clearAll();
      setView('plan');
    }
  };

  const toggleDay = (idx: number) => {
    setExpandedDay(expandedDay === idx ? null : idx);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Thực đơn 7 ngày</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setView('plan')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'plan' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}
          >
            Thực đơn
          </button>
          <button
            onClick={() => setView('shopping')}
            disabled={plan.length === 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'shopping' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 disabled:opacity-50'}`}
          >
            Đi chợ
          </button>
          {plan.length > 0 && (
            <button
              onClick={clearAll}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Xóa</span>
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {plan.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <CalendarDays size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-6">Chưa có thực đơn cho tuần này.</p>
          <button
            onClick={createPlan}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all"
          >
            Tạo thực đơn tự động
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <Loader2 size={40} className="animate-spin mx-auto text-orange-500 mb-4" />
          <p className="text-gray-600">AI đang tính toán dinh dưỡng...</p>
        </div>
      )}

      {/* Meal Plan View */}
      {view === 'plan' && plan.length > 0 && !loading && (
        <div className="space-y-4">
          <div className="flex justify-end mb-2">
            <button onClick={createPlan} className="text-orange-600 text-sm flex items-center gap-1 hover:underline">
              <RefreshCw size={14} /> Tạo lại thực đơn khác
            </button>
          </div>

          {plan.map((day, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => toggleDay(idx)}
                className="w-full flex justify-between items-center p-4 bg-orange-50/50 hover:bg-orange-50 transition-colors"
              >
                <span className="font-bold text-lg text-gray-800">{day.day}</span>
                {expandedDay === idx ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
              </button>

              {expandedDay === idx && (
                <div className="p-4 space-y-4 animate-fade-in">
                  <MealRow type="Sáng" meal={day.meals.breakfast} />
                  <MealRow type="Trưa" meal={day.meals.lunch} />
                  <MealRow type="Tối" meal={day.meals.dinner} />
                </div>
              )}
            </div>
          ))}

          {shoppingList.length === 0 && (
            <button
              onClick={createShoppingList}
              className="w-full mt-6 bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 flex justify-center items-center gap-2"
            >
              <ShoppingCart size={20} /> Tạo danh sách đi chợ
            </button>
          )}
        </div>
      )}

      {/* Shopping List View */}
      {view === 'shopping' && !loading && (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-green-100">
          <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
            <ShoppingCart /> Danh sách cần mua
          </h2>

          {shoppingList.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart size={40} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-sm mb-4">Chưa có danh sách mua sắm.</p>
              <button
                onClick={() => { setView('plan'); }}
                className="text-green-600 font-medium hover:underline"
              >
                ← Về tab Thực đơn để tạo danh sách
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {['Thịt', 'Rau', 'Gia vị', 'Đồ khô', 'Khác'].map((cat) => {
                const items = shoppingList.filter(i => i.category.includes(cat) || (cat === 'Khác' && !['Thịt', 'Rau', 'Gia vị', 'Đồ khô'].some(c => i.category.includes(c))));
                if (items.length === 0) return null;
                return (
                  <div key={cat}>
                    <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-1 mb-2">{cat}</h3>
                    <ul className="space-y-2">
                      {items.map((item, i) => (
                        <li key={i} className="flex justify-between text-sm text-gray-700">
                          <span>{item.name}</span>
                          <span className="font-medium bg-gray-100 px-2 rounded">{item.amount}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}

              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(shoppingList, null, 2))}
                className="w-full py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 mt-4"
              >
                Sao chép danh sách
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const MealRow = ({ type, meal }: { type: string, meal: any }) => (
  <div className="flex gap-3 items-start">
    <div className="w-12 text-sm font-bold text-orange-400 pt-1">{type}</div>
    <div className="flex-1">
      <div className="font-medium text-gray-800">{meal.dishName}</div>
      {meal.notes && <div className="text-xs text-gray-500 mt-1">{meal.notes}</div>}
      <Link
        to={`/recipe?query=${encodeURIComponent(meal.dishName)}`}
        className="text-xs text-orange-500 hover:underline mt-1 inline-block"
      >
        Xem cách nấu
      </Link>
    </div>
  </div>
);
