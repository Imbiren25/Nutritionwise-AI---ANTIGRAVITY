import { IFCTFood } from '../types';

// Tamil Nadu
const tamilNaduFoods: IFCTFood[] = [
    { id: 'idli', name: 'Idli', group: 'cereals', aliases: ['steamed rice cake'], source: 'ifct', per100g: { energy: 156, protein: 3.9, fat: 0.4, carbs: 33, fiber: 1.2, iron: 0.7, calcium: 18, vitaminA: 0, zinc: 0.5 } },
    { id: 'dosa', name: 'Dosa', group: 'cereals', aliases: ['rice crepe'], source: 'ifct', per100g: { energy: 168, protein: 4.5, fat: 3.7, carbs: 29, fiber: 1.5, iron: 1.2, calcium: 22, vitaminA: 5, zinc: 0.7 } },
    { id: 'sambar', name: 'Sambar', group: 'mixed', aliases: ['lentil vegetable stew'], source: 'ifct', per100g: { energy: 95, protein: 4.5, fat: 3.5, carbs: 12, fiber: 3.8, iron: 1.8, calcium: 45, vitaminA: 125, zinc: 0.8 } },
    { id: 'rasam', name: 'Rasam', group: 'mixed', aliases: ['tamarind soup'], source: 'ifct', per100g: { energy: 45, protein: 1.5, fat: 1.8, carbs: 6.5, fiber: 1.2, iron: 0.8, calcium: 22, vitaminA: 35, zinc: 0.3 } },
    { id: 'pongal', name: 'Pongal', group: 'mixed', aliases: ['rice lentil dish'], source: 'ifct', per100g: { energy: 145, protein: 5.2, fat: 4.5, carbs: 22, fiber: 2.2, iron: 1.5, calcium: 35, vitaminA: 15, zinc: 0.9 } },
    { id: 'curd-rice', name: 'Curd Rice', group: 'mixed', aliases: ['thayir sadam'], source: 'ifct', per100g: { energy: 125, protein: 3.8, fat: 2.5, carbs: 22, fiber: 0.5, iron: 0.5, calcium: 95, vitaminA: 25, zinc: 0.6 } },
    { id: 'murukku', name: 'Murukku', group: 'mixed', aliases: ['chakli'], source: 'ifct', per100g: { energy: 485, protein: 9.5, fat: 28, carbs: 52, fiber: 3.5, iron: 2.5, calcium: 45, vitaminA: 8, zinc: 1.5 } },
    { id: 'payasam', name: 'Payasam', group: 'dairy', aliases: ['kheer', 'sweet pudding'], source: 'ifct', per100g: { energy: 165, protein: 4.2, fat: 5.5, carbs: 26, fiber: 0.8, iron: 0.5, calcium: 115, vitaminA: 45, zinc: 0.6 } },
    { id: 'kothu-parotta', name: 'Kothu Parotta', group: 'mixed', aliases: ['shredded paratha'], source: 'ifct', per100g: { energy: 285, protein: 7.5, fat: 12.5, carbs: 38, fiber: 2.5, iron: 1.8, calcium: 42, vitaminA: 35, zinc: 1.2 } },
    { id: 'medu-vada', name: 'Medu Vada', group: 'pulses', aliases: ['lentil donut'], source: 'ifct', per100g: { energy: 245, protein: 8.5, fat: 13.5, carbs: 25, fiber: 4.2, iron: 2.2, calcium: 52, vitaminA: 8, zinc: 1.3 } },
];

