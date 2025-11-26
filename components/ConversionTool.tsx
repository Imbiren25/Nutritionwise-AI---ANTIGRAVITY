import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from './ui/Select';
import { ArrowRight, Search, RefreshCw, Calculator } from 'lucide-react';

const foodConversionData: { [food: string]: { [unit: string]: number } } = {
    'Rice (raw)': { 'cup': 200, 'tablespoon': 15, 'teaspoon': 5, 'katori': 120, 'gram': 1, 'ml': 0 },
    'Wheat Flour (Atta)': { 'cup': 120, 'tablespoon': 8, 'teaspoon': 3, 'katori': 70, 'gram': 1, 'ml': 0 },
    'Maida': { 'cup': 125, 'tablespoon': 8, 'teaspoon': 3, 'katori': 75, 'gram': 1, 'ml': 0 },
    'Suji / Rava': { 'cup': 180, 'tablespoon': 12, 'teaspoon': 4, 'katori': 120, 'gram': 1, 'ml': 0 },
    'Poha': { 'cup': 90, 'tablespoon': 7, 'teaspoon': 2, 'katori': 50, 'gram': 1, 'ml': 0 },
    'Oats (rolled)': { 'cup': 100, 'tablespoon': 8, 'teaspoon': 3, 'katori': 60, 'gram': 1, 'ml': 0 },
    'Bajra Flour': { 'cup': 130, 'tablespoon': 10, 'teaspoon': 4, 'katori': 75, 'gram': 1, 'ml': 0 },
    'Jowar Flour': { 'cup': 120, 'tablespoon': 9, 'teaspoon': 3, 'katori': 70, 'gram': 1, 'ml': 0 },
    'Ragi Flour': { 'cup': 125, 'tablespoon': 9, 'teaspoon': 3, 'katori': 72, 'gram': 1, 'ml': 0 },
    'Brown Rice (raw)': { 'cup': 195, 'tablespoon': 15, 'teaspoon': 5, 'katori': 118, 'gram': 1, 'ml': 0 },
    'Basmati Rice (raw)': { 'cup': 190, 'tablespoon': 14, 'teaspoon': 5, 'katori': 115, 'gram': 1, 'ml': 0 },
    'Parboiled Rice': { 'cup': 210, 'tablespoon': 16, 'teaspoon': 5, 'katori': 125, 'gram': 1, 'ml': 0 },
    'Dalia (Broken Wheat)': { 'cup': 160, 'tablespoon': 12, 'teaspoon': 4, 'katori': 100, 'gram': 1, 'ml': 0 },
    'Barley (jav)': { 'cup': 170, 'tablespoon': 12, 'teaspoon': 4, 'katori': 110, 'gram': 1, 'ml': 0 },
    'Barley Flour': { 'cup': 115, 'tablespoon': 8, 'teaspoon': 3, 'katori': 65, 'gram': 1, 'ml': 0 },
    'Corn Flour (Makki)': { 'cup': 120, 'tablespoon': 9, 'teaspoon': 3, 'katori': 70, 'gram': 1, 'ml': 0 },
    'Corn Grits': { 'cup': 150, 'tablespoon': 11, 'teaspoon': 4, 'katori': 95, 'gram': 1, 'ml': 0 },
    'Puffed Rice (Murmura)': { 'cup': 30, 'tablespoon': 2, 'teaspoon': 1, 'katori': 18, 'gram': 1, 'ml': 0 },
    'Rice Flour': { 'cup': 140, 'tablespoon': 10, 'teaspoon': 3, 'katori': 80, 'gram': 1, 'ml': 0 },
    'Foxtail Millet': { 'cup': 170, 'tablespoon': 12, 'teaspoon': 4, 'katori': 105, 'gram': 1, 'ml': 0 },
    'Kodo Millet': { 'cup': 160, 'tablespoon': 11, 'teaspoon': 4, 'katori': 100, 'gram': 1, 'ml': 0 },
    'Little Millet': { 'cup': 165, 'tablespoon': 12, 'teaspoon': 4, 'katori': 102, 'gram': 1, 'ml': 0 },
    'Barnyard Millet': { 'cup': 155, 'tablespoon': 11, 'teaspoon': 4, 'katori': 95, 'gram': 1, 'ml': 0 },
    'Proso Millet': { 'cup': 170, 'tablespoon': 12, 'teaspoon': 4, 'katori': 105, 'gram': 1, 'ml': 0 },
    'Buckwheat (Kuttu) Flour': { 'cup': 110, 'tablespoon': 8, 'teaspoon': 3, 'katori': 65, 'gram': 1, 'ml': 0 },
    'Sugar': { 'cup': 200, 'gram': 1, 'ml': 0 },
    'Dal (Toor, raw)': { 'cup': 190, 'gram': 1, 'ml': 0 },
    'Water': { 'cup': 240, 'gram': 1, 'ml': 1 },
    'Milk': { 'cup': 245, 'gram': 1, 'ml': 1 },
    'Oil': { 'cup': 225, 'gram': 1, 'ml': 0.94 },
    'Toor Dal (raw)': { 'cup': 200, 'tablespoon': 15, 'teaspoon': 5, 'katori': 130, 'gram': 1, 'ml': 0 },
    'Moong Dal – Split (raw)': { 'cup': 190, 'tablespoon': 14, 'teaspoon': 5, 'katori': 120, 'gram': 1, 'ml': 0 },
    'Moong Chilka (raw)': { 'cup': 185, 'tablespoon': 14, 'teaspoon': 5, 'katori': 118, 'gram': 1, 'ml': 0 },
    'Moong Sabut (raw)': { 'cup': 185, 'tablespoon': 13, 'teaspoon': 4, 'katori': 115, 'gram': 1, 'ml': 0 },
    'Masoor Dal – Split (raw)': { 'cup': 180, 'tablespoon': 14, 'teaspoon': 4, 'katori': 110, 'gram': 1, 'ml': 0 },
    'Masoor Whole (raw)': { 'cup': 190, 'tablespoon': 14, 'teaspoon': 4, 'katori': 118, 'gram': 1, 'ml': 0 },
    'Chana Dal (raw)': { 'cup': 220, 'tablespoon': 16, 'teaspoon': 5, 'katori': 140, 'gram': 1, 'ml': 0 },
    'Kabuli Chana (Chole)': { 'cup': 200, 'tablespoon': 15, 'teaspoon': 5, 'katori': 130, 'gram': 1, 'ml': 0 },
    'Kala Chana (Brown Chana)': { 'cup': 210, 'tablespoon': 16, 'teaspoon': 5, 'katori': 135, 'gram': 1, 'ml': 0 },
    'Rajma (Kidney Beans)': { 'cup': 180, 'tablespoon': 14, 'teaspoon': 5, 'katori': 110, 'gram': 1, 'ml': 0 },
    'Lobia (Black-eyed Beans)': { 'cup': 170, 'tablespoon': 13, 'teaspoon': 4, 'katori': 105, 'gram': 1, 'ml': 0 },
    'Soybean (raw)': { 'cup': 180, 'tablespoon': 13, 'teaspoon': 4, 'katori': 110, 'gram': 1, 'ml': 0 },
    'Urad Dal (Split)': { 'cup': 190, 'tablespoon': 14, 'teaspoon': 5, 'katori': 120, 'gram': 1, 'ml': 0 },
    'Urad Whole (Sabut)': { 'cup': 195, 'tablespoon': 14, 'teaspoon': 5, 'katori': 125, 'gram': 1, 'ml': 0 },
    'Arhar Dal': { 'cup': 200, 'tablespoon': 15, 'teaspoon': 5, 'katori': 130, 'gram': 1, 'ml': 0 },
    'Horse Gram (Kulthi)': { 'cup': 180, 'tablespoon': 13, 'teaspoon': 4, 'katori': 110, 'gram': 1, 'ml': 0 },
    'Green Gram Flour (Moong Atta)': { 'cup': 130, 'tablespoon': 10, 'teaspoon': 3, 'katori': 75, 'gram': 1, 'ml': 0 },
    'Gram Flour (Besan)': { 'cup': 120, 'tablespoon': 9, 'teaspoon': 3, 'katori': 70, 'gram': 1, 'ml': 0 },
    'Matki (Moth Beans)': { 'cup': 180, 'tablespoon': 13, 'teaspoon': 4, 'katori': 110, 'gram': 1, 'ml': 0 },
    'Masoor Atta (Red Lentil Flour)': { 'cup': 130, 'tablespoon': 10, 'teaspoon': 3, 'katori': 75, 'gram': 1, 'ml': 0 },
    'Chana Sattu': { 'cup': 120, 'tablespoon': 8, 'teaspoon': 3, 'katori': 70, 'gram': 1, 'ml': 0 },
    'Sprouted Moong (drained)': { 'cup': 90, 'tablespoon': 7, 'teaspoon': 2, 'katori': 55, 'gram': 1, 'ml': 0 },
    'Sprouted Chana': { 'cup': 110, 'tablespoon': 8, 'teaspoon': 3, 'katori': 65, 'gram': 1, 'ml': 0 },
    'Milk (cow/buffalo)': { 'cup': 240, 'tablespoon': 15, 'teaspoon': 5, 'katori': 150, 'gram': 1, 'ml': 1 },
    'Toned Milk': { 'cup': 240, 'tablespoon': 15, 'teaspoon': 5, 'katori': 150, 'gram': 1, 'ml': 1 },
    'Full Cream Milk': { 'cup': 250, 'tablespoon': 15, 'teaspoon': 5, 'katori': 150, 'gram': 1, 'ml': 1 },
    'Curd / Dahi': { 'cup': 240, 'tablespoon': 15, 'teaspoon': 5, 'katori': 150, 'gram': 1, 'ml': 0 },
    'Greek Yogurt (hung curd)': { 'cup': 220, 'tablespoon': 18, 'teaspoon': 6, 'katori': 140, 'gram': 1, 'ml': 0 },
    'Buttermilk (chaas)': { 'cup': 240, 'tablespoon': 15, 'teaspoon': 5, 'katori': 150, 'gram': 1, 'ml': 1 },
    'Paneer (crumbled)': { 'cup': 150, 'tablespoon': 12, 'teaspoon': 4, 'katori': 90, 'gram': 1, 'ml': 0 },
    'Paneer (cubes)': { 'cup': 170, 'tablespoon': 0, 'teaspoon': 0, 'katori': 110, 'gram': 1, 'ml': 0 },
    'Ghee': { 'cup': 205, 'tablespoon': 13, 'teaspoon': 4.5, 'katori': 120, 'gram': 1, 'ml': 0 },
    'Butter': { 'cup': 227, 'tablespoon': 14, 'teaspoon': 5, 'katori': 135, 'gram': 1, 'ml': 0 },
    'Skim Milk Powder': { 'cup': 100, 'tablespoon': 8, 'teaspoon': 3, 'katori': 65, 'gram': 1, 'ml': 0 },
    'Condensed Milk': { 'cup': 300, 'tablespoon': 20, 'teaspoon': 7, 'katori': 190, 'gram': 1, 'ml': 1 },
    'Onion (chopped)': { 'cup': 150, 'tablespoon': 10, 'teaspoon': 3, 'katori': 100, 'gram': 1, 'ml': 0 },
    'Tomato (chopped)': { 'cup': 180, 'tablespoon': 12, 'teaspoon': 4, 'katori': 120, 'gram': 1, 'ml': 0 },
    'Potato (chopped)': { 'cup': 160, 'tablespoon': 10, 'teaspoon': 3, 'katori': 110, 'gram': 1, 'ml': 0 },
    'Cucumber (chopped)': { 'cup': 120, 'tablespoon': 8, 'teaspoon': 3, 'katori': 80, 'gram': 1, 'ml': 0 },
    'Carrot (chopped)': { 'cup': 130, 'tablespoon': 9, 'teaspoon': 3, 'katori': 90, 'gram': 1, 'ml': 0 },
    'French Beans (chopped)': { 'cup': 125, 'tablespoon': 9, 'teaspoon': 3, 'katori': 85, 'gram': 1, 'ml': 0 },
    'Cauliflower (chopped)': { 'cup': 100, 'tablespoon': 8, 'teaspoon': 3, 'katori': 70, 'gram': 1, 'ml': 0 },
    'Cabbage (chopped)': { 'cup': 80, 'tablespoon': 6, 'teaspoon': 2, 'katori': 55, 'gram': 1, 'ml': 0 },
    'Spinach (raw chopped)': { 'cup': 30, 'tablespoon': 3, 'teaspoon': 1, 'katori': 25, 'gram': 1, 'ml': 0 },
    'Capsicum (chopped)': { 'cup': 90, 'tablespoon': 7, 'teaspoon': 2.5, 'katori': 60, 'gram': 1, 'ml': 0 },
    'Bottle Gourd (lauki, chopped)': { 'cup': 140, 'tablespoon': 10, 'teaspoon': 3, 'katori': 95, 'gram': 1, 'ml': 0 },
    'Brinjal (chopped)': { 'cup': 85, 'tablespoon': 6, 'teaspoon': 2, 'katori': 55, 'gram': 1, 'ml': 0 },
    'Pumpkin (chopped)': { 'cup': 110, 'tablespoon': 8, 'teaspoon': 3, 'katori': 75, 'gram': 1, 'ml': 0 },
    'Methi Leaves (chopped)': { 'cup': 50, 'tablespoon': 4, 'teaspoon': 1.5, 'katori': 35, 'gram': 1, 'ml': 0 },
    'Coriander Leaves (chopped)': { 'cup': 20, 'tablespoon': 2, 'teaspoon': 1, 'katori': 15, 'gram': 1, 'ml': 0 },
    'Ginger (chopped)': { 'cup': 50, 'tablespoon': 6, 'teaspoon': 2, 'katori': 40, 'gram': 1, 'ml': 0 },
    'Garlic (chopped)': { 'cup': 140, 'tablespoon': 12, 'teaspoon': 4, 'katori': 90, 'gram': 1, 'ml': 0 },
    'Apple (chopped)': { 'cup': 100, 'tablespoon': 7, 'teaspoon': 2, 'katori': 70, 'gram': 1, 'ml': 0 },
    'Banana (chopped)': { 'cup': 150, 'tablespoon': 12, 'teaspoon': 4, 'katori': 100, 'gram': 1, 'ml': 0 },
    'Papaya (chopped)': { 'cup': 140, 'tablespoon': 10, 'teaspoon': 3, 'katori': 95, 'gram': 1, 'ml': 0 },
    'Mango (chopped)': { 'cup': 160, 'tablespoon': 12, 'teaspoon': 4, 'katori': 105, 'gram': 1, 'ml': 0 },
    'Pomegranate (arils)': { 'cup': 160, 'tablespoon': 10, 'teaspoon': 3, 'katori': 110, 'gram': 1, 'ml': 0 },
    'Grapes (chopped)': { 'cup': 90, 'tablespoon': 6, 'teaspoon': 2, 'katori': 60, 'gram': 1, 'ml': 0 },
    'Watermelon (chopped)': { 'cup': 150, 'tablespoon': 10, 'teaspoon': 3, 'katori': 100, 'gram': 1, 'ml': 0 },
    'Orange (segments)': { 'cup': 180, 'tablespoon': 12, 'teaspoon': 4, 'katori': 120, 'gram': 1, 'ml': 0 },
    'Pineapple (chopped)': { 'cup': 165, 'tablespoon': 12, 'teaspoon': 4, 'katori': 110, 'gram': 1, 'ml': 0 },
    'Guava (seedless chopped)': { 'cup': 120, 'tablespoon': 8, 'teaspoon': 3, 'katori': 85, 'gram': 1, 'ml': 0 },
    'Chikoo (sapota, chopped)': { 'cup': 140, 'tablespoon': 10, 'teaspoon': 3, 'katori': 95, 'gram': 1, 'ml': 0 },
    'Pear (chopped)': { 'cup': 110, 'tablespoon': 8, 'teaspoon': 3, 'katori': 80, 'gram': 1, 'ml': 0 },
    'Berries (mixed, chopped)': { 'cup': 100, 'tablespoon': 7, 'teaspoon': 2, 'katori': 70, 'gram': 1, 'ml': 0 },
    'Cooking Oil (generic)': { 'cup': 202, 'tablespoon': 13.5, 'teaspoon': 4.5, 'katori': 90, 'gram': 1, 'ml': 0.92 },
    'Mustard Oil': { 'cup': 200, 'tablespoon': 13.5, 'teaspoon': 4.5, 'katori': 90, 'gram': 1, 'ml': 0.9 },
    'Olive Oil': { 'cup': 190, 'tablespoon': 13.3, 'teaspoon': 4.5, 'katori': 88, 'gram': 1, 'ml': 0.9 },
    'Ghee (liquid warm)': { 'cup': 185, 'tablespoon': 12.5, 'teaspoon': 4.2, 'katori': 90, 'gram': 1, 'ml': 0.9 },
    'Butter (solid)': { 'cup': 227, 'tablespoon': 14, 'teaspoon': 5, 'katori': 135, 'gram': 1, 'ml': 0 },
    'Ghee (solid form)': { 'cup': 205, 'tablespoon': 13, 'teaspoon': 4.5, 'katori': 120, 'gram': 1, 'ml': 0 },
    'Margarine': { 'cup': 230, 'tablespoon': 14, 'teaspoon': 5, 'katori': 140, 'gram': 1, 'ml': 0 },
    'Vanaspati': { 'cup': 220, 'tablespoon': 13, 'teaspoon': 4.5, 'katori': 130, 'gram': 1, 'ml': 0 },
    'White Sugar': { 'cup': 200, 'tablespoon': 12, 'teaspoon': 4, 'katori': 130, 'gram': 1, 'ml': 0 },
    'Brown Sugar': { 'cup': 195, 'tablespoon': 12, 'teaspoon': 4, 'katori': 128, 'gram': 1, 'ml': 0 },
    'Powdered Sugar': { 'cup': 120, 'tablespoon': 8, 'teaspoon': 3, 'katori': 80, 'gram': 1, 'ml': 0 },
    'Jaggery (Powdered)': { 'cup': 180, 'tablespoon': 12, 'teaspoon': 4, 'katori': 110, 'gram': 1, 'ml': 0 },
    'Jaggery (Solid crumbled)': { 'cup': 200, 'tablespoon': 15, 'teaspoon': 5, 'katori': 130, 'gram': 1, 'ml': 0 },
    'Honey': { 'cup': 340, 'tablespoon': 21, 'teaspoon': 7, 'katori': 220, 'gram': 1, 'ml': 1.4 },
    'Maple Syrup': { 'cup': 320, 'tablespoon': 20, 'teaspoon': 6.5, 'katori': 200, 'gram': 1, 'ml': 1.33 },
    'Date Syrup': { 'cup': 310, 'tablespoon': 19, 'teaspoon': 6, 'katori': 195, 'gram': 1, 'ml': 1.29 },
    'Liquid Jaggery (Gol ni paak)': { 'cup': 300, 'tablespoon': 20, 'teaspoon': 6.5, 'katori': 190, 'gram': 1, 'ml': 1.25 },
    'Corn Syrup': { 'cup': 328, 'tablespoon': 21, 'teaspoon': 7, 'katori': 210, 'gram': 1, 'ml': 1.37 },
    'Urad Dal Chilka': { 'cup': 185, 'tablespoon': 14, 'teaspoon': 5, 'katori': 118, 'gram': 1, 'ml': 0 },
    'Masoor Malka (Orange Lentils)': { 'cup': 175, 'tablespoon': 13, 'teaspoon': 4, 'katori': 108, 'gram': 1, 'ml': 0 },
    'Matar Dal (Dried Peas Dal)': { 'cup': 210, 'tablespoon': 16, 'teaspoon': 5, 'katori': 140, 'gram': 1, 'ml': 0 },
    'Rajma Chitra': { 'cup': 185, 'tablespoon': 14, 'teaspoon': 5, 'katori': 115, 'gram': 1, 'ml': 0 },
    'Rajma Kashmiri': { 'cup': 175, 'tablespoon': 13, 'teaspoon': 4, 'katori': 110, 'gram': 1, 'ml': 0 },
    'Rajma Red Small': { 'cup': 170, 'tablespoon': 12, 'teaspoon': 4, 'katori': 105, 'gram': 1, 'ml': 0 },
    'Rajma Brown': { 'cup': 180, 'tablespoon': 14, 'teaspoon': 5, 'katori': 110, 'gram': 1, 'ml': 0 },
    'Rajma Jammu': { 'cup': 175, 'tablespoon': 13, 'teaspoon': 4, 'katori': 108, 'gram': 1, 'ml': 0 },
    'Kabuli Chana – Large': { 'cup': 210, 'tablespoon': 16, 'teaspoon': 5, 'katori': 140, 'gram': 1, 'ml': 0 },
    'Kabuli Chana – Small': { 'cup': 195, 'tablespoon': 15, 'teaspoon': 5, 'katori': 128, 'gram': 1, 'ml': 0 },
    'Green Chickpeas (Dried)': { 'cup': 185, 'tablespoon': 14, 'teaspoon': 5, 'katori': 120, 'gram': 1, 'ml': 0 },
    'White Peas (Safed Vatana)': { 'cup': 210, 'tablespoon': 16, 'teaspoon': 5, 'katori': 140, 'gram': 1, 'ml': 0 },
    'Green Peas (Dried)': { 'cup': 185, 'tablespoon': 14, 'teaspoon': 5, 'katori': 120, 'gram': 1, 'ml': 0 },
    'Black Turtle Beans': { 'cup': 190, 'tablespoon': 14, 'teaspoon': 5, 'katori': 125, 'gram': 1, 'ml': 0 },
    'Navy Beans': { 'cup': 185, 'tablespoon': 13, 'teaspoon': 4, 'katori': 118, 'gram': 1, 'ml': 0 },
    'Red Cowpeas (Chori Beans)': { 'cup': 180, 'tablespoon': 13, 'teaspoon': 4, 'katori': 115, 'gram': 1, 'ml': 0 },
    'Broad Beans (Fava – dried)': { 'cup': 200, 'tablespoon': 15, 'teaspoon': 5, 'katori': 130, 'gram': 1, 'ml': 0 },
    'Bambara Groundnuts': { 'cup': 180, 'tablespoon': 13, 'teaspoon': 4, 'katori': 115, 'gram': 1, 'ml': 0 },
    'Khesari Dal': { 'cup': 180, 'tablespoon': 14, 'teaspoon': 5, 'katori': 120, 'gram': 1, 'ml': 0 },
    'Masoor Black (rare)': { 'cup': 185, 'tablespoon': 13, 'teaspoon': 4, 'katori': 118, 'gram': 1, 'ml': 0 },
    'Bhat Dal (Konkan)': { 'cup': 175, 'tablespoon': 12, 'teaspoon': 4, 'katori': 110, 'gram': 1, 'ml': 0 },
    'Gahat Dal (Uttarakhand)': { 'cup': 185, 'tablespoon': 13, 'teaspoon': 4, 'katori': 118, 'gram': 1, 'ml': 0 },
    'Burma Pea': { 'cup': 200, 'tablespoon': 15, 'teaspoon': 5, 'katori': 130, 'gram': 1, 'ml': 0 },
    'Urad Flour': { 'cup': 120, 'tablespoon': 9, 'teaspoon': 3, 'katori': 72, 'gram': 1, 'ml': 0 },
    'Chana Atta (coarse)': { 'cup': 130, 'tablespoon': 10, 'teaspoon': 3, 'katori': 80, 'gram': 1, 'ml': 0 },
    'Chole Flour': { 'cup': 125, 'tablespoon': 9, 'teaspoon': 3, 'katori': 75, 'gram': 1, 'ml': 0 },
    'Rajma Flour': { 'cup': 120, 'tablespoon': 9, 'teaspoon': 3, 'katori': 70, 'gram': 1, 'ml': 0 },
    'Soy Flour': { 'cup': 110, 'tablespoon': 8, 'teaspoon': 3, 'katori': 65, 'gram': 1, 'ml': 0 },
    'Mixed Dal Flour (Handvo mix)': { 'cup': 130, 'tablespoon': 10, 'teaspoon': 3, 'katori': 80, 'gram': 1, 'ml': 0 },
    'Moong (raw for sprouting)': { 'cup': 180, 'tablespoon': 13, 'teaspoon': 4, 'katori': 115, 'gram': 1, 'ml': 0 },
    'Chana (raw for sprouting)': { 'cup': 210, 'tablespoon': 16, 'teaspoon': 5, 'katori': 135, 'gram': 1, 'ml': 0 },
    'Matki (raw for sprouting)': { 'cup': 180, 'tablespoon': 13, 'teaspoon': 4, 'katori': 110, 'gram': 1, 'ml': 0 },
    'Mixed Sprouts Seeds': { 'cup': 175, 'tablespoon': 12, 'teaspoon': 4, 'katori': 108, 'gram': 1, 'ml': 0 },
    'Brown Lentils': { 'cup': 190, 'tablespoon': 14, 'teaspoon': 5, 'katori': 120, 'gram': 1, 'ml': 0 },
    'French Green Lentils (Puy)': { 'cup': 180, 'tablespoon': 14, 'teaspoon': 5, 'katori': 115, 'gram': 1, 'ml': 0 },
    'Black Beluga Lentils': { 'cup': 185, 'tablespoon': 14, 'teaspoon': 5, 'katori': 118, 'gram': 1, 'ml': 0 },
    'Edamame (dried soy)': { 'cup': 180, 'tablespoon': 13, 'teaspoon': 4, 'katori': 110, 'gram': 1, 'ml': 0 },
    'Toor Dal (cooked)': { 'cup': 200, 'tablespoon': 15, 'teaspoon': 5, 'katori': 130, 'gram': 1, 'ml': 1 },
    'Moong Dal (cooked)': { 'cup': 195, 'tablespoon': 14, 'teaspoon': 5, 'katori': 125, 'gram': 1, 'ml': 1 },
    'Masoor Dal (cooked)': { 'cup': 200, 'tablespoon': 15, 'teaspoon': 5, 'katori': 130, 'gram': 1, 'ml': 1 },
    'Chana Dal (cooked)': { 'cup': 210, 'tablespoon': 16, 'teaspoon': 5, 'katori': 140, 'gram': 1, 'ml': 1 },
    'Urad Dal (cooked)': { 'cup': 205, 'tablespoon': 15, 'teaspoon': 5, 'katori': 135, 'gram': 1, 'ml': 1 },
    'Rajma (cooked)': { 'cup': 200, 'tablespoon': 15, 'teaspoon': 5, 'katori': 130, 'gram': 1, 'ml': 1 },
    'Chole (cooked)': { 'cup': 210, 'tablespoon': 16, 'teaspoon': 5, 'katori': 140, 'gram': 1, 'ml': 1 },
    'Kala Chana (cooked)': { 'cup': 205, 'tablespoon': 15, 'teaspoon': 5, 'katori': 135, 'gram': 1, 'ml': 1 },
    'Lobia (cooked)': { 'cup': 200, 'tablespoon': 15, 'teaspoon': 5, 'katori': 130, 'gram': 1, 'ml': 1 },
    'Dal Tadka': { 'cup': 210, 'tablespoon': 16, 'teaspoon': 5.5, 'katori': 140, 'gram': 1, 'ml': 1 },
    'Dal Fry': { 'cup': 220, 'tablespoon': 16, 'teaspoon': 5.5, 'katori': 145, 'gram': 1, 'ml': 1 },
    'Daal Makhani': { 'cup': 230, 'tablespoon': 16, 'teaspoon': 5.5, 'katori': 150, 'gram': 1, 'ml': 1.05 },
    'Sambar': { 'cup': 240, 'tablespoon': 15, 'teaspoon': 5, 'katori': 150, 'gram': 1, 'ml': 1 },
};

