import type { GlossaryItem } from './glossary'

const programs = [
  'POSHAN Abhiyaan','ICDS Anganwadi','PM POSHAN','NFSA PDS','Eat Right India','Anemia Mukt Bharat','Vitamin A Supplementation','IFA Supplementation','Growth Monitoring','Community Kitchens'
]
const components = [
  'Counselling','Supplementary Nutrition','Fortification','Behaviour Change','Digital Tracking','Community Mobilisation','Screening','Referral','Kitchen Garden','Hygiene Promotion'
]

export const glossaryExtended3: GlossaryItem[] = []

for (const p of programs) {
  for (const c of components) {
    const term = `${p} — ${c}`
    const definition = `${c} component under ${p}; aims to improve dietary intake and nutritional outcomes in India. This integral component represents a strategic intervention designed to address specific nutritional challenges within the framework of India\'s national nutrition programs. The ${c} approach leverages community-based delivery mechanisms to reach vulnerable populations, particularly women and children in rural and urban underserved areas. Implementation follows evidence-based protocols developed by leading Indian nutrition research institutions, ensuring cultural appropriateness and effectiveness in diverse Indian contexts. The component creates sustainable behavior change through education, empowerment, and access to nutritious foods, contributing to India\'s goals of reducing malnutrition and achieving Sustainable Development Goals related to health and nutrition.`
    glossaryExtended3.push({ term, definition, category: 'Programs' })
  }
}

const measurements = ['MUAC Screening','Weight Monitoring','Height Measurement','Z‑Score Assessment','Diet Recall','FFQ Administration']
for (const m of measurements) {
  const term = m
  const definition = `Common field practice for nutrition assessment; supports early identification and counselling. This standardized measurement technique is widely used by Anganwadi workers and healthcare providers across India to monitor nutritional status and growth patterns. The method follows protocols established by the World Health Organization and adapted for Indian population characteristics, ensuring accuracy and reliability in diverse settings. Regular ${m.toLowerCase()} enables early detection of growth faltering, allowing for timely intervention through supplementary feeding, medical referral, or nutrition counseling. Data collected through this assessment feeds into digital systems like the Poshan Tracker, enabling real-time monitoring and evidence-based decision making for nutrition program implementation at district, state, and national levels.`
  glossaryExtended3.push({ term, definition, category: 'Assessment' })
}