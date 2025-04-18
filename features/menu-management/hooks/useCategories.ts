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
      { id: '1', name: 'Appetizers', dishes: [] },
      { id: '2', name: 'Main Courses', dishes: [] },
      { id: '3', name: 'Desserts', dishes: [] },
      { id: '4', name: 'Drinks', dishes: [] },
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