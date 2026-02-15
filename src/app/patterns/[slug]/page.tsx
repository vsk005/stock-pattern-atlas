import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';
import patterns from '@/data/patterns.json';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    return patterns.map((p: any) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const p = patterns.find((p: any) => p.slug === slug) as any;
    if (!p) return {};
    return {
        title: `${p.name} — Stock Pattern Atlas`,
        description: p.short_description,
        openGraph: { title: p.name, description: p.definition },
    };
}

const biasColor: Record<string, string> = { Bullish: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', Bearish: 'bg-red-500/20 text-red-400 border-red-500/30', Neutral: 'bg-gray-600/20 text-gray-400 border-gray-600/30' };
const relColor: Record<string, string> = { A: 'bg-amber-500/20 text-amber-400', B: 'bg-blue-500/20 text-blue-400', C: 'bg-gray-600/20 text-gray-300' };

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><span>{icon}</span>{title}</h2>
            {children}
        </div>
    );
}

export default async function PatternPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const p = patterns.find((p: any) => p.slug === slug) as any;
    if (!p) notFound();

    const related = p.related_patterns?.map((s: string) => patterns.find((pp: any) => pp.slug === s)).filter(Boolean) || [];

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link href="/" className="hover:text-gray-300">Home</Link>
                <span>/</span>
                <Link href="/library" className="hover:text-gray-300">Library</Link>
                <span>/</span>
                <span className="text-gray-300">{p.name}</span>
            </div>

            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${biasColor[p.bias]}`}>{p.bias}</span>
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${relColor[p.reliability]}`}>Tier {p.reliability}</span>
                    <span className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-700/50 text-gray-400">{p.category}</span>
                    <span className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-700/50 text-gray-400">{p.context}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{p.name}</h1>
                <p className="text-lg text-gray-400">{p.short_description}</p>
            </div>

            <div className="space-y-6">
                {/* Definition */}
                <Section title="Definition" icon="📖">
                    <p className="text-gray-300 leading-relaxed">{p.definition}</p>
                </Section>

                {/* Anatomy */}
                <Section title="Anatomy" icon="🔬">
                    <p className="text-gray-300 leading-relaxed">{p.anatomy}</p>
                </Section>

                {/* Rules Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Section title="Confirmation Rules" icon="✅">
                        <ul className="space-y-2">
                            {p.confirmation_rules?.map((r: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                    <span className="text-emerald-400 mt-0.5">✓</span>{r}
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Section title="Invalidation Rules" icon="❌">
                        <ul className="space-y-2">
                            {p.invalidation_rules?.map((r: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                    <span className="text-red-400 mt-0.5">✗</span>{r}
                                </li>
                            ))}
                        </ul>
                    </Section>
                </div>

                {/* Best Timeframes */}
                <Section title="Best Timeframes" icon="⏱️">
                    <div className="grid sm:grid-cols-2 gap-3">
                        {p.best_timeframes?.map((t: any) => (
                            <div key={t.timeframe} className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-3">
                                <span className="text-lg font-bold text-emerald-400 w-10">#{t.rank}</span>
                                <div>
                                    <div className="text-sm font-semibold text-white">{t.timeframe}</div>
                                    <div className="text-xs text-gray-400">{t.rationale}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Best Context */}
                <Section title="Best Context" icon="🎯">
                    <p className="text-gray-300 leading-relaxed">{p.best_context}</p>
                </Section>

                {/* Quick Checklist */}
                <Section title="Quick Checklist" icon="📋">
                    <ul className="space-y-2">
                        {p.quick_checklist?.map((c: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                <span className="text-cyan-400 mt-0.5">☐</span>{c}
                            </li>
                        ))}
                    </ul>
                </Section>

                {/* Common Traps */}
                <Section title="Common Traps" icon="⚠️">
                    <ul className="space-y-2">
                        {p.common_traps?.map((t: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                <span className="text-amber-400 mt-0.5">⚡</span>{t}
                            </li>
                        ))}
                    </ul>
                </Section>

                {/* Examples */}
                {p.examples?.length > 0 && (
                    <Section title="Chart Examples" icon="📊">
                        <div className="grid sm:grid-cols-2 gap-4">
                            {p.examples.map((ex: any, i: number) => (
                                <div key={i} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-semibold text-white">{ex.ticker}</span>
                                        <span className="text-xs text-gray-500">{ex.timeframe} · {ex.start} → {ex.end}</span>
                                    </div>
                                    <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden group mb-2 border border-gray-700/20">
                                        <Image
                                            src={ex.image}
                                            alt={ex.caption}
                                            fill
                                            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                            unoptimized
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400">{ex.caption}</p>
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Similar Patterns */}
                {related.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-white mb-4">Similar Patterns</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {related.map((r: any) => (
                                <Link key={r.slug} href={`/patterns/${r.slug}`} className="glass rounded-xl p-4 card-hover block group">
                                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 ${biasColor[r.bias]}`}>{r.bias}</span>
                                    <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{r.name}</h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
