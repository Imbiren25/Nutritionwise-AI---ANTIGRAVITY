import { IFCTFood } from '../types';

// Maharashtra
const maharashtraFoods: IFCTFood[] = [
    { id: 'vada-pav', name: 'Vada Pav', group: 'mixed', aliases: ['potato fritter burger'], source: 'ifct', per100g: { energy: 285, protein: 6.5, fat: 13.5, carbs: 37, fiber: 3.5, iron: 1.8, calcium: 42, vitaminA: 12, zinc: 1.1 } },
    { id: 'misal-pav', name: 'Misal Pav', group: 'mixed', aliases: ['spicy sprouts'], source: 'ifct', per100g: { energy: 195, protein: 8.5, fat: 8.5, carbs: 24, fiber: 5.5, iron: 2.8, calcium: 65, vitaminA: 45, zinc: 1.5 } },
    { id: 'puran-poli', name: 'Puran Poli', group: 'mixed', aliases: ['sweet flatbread'], source: 'ifct', per100g: { energy: 325, protein: 6.8, fat: 8.5, carbs: 58, fiber: 4.5, iron: 2.2, calcium: 52, vitaminA: 25, zinc: 1.3 } },
    { id: 'modak', name: 'Modak', group: 'sugars', aliases: ['sweet dumpling'], source: 'ifct', per100g: { energy: 285, protein: 4.5, fat: 7.5, carbs: 52, fiber: 2.2, iron: 1.2, calcium: 45, vitaminA: 35, zinc: 0.8 } },
    { id: 'bhakri', name: 'Bhakri', group: 'cereals', aliases: ['millet bread'], source: 'ifct', per100g: { energy: 342, protein: 9.8, fat: 3.5, carbs: 68, fiber: 8.2, iron: 3.5, calcium: 38, vitaminA: 0, zinc: 2.1 } },
    { id: 'pithla-bhakri', name: 'Pithla Bhakri', group: 'mixed', aliases: ['gram flour curry'], source: 'ifct', per100g: { energy: 265, protein: 9.5, fat: 11.5, carbs: 35, fiber: 5.5, iron: 2.8, calcium: 52, vitaminA: 18, zinc: 1.6 } },
    { id: 'sabudana-khichdi', name: 'Sabudana Khichdi', group: 'mixed', aliases: ['tapioca pearls'], source: 'ifct', per100g: { energy: 285, protein: 2.5, fat: 12.5, carbs: 42, fiber: 1.2, iron: 0.8, calcium: 28, vitaminA: 8, zinc: 0.5 } },
    { id: 'kolhapuri-chicken', name: 'Kolhapuri Chicken', group: 'meat', aliases: ['spicy chicken curry'], source: 'ifct', per100g: { energy: 225, protein: 19, fat: 14.5, carbs: 6.5, fiber: 1.8, iron: 1.8, calcium: 42, vitaminA: 55, zinc: 2.1 } },
];

// Gujarat
const gujaratFoods: IFCTFood[] = [
    { id: 'dhokla', name: 'Dhokla', group: 'mixed', aliases: ['steamed gram flour cake'], source: 'ifct', per100g: { energy: 165, protein: 6.5, fat: 4.5, carbs: 26, fiber: 3.2, iron: 1.5, calcium: 45, vitaminA: 15, zinc: 1.1 } },
    { id: 'khandvi', name: 'Khandvi', group: 'mixed', aliases: ['gram flour rolls'], source: 'ifct', per100g: { energy: 185, protein: 7.5, fat: 8.5, carbs: 22, fiber: 2.8, iron: 1.8, calcium: 52, vitaminA: 12, zinc: 1.2 } },
    { id: 'thepla', name: 'Thepla', group: 'cereals', aliases: ['fenugreek flatbread'], source: 'ifct', per100g: { energy: 315, protein: 8.5, fat: 11.5, carbs: 48, fiber: 6.5, iron: 3.2, calcium: 85, vitaminA: 125, zinc: 1.8 } },
    { id: 'undhiyu', name: 'Undhiyu', group: 'vegetables', aliases: ['mixed vegetable'], source: 'ifct', per100g: { energy: 125, protein: 4.5, fat: 6.5, carbs: 14, fiber: 4.8, iron: 2.2, calcium: 65, vitaminA: 185, zinc: 0.9 } },
    { id: 'fafda', name: 'Fafda', group: 'mixed', aliases: ['fried gram flour strips'], source: 'ifct', per100g: { energy: 485, protein: 11.5, fat: 32, carbs: 42, fiber: 4.5, iron: 2.8, calcium: 58, vitaminA: 8, zinc: 1.8 } },
    { id: 'handvo', name: 'Handvo', group: 'mixed', aliases: ['savory cake'], source: 'ifct', per100g: { energy: 245, protein: 7.5, fat: 11.5, carbs: 32, fiber: 4.2, iron: 2.2, calcium: 58, vitaminA: 85, zinc: 1.3 } },
    { id: 'shrikhand', name: 'Shrikhand', group: 'dairy', aliases: ['sweet yogurt'], source: 'ifct', per100g: { energy: 225, protein: 6.5, fat: 8.5, carbs: 32, fiber: 0, iron: 0.3, calcium: 145, vitaminA: 95, zinc: 0.7 } },
];