const units = ['gram', 'cup', 'ml'];
const fromOptions = ['1 Cup (g)', '1 Tablespoon (g)', '1 Teaspoon (g)', '1 Katori / Bowl'];
const foodCategoryMap: Record<string, string> = {
    'Rice (raw)': 'Cereals & Millets (raw)',
    'Brown Rice (raw)': 'Cereals & Millets (raw)',
    'Basmati Rice (raw)': 'Cereals & Millets (raw)',
    'Parboiled Rice': 'Cereals & Millets (raw)',
    'Wheat Flour (Atta)': 'Cereals & Millets (raw)',
    'Maida': 'Cereals & Millets (raw)',
    'Suji / Rava': 'Cereals & Millets (raw)',
    'Poha': 'Cereals & Millets (raw)',
    'Oats (rolled)': 'Cereals & Millets (raw)',
    'Bajra Flour': 'Cereals & Millets (raw)',
    'Jowar Flour': 'Cereals & Millets (raw)',
    'Ragi Flour': 'Cereals & Millets (raw)',
    'Barley (jav)': 'Cereals & Millets (raw)',
    'Barley Flour': 'Cereals & Millets (raw)',
    'Corn Flour (Makki)': 'Cereals & Millets (raw)',
    'Corn Grits': 'Cereals & Millets (raw)',
    'Puffed Rice (Murmura)': 'Cereals & Millets (raw)',
    'Rice Flour': 'Cereals & Millets (raw)',
    'Foxtail Millet': 'Cereals & Millets (raw)',
    'Kodo Millet': 'Cereals & Millets (raw)',
    'Little Millet': 'Cereals & Millets (raw)',
    'Barnyard Millet': 'Cereals & Millets (raw)',
    'Proso Millet': 'Cereals & Millets (raw)',
    'Buckwheat (Kuttu) Flour': 'Cereals & Millets (raw)',
    'Dalia (Broken Wheat)': 'Cereals & Millets (raw)',
    'Dal (Toor, raw)': 'Pulses & Legumes (raw)',
    'Toor Dal (raw)': 'Pulses & Legumes (raw)',
    'Moong Dal – Split (raw)': 'Pulses & Legumes (raw)',
    'Moong Chilka (raw)': 'Pulses & Legumes (raw)',
    'Moong Sabut (raw)': 'Pulses & Legumes (raw)',
    'Masoor Dal – Split (raw)': 'Pulses & Legumes (raw)',
    'Masoor Whole (raw)': 'Pulses & Legumes (raw)',
    'Chana Dal (raw)': 'Pulses & Legumes (raw)',
    'Kabuli Chana (Chole)': 'Pulses & Legumes (raw)',
    'Kala Chana (Brown Chana)': 'Pulses & Legumes (raw)',
    'Rajma (Kidney Beans)': 'Pulses & Legumes (raw)',
    'Lobia (Black-eyed Beans)': 'Pulses & Legumes (raw)',
    'Soybean (raw)': 'Pulses & Legumes (raw)',
    'Urad Dal (Split)': 'Pulses & Legumes (raw)',
    'Urad Whole (Sabut)': 'Pulses & Legumes (raw)',
    'Arhar Dal': 'Pulses & Legumes (raw)',
    'Horse Gram (Kulthi)': 'Pulses & Legumes (raw)',
    'Green Gram Flour (Moong Atta)': 'Pulses & Legumes (raw)',
    'Gram Flour (Besan)': 'Pulses & Legumes (raw)',
    'Matki (Moth Beans)': 'Pulses & Legumes (raw)',
    'Masoor Atta (Red Lentil Flour)': 'Pulses & Legumes (raw)',
    'Chana Sattu': 'Pulses & Legumes (raw)',
    'Sprouted Moong (drained)': 'Pulses & Legumes (raw)',
    'Sprouted Chana': 'Pulses & Legumes (raw)',
    'Water': 'Milk & Milk Products',
    'Milk': 'Milk & Milk Products',
    'Milk (cow/buffalo)': 'Milk & Milk Products',
    'Toned Milk': 'Milk & Milk Products',
    'Full Cream Milk': 'Milk & Milk Products',
    'Curd / Dahi': 'Milk & Milk Products',
    'Greek Yogurt (hung curd)': 'Milk & Milk Products',
    'Buttermilk (chaas)': 'Milk & Milk Products',
    'Paneer (crumbled)': 'Milk & Milk Products',
    'Paneer (cubes)': 'Milk & Milk Products',
    'Skim Milk Powder': 'Milk & Milk Products',
    'Condensed Milk': 'Milk & Milk Products',
    'Onion (chopped)': 'Vegetables (chopped)',
    'Tomato (chopped)': 'Vegetables (chopped)',
    'Potato (chopped)': 'Vegetables (chopped)',
    'Cucumber (chopped)': 'Vegetables (chopped)',
    'Carrot (chopped)': 'Vegetables (chopped)',
    'French Beans (chopped)': 'Vegetables (chopped)',
    'Cauliflower (chopped)': 'Vegetables (chopped)',
    'Cabbage (chopped)': 'Vegetables (chopped)',
    'Spinach (raw chopped)': 'Vegetables (chopped)',
    'Capsicum (chopped)': 'Vegetables (chopped)',
    'Bottle Gourd (lauki, chopped)': 'Vegetables (chopped)',
    'Brinjal (chopped)': 'Vegetables (chopped)',
    'Pumpkin (chopped)': 'Vegetables (chopped)',
    'Methi Leaves (chopped)': 'Vegetables (chopped)',
    'Coriander Leaves (chopped)': 'Vegetables (chopped)',
    'Ginger (chopped)': 'Vegetables (chopped)',
    'Garlic (chopped)': 'Vegetables (chopped)',
    'Apple (chopped)': 'Fruits (chopped)',
    'Banana (chopped)': 'Fruits (chopped)',
    'Papaya (chopped)': 'Fruits (chopped)',
    'Mango (chopped)': 'Fruits (chopped)',
    'Pomegranate (arils)': 'Fruits (chopped)',
    'Grapes (chopped)': 'Fruits (chopped)',
    'Watermelon (chopped)': 'Fruits (chopped)',
    'Orange (segments)': 'Fruits (chopped)',
    'Pineapple (chopped)': 'Fruits (chopped)',
    'Guava (seedless chopped)': 'Fruits (chopped)',
    'Chikoo (sapota, chopped)': 'Fruits (chopped)',
    'Pear (chopped)': 'Fruits (chopped)',
    'Berries (mixed, chopped)': 'Fruits (chopped)',
    'Oil': 'Oils & Fats',
    'Cooking Oil (generic)': 'Oils & Fats',
    'Mustard Oil': 'Oils & Fats',
    'Olive Oil': 'Oils & Fats',
    'Ghee': 'Oils & Fats',
    'Ghee (liquid warm)': 'Oils & Fats',
    'Butter': 'Oils & Fats',
    'Butter (solid)': 'Oils & Fats',
    'Ghee (solid form)': 'Oils & Fats',
    'Margarine': 'Oils & Fats',
    'Vanaspati': 'Oils & Fats',
    'Sugar': 'Sugars & Sweeteners',
    'White Sugar': 'Sugars & Sweeteners',
    'Brown Sugar': 'Sugars & Sweeteners',
    'Powdered Sugar': 'Sugars & Sweeteners',
    'Jaggery (Powdered)': 'Sugars & Sweeteners',
    'Jaggery (Solid crumbled)': 'Sugars & Sweeteners',
    'Honey': 'Sugars & Sweeteners',
    'Maple Syrup': 'Sugars & Sweeteners',
    'Date Syrup': 'Sugars & Sweeteners',
    'Liquid Jaggery (Gol ni paak)': 'Sugars & Sweeteners',
    'Corn Syrup': 'Sugars & Sweeteners',
    'Urad Dal Chilka': 'Pulses & Legumes (raw)',
    'Masoor Malka (Orange Lentils)': 'Pulses & Legumes (raw)',
    'Matar Dal (Dried Peas Dal)': 'Pulses & Legumes (raw)',
    'Rajma Chitra': 'Pulses & Legumes (raw)',
    'Rajma Kashmiri': 'Pulses & Legumes (raw)',
    'Rajma Red Small': 'Pulses & Legumes (raw)',
    'Rajma Brown': 'Pulses & Legumes (raw)',
    'Rajma Jammu': 'Pulses & Legumes (raw)',
    'Kabuli Chana – Large': 'Pulses & Legumes (raw)',
    'Kabuli Chana – Small': 'Pulses & Legumes (raw)',
    'Green Chickpeas (Dried)': 'Pulses & Legumes (raw)',
    'White Peas (Safed Vatana)': 'Pulses & Legumes (raw)',
    'Green Peas (Dried)': 'Pulses & Legumes (raw)',
    'Black Turtle Beans': 'Pulses & Legumes (raw)',
    'Navy Beans': 'Pulses & Legumes (raw)',
    'Red Cowpeas (Chori Beans)': 'Pulses & Legumes (raw)',
    'Broad Beans (Fava – dried)': 'Pulses & Legumes (raw)',
    'Bambara Groundnuts': 'Pulses & Legumes (raw)',
    'Khesari Dal': 'Pulses & Legumes (raw)',
    'Masoor Black (rare)': 'Pulses & Legumes (raw)',
    'Bhat Dal (Konkan)': 'Pulses & Legumes (raw)',
    'Gahat Dal (Uttarakhand)': 'Pulses & Legumes (raw)',
    'Burma Pea': 'Pulses & Legumes (raw)',
    'Urad Flour': 'Pulses & Legumes (raw)',
    'Chana Atta (coarse)': 'Pulses & Legumes (raw)',
    'Chole Flour': 'Pulses & Legumes (raw)',
    'Rajma Flour': 'Pulses & Legumes (raw)',
    'Soy Flour': 'Pulses & Legumes (raw)',
    'Mixed Dal Flour (Handvo mix)': 'Pulses & Legumes (raw)',
    'Moong (raw for sprouting)': 'Pulses & Legumes (raw)',
    'Chana (raw for sprouting)': 'Pulses & Legumes (raw)',
    'Matki (raw for sprouting)': 'Pulses & Legumes (raw)',
    'Mixed Sprouts Seeds': 'Pulses & Legumes (raw)',
    'Brown Lentils': 'Pulses & Legumes (raw)',
    'French Green Lentils (Puy)': 'Pulses & Legumes (raw)',
    'Black Beluga Lentils': 'Pulses & Legumes (raw)',
    'Edamame (dried soy)': 'Pulses & Legumes (raw)',
    'Toor Dal (cooked)': 'Cooked Pulses (dal, rajma, chole, etc.)',
    'Moong Dal (cooked)': 'Cooked Pulses (dal, rajma, chole, etc.)',
    'Masoor Dal (cooked)': 'Cooked Pulses (dal, rajma, chole, etc.)',
    'Chana Dal (cooked)': 'Cooked Pulses (dal, rajma, chole, etc.)',
    'Urad Dal (cooked)': 'Cooked Pulses (dal, rajma, chole, etc.)',
    'Rajma (cooked)': 'Cooked Pulses (dal, rajma, chole, etc.)',
    'Chole (cooked)': 'Cooked Pulses (dal, rajma, chole, etc.)',
    'Kala Chana (cooked)': 'Cooked Pulses (dal, rajma, chole, etc.)',
    'Lobia (cooked)': 'Cooked Pulses (dal, rajma, chole, etc.)',
    'Dal Tadka': 'Cooked Pulses (dal, rajma, chole, etc.)',
    'Dal Fry': 'Cooked Pulses (dal, rajma, chole, etc.)',
    'Daal Makhani': 'Cooked Pulses (dal, rajma, chole, etc.)',
    'Sambar': 'Cooked Pulses (dal, rajma, chole, etc.)',
};

