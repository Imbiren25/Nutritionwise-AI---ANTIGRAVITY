import React, { useMemo, useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { IFCTFood, Page } from '../types';
import { IFCT_SEED } from '../data/ifct';
import { useDebounce } from '../hooks/useDebounce';
import { lookupIFCT, compareIFCT } from '../services/geminiService';

const groups: IFCTFood['group'][] = ['cereals','pulses','dairy','vegetables','fruits','oils','eggs','meat','sugars','mixed'];

const IFCTLibrary: React.FC<{ setActivePage: (p: Page) => void }> = ({ setActivePage }) => {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<IFCTFood['group'] | 'all'>('all');
  const [sortKey, setSortKey] = useState<keyof IFCTFood['per100g']>('protein');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [aiItem, setAiItem] = useState<IFCTFood | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [compare, setCompare] = useState<IFCTFood[]>([]);
  const debouncedQuery = useDebounce(query, 250);

  const baseData = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    let items = IFCT_SEED.filter(i => {
      const nameMatch = i.name.toLowerCase().includes(q) || (i.aliases || []).some(a => a.toLowerCase().includes(q));
      const groupMatch = group === 'all' ? true : i.group === group;
      return nameMatch && groupMatch;
    });
    items = items.sort((a, b) => {
      const av = a.per100g[sortKey];
      const bv = b.per100g[sortKey];
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return items;
  }, [debouncedQuery, group, sortKey, sortDir]);

  const hasResults = baseData.length > 0 || !!aiItem;

  const handleAiLookup = async () => {
    const name = query.trim();
    if (!name) return;
    try {
      const res = await lookupIFCT(name);
      setAiItem(res);
    } catch (e) {
      setAiItem(null);
      alert('AI lookup unavailable. Configure API key or check network.');
    }
  };

  const toggleSelected = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleCompare = async () => {
    const names = [...selected.map(id => {
      const item = IFCT_SEED.find(i => i.id === id);
      return item ? item.name : '';
    }).filter(Boolean), aiItem?.name].filter(Boolean) as string[];
    if (names.length === 0) return;
    try {
      const res = await compareIFCT(names);
      setCompare(res);
    } catch (e) {
      alert('AI compare unavailable. Configure API key or check network.');
    }
  };

  const renderRows = (items: IFCTFood[]) => (
    items.map(item => (
      <tr key={item.id} className="border-t">
        <td className="p-2">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleSelected(item.id)} />
            <span className="font-medium text-[var(--text-primary)]">{item.name}</span>
            {item.source === 'ai' && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[var(--warning-bg)] text-[var(--warning-text)]">AI</span>}
          </label>
          <p className="text-xs text-[var(--text-secondary)]">{item.group}</p>
        </td>
        <td className="p-2">{item.per100g.energy}</td>
        <td className="p-2">{item.per100g.protein}</td>
        <td className="p-2">{item.per100g.fat}</td>
        <td className="p-2">{item.per100g.carbs}</td>
        <td className="p-2">{item.per100g.fiber}</td>
        <td className="p-2">{item.per100g.iron}</td>
        <td className="p-2">{item.per100g.calcium}</td>
        <td className="p-2">{item.per100g.vitaminA}</td>
        <td className="p-2">{item.per100g.zinc}</td>
      </tr>
    ))
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">IFCT Library</h1>
      <p className="text-[var(--text-secondary)]">Per-100g nutrient values aligned with ICMR-NIN IFCT 2021.</p>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="form-input w-full" placeholder="Search food name" value={query} onChange={e => setQuery(e.target.value)} />
          <select className="form-select w-full" value={group} onChange={e => setGroup(e.target.value as IFCTFood['group'] | 'all')}>
            <option value="all">All groups</option>
            {groups.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <div className="flex gap-2">
            <select className="form-select" value={sortKey} onChange={e => setSortKey(e.target.value as keyof IFCTFood['per100g'])}>
              {(['energy','protein','fat','carbs','fiber','iron','calcium','vitaminA','zinc'] as (keyof IFCTFood['per100g'])[]).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <select className="form-select" value={sortDir} onChange={e => setSortDir(e.target.value as 'asc' | 'desc')}>
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={handleAiLookup}>Search with AI</Button>
          <Button variant="secondary" onClick={() => setActivePage('conversion-tool')}>Open Conversions</Button>
          <Button variant="secondary" onClick={handleCompare} disabled={selected.length === 0 && !aiItem}>Compare Selected</Button>
        </div>
      </Card>

      <div className="overflow-x-auto bg-[var(--bg-secondary)] rounded-xl shadow">
        <table className="w-full text-sm table-fixed">
          <thead className="sticky top-0 bg-[var(--bg-tertiary)]">
            <tr>
              <th className="p-2 text-left w-64">Food</th>
              <th className="p-2">Energy</th>
              <th className="p-2">Protein</th>
              <th className="p-2">Fat</th>
              <th className="p-2">Carbs</th>
              <th className="p-2">Fiber</th>
              <th className="p-2">Iron</th>
              <th className="p-2">Calcium</th>
              <th className="p-2">Vitamin A</th>
              <th className="p-2">Zinc</th>
            </tr>
          </thead>
          <tbody>
            {renderRows(baseData)}
            {aiItem && renderRows([aiItem])}
          </tbody>
        </table>
        {!hasResults && <p className="p-4 text-center text-[var(--text-secondary)]">No matches. Try Search with AI.</p>}
      </div>

      {compare.length > 0 && (
        <div className="bg-[var(--bg-secondary)] rounded-xl shadow p-4">
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">AI Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--bg-tertiary)]">
                <tr>
                  <th className="p-2 text-left">Food</th>
                  <th className="p-2">Energy</th>
                  <th className="p-2">Protein</th>
                  <th className="p-2">Fat</th>
                  <th className="p-2">Carbs</th>
                  <th className="p-2">Fiber</th>
                  <th className="p-2">Iron</th>
                  <th className="p-2">Calcium</th>
                  <th className="p-2">Vitamin A</th>
                  <th className="p-2">Zinc</th>
                </tr>
              </thead>
              <tbody>
                {compare.map(item => (
                  <tr key={item.id} className="border-t">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.per100g.energy}</td>
                    <td className="p-2">{item.per100g.protein}</td>
                    <td className="p-2">{item.per100g.fat}</td>
                    <td className="p-2">{item.per100g.carbs}</td>
                    <td className="p-2">{item.per100g.fiber}</td>
                    <td className="p-2">{item.per100g.iron}</td>
                    <td className="p-2">{item.per100g.calcium}</td>
                    <td className="p-2">{item.per100g.vitaminA}</td>
                    <td className="p-2">{item.per100g.zinc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-2">AI-derived values are educational estimates aligned with IFCT 2021.</p>
        </div>
      )}
    </div>
  );
};

export default IFCTLibrary;