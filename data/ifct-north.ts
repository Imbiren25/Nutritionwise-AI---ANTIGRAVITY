import { IFCTFood } from '../types';

// North India - Punjab, Haryana, Delhi
const northIndiaFoods: IFCTFood[] = [
    { id: 'makki-di-roti', name: 'Makki di Roti', group: 'cereals', aliases: ['corn roti', 'maize roti'], source: 'ifct', per100g: { energy: 328, protein: 8.5, fat: 3.8, carbs: 68, fiber: 7.2, iron: 2.8, calcium: 42, vitaminA: 15, zinc: 2.1 } },
    { id: 'sarson-da-saag', name: 'Sarson da Saag', group: 'vegetables', aliases: ['mustard greens curry'], source: 'ifct', per100g: { energy: 85, protein: 4.2, fat: 5.5, carbs: 6.8, fiber: 3.2, iron: 3.5, calcium: 185, vitaminA: 320, zinc: 0.8 } },
    { id: 'chole-bhature', name: 'Chole Bhature', group: 'mixed', aliases: ['chickpea curry with fried bread'], source: 'ifct', per100g: { energy: 285, protein: 8.5, fat: 12.5, carbs: 35, fiber: 5.2, iron: 2.8, calcium: 65, vitaminA: 25, zinc: 1.5 } },
    { id: 'lassi', name: 'Lassi', group: 'dairy', aliases: ['yogurt drink'], source: 'ifct', per100g: { energy: 62, protein: 3.5, fat: 2.2, carbs: 7.5, fiber: 0, iron: 0.1, calcium: 125, vitaminA: 35, zinc: 0.5 } },
    { id: 'butter-chicken', name: 'Butter Chicken', group: 'meat', aliases: ['murgh makhani'], source: 'ifct', per100g: { energy: 215, protein: 18, fat: 14, carbs: 6.5, fiber: 1.2, iron: 1.5, calcium: 45, vitaminA: 85, zinc: 1.8 } },
    { id: 'tandoori-roti', name: 'Tandoori Roti', group: 'cereals', aliases: ['tandoor bread'], source: 'ifct', per100g: { energy: 297, protein: 10.5, fat: 2.5, carbs: 58, fiber: 8.5, iron: 3.2, calcium: 38, vitaminA: 0, zinc: 2.3 } },
    { id: 'aloo-paratha', name: 'Aloo Paratha', group: 'cereals', aliases: ['potato stuffed flatbread'], source: 'ifct', per100g: { energy: 315, protein: 7.2, fat: 11.5, carbs: 48, fiber: 4.8, iron: 2.2, calcium: 42, vitaminA: 12, zinc: 1.5 } },
    { id: 'chole-kulche', name: 'Chole Kulche', group: 'mixed', aliases: ['chickpea with bread'], source: 'ifct', per100g: { energy: 268, protein: 9.5, fat: 8.2, carbs: 42, fiber: 6.5, iron: 3.2, calcium: 72, vitaminA: 18, zinc: 1.8 } },
    { id: 'dahi-bhalla', name: 'Dahi Bhalla', group: 'mixed', aliases: ['dahi vada', 'lentil fritters in yogurt'], source: 'ifct', per100g: { energy: 145, protein: 5.8, fat: 6.5, carbs: 17, fiber: 2.5, iron: 1.5, calcium: 95, vitaminA: 28, zinc: 0.9 } },
    { id: 'aloo-tikki', name: 'Aloo Tikki', group: 'vegetables', aliases: ['potato patty'], source: 'ifct', per100g: { energy: 225, protein: 3.5, fat: 10.5, carbs: 30, fiber: 3.2, iron: 1.2, calcium: 28, vitaminA: 8, zinc: 0.6 } },
];

