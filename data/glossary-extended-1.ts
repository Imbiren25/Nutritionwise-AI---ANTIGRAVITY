import type { GlossaryItem } from './glossary'

const foods = [
  'Moong Dal','Chana Dal','Masoor Dal','Urad Dal','Arhar Dal','Rajma','Kala Chana','Soyabean',
  'Poha','Idli','Dosa','Upma','Khichdi','Thepla','Bhakri','Paratha','Pulao','Biryani','Sambar','Rasam',
  'Whole Wheat Roti','Brown Rice','Parboiled Rice','Millet Roti','Jowar Roti','Bajra Roti','Ragi Mudde',
  'Curd','Paneer','Buttermilk','Kadhi','Lassi','Raita',
  'Spinach','Amaranth','Fenugreek Leaves','Drumstick Leaves','Cabbage','Cauliflower','Carrot','Beetroot','Pumpkin','Bottle Gourd','Bitter Gourd','Okra','Brinjal','Tomato','Green Peas',
  'Banana','Guava','Papaya','Mango','Apple','Orange','Amla','Pomegranate','Watermelon','Muskmelon',
  'Sweet Potato','Jackfruit','Corn','Mushroom',
]

const methods = ['Boiled','Steamed','Pressure Cooked','Roasted','Pan‑Fried','Tempered','Sprouted','Fermented']

export const glossaryExtended1: GlossaryItem[] = []

for (const food of foods) {
  for (const method of methods) {
    const term = `${method} ${food}`
    const definition = `A ${method.toLowerCase()} preparation of ${food}, common in Indian households; nutrient retention varies by technique and added ingredients. This cooking method preserves the natural flavors and nutritional value of ${food} while making it easily digestible. In Indian cuisine, ${method.toLowerCase()} cooking is preferred for its ability to retain water-soluble vitamins and minerals that might otherwise be lost. The technique enhances the bioavailability of nutrients and creates a lighter, healthier dish suitable for daily consumption. Traditional Indian cooking emphasizes such gentle methods to maintain the pranic (life) energy of food, aligning with Ayurvedic principles of nutrition and wellness.`
    glossaryExtended1.push({ term, definition, category: 'Foods' })
  }
}

// Add common combinations
const combos: Array<[string,string]> = [
  ['Sprouted Moong Salad','High‑vitamin sprouted moong tossed with vegetables and lemon; enhances bioavailability. Sprouting increases vitamin C content by 300% and makes minerals more bioavailable. This refreshing salad is popular across India as a nutritious breakfast or snack, providing complete protein when combined with vegetables. The addition of lemon juice not only enhances flavor but also increases iron absorption from moong beans, making it an excellent choice for preventing anemia. Rich in antioxidants and digestive enzymes, this salad supports gut health and provides sustained energy throughout the day.'],
  ['Dal Khichdi','Balanced one‑pot rice‑lentil dish; gentle on digestion and suitable across ages. Known as the Indian comfort food, khichdi combines the goodness of rice and lentils in perfect proportions, providing all essential amino acids. This easily digestible meal is recommended during illness recovery and is often the first solid food introduced to infants in many Indian households. The combination creates a complete protein profile while the spices aid digestion and provide therapeutic benefits. Ancient Ayurvedic texts praise khichdi for its tridoshic properties, meaning it balances all three doshas and promotes overall wellbeing.'],
  ['Vegetable Sambar','Lentil‑based stew with assorted vegetables; protein and fibre rich. This South Indian staple combines toor dal with tamarind, vegetables, and a special spice blend called sambar powder, creating a nutritionally complete dish. The variety of vegetables ensures diverse vitamins, minerals, and antioxidants, while lentils provide plant-based protein and fiber. Tamarind adds vitamin C and enhances iron absorption from both lentils and vegetables. The traditional inclusion of curry leaves provides essential minerals and aids in blood sugar regulation. Sambar is typically served with rice or idli, creating a balanced meal that provides sustained energy and supports digestive health.'],
  ['Curd Rice','Cooling rice with yogurt; supports gut health and hydration. This South Indian comfort food combines the probiotic benefits of curd with the easily digestible carbohydrates of rice. The live cultures in curd help maintain healthy gut flora, which is essential for proper digestion and immune function. Curd rice is particularly beneficial during hot Indian summers as it helps cool the body and prevent heat-related digestive issues. The addition of curry leaves and mustard seeds not only enhances flavor but also provides antioxidants and aids digestion. This simple yet nutritious dish is often given to children and elderly people due to its gentle nature and high calcium content.'],
  ['Ragi Porridge','Calcium‑rich finger millet porridge suitable for children and elderly. Ragi contains 344mg of calcium per 100g, making it one of the richest plant sources of this essential mineral. The high fiber content helps regulate blood sugar levels, making it an excellent choice for diabetics. Ragi porridge is traditionally given to growing children and nursing mothers to support bone development and milk production. The millet\'s natural iron content, combined with vitamin C from added ingredients, helps prevent anemia. Being gluten-free and easily digestible, ragi porridge is ideal for people with gluten sensitivity and those recovering from illness.'],
  ['Jowar Bhakri','High‑fibre sorghum flatbread traditionally consumed in western India. Jowar is rich in antioxidants and provides 10.2g of fiber per 100g, supporting digestive health and blood sugar control. This unleavened bread is a staple in Maharashtra and Karnataka, where it\'s often served with spicy curries and chutneys. The complex carbohydrates in jowar provide sustained energy release, making it beneficial for people with diabetes. Being gluten-free, jowar bhakri is an excellent alternative for those with celiac disease or gluten sensitivity. The traditional preparation method involves minimal processing, preserving the grain\'s natural nutrients and providing essential minerals like iron, magnesium, and phosphorus.'],
]

for (const [term, definition] of combos) {
  glossaryExtended1.push({ term, definition, category: 'Foods' })
}