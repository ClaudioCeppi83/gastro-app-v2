import React, { useState } from 'react';
import { CategoryWithDishes } from '../types'; // Adjust the path as needed
import { Dish } from '../../order-system/types';

interface MenuDisplayProps {
  categories: CategoryWithDishes[];
  onAddItem: (dish: Dish) => void;
}

const MenuDisplay: React.FC<MenuDisplayProps> = ({ categories, onAddItem }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categories.length > 0 ? categories[0].id : null
  );

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleAddItemClick = (dish: Dish) => {
    onAddItem(dish);
  };

  const renderMenuItems = () => {
    if (!selectedCategory) return null;

    const category = categories.find((c) => c.id === selectedCategory);
    if (!category) return null;

    return (
      <div className="menu-items">
        {category.dishes.map((dish) => (
          <div key={dish.id} className="menu-item">
            <h3>{dish.name}</h3>
            <p>${dish.price.toFixed(2)}</p>
            <button onClick={() => handleAddItemClick(dish)}>Add</button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="menu-display">
      <div className="categories">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-button ${
              selectedCategory === category.id ? 'selected' : ''
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {renderMenuItems()}
    </div>
  );
};

export default MenuDisplay;
