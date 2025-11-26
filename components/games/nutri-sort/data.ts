export type FoodCategory = 'carbs' | 'protein' | 'fats' | 'fruit-veg';

export interface FoodItem {
    id: string;
    name: string;
    category: FoodCategory;
    icon: string; // Emoji or icon name
}

export const FOOD_ITEMS: FoodItem[] = [
    { id: 'apple', name: 'Apple', category: 'fruit-veg', icon: '🍎' },
    { id: 'banana', name: 'Banana', category: 'fruit-veg', icon: '🍌' },
    { id: 'carrot', name: 'Carrot', category: 'fruit-veg', icon: '🥕' },
    { id: 'broccoli', name: 'Broccoli', category: 'fruit-veg', icon: '🥦' },
    { id: 'bread', name: 'Bread', category: 'carbs', icon: '🍞' },
    { id: 'rice', name: 'Rice', category: 'carbs', icon: '🍚' },
    { id: 'pasta', name: 'Pasta', category: 'carbs', icon: '🍝' },
    { id: 'potato', name: 'Potato', category: 'carbs', icon: '🥔' },
    { id: 'chicken', name: 'Chicken', category: 'protein', icon: '🍗' },
    { id: 'egg', name: 'Egg', category: 'protein', icon: '🥚' },
    { id: 'fish', name: 'Fish', category: 'protein', icon: '🐟' },
    { id: 'steak', name: 'Steak', category: 'protein', icon: '🥩' },
    { id: 'avocado', name: 'Avocado', category: 'fats', icon: '🥑' },
    { id: 'nuts', name: 'Nuts', category: 'fats', icon: '🥜' },
    { id: 'cheese', name: 'Cheese', category: 'fats', icon: '🧀' },
    { id: 'oil', name: 'Olive Oil', category: 'fats', icon: '🫒' },
];

export const CATEGORIES: { id: FoodCategory; label: string; color: string }[] = [
    { id: 'fruit-veg', label: 'Fruits & Veg', color: 'bg-green-500' },
    { id: 'carbs', label: 'Carbohydrates', color: 'bg-yellow-500' },
    { id: 'protein', label: 'Protein', color: 'bg-red-500' },
    { id: 'fats', label: 'Healthy Fats', color: 'bg-blue-500' },
];
