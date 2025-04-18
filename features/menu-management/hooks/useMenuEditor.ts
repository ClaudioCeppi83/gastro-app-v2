import { useState } from 'react';
import { Dish } from '../../order-system/types';

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
    // In a real application, submit the form data to update or create a dish
    // Example:
    // try {
    //   if (initialDish) {
    //     await api.updateDish({ ...initialDish, ...form });
    //   } else {
    //     await api.createDish(form);
    //   }
    //   // Handle success (e.g., redirect, show message)
    // } catch (err: any) {
    //   // Handle error
    // }
    console.log('Form submitted:', form);
    // Placeholder: In a real app, you'd likely have a success/error state and feedback to the user
  };

  return {
    form,
    updateForm,
    submitForm,
  };
};

export default useMenuEditor;
