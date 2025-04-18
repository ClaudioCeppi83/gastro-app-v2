import { useState, useEffect } from 'react';
import { Category } from '../types';

const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, fetch categories from an API or database
    // Example:
    // const fetchCategories = async () => {
    //   try {
    //     const data = await api.getCategories();
    //     setCategories(data);
    //   } catch (err: any) {
    //     setError(err.message || 'Failed to fetch categories');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchCategories();

    // For now, return a static list
    setCategories([
      {
        id: '1',
        name: 'Appetizers',
        dishes: [
          { id: 'a1', name: 'Spring Rolls', price: 5.99, description: 'Crispy rolls with vegetables', category: 'Appetizers', isActive: true, allergens: [] },
          { id: 'a2', name: 'Garlic Bread', price: 3.99, description: 'Toasted bread with garlic butter', category: 'Appetizers', isActive: true, allergens: ['Gluten'] },
        ],
      },
      {
        id: '2',
        name: 'Main Courses',
        dishes: [
          { id: 'm1', name: 'Grilled Chicken', price: 12.99, description: 'Chicken breast with herbs', category: 'Main Courses', isActive: true, allergens: [] },
          { id: 'm2', name: 'Pasta Carbonara', price: 10.99, description: 'Pasta with creamy sauce', category: 'Main Courses', isActive: true, allergens: ['Dairy', 'Gluten'] },
        ],
      },
      {
        id: '3',
        name: 'Desserts',
        dishes: [
          { id: 'd1', name: 'Cheesecake', price: 6.99, description: 'Creamy cheesecake with berries', category: 'Desserts', isActive: true, allergens: ['Dairy', 'Gluten'] },
          { id: 'd2', name: 'Chocolate Mousse', price: 5.99, description: 'Rich chocolate mousse', category: 'Desserts', isActive: true, allergens: ['Dairy'] },
        ],
      },
      {
        id: '4',
        name: 'Drinks',
        dishes: [
          { id: 'dr1', name: 'Coca-Cola', price: 1.99, description: 'Classic soda', category: 'Drinks', isActive: true, allergens: [] },
          { id: 'dr2', name: 'Orange Juice', price: 2.99, description: 'Freshly squeezed orange juice', category: 'Drinks', isActive: true, allergens: [] },
        ],
      },
    ]);
    setLoading(false);
  }, []);

  return {
    categories,
    loading,
    error,
  };
};

export default useCategories;