const ConversionTool: React.FC = () => {
    const [food, setFood] = useState('Rice (raw)');
    const [quantity, setQuantity] = useState(1);
    const [fromUnit, setFromUnit] = useState('1 Cup (g)');
    const [toUnit, setToUnit] = useState('gram');
    const [foodSearch, setFoodSearch] = useState('');
    const isLiquid = useMemo(() => foodConversionData[food]?.ml > 0, [food]);

    const filteredFoods = useMemo(() => {
        const q = foodSearch.toLowerCase();
        return Object.keys(foodConversionData).filter(f => f.toLowerCase().includes(q));
    }, [foodSearch]);

    const getCategory = (name: string): string => {
        if (foodCategoryMap[name]) return foodCategoryMap[name];
        const n = name.toLowerCase();
        if (/(milk|curd|yogurt|buttermilk|paneer|skim milk powder|condensed milk)/.test(n)) return 'Milk & Milk Products';
        if (/(onion|tomato|potato|cucumber|carrot|french beans|cauliflower|cabbage|spinach|capsicum|bottle gourd|brinjal|pumpkin|methi|coriander|ginger|garlic)/.test(n)) return 'Vegetables (chopped)';
        if (/(apple|banana|papaya|mango|pomegranate|grapes|watermelon|orange|pineapple|guava|chikoo|sapota|pear|berries)/.test(n)) return 'Fruits (chopped)';
        if (/(oil|ghee|butter|vanaspati|margarine)/.test(n)) return 'Oils & Fats';
        if (/(sugar|jaggery|honey|syrup)/.test(n)) return 'Sugars & Sweeteners';
        if (/(dal|chana|rajma|lobia|soybean|urad|arhar|kulthi|moong)/.test(n) && /raw/.test(n)) return 'Pulses & Legumes (raw)';
        if (/(dal|rajma|chole)/.test(n) && !/raw/.test(n)) return 'Cooked Pulses (dal, rajma, chole, etc.)';
        if (/(rice|wheat|atta|flour|maida|suji|rava|poha|oats|millet|buckwheat|grits|puffed)/.test(n)) return 'Cereals & Millets (raw)';
        return 'Cereals & Millets (raw)';
    };

    const categorizedFoods = useMemo(() => {
        const categories = [
            'Cereals & Millets (raw)',
            'Pulses & Legumes (raw)',
            'Cooked Pulses (dal, rajma, chole, etc.)',
            'Milk & Milk Products',
            'Vegetables (chopped)',
            'Fruits (chopped)',
            'Oils & Fats',
            'Sugars & Sweeteners',
        ];
        const map: Record<string, string[]> = Object.fromEntries(categories.map(c => [c, []]));
        filteredFoods.forEach(f => {
            const c = getCategory(f);
            map[c].push(f);
        });
        return map;
    }, [filteredFoods]);

    useEffect(() => {
        if (!isLiquid && toUnit === 'ml') {
            setToUnit('gram');
        }
    }, [isLiquid, toUnit]);

    const result = useMemo(() => {
        const foodData = foodConversionData[food];
        if (!foodData) return 'N/A';
        const unitMap: { [k: string]: string } = {
            '1 Cup (g)': 'cup',
            '1 Tablespoon (g)': 'tablespoon',
            '1 Teaspoon (g)': 'teaspoon',
            '1 Katori / Bowl': 'katori',
        };
        const key = unitMap[fromUnit] || 'cup';
        let fromGrams: number = foodData[key];
        if (fromGrams === undefined) {
            if (key === 'tablespoon') fromGrams = foodData['cup'] / 16;
            else if (key === 'teaspoon') fromGrams = foodData['cup'] / 48;
            else if (key === 'katori') fromGrams = foodData['cup'] * 0.625;
            else fromGrams = foodData['cup'];
        }
        const toGrams = foodData[toUnit];

        if (fromGrams === 0 || toGrams === 0) return 'Conversion not applicable';

        const valueInGrams = quantity * fromGrams;
        const convertedValue = valueInGrams / toGrams;

        return `${convertedValue.toFixed(2)} ${toUnit}(s)`;
    }, [food, quantity, fromUnit, toUnit]);

    return (
        <div className="max-w-3xl mx-auto pb-24 space-y-8">
            <div className="text-center md:text-left space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Kitchen Conversion Tool</h1>
                <p className="text-lg text-muted-foreground">Convert common Indian food measurements accurately.</p>
            </div>

            <Card className="shadow-lg border-border/50">
                <CardHeader className="bg-muted/30 pb-6">
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-primary" />
                        Conversion Calculator
                    </CardTitle>
                    <CardDescription>
                        Select a food item and quantity to convert between units.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                    {/* Food Selection */}
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="foodSearch">Search Food</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="foodSearch"
                                        value={foodSearch}
                                        onChange={e => setFoodSearch(e.target.value)}
                                        placeholder="Type to search..."
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="food">Select Item</Label>
                                <Select value={food} onValueChange={setFood}>
                                    <SelectTrigger id="food" className="w-full">
                                        <SelectValue placeholder="Select food item" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(() => {
                                            const entries = Object.entries(categorizedFoods) as [string, string[]][];
                                            const hasMatches = entries.some(([, items]) => items.length > 0);

                                            if (!hasMatches) {
                                                return (
                                                    <div className="p-2 text-sm text-muted-foreground text-center">
                                                        No matches found
                                                    </div>
                                                );
                                            }

                                            return entries.map(([cat, items]) => (
                                                items.length > 0 ? (
                                                    <SelectGroup key={cat}>
                                                        <SelectLabel>{cat}</SelectLabel>
                                                        {items.map((f: string) => (
                                                            <SelectItem key={f} value={f}>{f}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                ) : null
                                            ));
                                        })()}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
                        {/* Quantity */}
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                type="number"
                                id="quantity"
                                value={quantity}
                                onChange={e => setQuantity(parseFloat(e.target.value) || 0)}
                                min="0"
                                step="0.1"
                            />
                        </div>

                        {/* From Unit */}
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="fromUnit">From Unit</Label>
                            <Select value={fromUnit} onValueChange={setFromUnit}>
                                <SelectTrigger id="fromUnit">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {fromOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Arrow */}
                        <div className="hidden md:flex md:col-span-1 justify-center pb-3">
                            <ArrowRight className="w-6 h-6 text-muted-foreground" />
                        </div>

                        {/* To Unit */}
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="toUnit">To Unit</Label>
                            <Select value={toUnit} onValueChange={setToUnit}>
                                <SelectTrigger id="toUnit">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gram">Grams (g)</SelectItem>
                                    {isLiquid && <SelectItem value="ml">Milliliters (ml)</SelectItem>}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Result Display */}
                    <div className="mt-8 rounded-xl bg-primary/5 border border-primary/10 p-6 text-center space-y-2">
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Calculated Result</p>
                        <div className="flex items-center justify-center gap-3 text-primary">
                            <span className="text-4xl md:text-5xl font-bold tracking-tight">{result}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-sm text-blue-800">
                <RefreshCw className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                    <strong>Note:</strong> Conversion values are standardized estimates based on common Indian household measures.
                    Actual weights may vary with utensil size, brand, moisture, and preparation.
                    Use these values for approximate dietary assessment, not for precise laboratory measurement.
                </p>
            </div>
        </div>
    );
};

export default ConversionTool;