// Kerala
const keralaFoods: IFCTFood[] = [
    { id: 'appam', name: 'Appam', group: 'cereals', aliases: ['rice pancake'], source: 'ifct', per100g: { energy: 145, protein: 2.8, fat: 1.5, carbs: 30, fiber: 0.8, iron: 0.6, calcium: 15, vitaminA: 0, zinc: 0.4 } },
    { id: 'puttu', name: 'Puttu', group: 'cereals', aliases: ['steamed rice cake'], source: 'ifct', per100g: { energy: 135, protein: 2.5, fat: 0.8, carbs: 29, fiber: 1.5, iron: 0.8, calcium: 12, vitaminA: 0, zinc: 0.5 } },
    { id: 'kerala-fish-curry', name: 'Kerala Fish Curry', group: 'meat', aliases: ['meen curry'], source: 'ifct', per100g: { energy: 145, protein: 16.5, fat: 7.5, carbs: 4.5, fiber: 1.2, iron: 1.2, calcium: 35, vitaminA: 45, zinc: 0.9 } },
    { id: 'avial', name: 'Avial', group: 'vegetables', aliases: ['mixed vegetable curry'], source: 'ifct', per100g: { energy: 95, protein: 2.8, fat: 5.5, carbs: 10, fiber: 3.5, iron: 1.5, calcium: 55, vitaminA: 185, zinc: 0.6 } },
    { id: 'thoran', name: 'Thoran', group: 'vegetables', aliases: ['stir fried vegetables'], source: 'ifct', per100g: { energy: 75, protein: 2.5, fat: 4.5, carbs: 7.5, fiber: 3.2, iron: 1.8, calcium: 45, vitaminA: 125, zinc: 0.5 } },
    { id: 'sadya-rice', name: 'Sadya Rice', group: 'cereals', aliases: ['kerala feast rice'], source: 'ifct', per100g: { energy: 130, protein: 2.6, fat: 0.3, carbs: 28, fiber: 0.4, iron: 0.5, calcium: 8, vitaminA: 0, zinc: 0.6 } },
    { id: 'banana-chips', name: 'Banana Chips', group: 'fruits', aliases: ['kaya varuthathu'], source: 'ifct', per100g: { energy: 520, protein: 2.3, fat: 34, carbs: 58, fiber: 7.7, iron: 1.2, calcium: 18, vitaminA: 15, zinc: 0.6 } },
    { id: 'erissery', name: 'Erissery', group: 'vegetables', aliases: ['pumpkin coconut curry'], source: 'ifct', per100g: { energy: 125, protein: 3.5, fat: 7.5, carbs: 12, fiber: 2.8, iron: 1.5, calcium: 42, vitaminA: 285, zinc: 0.7 } },
    { id: 'olan', name: 'Olan', group: 'vegetables', aliases: ['ash gourd coconut milk'], source: 'ifct', per100g: { energy: 85, protein: 1.8, fat: 6.5, carbs: 6.5, fiber: 1.5, iron: 0.5, calcium: 28, vitaminA: 12, zinc: 0.3 } },
];

// Karnataka
const karnatakaFoods: IFCTFood[] = [
    { id: 'bisi-bele-bath', name: 'Bisi Bele Bath', group: 'mixed', aliases: ['rice lentil vegetable'], source: 'ifct', per100g: { energy: 155, protein: 5.5, fat: 5.5, carbs: 23, fiber: 3.2, iron: 1.8, calcium: 45, vitaminA: 85, zinc: 1.1 } },
    { id: 'ragi-mudde', name: 'Ragi Mudde', group: 'cereals', aliases: ['finger millet ball'], source: 'ifct', per100g: { energy: 328, protein: 7.3, fat: 1.3, carbs: 72, fiber: 3.6, iron: 3.9, calcium: 344, vitaminA: 0, zinc: 2.3 } },
    { id: 'jolada-rotti', name: 'Jolada Rotti', group: 'cereals', aliases: ['sorghum bread'], source: 'ifct', per100g: { energy: 329, protein: 10.4, fat: 1.9, carbs: 70, fiber: 9.7, iron: 4.1, calcium: 25, vitaminA: 0, zinc: 1.6 } },
    { id: 'mysore-pak', name: 'Mysore Pak', group: 'sugars', aliases: ['gram flour sweet'], source: 'ifct', per100g: { energy: 485, protein: 6.5, fat: 28, carbs: 54, fiber: 2.2, iron: 1.5, calcium: 38, vitaminA: 85, zinc: 1.1 } },
    { id: 'holige', name: 'Holige', group: 'mixed', aliases: ['puran poli', 'sweet flatbread'], source: 'ifct', per100g: { energy: 325, protein: 6.8, fat: 8.5, carbs: 58, fiber: 4.5, iron: 2.2, calcium: 52, vitaminA: 25, zinc: 1.3 } },
    { id: 'rava-idli', name: 'Rava Idli', group: 'cereals', aliases: ['semolina idli'], source: 'ifct', per100g: { energy: 165, protein: 4.2, fat: 4.5, carbs: 28, fiber: 1.5, iron: 0.8, calcium: 22, vitaminA: 8, zinc: 0.6 } },
    { id: 'neer-dosa', name: 'Neer Dosa', group: 'cereals', aliases: ['rice crepe'], source: 'ifct', per100g: { energy: 125, protein: 2.5, fat: 0.8, carbs: 27, fiber: 0.8, iron: 0.5, calcium: 12, vitaminA: 0, zinc: 0.4 } },
];

