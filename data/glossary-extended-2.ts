import type { GlossaryItem } from './glossary'

const spices = [
  'Turmeric','Cumin','Coriander','Mustard Seeds','Fenugreek Seeds','Fennel','Cardamom','Clove','Cinnamon','Black Pepper','Bay Leaf','Nutmeg','Star Anise','Ajwain','Nigella Seeds','Asafoetida'
]
const uses = ['Tadka','Masala Blend','Pickling','Marination','Infusion','Decoction']

export const glossaryExtended2: GlossaryItem[] = []

for (const spice of spices) {
  for (const use of uses) {
    const term = `${spice} ${use}`
    const definition = `${use} using ${spice.toLowerCase()} common in Indian cooking; contributes flavour and may support digestion. This traditional application of ${spice.toLowerCase()} in ${use} preparations has been practiced for centuries in Indian households and Ayurvedic medicine. The technique enhances the bioavailability of active compounds in ${spice.toLowerCase()} while creating complex flavor profiles that stimulate digestive enzymes. Research shows that ${spice.toLowerCase()} contains bioactive compounds with anti-inflammatory, antioxidant, and digestive properties that are activated through traditional ${use} methods. The combination of ${spice.toLowerCase()} with other spices in ${use} preparations creates synergistic effects that enhance both nutritional value and therapeutic benefits, making it an integral part of Indian culinary traditions.`
    glossaryExtended2.push({ term, definition, category: 'Spices' })
  }
}

const condiments = ['Coconut Chutney','Tomato Chutney','Coriander Chutney','Peanut Chutney','Sesame Chutney','Mint Chutney']
for (const c of condiments) {
  const term = c
  const definition = `Traditional chutney served with snacks and meals; can add micronutrients depending on ingredients. This authentic South Indian condiment is prepared fresh daily in households and provides a burst of flavors while delivering essential nutrients. The grinding process on traditional stone grinders preserves the natural enzymes and vitamins that might be lost in mechanical processing. When consumed with main meals, this chutney aids digestion and enhances the bioavailability of nutrients from other foods through its acid and enzyme content. The combination of fresh ingredients creates a probiotic-rich accompaniment that supports gut health and provides antioxidants that complement the nutritional profile of the main meal.`
  glossaryExtended2.push({ term, definition, category: 'Condiments' })
}