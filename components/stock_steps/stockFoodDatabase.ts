// Master Stock Food Database
// Combines all category-specific databases into a single comprehensive database
// 1000+ items with complete nutritional data

import { cerealsDatabase } from './stockDB_cereals';
import { pulsesDatabase } from './stockDB_pulses';
import { oilsDatabase } from './stockDB_oils';
import { vegetablesDatabase } from './stockDB_vegetables';
import { fruitsDatabase } from './stockDB_fruits';
import { dairyDatabase } from './stockDB_dairy';
import { eggsDatabase, meatDatabase, sugarsDatabase, condimentsDatabase } from './stockDB_combined';

export type StockFoodItem = {
    name: string;
    category: string;
    energy: number;      // kcal per 100g (or per unit for eggs)
    protein: number;     // g per 100g (or per unit for eggs)
    carbs: number;       // g per 100g (or per unit for eggs)
    fat: number;         // g per 100g (or per unit for eggs)
    fiber: number;       // g per 100g (or per unit for eggs)
    defaultUnit: 'kg' | 'litre' | 'unit';
};

// Combined master database
export const stockFoodDatabase: StockFoodItem[] = [
    ...cerealsDatabase,
    ...pulsesDatabase,
    ...oilsDatabase,
    ...vegetablesDatabase,
    ...fruitsDatabase,
    ...dairyDatabase,
    ...eggsDatabase,
    ...meatDatabase,
    ...sugarsDatabase,
    ...condimentsDatabase
];

// Category statistics
export const categoryStats = {
    cereals: cerealsDatabase.length,
    pulses: pulsesDatabase.length,
    oils: oilsDatabase.length,
    vegetables: vegetablesDatabase.length,
    fruits: fruitsDatabase.length,
    dairy: dairyDatabase.length,
    eggs: eggsDatabase.length,
    meat: meatDatabase.length,
    sugars: sugarsDatabase.length,
    condiments: condimentsDatabase.length,
    total: stockFoodDatabase.length
};

// Helper function to get items by category
export const getStockItemsByCategory = (category: string): StockFoodItem[] => {
    return stockFoodDatabase.filter(item => item.category === category);
};

// Helper function to search items
export const searchStockItems = (query: string): StockFoodItem[] => {
    const lowerQuery = query.toLowerCase();
    return stockFoodDatabase.filter(item =>
        item.name.toLowerCase().includes(lowerQuery)
    );
};

// Helper function to get all category names
export const getAllCategories = (): string[] => {
    return Array.from(new Set(stockFoodDatabase.map(item => item.category)));
};

// Export individual databases for direct access if needed
export {
    cerealsDatabase,
    pulsesDatabase,
    oilsDatabase,
    vegetablesDatabase,
    fruitsDatabase,
    dairyDatabase,
    eggsDatabase,
    meatDatabase,
    sugarsDatabase,
    condimentsDatabase
};

// Category display names mapping
export const categoryDisplayNames: Record<string, string> = {
    cereals: 'Cereals (Rice, Wheat, Millets, etc.)',
    pulses: 'Pulses (Dal, Lentils, Beans)',
    oils: 'Oils & Fats',
    vegetables: 'Vegetables',
    fruits: 'Fruits',
    dairy: 'Dairy & Milk Products',
    eggs: 'Eggs',
    meat: 'Meat, Fish & Poultry',
    sugars: 'Sugar & Jaggery',
    condiments: 'Condiments & Spices'
};

console.log('Stock Food Database Loaded:', categoryStats);
