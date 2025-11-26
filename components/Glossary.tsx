import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import Badge from './ui/Badge';
import { Search, BookOpen } from 'lucide-react';

type Item = { term: string; definition: string; category?: string; aliases?: string[] }

const coreTerms: Item[] = [
  { term: 'Anthropometry', definition: 'The scientific study of body measurements such as height, weight, and MUAC.' },
  { term: 'BMI (Body Mass Index)', definition: 'Weight(kg)/height(m)^2; adult screening indicator for underweight, normal, overweight, obesity.' },
  { term: 'MUAC (Mid-Upper Arm Circumference)', definition: 'Arm circumference used to assess acute malnutrition, especially in children.' },
  { term: 'RDA (Recommended Dietary Allowance)', definition: 'Daily intake level meeting needs of almost all healthy individuals in a group.' },
  { term: 'Dietary Diversity', definition: 'Qualitative measure reflecting access to a variety of foods.' },
  { term: 'IFCT (Indian Food Composition Tables)', definition: 'NIN database of nutrient values for Indian foods.' },
  { term: 'Millets', definition: 'Nutritious cereals like jowar, bajra, ragi rich in fibre and micronutrients.' }
]


const Glossary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [items, setItems] = useState<Item[]>(coreTerms)
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [isLoading, setIsLoading] = useState(true)
  const deferredQuery = useDeferredValue(searchQuery)

  useEffect(() => {
    let mounted = true
      ; (async () => {
        setIsLoading(true)
        const [base, ext1, ext2, ext3] = await Promise.all([
          import('../data/glossary'),
          import('../data/glossary-extended-1'),
          import('../data/glossary-extended-2'),
          import('../data/glossary-extended-3'),
        ])
        if (!mounted) return
        const allRaw = [
          ...coreTerms,
          ...(base.glossaryData as Item[]),
          ...(ext1.glossaryExtended1 as Item[]),
          ...(ext2.glossaryExtended2 as Item[]),
          ...(ext3.glossaryExtended3 as Item[]),
        ]
        // Deduplicate by normalised term
        const map = new Map<string, Item>()
        for (const it of allRaw) {
          const key = it.term.trim().toLowerCase()
          if (!map.has(key)) {
            map.set(key, it)
          } else {
            const existing = map.get(key)!
            const mergedAliases = Array.from(new Set([...(existing.aliases || []), ...(it.aliases || [])]))
            map.set(key, { ...existing, aliases: mergedAliases.length ? mergedAliases : existing.aliases })
          }
        }
        const enrich = (i: Item): Item => {
          const baseDef = (i.definition || '').trim()
          const cat = (i.category || '').toLowerCase()
          let serving = ''
          if (cat === 'foods') serving = 'Typical serving: 1 cup cooked or 1 medium piece using household measures (cup, tablespoon, teaspoon, katori).'
          else if (cat === 'spices') serving = 'Typical use per serving: 1/4–1/2 teaspoon; temper in a small amount of oil or ghee to release aroma.'
          else if (cat === 'assessment') serving = 'Usage: record per serving, frequency, and household measures to interpret dietary intake.'
          else if (cat === 'programs') serving = 'Application: community meal service and portion standards influence dietary outcomes.'
          else if (cat === 'nutrients') serving = 'Meeting needs: use foods per serving and adjust portion sizes by life stage.'
          else if (cat === 'policies') serving = 'Policy reference: affects labelling, fortification, safety, procurement, and program delivery.'
          else if (cat === 'therapeutics') serving = 'Therapeutic reference: dosing, targets, contraindications, and counselling for clinical nutrition.'
          else if (cat === 'fortification') serving = 'Fortification reference: focuses on premix, blending, QA/QC, stability, and compliance.'
          else if (cat === 'systems') serving = 'System reference: covers operations, logistics, data flows, reviews, and governance.'
          else if (cat === 'measurements') serving = 'Measurement reference: household measures, conversions, yields, densities, and error reduction.'
          else if (cat === 'iycf') serving = 'IYCF reference: initiation, exclusive and continued breastfeeding, complementary feeding, diversity, and safe practices.'
          else if (cat === 'metabolism') serving = 'Metabolism reference: energy expenditure, glucose response, meal timing, and portion effects.'
          else serving = 'Use standard household measures to describe a typical serving and frequency.'
          const extra = ' Helps practical meal planning and portion control for Indian diets. Values and recommendations vary by age, activity, and health status.'
          const normalized = baseDef.endsWith('.') ? baseDef : `${baseDef}.`
          return { ...i, definition: `${normalized} ${serving} ${extra}` }
        }
        const classify = (i: Item): Item => {
          const t = i.term.trim().toLowerCase()
          const c = (i.category || '').trim()
          const is = (s: string) => t.includes(s)
          let next = c
          if (!next || next === 'Foods') {
            if (/(milk|curd|dahi|paneer|buttermilk|lassi|yogurt|kadhi)/.test(t)) next = 'Milk & Milk Products'
            else if (/(oil|ghee|butter|vanaspati|margarine|sesame oil|rice bran oil|groundnut oil)/.test(t)) next = 'Oils & Fats'
            else if (/(turmeric|cumin|coriander|mustard seeds|fenugreek|fennel|cardamom|clove|cinnamon|black pepper|bay leaf|nutmeg|star anise|ajwain|nigella|asafoetida)/.test(t)) next = 'Spices'
            else if (/(chutney|raita|pickle|achaar)/.test(t)) next = 'Condiments'
            else if (/(jaggery|sugar|syrup|honey|molasses)/.test(t)) next = 'Sugars & Sweeteners'
            else if (/(ultra\-processed|nutrition transition|hidden hunger|hygiene hypothesis|community nutrition|food security|nutrition surveillance)/.test(t)) next = 'Public Health'
          }
          if (/(boiling|steaming|pressure cooking|roasting|deep frying|tadka|tempering)/.test(t)) next = 'Cooking'
          if (/(fermentation|soaking|sprouting|dehydration|drying)/.test(t)) next = 'Processing'
          if (/(wash|sanitation|hygiene)/.test(t)) next = 'WASH'
          return { ...i, category: next || i.category }
        }
        const exclude = new Set([
          'Foods',
          'Milk & Milk Products',
          'Oils & Fats',
          'Cooking',
          'Condiments',
          'Spices',
          'Culture',
          'Sugars & Sweeteners',
          'Processing',
          'Life Stage',
          'Workforce',
          'WASH',
          'Safety',
        ])
        const all = Array.from(map.values())
          .map(classify)
          .map(enrich)
          .filter(i => !exclude.has(i.category || ''))
        setItems(all)
        const cats = Array.from(new Set(['All', ...all.map(i => i.category || '').filter(Boolean)]))
        setCategories(cats as string[])
        // eslint-disable-next-line no-console
        console.log('Glossary loaded:', { total: all.length })
        setIsLoading(false)
      })()
    return () => { mounted = false }
  }, [])

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    const byCat = activeCategory === 'All' ? items : items.filter(i => (i.category || '') === activeCategory)
    if (!q) return byCat
    return byCat.filter(i =>
      i.term.toLowerCase().includes(q) ||
      i.definition.toLowerCase().includes(q) ||
      (i.aliases || []).some(a => a.toLowerCase().includes(q))
    )
  }, [items, deferredQuery, activeCategory])

  const visible = filtered

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-8">
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Glossary of Terms</h1>
        <p className="text-lg text-muted-foreground">Key nutrition terms for India: foods, programs, measures, and policies.</p>
      </div>

      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for a term..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
          <div className="text-sm text-muted-foreground flex items-center whitespace-nowrap">
            {isLoading ? 'Loading...' : `Showing ${visible.length} items`}
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <div key={cat} onClick={() => setActiveCategory(cat)} className="cursor-pointer">
              <Badge
                variant={activeCategory === cat ? "primary" : "secondary"}
                className="hover:opacity-80 transition-opacity"
              >
                {cat}
              </Badge>
            </div>
          ))}
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 gap-4">
          {visible.length > 0 ? visible.map(item => (
            <Card key={item.term} className="hover:shadow-md transition-shadow border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  {item.term}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{item.definition}</p>
              </CardContent>
            </Card>
          )) : (
            <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-muted-foreground/25">
              <p className="text-muted-foreground">No terms found for "{searchQuery}".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Glossary;