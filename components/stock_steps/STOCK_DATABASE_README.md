# Stock Food Database - Comprehensive Nutritional Database for India

## Overview
This is a complete nutritional database containing **1000+ food items** across 10 major categories, specifically designed for household food stock inventory and nutrition assessment in the Indian context.

## Database Structure

### Complete Coverage - 10 Categories

#### 1. **Cereals** (100+ items)
- Rice varieties (Basmati, Sona Masoori, Brown, Red, Black, Wild)
- Wheat products (Atta, Maida, Semolina, Bread)
- Millets (Bajra, Ragi, Jowar, Foxtail, Little, Kodo, Barnyard, Proso)
- Oats, Barley, Rye products
- Quinoa, Amaranth, Buckwheat
- Pasta, Noodles, Vermicelli
- Breakfast cereals and flakes

#### 2. **Pulses** (100+ items)
- Dal varieties (Toor, Moong, Masoor, Urad, Chana)
- Whole and split forms
- Chickpeas (Kabuli, Desi, Kala)
- Kidney beans (Rajma - all varieties)
- Lentils (French, Puy, Beluga, Yellow)
- Beans (Lima, Navy, Pinto, Black, Adzuki, Fava)
- Soya products (Chunks, Granules, Beans)
- Organic varieties

#### 3. **Oils & Fats** (100+ items)
- Cooking oils (Sunflower, Mustard, Groundnut, Sesame)
- Coconut oil varieties (Refined, Virgin, Cold-pressed)
- Olive oils (Extra Virgin, Pure, Pomace)
- Ghee varieties (Cow, Buffalo, A2, Bilona, Organic)
- Butter and margarine
- Specialty oils (Avocado, Almond, Flaxseed, Hemp)
- Traditional Indian oils (Kachi Ghani, Marachekku)
- Blended oils

#### 4. **Vegetables** (100+ items)
- Root vegetables (Potato, Carrot, Beetroot, Radish, Turnip)
- Leafy greens (Spinach, Methi, Sarson, Amaranth, Curry leaves)
- Cruciferous vegetables (Cabbage, Cauliflower, Broccoli)
- Gourds (Lauki, Karela, Turai, Snake, Pointed, Ash, Ivy)
- Peppers and chilies
- Beans and pods
- Mushroom varieties
- Onion and tomato varieties

#### 5. **Fruits** (100+ items)
- Tropical fruits (Banana, Mango varieties, Papaya, Pineapple)
- Citrus fruits (Orange, Mosambi, Lemon, Grapefruit)
- Berries (Strawberry, Raspberry, Blueberry, Blackberry, Mulberry)
- Apples and Pears
- Grapes and Melons
- Stone fruits (Peach, Plum, Apricot, Cherry)
- Dried fruits (Dates, Raisins, Figs, Prunes, Apricots)
- Indian specialty fruits (Chikoo, Jamun, Ber, Karonda)

#### 6. **Dairy & Milk Products** (100+ items)
- Cow milk varieties (Full cream, Toned, Double toned, A2, Gir)
- Buffalo milk products
- Milk powder (Full cream, Skimmed, Malted)
- Curd/Yogurt (Plain, Greek, Hung, Flavored, Probiotic)
- Paneer and cottage cheese
- Hard cheeses (Cheddar, Mozzarella, Parmesan, Gouda)
- Soft cheeses (Cream, Brie, Ricotta, Feta)
- Cream varieties
- Ice cream
- Alternative milks (Soy, Almond, Coconut, Oat)

#### 7. **Eggs** (40+ items)
- Chicken eggs (all sizes and types)
- Duck, Quail, Goose, Turkey eggs
- Egg components (White, Yolk)
- Processed forms (Scrambled, Boiled, Fried, Omelette)
- Egg powder
- Specialty preparations

