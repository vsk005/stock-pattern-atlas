'use client';
import { useState } from 'react';
import patterns from '@/data/patterns.json';

const biasColor: Record<string, string> = { Bullish: 'text-emerald-400', Bearish: 'text-red-400', Neutral: 'text-gray-400' };
const relColor: Record<string, string> = { A: 'text-amber-400', B: 'text-blue-400', C: 'text-gray-400' };

export default function CompareClient() {
    const [selected, setSelected] = useState<string[]>([]);
    const [search, setSearch] = useState('');

    const filtered = search ? patterns.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase())) : patterns;
    const selectedPatterns = selected.map(s => patterns.find((p: any) => p.slug === s)).filter(Boolean) as any[];

    const toggle = (slug: string) => {
        setSelected(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : prev.length < 3 ? [...prev, slug] : prev);
    };

    const rows = [
        { label: 'Category', key: 'category' },
        { label: 'Bias', key: 'bias', color: biasColor },
        { label: 'Context', key: 'context' },
        { label: 'Reliability', key: 'reliability', color: relColor },
        { label: 'Definition', key: 'definition' },
        { label: 'Best Context', key: 'best_context' },
    ];

    const listRows = [
        { label: 'Confirmation Rules', key: 'confirmation_rules', icon: '✓', iconColor: 'text-emerald-400' },
        { label: 'Invalidation Rules', key: 'invalidation_rules', icon: '✗', iconColor: 'text-red-400' },
        { label: 'Quick Checklist', key: 'quick_checklist', icon: '☐', iconColor: 'text-cyan-400' },
        { label: 'Common Traps', key: 'common_traps', icon: '⚡', iconColor: 'text-amber-400' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <h1 className="text-3xl font-bold text-white mb-2">Compare Patterns</h1>
            <p className="text-gray-400 mb-8">Select 2–3 patterns to view side by side.</p>

            {/* Selector */}
            <div className="glass rounded-xl p-4 mb-8">
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search to add a pattern..." className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 mb-3" />
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {filtered.slice(0, 30).map((p: any) => (
                        <button key={p.slug} onClick={() => toggle(p.slug)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selected.includes(p.slug) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600'}`}>
                            {p.name}
                        </button>
                    ))}
                </div>
                {selected.length > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-gray-500">Selected ({selected.length}/3):</span>
                        {selectedPatterns.map((p: any) => (
                            <span key={p.slug} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs">
                                {p.name}
                                <button onClick={() => toggle(p.slug)} className="hover:text-white">×</button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Comparison Table */}
            {selectedPatterns.length >= 2 && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="text-left p-3 text-sm text-gray-500 border-b border-gray-800 w-40"></th>
                                {selectedPatterns.map((p: any) => (
                                    <th key={p.slug} className="text-left p-3 border-b border-gray-800">
                                        <a href={`/patterns/${p.slug}`} className="text-white font-semibold hover:text-emerald-400 transition-colors">{p.name}</a>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(row => (
                                <tr key={row.label} className="border-b border-gray-800/50 hover:bg-gray-900/30">
                                    <td className="p-3 text-sm font-medium text-gray-400">{row.label}</td>
                                    {selectedPatterns.map((p: any) => (
                                        <td key={p.slug} className={`p-3 text-sm ${row.color ? row.color[p[row.key]] || 'text-gray-300' : 'text-gray-300'}`}>
                                            {row.key === 'reliability' ? `Tier ${p[row.key]}` : p[row.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {listRows.map(row => (
                                <tr key={row.label} className="border-b border-gray-800/50 hover:bg-gray-900/30">
                                    <td className="p-3 text-sm font-medium text-gray-400 align-top">{row.label}</td>
                                    {selectedPatterns.map((p: any) => (
                                        <td key={p.slug} className="p-3 text-sm text-gray-300 align-top">
                                            <ul className="space-y-1">
                                                {(p[row.key] || []).map((item: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-1.5">
                                                        <span className={`${row.iconColor} text-xs mt-0.5`}>{row.icon}</span>
                                                        <span className="text-xs">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            <tr className="border-b border-gray-800/50 hover:bg-gray-900/30">
                                <td className="p-3 text-sm font-medium text-gray-400 align-top">Best Timeframes</td>
                                {selectedPatterns.map((p: any) => (
                                    <td key={p.slug} className="p-3 text-sm text-gray-300 align-top">
                                        {(p.best_timeframes || []).map((t: any) => (
                                            <div key={t.timeframe} className="text-xs mb-1">
                                                <span className="text-emerald-400 font-medium">#{t.rank} {t.timeframe}</span>
                                                <span className="text-gray-500 ml-1">— {t.rationale}</span>
                                            </div>
                                        ))}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {selectedPatterns.length < 2 && (
                <div className="text-center py-16 glass rounded-xl">
                    <p className="text-gray-500">Select at least 2 patterns above to compare.</p>
                </div>
            )}
        </div>
    );
}
