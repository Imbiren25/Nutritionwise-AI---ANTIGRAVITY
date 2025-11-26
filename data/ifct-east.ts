import { IFCTFood } from '../types';

// West Bengal
const westBengalFoods: IFCTFood[] = [
    { id: 'machher-jhol', name: 'Machher Jhol', group: 'meat', aliases: ['fish curry'], source: 'ifct', per100g: { energy: 135, protein: 14.5, fat: 7.5, carbs: 4.5, fiber: 1.2, iron: 1.2, calcium: 42, vitaminA: 45, zinc: 0.9 } },
    { id: 'shukto', name: 'Shukto', group: 'vegetables', aliases: ['mixed vegetable'], source: 'ifct', per100g: { energy: 95, protein: 2.8, fat: 6.5, carbs: 8.5, fiber: 3.5, iron: 1.5, calcium: 55, vitaminA: 185, zinc: 0.6 } },
    { id: 'luchi', name: 'Luchi', group: 'cereals', aliases: ['fried bread'], source: 'ifct', per100g: { energy: 385, protein: 7.5, fat: 22, carbs: 42, fiber: 2.5, iron: 1.8, calcium: 28, vitaminA: 0, zinc: 0.9 } },
    { id: 'rosogolla', name: 'Rosogolla', group: 'dairy', aliases: ['rasgulla'], source: 'ifct', per100g: { energy: 186, protein: 4, fat: 1, carbs: 40, fiber: 0, iron: 0.2, calcium: 85, vitaminA: 15, zinc: 0.3 } },
    { id: 'sandesh', name: 'Sandesh', group: 'dairy', aliases: ['bengali sweet'], source: 'ifct', per100g: { energy: 265, protein: 8.5, fat: 9.5, carbs: 38, fiber: 0, iron: 0.3, calcium: 125, vitaminA: 95, zinc: 0.7 } },
    { id: 'mishti-doi', name: 'Mishti Doi', group: 'dairy', aliases: ['sweet yogurt'], source: 'ifct', per100g: { energy: 145, protein: 4.5, fat: 4.5, carbs: 22, fiber: 0, iron: 0.2, calcium: 135, vitaminA: 55, zinc: 0.5 } },
    { id: 'kosha-mangsho', name: 'Kosha Mangsho', group: 'meat', aliases: ['mutton curry'], source: 'ifct', per100g: { energy: 245, protein: 21, fat: 16, carbs: 5.5, fiber: 1.5, iron: 2.8, calcium: 38, vitaminA: 42, zinc: 3.5 } },
    { id: 'chingri-malai-curry', name: 'Chingri Malai Curry', group: 'meat', aliases: ['prawn coconut curry'], source: 'ifct', per100g: { energy: 165, protein: 15.5, fat: 10.5, carbs: 4.5, fiber: 0.8, iron: 1.5, calcium: 85, vitaminA: 55, zinc: 1.8 } },
    { id: 'aloo-posto', name: 'Aloo Posto', group: 'vegetables', aliases: ['potato poppy seeds'], source: 'ifct', per100g: { energy: 185, protein: 4.5, fat: 11.5, carbs: 17, fiber: 2.8, iron: 2.5, calcium: 185, vitaminA: 12, zinc: 1.5 } },
];

// Odisha
const odishaFoods: IFCTFood[] = [
    { id: 'dalma', name: 'Dalma', group: 'mixed', aliases: ['lentil vegetable'], source: 'ifct', per100g: { energy: 125, protein: 6.5, fat: 3.5, carbs: 18, fiber: 5.2, iron: 2.2, calcium: 58, vitaminA: 125, zinc: 1.1 } },
    { id: 'pakhala', name: 'Pakhala', group: 'mixed', aliases: ['fermented rice'], source: 'ifct', per100g: { energy: 95, protein: 2.2, fat: 0.5, carbs: 21, fiber: 0.8, iron: 0.5, calcium: 18, vitaminA: 0, zinc: 0.4 } },
    { id: 'chhena-poda', name: 'Chhena Poda', group: 'dairy', aliases: ['baked cheese cake'], source: 'ifct', per100g: { energy: 285, protein: 10.5, fat: 12.5, carbs: 35, fiber: 0, iron: 0.5, calcium: 165, vitaminA: 125, zinc: 0.9 } },
    { id: 'rasabali', name: 'Rasabali', group: 'dairy', aliases: ['fried cheese in syrup'], source: 'ifct', per100g: { energy: 325, protein: 7.5, fat: 15.5, carbs: 42, fiber: 0, iron: 0.3, calcium: 95, vitaminA: 85, zinc: 0.6 } },
    { id: 'santula', name: 'Santula', group: 'vegetables', aliases: ['steamed vegetables'], source: 'ifct', per100g: { energy: 75, protein: 2.5, fat: 3.5, carbs: 9.5, fiber: 3.8, iron: 1.5, calcium: 48, vitaminA: 185, zinc: 0.5 } },
    { id: 'khaja', name: 'Khaja', group: 'sugars', aliases: ['layered sweet'], source: 'ifct', per100g: { energy: 465, protein: 5.5, fat: 26, carbs: 54, fiber: 1.5, iron: 1.2, calcium: 35, vitaminA: 45, zinc: 0.7 } },
];

