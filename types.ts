
export interface UserProfile {
  name: string;
  goal: string;
  dietaryNotes: string; // Combined preferences, allergies, dislikes
  cookingTime: number; // minutes
}

export interface Ingredient {
  name: string;
  amount: string;
  category?: 'meat' | 'vegetable' | 'spice' | 'dry' | 'other';
}

export interface Recipe {
  name: string;
  description: string;
  ingredients: Ingredient[];
  steps: string[];
  cookingTime: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  quickVersion?: string;
}

export interface AnalyzedDish {
  dishName: string;
  ingredients: string[];
  confidence: number;
  alternatives: string[];
}

export interface Meal {
  dishName: string;
  type: 'breakfast' | 'lunch' | 'dinner';
  notes?: string;
}

export interface DailyPlan {
  day: string;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
  };
}

export interface ShoppingItem {
  name: string;
  amount: string;
  category: string;
}
