import { useState, useEffect } from 'react';
import { Category, CategoryWithDishes } from '../types';
import { getMenu, getDishes } from '../../../services/firestoreService';
import { Dish } from '../../order-system/types';

const useCategories = () => {
  const [categories, setCategories] = useState<CategoryWithDishes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuAndDishes = async () => {
      try {
        const menuData = await getMenu();
        const allDishes = await getDishes() as Dish[];

        if (menuData?.categories) {        
          const updatedCategories: CategoryWithDishes[] = menuData.categories
            .filter((category: Category) => category.id && category.dishIds)
            .map((category: Category) => ({
              id: category.id,
              name: category.name,
              description: category.description,
              dishes: allDishes.filter(dish => category.dishIds.includes(dish.id))
            }));
          setCategories(updatedCategories);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch menu or dishes');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuAndDishes();
  }, []);

  return {
    categories,
    loading,
    error,
  };
};

export default useCategories;
