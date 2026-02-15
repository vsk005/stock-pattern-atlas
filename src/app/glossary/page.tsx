import { Metadata } from 'next';
import { glossaryTerms } from '@/data/glossary';

export const metadata: Metadata = {
    title: 'Glossary — Stock Pattern Atlas',
    description: 'Key terms and definitions for understanding candlestick and chart patterns in stock trading.',
};

export default function GlossaryPage() {
    const sorted = [...glossaryTerms].sort((a, b) => a.term.localeCompare(b.term));
    const letters = [...new Set(sorted.map(t => t.term[0].toUpperCase()))];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <h1 className="text-3xl font-bold text-white mb-2">Glossary</h1>
            <p className="text-gray-400 mb-8">Essential terms for understanding stock chart patterns.</p>

            <div className="flex flex-wrap gap-2 mb-8">
                {letters.map(l => (
                    <a key={l} href={`#${l}`} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-sm font-medium text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all">{l}</a>
                ))}
            </div>

            <div className="space-y-8">
                {letters.map(l => (
                    <div key={l} id={l}>
                        <h2 className="text-xl font-bold text-emerald-400 mb-4 border-b border-gray-800 pb-2">{l}</h2>
                        <div className="space-y-4">
                            {sorted.filter(t => t.term[0].toUpperCase() === l).map(t => (
                                <div key={t.term} className="glass rounded-xl p-4">
                                    <dt className="text-base font-semibold text-white mb-1">{t.term}</dt>
                                    <dd className="text-sm text-gray-400 leading-relaxed">{t.definition}</dd>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