// Bihar & Jharkhand
const biharJharkhandFoods: IFCTFood[] = [
    { id: 'litti-chokha', name: 'Litti Chokha', group: 'mixed', aliases: ['stuffed wheat balls'], source: 'ifct', per100g: { energy: 285, protein: 8.5, fat: 9.5, carbs: 45, fiber: 6.5, iron: 3.2, calcium: 52, vitaminA: 85, zinc: 1.8 } },
    { id: 'sattu', name: 'Sattu', group: 'cereals', aliases: ['roasted gram flour'], source: 'ifct', per100g: { energy: 406, protein: 20, fat: 5.2, carbs: 65, fiber: 18.3, iron: 5.8, calcium: 65, vitaminA: 0, zinc: 3.1 } },
    { id: 'thekua', name: 'Thekua', group: 'sugars', aliases: ['sweet fried cookie'], source: 'ifct', per100g: { energy: 425, protein: 6.5, fat: 18, carbs: 62, fiber: 3.2, iron: 1.8, calcium: 42, vitaminA: 12, zinc: 1.1 } },
    { id: 'dhuska', name: 'Dhuska', group: 'mixed', aliases: ['rice lentil fritter'], source: 'ifct', per100g: { energy: 265, protein: 7.5, fat: 14.5, carbs: 28, fiber: 3.8, iron: 2.2, calcium: 45, vitaminA: 15, zinc: 1.2 } },
    { id: 'sattu-paratha', name: 'Sattu Paratha', group: 'cereals', aliases: ['stuffed flatbread'], source: 'ifct', per100g: { energy: 325, protein: 11.5, fat: 10.5, carbs: 50, fiber: 8.5, iron: 3.5, calcium: 58, vitaminA: 8, zinc: 2.1 } },
];

// Assam
const assamFoods: IFCTFood[] = [
    { id: 'masor-tenga', name: 'Masor Tenga', group: 'meat', aliases: ['sour fish curry'], source: 'ifct', per100g: { energy: 125, protein: 13.5, fat: 6.5, carbs: 5.5, fiber: 1.5, iron: 1.2, calcium: 38, vitaminA: 42, zinc: 0.8 } },
    { id: 'khar', name: 'Khar', group: 'vegetables', aliases: ['alkaline dish'], source: 'ifct', per100g: { energy: 85, protein: 2.8, fat: 4.5, carbs: 9.5, fiber: 2.8, iron: 1.5, calcium: 45, vitaminA: 125, zinc: 0.6 } },
    { id: 'pitha', name: 'Pitha', group: 'cereals', aliases: ['rice cake'], source: 'ifct', per100g: { energy: 245, protein: 4.5, fat: 6.5, carbs: 42, fiber: 1.8, iron: 1.2, calcium: 28, vitaminA: 15, zinc: 0.7 } },
    { id: 'assam-duck-curry', name: 'Assam Duck Curry', group: 'meat', aliases: ['hanh curry'], source: 'ifct', per100g: { energy: 265, protein: 19, fat: 18, carbs: 6.5, fiber: 1.5, iron: 2.5, calcium: 35, vitaminA: 55, zinc: 2.8 } },
    { id: 'bamboo-shoot-curry', name: 'Bamboo Shoot Curry', group: 'vegetables', aliases: ['khorisa'], source: 'ifct', per100g: { energy: 65, protein: 2.5, fat: 3.5, carbs: 6.5, fiber: 4.5, iron: 1.8, calcium: 42, vitaminA: 25, zinc: 0.9 } },
];

// Northeast States
const northeastFoods: IFCTFood[] = [
    { id: 'jadoh', name: 'Jadoh', group: 'mixed', aliases: ['meghalaya rice dish'], source: 'ifct', per100g: { energy: 185, protein: 8.5, fat: 7.5, carbs: 24, fiber: 1.8, iron: 1.8, calcium: 38, vitaminA: 35, zinc: 1.5 } },
    { id: 'momos', name: 'Momos', group: 'mixed', aliases: ['dumplings'], source: 'ifct', per100g: { energy: 195, protein: 8.5, fat: 6.5, carbs: 27, fiber: 2.2, iron: 1.5, calcium: 35, vitaminA: 25, zinc: 1.2 } },
    { id: 'thukpa', name: 'Thukpa', group: 'mixed', aliases: ['noodle soup'], source: 'ifct', per100g: { energy: 125, protein: 6.5, fat: 4.5, carbs: 17, fiber: 2.5, iron: 1.2, calcium: 42, vitaminA: 55, zinc: 0.9 } },
    { id: 'smoked-pork', name: 'Smoked Pork', group: 'meat', aliases: ['naga pork'], source: 'ifct', per100g: { energy: 285, protein: 22, fat: 21, carbs: 0, fiber: 0, iron: 1.5, calcium: 18, vitaminA: 12, zinc: 3.2 } },
    { id: 'axone', name: 'Axone', group: 'pulses', aliases: ['fermented soybean'], source: 'ifct', per100g: { energy: 195, protein: 16.5, fat: 10.5, carbs: 12, fiber: 8.5, iron: 4.5, calcium: 145, vitaminA: 8, zinc: 2.8 } },
    { id: 'tungrymbai', name: 'Tungrymbai', group: 'pulses', aliases: ['fermented soybean curry'], source: 'ifct', per100g: { energy: 165, protein: 12.5, fat: 8.5, carbs: 14, fiber: 6.5, iron: 3.8, calcium: 125, vitaminA: 15, zinc: 2.2 } },
];

export const eastIndianFoods: IFCTFood[] = [
    ...westBengalFoods,
    ...odishaFoods,
    ...biharJharkhandFoods,
    ...assamFoods,
    ...northeastFoods,
];