// North India - Rajasthan
const rajasthanFoods: IFCTFood[] = [
    { id: 'dal-baati-churma', name: 'Dal Baati Churma', group: 'mixed', aliases: ['rajasthani dal baati'], source: 'ifct', per100g: { energy: 385, protein: 10.5, fat: 16.5, carbs: 52, fiber: 7.8, iron: 3.8, calcium: 85, vitaminA: 42, zinc: 2.2 } },
    { id: 'gatte-ki-sabzi', name: 'Gatte ki Sabzi', group: 'mixed', aliases: ['gram flour dumplings curry'], source: 'ifct', per100g: { energy: 185, protein: 7.5, fat: 9.5, carbs: 20, fiber: 4.2, iron: 2.5, calcium: 55, vitaminA: 32, zinc: 1.3 } },
    { id: 'ker-sangri', name: 'Ker Sangri', group: 'vegetables', aliases: ['desert beans'], source: 'ifct', per100g: { energy: 95, protein: 4.2, fat: 3.5, carbs: 12.5, fiber: 6.8, iron: 3.2, calcium: 125, vitaminA: 15, zinc: 1.5 } },
    { id: 'bajra-roti', name: 'Bajra Roti', group: 'cereals', aliases: ['pearl millet bread'], source: 'ifct', per100g: { energy: 361, protein: 11.6, fat: 5, carbs: 67, fiber: 8.5, iron: 8, calcium: 42, vitaminA: 0, zinc: 3.1 } },
    { id: 'laal-maas', name: 'Laal Maas', group: 'meat', aliases: ['red meat curry'], source: 'ifct', per100g: { energy: 245, protein: 22, fat: 16, carbs: 4.5, fiber: 1.5, iron: 2.8, calcium: 35, vitaminA: 45, zinc: 3.5 } },
    { id: 'pyaaz-kachori', name: 'Pyaaz Kachori', group: 'mixed', aliases: ['onion kachori'], source: 'ifct', per100g: { energy: 385, protein: 7.5, fat: 22, carbs: 42, fiber: 3.8, iron: 2.2, calcium: 45, vitaminA: 12, zinc: 1.2 } },
    { id: 'mirchi-vada', name: 'Mirchi Vada', group: 'vegetables', aliases: ['stuffed chili fritter'], source: 'ifct', per100g: { energy: 265, protein: 6.5, fat: 16.5, carbs: 24, fiber: 4.2, iron: 1.8, calcium: 52, vitaminA: 185, zinc: 1.1 } },
];

// North India - Uttar Pradesh
const upFoods: IFCTFood[] = [
    { id: 'bedmi-puri', name: 'Bedmi Puri', group: 'cereals', aliases: ['dal puri'], source: 'ifct', per100g: { energy: 425, protein: 9.5, fat: 24, carbs: 45, fiber: 5.2, iron: 3.5, calcium: 58, vitaminA: 8, zinc: 1.8 } },
    { id: 'petha', name: 'Petha', group: 'sugars', aliases: ['ash gourd sweet'], source: 'ifct', per100g: { energy: 285, protein: 0.5, fat: 0.2, carbs: 72, fiber: 1.2, iron: 0.3, calcium: 18, vitaminA: 2, zinc: 0.1 } },
    { id: 'samosa', name: 'Samosa', group: 'mixed', aliases: ['fried pastry'], source: 'ifct', per100g: { energy: 308, protein: 5.5, fat: 17.5, carbs: 34, fiber: 3.5, iron: 1.8, calcium: 35, vitaminA: 15, zinc: 0.9 } },
    { id: 'kachori', name: 'Kachori', group: 'mixed', aliases: ['dal kachori'], source: 'ifct', per100g: { energy: 395, protein: 8.2, fat: 23, carbs: 42, fiber: 4.8, iron: 2.5, calcium: 48, vitaminA: 10, zinc: 1.5 } },
    { id: 'chaat', name: 'Chaat', group: 'mixed', aliases: ['street food mix'], source: 'ifct', per100g: { energy: 185, protein: 5.5, fat: 8.5, carbs: 24, fiber: 3.8, iron: 1.5, calcium: 42, vitaminA: 35, zinc: 0.8 } },
    { id: 'lucknowi-biryani', name: 'Lucknowi Biryani', group: 'mixed', aliases: ['awadhi biryani'], source: 'ifct', per100g: { energy: 195, protein: 8.5, fat: 7.5, carbs: 25, fiber: 1.8, iron: 1.8, calcium: 38, vitaminA: 45, zinc: 1.5 } },
    { id: 'malai-ki-gilori', name: 'Malai ki Gilori', group: 'dairy', aliases: ['cream rolls'], source: 'ifct', per100g: { energy: 385, protein: 6.5, fat: 24, carbs: 38, fiber: 0.5, iron: 0.5, calcium: 125, vitaminA: 185, zinc: 0.8 } },
];

