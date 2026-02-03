// utils/storage.ts
import { DailyPlan, ShoppingItem } from '@/types';

const STORAGE_KEYS = {
    MEAL_PLAN: 'bepdzui_meal_plan',
    SHOPPING_LIST: 'bepdzui_shopping_list',
} as const;

// Generic localStorage helpers
function saveToStorage<T>(key: string, data: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Failed to save ${key} to localStorage:`, error);
    }
}

function loadFromStorage<T>(key: string): T | null {
    try {
        const item = localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
        console.error(`Failed to load ${key} from localStorage:`, error);
        return null;
    }
}

function clearFromStorage(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Failed to clear ${key} from localStorage:`, error);
    }
}

// Meal Plan specific functions
export const MealPlanStorage = {
    savePlan: (plan: DailyPlan[]) => saveToStorage(STORAGE_KEYS.MEAL_PLAN, plan),
    loadPlan: (): DailyPlan[] => loadFromStorage<DailyPlan[]>(STORAGE_KEYS.MEAL_PLAN) || [],
    clearPlan: () => clearFromStorage(STORAGE_KEYS.MEAL_PLAN),

    saveShoppingList: (list: ShoppingItem[]) => saveToStorage(STORAGE_KEYS.SHOPPING_LIST, list),
    loadShoppingList: (): ShoppingItem[] => loadFromStorage<ShoppingItem[]>(STORAGE_KEYS.SHOPPING_LIST) || [],
    clearShoppingList: () => clearFromStorage(STORAGE_KEYS.SHOPPING_LIST),

    clearAll: () => {
        clearFromStorage(STORAGE_KEYS.MEAL_PLAN);
        clearFromStorage(STORAGE_KEYS.SHOPPING_LIST);
    },
};