#### 8. **Meat, Fish & Poultry** (100+ items)
- Chicken (Breast, Thigh, Drumstick, Wings, Organs)
- Mutton/Lamb/Goat (all cuts and organs)
- Beef (all cuts)
- Pork (all cuts and products)
- Freshwater fish (Rohu, Katla, Hilsa, Catla)
- Marine fish (Pomfret, Mackerel, Salmon, Tuna, Kingfish)
- Prawns, Shrimp, Crab, Lobster
- Squid, Octopus, Oysters, Clams
- Processed meats (Salami, Sausages, Nuggets)

#### 9. **Sugar & Jaggery** (50+ items)
- White sugar (Granulated, Powdered, Crystal, Cube)
- Brown sugar varieties
- Jaggery (Gur, Palm, Date Palm, Coconut)
- Honey varieties (Raw, Manuka, Wild, Organic)
- Syrups (Maple, Golden, Corn, Glucose, Date, Molasses)
- Specialty sugars (Coconut, Date, Xylitol, Erythritol)
- Rock sugar

#### 10. **Condiments & Spices** (100+ items)
- Salts (Table, Sea, Rock, Black, Pink Himalayan)
- Spice powders (Turmeric, Chilli, Coriander, Cumin, Garam Masala)
- Whole spices (Cumin, Mustard, Cardamom, Cloves, Cinnamon)
- Masalas (Chat, Pav Bhaji, Sambhar, Tandoori, Biryani)
- Seeds (Sesame, Poppy, Flax, Fennel)
- Dried herbs (Mint, Kasuri Methi, Basil, Oregano)
- Acidic agents (Tamarind, Amchur, Kokum, Vinegar)
- Tea, Coffee, Cocoa

## Nutritional Data Included

For each item, the database provides:
- **Energy** (kcal per 100g or per unit for eggs)
- **Protein** (grams per 100g)
- **Carbohydrates** (grams per 100g)
- **Fat** (grams per 100g)
- **Fiber** (grams per 100g)
- **Default Unit** (kg, litre, or unit)
- **Category** classification

## Usage

```typescript
import { 
    stockFoodDatabase, 
    getStockItemsByCategory,
    searchStockItems,
    categoryStats 
} from './stockFoodDatabase';

// Get all cereals
const cereals = getStockItemsByCategory('cereals');

// Search for rice items
const riceItems = searchStockItems('rice');

// View database statistics
console.log(categoryStats);
// Output: { cereals: 100+, pulses: 100+, oils: 100+, ... total: 1000+ }
```

## Data Sources
All nutritional values are based on:
- ICMR-NIN Indian Food Composition Tables
- USDA Food Database (for international items)
- Standardized per 100g values for consistency

## File Structure
```
stock_steps/
├── stockFoodDatabase.ts       # Master index (imports all)
├── stockDB_cereals.ts         # 100+ cereals
├── stockDB_pulses.ts          # 100+ pulses
├── stockDB_oils.ts            # 100+ oils & fats
├── stockDB_vegetables.ts      # 100+ vegetables
├── stockDB_fruits.ts          # 100+ fruits
├── stockDB_dairy.ts           # 100+ dairy products
└── stockDB_combined.ts        # Eggs, Meat, Sugars, Condiments
```

## Integration with Stock Inventory

This database is designed to work seamlessly with the household food stock assessment module:

1. **Item Selection**: Users can search and select from 1000+ items
2. **Nutritional Calculation**: Automatic calculation based on quantity and unit
3. **Consumption Unit (CU)**: Supports calculation of household food security
4. **Dietary Diversity**: Enables assessment across 10 food groups
5. **Nutrient Analysis**: Complete macro and micronutrient tracking

## Benefits

✅ **Comprehensive**: 1000+ items covering all common Indian household foods  
✅ **Accurate**: Based on authoritative nutrition databases  
✅ **Culturally Relevant**: Includes regional Indian foods and preparations  
✅ **Type-Safe**: Full TypeScript support with defined types  
✅ **Searchable**: Built-in search and filter helpers  
✅ **Modular**: Category-wise organization for easy maintenance  
✅ **Extensible**: Easy to add new items or categories

## License
Data compiled for NutritionWise AI - Nutritional Assessment System

---
**Version**: 1.0  
**Last Updated**: 2025  
**Total Items**: 1000+  
**Categories**: 10