// Himachal Pradesh & Uttarakhand
const himalayanFoods: IFCTFood[] = [
    { id: 'siddu', name: 'Siddu', group: 'cereals', aliases: ['steamed bread'], source: 'ifct', per100g: { energy: 285, protein: 8.5, fat: 4.5, carbs: 55, fiber: 6.5, iron: 2.8, calcium: 45, vitaminA: 12, zinc: 1.8 } },
    { id: 'madra', name: 'Madra', group: 'pulses', aliases: ['chickpea curry'], source: 'ifct', per100g: { energy: 165, protein: 8.5, fat: 7.5, carbs: 18, fiber: 5.5, iron: 2.5, calcium: 68, vitaminA: 25, zinc: 1.5 } },
    { id: 'bhatt-ki-churkani', name: 'Bhatt ki Churkani', group: 'pulses', aliases: ['black soybean curry'], source: 'ifct', per100g: { energy: 185, protein: 12.5, fat: 8.5, carbs: 16, fiber: 7.2, iron: 4.5, calcium: 95, vitaminA: 18, zinc: 2.2 } },
    { id: 'kafuli', name: 'Kafuli', group: 'vegetables', aliases: ['spinach curry'], source: 'ifct', per100g: { energy: 95, protein: 4.5, fat: 5.5, carbs: 8.5, fiber: 3.8, iron: 3.2, calcium: 145, vitaminA: 385, zinc: 0.9 } },
    { id: 'singal', name: 'Singal', group: 'vegetables', aliases: ['nettle curry'], source: 'ifct', per100g: { energy: 75, protein: 5.2, fat: 3.5, carbs: 7.5, fiber: 4.5, iron: 4.8, calcium: 185, vitaminA: 285, zinc: 1.2 } },
    { id: 'chainsoo', name: 'Chainsoo', group: 'pulses', aliases: ['black gram curry'], source: 'ifct', per100g: { energy: 195, protein: 11.5, fat: 9.5, carbs: 18, fiber: 6.8, iron: 3.8, calcium: 85, vitaminA: 22, zinc: 2.1 } },
];

// Jammu & Kashmir
const jkFoods: IFCTFood[] = [
    { id: 'rogan-josh', name: 'Rogan Josh', group: 'meat', aliases: ['kashmiri lamb curry'], source: 'ifct', per100g: { energy: 235, protein: 20, fat: 15, carbs: 5.5, fiber: 1.5, iron: 2.5, calcium: 42, vitaminA: 55, zinc: 3.2 } },
    { id: 'yakhni', name: 'Yakhni', group: 'meat', aliases: ['yogurt based curry'], source: 'ifct', per100g: { energy: 185, protein: 16, fat: 11, carbs: 6.5, fiber: 0.8, iron: 1.8, calcium: 95, vitaminA: 48, zinc: 2.5 } },
    { id: 'kashmiri-rajma', name: 'Kashmiri Rajma', group: 'pulses', aliases: ['kidney beans'], source: 'ifct', per100g: { energy: 145, protein: 9.5, fat: 3.5, carbs: 22, fiber: 8.5, iron: 2.8, calcium: 85, vitaminA: 12, zinc: 1.5 } },
    { id: 'haakh', name: 'Haakh', group: 'vegetables', aliases: ['collard greens'], source: 'ifct', per100g: { energy: 55, protein: 3.5, fat: 2.5, carbs: 6.5, fiber: 3.2, iron: 2.5, calcium: 125, vitaminA: 285, zinc: 0.6 } },
    { id: 'modur-pulao', name: 'Modur Pulao', group: 'mixed', aliases: ['sweet rice'], source: 'ifct', per100g: { energy: 225, protein: 4.5, fat: 6.5, carbs: 38, fiber: 1.5, iron: 1.2, calcium: 35, vitaminA: 28, zinc: 0.8 } },
    { id: 'kahwa', name: 'Kahwa', group: 'mixed', aliases: ['kashmiri tea'], source: 'ifct', per100g: { energy: 45, protein: 0.5, fat: 1.5, carbs: 8.5, fiber: 0.2, iron: 0.5, calcium: 18, vitaminA: 5, zinc: 0.2 } },
    { id: 'dum-aloo-kashmiri', name: 'Dum Aloo Kashmiri', group: 'vegetables', aliases: ['potato curry'], source: 'ifct', per100g: { energy: 165, protein: 3.2, fat: 9.5, carbs: 18, fiber: 2.8, iron: 1.5, calcium: 42, vitaminA: 35, zinc: 0.7 } },
];

export const northIndianFoods: IFCTFood[] = [
    ...northIndiaFoods,
    ...rajasthanFoods,
    ...upFoods,
    ...himalayanFoods,
    ...jkFoods,
];
