// services/recipeService.ts
import { collection, addDoc, query, where, orderBy, limit, getDocs, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebaseService';
import { Recipe, SavedRecipe } from '@/types';

const RECIPES_COLLECTION = 'recipes';

/**
 * Save a recipe to Firestore
 */
export const saveRecipe = async (
  userId: string,
  recipe: Recipe,
  searchQuery: string
): Promise<string> => {
  try {
    const recipeData = {
      ...recipe,
      userId,
      query: searchQuery,
      createdAt: Timestamp.now(),
      isFavorite: false,
    };

    console.log('Saving recipe with data:', { userId, query: searchQuery, recipeName: recipe.name });
    const docRef = await addDoc(collection(db, RECIPES_COLLECTION), recipeData);
    console.log('Recipe saved successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw error;
  }
};

/**
 * Get user's recipe history
 */
export const getUserRecipes = async (
  userId: string,
  limitCount: number = 20
): Promise<SavedRecipe[]> => {
  try {
    console.log('Fetching recipes for userId:', userId);

    const q = query(
      collection(db, RECIPES_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    console.log('Found recipes:', querySnapshot.size);

    const recipes: SavedRecipe[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('Recipe data:', { id: doc.id, name: data.name });
      recipes.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as SavedRecipe);
    });

    return recipes;
  } catch (error: any) {
    console.error('Error fetching recipes:', error);

    // Nếu lỗi là do missing index, hướng dẫn user
    if (error.code === 'failed-precondition' || error.message?.includes('index')) {
      console.error('Firestore index required. Check console for link to create index.');
      console.error('Error details:', error.message);
    }

    throw error;
  }
};

/**
 * Delete a recipe
 */
export const deleteRecipe = async (recipeId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, RECIPES_COLLECTION, recipeId));
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw new Error('Không thể xóa công thức.');
  }
};

/**
 * Toggle favorite status
 */
export const toggleFavorite = async (
  recipeId: string,
  currentStatus: boolean
): Promise<void> => {
  try {
    await updateDoc(doc(db, RECIPES_COLLECTION, recipeId), {
      isFavorite: !currentStatus,
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw new Error('Không thể cập nhật yêu thích.');
  }
};

/**
 * Get favorite recipes only
 */
export const getFavoriteRecipes = async (userId: string): Promise<SavedRecipe[]> => {
  try {
    const q = query(
      collection(db, RECIPES_COLLECTION),
      where('userId', '==', userId),
      where('isFavorite', '==', true),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const recipes: SavedRecipe[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      recipes.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as SavedRecipe);
    });

    return recipes;
  } catch (error) {
    console.error('Error fetching favorite recipes:', error);
    throw new Error('Không thể tải công thức yêu thích.');
  }
};
