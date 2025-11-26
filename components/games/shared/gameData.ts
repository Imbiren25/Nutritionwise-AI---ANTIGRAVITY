export type FoodCategory = 'carbs' | 'protein' | 'fats' | 'fruit-veg' | 'junk' | 'fiber';

export interface GameItem {
    id: string;
    name: string;
    category: FoodCategory;
    icon: string;
    isHealthy: boolean;
    isFiberRich?: boolean;
}

export const GAME_ITEMS: GameItem[] = [
    // Healthy Items
    { id: 'apple', name: 'Apple', category: 'fruit-veg', icon: '🍎', isHealthy: true, isFiberRich: true },
    { id: 'banana', name: 'Banana', category: 'fruit-veg', icon: '🍌', isHealthy: true, isFiberRich: true },
    { id: 'carrot', name: 'Carrot', category: 'fruit-veg', icon: '🥕', isHealthy: true, isFiberRich: true },
    { id: 'broccoli', name: 'Broccoli', category: 'fruit-veg', icon: '🥦', isHealthy: true, isFiberRich: true },
    { id: 'bread', name: 'Whole Grain Bread', category: 'carbs', icon: '🍞', isHealthy: true, isFiberRich: true },
    { id: 'rice', name: 'Brown Rice', category: 'carbs', icon: '🍚', isHealthy: true, isFiberRich: true },
    { id: 'oats', name: 'Oats', category: 'carbs', icon: '🥣', isHealthy: true, isFiberRich: true },
    { id: 'beans', name: 'Beans', category: 'protein', icon: '🫘', isHealthy: true, isFiberRich: true },
    { id: 'chicken', name: 'Chicken', category: 'protein', icon: '🍗', isHealthy: true, isFiberRich: false },
    { id: 'fish', name: 'Fish', category: 'protein', icon: '🐟', isHealthy: true, isFiberRich: false },
    { id: 'egg', name: 'Egg', category: 'protein', icon: '🥚', isHealthy: true, isFiberRich: false },
    { id: 'avocado', name: 'Avocado', category: 'fats', icon: '🥑', isHealthy: true, isFiberRich: true },
    { id: 'nuts', name: 'Nuts', category: 'fats', icon: '🥜', isHealthy: true, isFiberRich: true },
    { id: 'yogurt', name: 'Yogurt', category: 'protein', icon: '🥛', isHealthy: true, isFiberRich: false },

    // Junk/Unhealthy Items (Bombs/Avoid)
    { id: 'burger', name: 'Burger', category: 'junk', icon: '🍔', isHealthy: false },
    { id: 'fries', name: 'Fries', category: 'junk', icon: '🍟', isHealthy: false },
    { id: 'pizza', name: 'Pizza', category: 'junk', icon: '🍕', isHealthy: false },
    { id: 'donut', name: 'Donut', category: 'junk', icon: '🍩', isHealthy: false },
    { id: 'soda', name: 'Soda', category: 'junk', icon: '🥤', isHealthy: false },
    { id: 'candy', name: 'Candy', category: 'junk', icon: '🍬', isHealthy: false },
    { id: 'cookie', name: 'Cookie', category: 'junk', icon: '🍪', isHealthy: false },
];

export const QUIZ_QUESTIONS = [
    { q: "Which nutrient is the body's main source of energy?", options: ["Carbohydrates", "Protein", "Vitamins", "Water"], a: 0 },
    { q: "Which vitamin is produced when skin is exposed to sunlight?", options: ["Vitamin C", "Vitamin D", "Vitamin A", "Vitamin B12"], a: 1 },
    { q: "Iron is essential for transporting what in the blood?", options: ["Calcium", "Oxygen", "Sugar", "Fat"], a: 1 },
    { q: "Which of these is a good source of fiber?", options: ["Chicken", "Eggs", "Oats", "Milk"], a: 2 },
    { q: "How much water should an average adult drink daily?", options: ["1-2 Liters", "3-4 Liters", "5-6 Liters", "10 Liters"], a: 1 },
    { q: "Which food group is the best source of Calcium?", options: ["Meat", "Dairy", "Grains", "Fruits"], a: 1 },
    { q: "What is the 'bad' cholesterol called?", options: ["HDL", "LDL", "ABC", "XYZ"], a: 1 },
    { q: "Which of these is a protein powerhouse?", options: ["Apple", "Lentils", "Cucumber", "Rice"], a: 1 },
    { q: "Vitamin C helps with...", options: ["Bone strength", "Immunity", "Muscle growth", "Sleep"], a: 1 },
    { q: "Too much sodium (salt) can lead to...", options: ["High Blood Pressure", "Low Energy", "Better Vision", "Weight Loss"], a: 0 },
];
