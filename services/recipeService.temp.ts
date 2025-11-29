// TEMPORARY: Simple query without index (for testing while index builds)
// Replace getUserRecipes with this temporarily

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebaseService';
import { SavedRecipe } from '../types';

export const getUserRecipesSimple = async (userId: string): Promise<SavedRecipe[]> => {
  try {
    console.log('Fetching recipes (simple query) for userId:', userId);

    // Simple query without orderBy - doesn't need index
    const q = query(
      collection(db, 'recipes'),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    console.log('Found recipes:', querySnapshot.size);

    const recipes: SavedRecipe[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      recipes.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as SavedRecipe);
    });

    // Sort on client side instead
    recipes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return recipes;
  } catch (error: any) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

// HOW TO USE:
// 1. Import this in RecipeHistory.tsx instead of recipeService.ts
// 2. Use getUserRecipesSimple instead of getUserRecipes
// 3. After index is built, switch back to original
