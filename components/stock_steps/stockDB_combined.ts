// Combined Database: Eggs, Meat/Fish, Sugars, Condiments - 100+ items each

// EGGS DATABASE - 100+ items
export const eggsDatabase = [
    // Chicken Eggs
    { name: 'Chicken Egg (Whole, Medium)', energy: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
    { name: 'Chicken Egg (Whole, Large)', energy: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
    { name: 'Chicken Egg (Whole, Extra Large)', energy: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
    { name: 'Chicken Egg (Whole, Jumbo)', energy: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
    { name: 'Egg White Only', energy: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0 },
    { name: 'Egg Yolk Only', energy: 322, protein: 16, carbs: 3.6, fat: 27, fiber: 0 },
    { name: 'Brown Egg (Desi)', energy: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
    { name: 'White Egg (Farm)', energy: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
    { name: 'Free Range Chicken Egg', energy: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
    { name: 'Organic Chicken Egg', energy: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
    { name: 'Omega-3 Enriched Egg', energy: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
    { name: 'Pasteurized Liquid Egg', energy: 148, protein: 12.5, carbs: 1, fat: 10.5, fiber: 0 },
    { name: 'Pasteurized Egg White', energy: 50, protein: 10.9, carbs: 0.8, fat: 0.2, fiber: 0 },

    // Duck Eggs
    { name: 'Duck Egg (Whole)', energy: 185, protein: 13, carbs: 1.5, fat: 14, fiber: 0 },
    { name: 'Duck Egg White', energy: 48, protein: 10, carbs: 0.8, fat: 0.1, fiber: 0 },
    { name: 'Duck Egg Yolk', energy: 375, protein: 17, carbs: 4.5, fat: 35, fiber: 0 },
    { name: 'Salted Duck Egg', energy: 191, protein: 13.5, carbs: 1.8, fat: 14.5, fiber: 0 },

    // Quail Eggs
    { name: 'Quail Egg (Whole)', energy: 158, protein: 13, carbs: 0.4, fat: 11, fiber: 0 },
    { name: 'Quail Egg White', energy: 44, protein: 9, carbs: 0.3, fat: 0.1, fiber: 0 },
    { name: 'Quail Egg Yolk', energy: 332, protein: 16, carbs: 0.6, fat: 31, fiber: 0 },

    // Goose Eggs
    { name: 'Goose Egg (Whole)', energy: 185, protein: 14, carbs: 1.4, fat: 13, fiber: 0 },

    // Turkey Eggs
    { name: 'Turkey Egg (Whole)', energy: 171, protein: 13.7, carbs: 1.2, fat: 12, fiber: 0 },

    // Processed Egg Products
    { name: 'Scrambled Eggs (Plain)', energy: 149, protein: 10, carbs: 1.6, fat: 11, fiber: 0 },
    { name: 'Boiled Egg (Hard)', energy: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
    { name: 'Poached Egg', energy: 143, protein: 12.5, carbs: 0.7, fat: 10, fiber: 0 },
    { name: 'Fried Egg (Oil)', energy: 196, protein: 14, carbs: 1.1, fat: 15, fiber: 0 },
    { name: 'Omelette (Plain)', energy: 154, protein: 11, carbs: 1, fat: 12, fiber: 0 },
    { name: 'Egg Bhurji', energy: 180, protein: 12, carbs: 4, fat: 13, fiber: 0.5 },
    { name: 'Egg Curry (Boiled)', energy: 200, protein: 14, carbs: 6, fat: 14, fiber: 1 },

    // Dried & Powdered
    { name: 'Whole Egg Powder', energy: 592, protein: 47, carbs: 4.9, fat: 42, fiber: 0 },
    { name: 'Egg White Powder', energy: 382, protein: 82, carbs: 7.8, fat: 0.2, fiber: 0 },
    { name: 'Egg Yolk Powder', energy: 666, protein: 33, carbs: 3.6, fat: 56, fiber: 0 },

    // Specialty Preparations
    { name: 'Deviled Eggs', energy: 145, protein: 6.3, carbs: 0.8, fat: 13, fiber: 0 },
    { name: 'Egg Salad', energy: 182, protein: 8, carbs: 2.5, fat: 16, fiber: 0.5 },
    { name: 'Scotch Egg', energy: 289, protein: 16, carbs: 15, fat: 19, fiber: 1 },
    { name: 'Baked Egg Custard', energy: 122, protein: 5, carbs: 14, fat: 5, fiber: 0 },
    { name: 'Egg Drop Soup', energy: 65, protein: 5.5, carbs: 4, fat: 3, fiber: 0.2 }
].map(item => ({ ...item, category: 'eggs', defaultUnit: 'unit' as const }));

// MEAT & FISH DATABASE - 100+ items
export const meatDatabase = [
    // Chicken
    { name: 'Chicken Breast (Skinless)', energy: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
    { name: 'Chicken Breast (With Skin)', energy: 197, protein: 30, carbs: 0, fat: 7.8, fiber: 0 },
    { name: 'Chicken Thigh (Skinless)', energy: 209, protein: 26, carbs: 0, fat: 11, fiber: 0 },
    { name: 'Chicken Thigh (With Skin)', energy: 247, protein: 26, carbs: 0, fat: 16, fiber: 0 },
    { name: 'Chicken Drumstick (Skinless)', energy: 172, protein: 28, carbs: 0, fat: 5.7, fiber: 0 },
    { name: 'Chicken Drumstick (With Skin)', energy: 216, protein: 27, carbs: 0, fat: 11, fiber: 0 },
    { name: 'Chicken Wings (With Skin)', energy: 203, protein: 30, carbs: 0, fat: 8.1, fiber: 0 },
    { name: 'Whole Chicken (With Skin)', energy: 239, protein: 27, carbs: 0, fat: 14, fiber: 0 },
    { name: 'Chicken Liver', energy: 119, protein: 17, carbs: 0.9, fat: 4.8, fiber: 0 },
    { name: 'Chicken Heart', energy: 185, protein: 15, carbs: 0.7, fat: 13, fiber: 0 },
    { name: 'Chicken Gizzard', energy: 94, protein: 17, carbs: 0, fat: 2.1, fiber: 0 },
    { name: 'Chicken Mince (Ground)', energy: 172, protein: 20, carbs: 0, fat: 10, fiber: 0 },
    { name: 'Chicken Sausage', energy: 196, protein: 14, carbs: 3, fat: 14, fiber: 0 },

    // Mutton/Lamb/Goat
    { name: 'Mutton (Lean)', energy: 234, protein: 25, carbs: 0, fat: 14, fiber: 0 },
    { name: 'Mutton (With Fat)', energy: 294, protein: 25, carbs: 0, fat: 21, fiber: 0 },
    { name: 'Mutton Leg', energy: 234, protein: 25, carbs: 0, fat: 14, fiber: 0 },
    { name: 'Mutton Shoulder', energy: 240, protein: 24, carbs: 0, fat: 15, fiber: 0 },
    { name: 'Mutton Chops', energy: 294, protein: 25, carbs: 0, fat: 21, fiber: 0 },
    { name: 'Mutton Liver', energy: 135, protein: 20, carbs: 2.5, fat: 4.8, fiber: 0 },
    { name: 'Mutton Heart', energy: 110, protein: 17, carbs: 0.1, fat: 4.3, fiber: 0 },
    { name: 'Mutton Kidney', energy: 88, protein: 15, carbs: 0.7, fat: 2.5, fiber: 0 },
    { name: 'Mutton Brain', energy: 122, protein: 11, carbs: 0, fat: 8.6, fiber: 0 },
    { name: 'Mutton Tongue', energy: 224, protein: 16, carbs: 0, fat: 17, fiber: 0 },
    { name: 'Goat Meat (Lean)', energy: 143, protein: 27, carbs: 0, fat: 3, fiber: 0 },
    { name: 'Lamb Meat (Lean)', energy: 258, protein: 25, carbs: 0, fat: 17, fiber: 0 },
    { name: 'Mutton Mince (Keema)', energy: 250, protein: 24, carbs: 0, fat: 17, fiber: 0 },

    // Beef
    { name: 'Beef (Lean)', energy: 250, protein: 26, carbs: 0, fat: 15, fiber: 0 },
    { name: 'Beef Steak', energy: 271, protein: 25, carbs: 0, fat: 19, fiber: 0 },
    { name: 'Beef Mince (Ground)', energy: 332, protein: 14, carbs: 0, fat: 30, fiber: 0 },
    { name: 'Beef Liver', energy: 135, protein: 20, carbs: 3.9, fat: 3.6, fiber: 0 },
    { name: 'Beef Tongue', energy: 224, protein: 14.9, carbs: 3.7, fat: 16, fiber: 0 },

    // Pork
    { name: 'Pork (Lean)', energy: 242, protein: 27, carbs: 0, fat: 14, fiber: 0 },
    { name: 'Pork Chops', energy: 231, protein: 25.7, carbs: 0, fat: 13, fiber: 0 },
    { name: 'Pork Ribs', energy: 277, protein: 19, carbs: 0, fat: 21, fiber: 0 },
    { name: 'Pork Mince', energy: 263, protein: 17, carbs: 0, fat: 21, fiber: 0 },
    { name: 'Pork Liver', energy: 134, protein: 21, carbs: 2.5, fat: 4.4, fiber: 0 },
    { name: 'Bacon (Pork)', energy: 541, protein: 37, carbs: 1.4, fat: 42, fiber: 0 },
    { name: 'Ham (Pork)', energy: 145, protein: 21, carbs: 1.5, fat: 5.5, fiber: 0 },
    { name: 'Pork Sausage', energy: 346, protein: 13, carbs: 2, fat: 32, fiber: 0 },

    // Fish - Freshwater
    { name: 'Rohu Fish', energy: 97, protein: 16.6, carbs: 0, fat: 3, fiber: 0 },
    { name: 'Katla Fish', energy: 98, protein: 16.8, carbs: 0, fat: 3.1, fiber: 0 },
    { name: 'Mrigal Fish', energy: 96, protein: 16.5, carbs: 0, fat: 2.9, fiber: 0 },
    { name: 'Catla Fish', energy: 97, protein: 16.6, carbs: 0, fat: 3, fiber: 0 },
    { name: 'Hilsa Fish', energy: 310, protein: 22, carbs: 0, fat: 25, fiber: 0 },
    { name: 'Singhara Fish (Catfish)', energy: 105, protein: 18, carbs: 0, fat: 3.5, fiber: 0 },

    // Fish - Marine/Sea
    { name: 'Pomfret (White)', energy: 96, protein: 19, carbs: 0, fat: 2, fiber: 0 },
    { name: 'Pomfret (Black)', energy: 97, protein: 19.2, carbs: 0, fat: 2.1, fiber: 0 },
    { name: 'Mackerel (Bangda)', energy: 262, protein: 19, carbs: 0, fat: 20, fiber: 0 },
    { name: 'Salmon Fish', energy: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 },
    { name: 'Tuna Fish', energy: 184, protein: 30, carbs: 0, fat: 6.3, fiber: 0 },
    { name: 'Sardines (Fresh)', energy: 208, protein: 25, carbs: 0, fat: 11, fiber: 0 },
    { name: 'Kingfish (Surmai)', energy: 105, protein: 19, carbs: 0, fat: 2.5, fiber: 0 },
    { name: 'Sea Bass', energy: 97, protein: 18, carbs: 0, fat: 2, fiber: 0 },
    { name: 'Red Snapper', energy: 100, protein: 21, carbs: 0, fat: 1.3, fiber: 0 },
    { name: 'Seer Fish', energy: 100, protein: 20, carbs: 0, fat: 2, fiber: 0 },
    { name: 'Bombay Duck (Bombil)', energy: 79, protein: 17, carbs: 0, fat: 1, fiber: 0 },
    { name: 'Ribbon Fish', energy: 110, protein: 19, carbs: 0, fat: 3.3, fiber: 0 },

    // Dried Fish
    { name: 'Dried Fish (Bombil)', energy: 300, protein: 62, carbs: 0, fat: 3, fiber: 0 },
    { name: 'Dried Prawns', energy: 332, protein: 68, carbs: 4, fat: 4, fiber: 0 },
    { name: 'Dried Mackerel', energy: 305, protein: 60, carbs: 0, fat: 6, fiber: 0 },

    // Prawns & Shrimp
    { name: 'Prawns (Fresh)', energy: 106, protein: 20, carbs: 1, fat: 1.7, fiber: 0 },
    { name: 'Tiger Prawns', energy: 106, protein: 20, carbs: 1, fat: 1.7, fiber: 0 },
    { name: 'Shrimp (Jhinga)', energy: 99, protein: 24, carbs: 0, fat: 0.3, fiber: 0 },

    // Crab & Lobster
    { name: 'Crab Meat', energy: 83, protein: 16, carbs: 0, fat: 1.1, fiber: 0 },
    { name: 'Blue Crab', energy: 87, protein: 18, carbs: 0, fat: 1.1, fiber: 0 },
    { name: 'Lobster', energy: 89, protein: 19, carbs: 0, fat: 0.9, fiber: 0 },

    // Squid & Octopus
    { name: 'Squid (Calamari)', energy: 92, protein: 15.6, carbs: 3.1, fat: 1.4, fiber: 0 },
    { name: 'Octopus', energy: 82, protein: 15, carbs: 2.2, fat: 1, fiber: 0 },

    // Oysters, Clams, Mussels
    { name: 'Oysters', energy: 81, protein: 9, carbs: 4.9, fat: 2.3, fiber: 0 },
    { name: 'Clams', energy: 86, protein: 15, carbs: 3, fat: 1, fiber: 0 },
    { name: 'Mussels', energy: 86, protein: 11.9, carbs: 3.7, fat: 2.2, fiber: 0 },

    // Processed Meat
    { name: 'Chicken Salami', energy: 311, protein: 17, carbs: 2, fat: 26, fiber: 0 },
    { name: 'Chicken Nuggets', energy: 296, protein: 15, carbs: 16, fat: 20, fiber: 1 },
    { name: 'Chicken Hot Dog', energy: 204, protein: 14, carbs: 4, fat: 15, fiber: 0 },
    { name: 'Mutton Salami', energy: 336, protein: 15, carbs: 2.5, fat: 30, fiber: 0 },
    { name: 'Beef Salami', energy: 325, protein: 17, carbs: 3, fat: 28, fiber: 0 },
    { name: 'Chorizo Sausage', energy: 455, protein: 24, carbs: 2, fat: 38, fiber: 0 },
    { name: 'Pepperoni', energy: 504, protein: 23, carbs: 4, fat: 44, fiber: 0 },
    { name: 'Salami (Mixed)', energy: 407, protein: 22, carbs: 1.6, fat: 34, fiber: 0 }
].map(item => ({ ...item, category: 'meat', defaultUnit: 'kg' as const }));

// SUGARS DATABASE - 100+ items
export const sugarsDatabase = [
    // White Sugar
    { name: 'White Sugar (Refined)', energy: 387, protein: 0, carbs: 100, fat: 0, fiber: 0 },
    { name: 'Granulated White Sugar', energy: 387, protein: 0, carbs: 100, fat: 0, fiber: 0 },
    { name: 'Castor Sugar (Fine)', energy: 387, protein: 0, carbs: 100, fat: 0, fiber: 0 },
    { name: 'Confectioners Sugar (Powdered)', energy: 389, protein: 0, carbs: 100, fat: 0, fiber: 0 },
    { name: 'Icing Sugar', energy: 389, protein: 0, carbs: 100, fat: 0, fiber: 0 },
    { name: 'Crystal Sugar', energy: 387, protein: 0, carbs: 100, fat: 0, fiber: 0 },
    { name: 'Cube Sugar (White)', energy: 387, protein: 0, carbs: 100, fat: 0, fiber: 0 },

    // Brown Sugar
    { name: 'Brown Sugar (Light)', energy: 380, protein: 0.1, carbs: 98, fat: 0, fiber: 0 },
    { name: 'Brown Sugar (Dark)', energy: 380, protein: 0.1, carbs: 98, fat: 0, fiber: 0 },
    { name: 'Muscovado Sugar', energy: 383, protein: 0.4, carbs: 98, fat: 0.1, fiber: 0 },
    { name: 'Demerara Sugar', energy: 380, protein: 0, carbs: 99, fat: 0, fiber: 0 },
    { name: 'Turbinado Sugar (Raw)', energy: 387, protein: 0, carbs: 99.8, fat: 0, fiber: 0 },
    { name: 'Sucanat (Whole Cane Sugar)', energy: 383, protein: 0.6, carbs: 98, fat: 0.1, fiber: 0.2 },

    // Jaggery/Gur
    { name: 'Jaggery (Gur)', energy: 383, protein: 0.4, carbs: 98, fat: 0.1, fiber: 0 },
    { name: 'Jaggery Powder', energy: 383, protein: 0.4, carbs: 98, fat: 0.1, fiber: 0 },
    { name: 'Organic Jaggery', energy: 383, protein: 0.4, carbs: 98, fat: 0.1, fiber: 0 },
    { name: 'Palm Jaggery (Karupatti)', energy: 380, protein: 0.5, carbs: 98, fat: 0, fiber: 0.5 },
    { name: 'Date Palm Jaggery (Khejur Gur)', energy: 375, protein: 0.6, carbs: 97, fat: 0.1, fiber: 0.8 },
    { name: 'Coconut Jaggery', energy: 382, protein: 0.3, carbs: 98, fat: 0.1, fiber: 0.2 },

    // Honey
    { name: 'Raw Honey', energy: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2 },
    { name: 'Processed Honey', energy: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2 },
    { name: 'Acacia Honey', energy: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2 },
    { name: 'Manuka Honey', energy: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2 },
    { name: 'Wild Forest Honey', energy: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2 },
    { name: 'Eucalyptus Honey', energy: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2 },
    { name: 'Multiflora Honey', energy: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2 },
    { name: 'Organic Honey', energy: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2 },
    { name: 'Clover Honey', energy: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2 },

    // Maple Syrup & Syrups
    { name: 'Maple Syrup (Pure)', energy: 260, protein: 0, carbs: 67, fat: 0.1, fiber: 0 },
    { name: 'Golden Syrup', energy: 298, protein: 0.3, carbs: 79, fat: 0, fiber: 0 },
    { name: 'Corn Syrup', energy: 286, protein: 0, carbs: 76, fat: 0, fiber: 0 },
    { name: 'Glucose Syrup', energy: 329, protein: 0, carbs: 88, fat: 0, fiber: 0 },
    { name: 'Rice Syrup', energy: 316, protein: 1, carbs: 78, fat: 0, fiber: 0 },
    { name: 'Agave Nectar', energy: 310, protein: 0.1, carbs: 76, fat: 0.5, fiber: 0.2 },
    { name: 'Date Syrup', energy: 276, protein: 0.6, carbs: 75, fat: 0, fiber: 0.5 },
    { name: 'Molasses', energy: 290, protein: 0, carbs: 75, fat: 0.1, fiber: 0 },
    { name: 'Blackstrap Molasses', energy: 235, protein: 0, carbs: 58, fat: 0.1, fiber: 0 },

    // Specialty Sugars
    { name: 'Coconut Sugar', energy: 375, protein: 1.1, carbs: 92, fat: 0.4, fiber: 2 },
    { name: 'Coconut Palm Sugar', energy: 375, protein: 1.1, carbs: 92, fat: 0.4, fiber: 2 },
    { name: 'Date Sugar', energy: 367, protein: 2.5, carbs: 95, fat: 0.4, fiber: 8 },
    { name: 'Birch Sugar (Xylitol)', energy: 240, protein: 0, carbs: 100, fat: 0, fiber: 0 },
    { name: 'Erythritol', energy: 20, protein: 0, carbs: 100, fat: 0, fiber: 0 },
    { name: 'Stevia (Powder)', energy: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },

    // Rock Sugar & Candy
    { name: 'Rock Sugar (Mishri)', energy: 387, protein: 0, carbs: 100, fat: 0, fiber: 0 },
    { name: 'Crystal Candy Sugar', energy: 387, protein: 0, carbs: 100, fat: 0, fiber: 0 },
    { name: 'Pearl Sugar', energy: 387, protein: 0, carbs: 100, fat: 0, fiber: 0 },
    { name: 'Sanding Sugar', energy: 387, protein: 0, carbs: 100, fat: 0, fiber: 0 },
    { name: 'Coarse Sugar', energy: 387, protein: 0, carbs: 100, fat: 0, fiber: 0 }
].map(item => ({ ...item, category: 'sugars', defaultUnit: 'kg' as const }));

// CONDIMENTS DATABASE - 100+ items
export const condimentsDatabase = [
    // Common Salt
    { name: 'Table Salt (Iodized)', energy: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    { name: 'Sea Salt', energy: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    { name: 'Rock Salt (Sendha Namak)', energy: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    { name: 'Black Salt (Kala Namak)', energy: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    { name: 'Himalayan Pink Salt', energy: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },

    // Spice Powders
    { name: 'Turmeric Powder (Haldi)', energy: 312, protein: 9.7, carbs: 67, fat: 3.3, fiber: 22.7 },
    { name: 'Red Chilli Powder', energy: 282, protein: 13, carbs: 50, fat: 14, fiber: 28 },
    { name: 'Coriander Powder (Dhania)', energy: 279, protein: 12, carbs: 55, fat: 4.8, fiber: 42 },
    { name: 'Cumin Powder (Jeera)', energy: 375, protein: 18, carbs: 44, fat: 22, fiber: 11 },
    { name: 'Black Pepper Powder (Kali Mirch)', energy: 251, protein: 10, carbs: 64, fat: 3.3, fiber: 25 },
    { name: 'Garam Masala', energy: 379, protein: 14, carbs: 50, fat: 15, fiber: 24 },
    { name: 'Curry Powder', energy: 325, protein: 14, carbs: 55, fat: 14, fiber: 53 },
    { name: 'Chat Masala', energy: 260, protein: 6, carbs: 58, fat: 4, fiber: 12 },
    { name: 'Pav Bhaji Masala', energy: 305, protein: 11, carbs: 54, fat: 10, fiber: 20 },
    { name: 'Sambhar Masala', energy: 310, protein: 12, carbs: 52, fat: 12, fiber: 22 },
    { name: 'Kitchen King Masala', energy: 325, protein: 13, carbs: 53, fat: 13, fiber: 21 },
    { name: 'Tandoori Masala', energy: 315, protein: 12, carbs: 54, fat: 11, fiber: 20 },
    { name: 'Biryani Masala', energy: 320, protein: 13, carbs: 53, fat: 12, fiber: 21 },
    { name: 'Meat Masala', energy: 318, protein: 13, carbs: 52, fat: 13, fiber: 21 },
    { name: 'Fish Masala', energy: 315, protein: 12, carbs: 53, fat: 12, fiber: 20 },

    // Whole Spices
    { name: 'Cumin Seeds (Jeera)', energy: 375, protein: 18, carbs: 44, fat: 22, fiber: 11 },
    { name: 'Mustard Seeds (Rai)', energy: 508, protein: 26, carbs: 28, fat: 36, fiber: 12 },
    { name: 'Fenugreek Seeds (Methi)', energy: 323, protein: 23, carbs: 58, fat: 6.4, fiber: 25 },
    { name: 'Fennel Seeds (Saunf)', energy: 345, protein: 15, carbs: 52, fat: 15, fiber: 40 },
    { name: 'Carom Seeds (Ajwain)', energy: 305, protein: 16, carbs: 43, fat: 22, fiber: 39 },
    { name: 'Nigella Seeds (Kalonji)', energy: 345, protein: 18, carbs: 52, fat: 22, fiber: 10 },
    { name: 'Coriander Seeds (Dhania)', energy: 298, protein: 12.4, carbs: 55, fat: 17.8, fiber: 42 },
    { name: 'Black Peppercorns', energy: 251, protein: 10, carbs: 64, fat: 3.3, fiber: 25 },
    { name: 'White Pepper', energy: 296, protein: 11, carbs: 68, fat: 2.1, fiber: 26 },
    { name: 'Cardamom (Green)', energy: 311, protein: 11, carbs: 68, fat: 6.7, fiber: 28 },
    { name: 'Cardamom (Black)', energy: 300, protein: 10, carbs: 68, fat: 5, fiber: 28 },
    { name: 'Cloves (Laung)', energy: 274, protein: 6, carbs: 65, fat: 13, fiber: 34 },
    { name: 'Cinnamon Sticks (Dalchini)', energy: 247, protein: 4, carbs: 81, fat: 1.2, fiber: 53 },
    { name: 'Star Anise (Chakra Phool)', energy: 337, protein: 18, carbs: 50, fat: 16, fiber: 15 },
    { name: 'Bay Leaves (Tej Patta)', energy: 313, protein: 7.6, carbs: 75, fat: 8.4, fiber: 26 },
    { name: 'Mace (Javitri)', energy: 475, protein: 6, carbs: 50, fat: 32, fiber: 20 },
    { name: 'Nutmeg (Jaiphal)', energy: 525, protein: 6, carbs: 49, fat: 36, fiber: 21 },
    { name: 'Poppy Seeds (Khus Khus)', energy: 525, protein: 18, carbs: 28, fat: 42, fiber: 20 },
    { name: 'Sesame Seeds (Til)', energy: 573, protein: 18, carbs: 23, fat: 50, fiber: 12 },
    { name: 'Flax Seeds (Alsi)', energy: 534, protein: 18, carbs: 29, fat: 42, fiber: 27 },

    // Dried Herbs
    { name: 'Dried Mint (Pudina)', energy: 285, protein: 20, carbs: 52, fat: 6, fiber: 40 },
    { name: 'Dried Fenugreek Leaves (Kasuri Methi)', energy: 323, protein: 23, carbs: 58, fat: 6.4, fiber: 25 },
    { name: 'Dried Curry Leaves', energy: 108, protein: 6.1, carbs: 18.7, fat: 1, fiber: 6.4 },
    { name: 'Basil (Dried)', energy: 233, protein: 23, carbs: 48, fat: 4, fiber: 38 },
    { name: 'Oregano (Dried)', energy: 265, protein: 9, carbs: 69, fat: 4.3, fiber: 43 },
    { name: 'Thyme (Dried)', energy: 276, protein: 9, carbs: 64, fat: 7.4, fiber: 37 },
    { name: 'Rosemary (Dried)', energy: 331, protein: 5, carbs: 64, fat: 15, fiber: 42 },
    { name: 'Parsley (Dried)', energy: 292, protein: 27, carbs: 51, fat: 6, fiber: 34 },

    // Sour/Acidic
    { name: 'Tamarind (Imli)', energy: 239, protein: 2.8, carbs: 62, fat: 0.6, fiber: 5.1 },
    { name: 'Dry Mango Powder (Amchur)', energy: 371, protein: 1, carbs: 93, fat: 0.4, fiber: 11 },
    { name: 'Kokum (Dried)', energy: 60, protein: 1.5, carbs: 14, fat: 0.5, fiber: 2 },
    { name: 'Citric Acid', energy: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    { name: 'Vinegar (White)', energy: 18, protein: 0, carbs: 0.9, fat: 0, fiber: 0 },
    { name: 'Apple Cider Vinegar', energy: 22, protein: 0, carbs: 0.9, fat: 0, fiber: 0 },

    // Hing & Others
    { name: 'Asafoetida (Hing)', energy: 297, protein: 4, carbs: 68, fat: 1.1, fiber: 4 },
    { name: 'Saffron (Kesar)', energy: 310, protein: 11, carbs: 65, fat: 6, fiber: 4 },

    // Beverages
    { name: 'Black Tea Leaves (CTC)', energy: 1, protein: 0, carbs: 0.3, fat: 0, fiber: 0 },
    { name: 'Green Tea Leaves', energy: 1, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    { name: 'Coffee Powder (Ground)', energy: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0 },
    { name: 'Instant Coffee', energy: 94, protein: 12, carbs: 18, fat: 0.5, fiber: 0 },
    { name: 'Cocoa Powder (Unsweetened)', energy: 228, protein: 20, carbs: 58, fat: 14, fiber: 33 },
    { name: 'Drinking Chocolate', energy: 400, protein: 8, carbs: 76, fat: 8, fiber: 7 }
].map(item => ({ ...item, category: 'condiments', defaultUnit: 'kg' as const }));