// Goa
const goaFoods: IFCTFood[] = [
    { id: 'goan-fish-curry', name: 'Goan Fish Curry', group: 'meat', aliases: ['xitti kodi'], source: 'ifct', per100g: { energy: 155, protein: 16.5, fat: 8.5, carbs: 5.5, fiber: 1.5, iron: 1.2, calcium: 42, vitaminA: 48, zinc: 0.9 } },
    { id: 'vindaloo', name: 'Vindaloo', group: 'meat', aliases: ['spicy pork curry'], source: 'ifct', per100g: { energy: 265, protein: 20, fat: 18, carbs: 7.5, fiber: 1.8, iron: 1.8, calcium: 38, vitaminA: 42, zinc: 2.8 } },
    { id: 'xacuti', name: 'Xacuti', group: 'meat', aliases: ['chicken curry'], source: 'ifct', per100g: { energy: 215, protein: 18.5, fat: 13.5, carbs: 6.5, fiber: 2.2, iron: 1.5, calcium: 45, vitaminA: 55, zinc: 1.8 } },
    { id: 'bebinca', name: 'Bebinca', group: 'sugars', aliases: ['layered pudding'], source: 'ifct', per100g: { energy: 385, protein: 6.5, fat: 18, carbs: 52, fiber: 0.5, iron: 1.2, calcium: 95, vitaminA: 185, zinc: 0.8 } },
    { id: 'sanna', name: 'Sanna', group: 'cereals', aliases: ['rice cake'], source: 'ifct', per100g: { energy: 145, protein: 2.8, fat: 0.8, carbs: 32, fiber: 1.2, iron: 0.6, calcium: 15, vitaminA: 0, zinc: 0.5 } },
    { id: 'sorpotel', name: 'Sorpotel', group: 'meat', aliases: ['spicy pork dish'], source: 'ifct', per100g: { energy: 285, protein: 21, fat: 20, carbs: 5.5, fiber: 1.5, iron: 2.5, calcium: 35, vitaminA: 85, zinc: 3.2 } },
];

// Madhya Pradesh & Chhattisgarh
const mpCgFoods: IFCTFood[] = [
    { id: 'poha', name: 'Poha', group: 'cereals', aliases: ['flattened rice'], source: 'ifct', per100g: { energy: 158, protein: 3.4, fat: 4.5, carbs: 28, fiber: 1.8, iron: 1.2, calcium: 22, vitaminA: 12, zinc: 0.7 } },
    { id: 'bhutte-ka-kees', name: 'Bhutte ka Kees', group: 'vegetables', aliases: ['grated corn'], source: 'ifct', per100g: { energy: 185, protein: 4.5, fat: 9.5, carbs: 22, fiber: 3.5, iron: 1.2, calcium: 42, vitaminA: 85, zinc: 0.8 } },
    { id: 'dal-bafla', name: 'Dal Bafla', group: 'mixed', aliases: ['wheat balls with dal'], source: 'ifct', per100g: { energy: 285, protein: 9.5, fat: 11.5, carbs: 40, fiber: 6.5, iron: 3.2, calcium: 58, vitaminA: 25, zinc: 1.8 } },
    { id: 'mawa-bati', name: 'Mawa Bati', group: 'sugars', aliases: ['sweet dumplings'], source: 'ifct', per100g: { energy: 425, protein: 8.5, fat: 22, carbs: 52, fiber: 1.5, iron: 1.2, calcium: 125, vitaminA: 145, zinc: 1.1 } },
    { id: 'chila', name: 'Chila', group: 'mixed', aliases: ['gram flour pancake'], source: 'ifct', per100g: { energy: 185, protein: 7.5, fat: 6.5, carbs: 26, fiber: 4.2, iron: 2.2, calcium: 48, vitaminA: 25, zinc: 1.3 } },
    { id: 'bafla', name: 'Bafla', group: 'cereals', aliases: ['wheat balls'], source: 'ifct', per100g: { energy: 325, protein: 9.5, fat: 12.5, carbs: 48, fiber: 7.5, iron: 3.2, calcium: 45, vitaminA: 12, zinc: 1.8 } },
];

export const westIndianFoods: IFCTFood[] = [
    ...maharashtraFoods,
    ...gujaratFoods,
    ...goaFoods,
    ...mpCgFoods,
];
