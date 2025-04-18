import { useState } from 'react';
import { Dish } from '../../order-system/types';
import {
  createDish as createDishFirestore,
  updateDish as updateDishFirestore,
} from '../../../services/firestoreService';

interface DishForm {
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  allergens: string[];
}

const useMenuEditor = (initialDish?: Dish) => {
  const [form, setForm] = useState<DishForm>({
    name: initialDish?.name || '',
    description: initialDish?.description || '',
    price: initialDish?.price || 0,
    category: initialDish?.category || '',
    isActive: initialDish?.isActive || true,
    allergens: initialDish?.allergens || [],
  });

  const updateForm = (updates: Partial<DishForm>) => {
    setForm({ ...form, ...updates });
  };

  const submitForm = async () => {
    try {
      if (initialDish) {
        await updateDishFirestore(initialDish.id, form);
        return initialDish.id; // Return the ID of the updated dish
      } else {
        const newDishId = await createDishFirestore(form);
        return newDishId; // Return the ID of the newly created dish
      }
    } catch (error: any) {
      // Handle error appropriately, e.g., re-throw or set an error state
      console.error("Error submitting form:", error);
      throw error; 
    }
  };

  return {
    form,
    updateForm,
    submitForm,
  };
};

export default useMenuEditor;