// Andhra Pradesh & Telangana
const apTelanganaFoods: IFCTFood[] = [
    { id: 'pesarattu', name: 'Pesarattu', group: 'pulses', aliases: ['moong dal dosa'], source: 'ifct', per100g: { energy: 145, protein: 7.5, fat: 2.5, carbs: 24, fiber: 4.2, iron: 2.2, calcium: 45, vitaminA: 12, zinc: 1.2 } },
    { id: 'gongura-pachadi', name: 'Gongura Pachadi', group: 'vegetables', aliases: ['sorrel leaves chutney'], source: 'ifct', per100g: { energy: 85, protein: 2.5, fat: 6.5, carbs: 5.5, fiber: 2.8, iron: 2.5, calcium: 85, vitaminA: 185, zinc: 0.6 } },
    { id: 'hyderabadi-biryani', name: 'Hyderabadi Biryani', group: 'mixed', aliases: ['telangana biryani'], source: 'ifct', per100g: { energy: 205, protein: 9.5, fat: 8.5, carbs: 26, fiber: 1.5, iron: 1.8, calcium: 42, vitaminA: 55, zinc: 1.6 } },
    { id: 'pulihora', name: 'Pulihora', group: 'mixed', aliases: ['tamarind rice'], source: 'ifct', per100g: { energy: 165, protein: 3.5, fat: 6.5, carbs: 25, fiber: 1.8, iron: 1.2, calcium: 28, vitaminA: 15, zinc: 0.7 } },
    { id: 'pappu', name: 'Pappu', group: 'pulses', aliases: ['dal'], source: 'ifct', per100g: { energy: 115, protein: 6.5, fat: 3.5, carbs: 15, fiber: 4.5, iron: 2.2, calcium: 42, vitaminA: 12, zinc: 1.1 } },
    { id: 'pootharekulu', name: 'Pootharekulu', group: 'sugars', aliases: ['paper sweet'], source: 'ifct', per100g: { energy: 425, protein: 4.5, fat: 18, carbs: 62, fiber: 1.2, iron: 0.8, calcium: 45, vitaminA: 65, zinc: 0.6 } },
    { id: 'gutti-vankaya', name: 'Gutti Vankaya', group: 'vegetables', aliases: ['stuffed eggplant'], source: 'ifct', per100g: { energy: 125, protein: 2.8, fat: 8.5, carbs: 11, fiber: 4.5, iron: 1.5, calcium: 38, vitaminA: 45, zinc: 0.5 } },
];

export const southIndianFoods: IFCTFood[] = [
    ...tamilNaduFoods,
    ...keralaFoods,
    ...karnatakaFoods,
    ...apTelanganaFoods,
];
