'use client';
import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import Link from 'next/link';
import patterns from '@/data/patterns.json';

const allCategories = ['Candlestick', 'Multi-Candle', 'Chart Pattern'];
const allBiases = ['Bullish', 'Bearish', 'Neutral'];
const allContexts = ['Trend Reversal', 'Trend Continuation', 'Range Behavior'];
const allReliability = ['A', 'B', 'C'];
const sortOptions = ['Alphabetical', 'Reliability', 'Category'];

const biasColor: Record<string, string> = { Bullish: 'bg-emerald-500/20 text-emerald-400', Bearish: 'bg-red-500/20 text-red-400', Neutral: 'bg-gray-600/20 text-gray-400' };
const relColor: Record<string, string> = { A: 'bg-amber-500/20 text-amber-400', B: 'bg-blue-500/20 text-blue-400', C: 'bg-gray-600/20 text-gray-300' };

const fuse = new Fuse(patterns, { keys: ['name', 'short_description', 'category', 'bias', 'context'], threshold: 0.3 });

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600'}`}>
            {label}
        </button>
    );
}

export default function LibraryClient() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [bias, setBias] = useState('');
    const [context, setContext] = useState('');
    const [reliability, setReliability] = useState('');
    const [sort, setSort] = useState('Alphabetical');

    const filtered = useMemo(() => {
        let list = search ? fuse.search(search).map(r => r.item) : [...patterns];
        if (category) list = list.filter((p: any) => p.category === category);
        if (bias) list = list.filter((p: any) => p.bias === bias);
        if (context) list = list.filter((p: any) => p.context === context);
        if (reliability) list = list.filter((p: any) => p.reliability === reliability);
        if (sort === 'Alphabetical') list.sort((a: any, b: any) => a.name.localeCompare(b.name));
        else if (sort === 'Reliability') list.sort((a: any, b: any) => a.reliability.localeCompare(b.reliability));
        else if (sort === 'Category') list.sort((a: any, b: any) => a.category.localeCompare(b.category));
        return list;
    }, [search, category, bias, context, reliability, sort]);

    const clearAll = () => { setSearch(''); setCategory(''); setBias(''); setContext(''); setReliability(''); };
    const hasFilters = search || category || bias || context || reliability;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Pattern Library</h1>
                <p className="text-gray-400">Search and filter {patterns.length} candlestick and chart patterns.</p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patterns by name, description, or category..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-all" />
            </div>

            {/* Filters */}
            <div className="space-y-3 mb-6">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium w-16">Category</span>
                    {allCategories.map(c => <Chip key={c} label={c} active={category === c} onClick={() => setCategory(category === c ? '' : c)} />)}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium w-16">Bias</span>
                    {allBiases.map(b => <Chip key={b} label={b} active={bias === b} onClick={() => setBias(bias === b ? '' : b)} />)}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium w-16">Context</span>
                    {allContexts.map(c => <Chip key={c} label={c} active={context === c} onClick={() => setContext(context === c ? '' : c)} />)}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium w-16">Tier</span>
                    {allReliability.map(r => <Chip key={r} label={`Tier ${r}`} active={reliability === r} onClick={() => setReliability(reliability === r ? '' : r)} />)}
                </div>
            </div>

            {/* Sort + Count */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-400">{filtered.length} pattern{filtered.length !== 1 ? 's' : ''} found</p>
                <div className="flex items-center gap-2">
                    {hasFilters && <button onClick={clearAll} className="text-xs text-red-400 hover:text-red-300">Clear all</button>}
                    <select value={sort} onChange={e => setSort(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 px-3 py-1.5 focus:outline-none">
                        {sortOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((p: any, i: number) => (
                    <Link key={p.slug} href={`/patterns/${p.slug}`} className="glass rounded-xl p-5 card-hover block group" style={{ animationDelay: `${i * 30}ms` }}>
                        <div className="flex flex-wrap items-center gap-1.5 mb-3">
                            <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${biasColor[p.bias]}`}>{p.bias}</span>
                            <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${relColor[p.reliability]}`}>Tier {p.reliability}</span>
                            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-700/50 text-gray-400">{p.category}</span>
                        </div>
                        <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors mb-1">{p.name}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2 mb-3">{p.short_description}</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <span>{p.context}</span>
                            <span>·</span>
                            <span>{p.best_timeframes?.[0]?.timeframe}</span>
                        </div>
                    </Link>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No patterns match your filters.</p>
                    <button onClick={clearAll} className="mt-4 text-emerald-400 hover:text-emerald-300 text-sm">Clear filters</button>
                </div>
            )}
        </div>
    );
}
