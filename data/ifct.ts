import { IFCTFood } from '../types';
import { northIndianFoods } from './ifct-north';
import { southIndianFoods } from './ifct-south';
import { eastIndianFoods } from './ifct-east';
import { westIndianFoods } from './ifct-west';

// Core basic foods (original seed data)
const coreFoods: IFCTFood[] = [
  {
    id: 'rice-raw',
    name: 'Rice (raw)',
    group: 'cereals',
    aliases: ['white rice'],
    source: 'ifct',
    per100g: { energy: 350, protein: 7, fat: 0.5, carbs: 78, fiber: 0.6, iron: 1.8, calcium: 10, vitaminA: 0, zinc: 1.2 }
  },
  {
    id: 'wheat-atta',
    name: 'Wheat Flour (Atta)',
    group: 'cereals',
    aliases: ['atta'],
    source: 'ifct',
    per100g: { energy: 340, protein: 12, fat: 1.5, carbs: 72, fiber: 10.7, iron: 3.5, calcium: 34, vitaminA: 0, zinc: 2.7 }
  },
  {
    id: 'moong-dal-raw',
    name: 'Moong Dal (raw)',
    group: 'pulses',
    aliases: ['green gram split'],
    source: 'ifct',
    per100g: { energy: 347, protein: 24, fat: 1.2, carbs: 62, fiber: 16.3, iron: 4.1, calcium: 124, vitaminA: 0, zinc: 2.7 }
  },
  {
    id: 'chana-dal-raw',
    name: 'Chana Dal (raw)',
    group: 'pulses',
    aliases: ['bengal gram split'],
    source: 'ifct',
    per100g: { energy: 372, protein: 22, fat: 5.6, carbs: 61, fiber: 10.8, iron: 5.3, calcium: 63, vitaminA: 0, zinc: 3.8 }
  },
  {
    id: 'rajma-raw',
    name: 'Rajma (raw)',
    group: 'pulses',
    aliases: ['kidney beans'],
    source: 'ifct',
    per100g: { energy: 333, protein: 24, fat: 1.1, carbs: 60, fiber: 24.9, iron: 5.1, calcium: 260, vitaminA: 0, zinc: 3.3 }
  },
  {
    id: 'paneer',
    name: 'Paneer',
    group: 'dairy',
    aliases: ['cottage cheese'],
    source: 'ifct',
    per100g: { energy: 296, protein: 18, fat: 23, carbs: 3, fiber: 0, iron: 0.2, calcium: 208, vitaminA: 210, zinc: 2.1 }
  },
  {
    id: 'milk-toned',
    name: 'Toned Milk',
    group: 'dairy',
    aliases: ['milk'],
    source: 'ifct',
    per100g: { energy: 58, protein: 3.2, fat: 1.5, carbs: 4.8, fiber: 0, iron: 0, calcium: 120, vitaminA: 45, zinc: 0.4 }
  },
  {
    id: 'spinach-raw',
    name: 'Spinach (raw)',
    group: 'vegetables',
    aliases: ['palak'],
    source: 'ifct',
    per100g: { energy: 30, protein: 2.9, fat: 0.4, carbs: 3.6, fiber: 2.2, iron: 2.7, calcium: 99, vitaminA: 469, zinc: 0.5 }
  },
  {
    id: 'carrot-raw',
    name: 'Carrot (raw)',
    group: 'vegetables',
    aliases: ['gajar'],
    source: 'ifct',
    per100g: { energy: 41, protein: 0.9, fat: 0.2, carbs: 9.6, fiber: 2.8, iron: 0.3, calcium: 33, vitaminA: 835, zinc: 0.2 }
  },
  {
    id: 'banana',
    name: 'Banana',
    group: 'fruits',
    aliases: ['kela'],
    source: 'ifct',
    per100g: { energy: 89, protein: 1.1, fat: 0.3, carbs: 23, fiber: 2.6, iron: 0.3, calcium: 5, vitaminA: 3, zinc: 0.2 }
  },
  {
    id: 'apple',
    name: 'Apple',
    group: 'fruits',
    aliases: ['seb'],
    source: 'ifct',
    per100g: { energy: 52, protein: 0.3, fat: 0.2, carbs: 14, fiber: 2.4, iron: 0.1, calcium: 6, vitaminA: 1, zinc: 0.1 }
  },
  {
    id: 'mustard-oil',
    name: 'Mustard Oil',
    group: 'oils',
    aliases: ['sarson tel'],
    source: 'ifct',
    per100g: { energy: 884, protein: 0, fat: 100, carbs: 0, fiber: 0, iron: 0, calcium: 0, vitaminA: 0, zinc: 0 }
  },
  {
    id: 'egg',
    name: 'Egg',
    group: 'eggs',
    aliases: ['anda'],
    source: 'ifct',
    per100g: { energy: 155, protein: 13, fat: 11, carbs: 1.1, fiber: 0, iron: 1.2, calcium: 50, vitaminA: 140, zinc: 1.3 }
  },
  {
    id: 'chicken-breast',
    name: 'Chicken Breast (cooked)',
    group: 'meat',
    aliases: ['murgh breast'],
    source: 'ifct',
    per100g: { energy: 165, protein: 31, fat: 3.6, carbs: 0, fiber: 0, iron: 1, calcium: 15, vitaminA: 13, zinc: 1 }
  },
  {
    id: 'jaggery',
    name: 'Jaggery',
    group: 'sugars',
    aliases: ['gur'],
    source: 'ifct',
    per100g: { energy: 383, protein: 0, fat: 0, carbs: 98, fiber: 0, iron: 0.5, calcium: 80, vitaminA: 0, zinc: 0.1 }
  },
  {
    id: 'khichdi',
    name: 'Khichdi',
    group: 'mixed',
    aliases: ['kichadi'],
    source: 'ifct',
    per100g: { energy: 120, protein: 3.5, fat: 3, carbs: 18, fiber: 1.8, iron: 1.1, calcium: 22, vitaminA: 20, zinc: 0.6 }
  }
];

// Combine all foods: core + regional
export const IFCT_SEED: IFCTFood[] = [
  ...coreFoods,
  ...northIndianFoods,
  ...southIndianFoods,
  ...eastIndianFoods,
  ...westIndianFoods,
];