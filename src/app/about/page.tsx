import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About — Stock Pattern Atlas',
    description: 'About Stock Pattern Atlas and important disclaimers about educational content.',
};

export default function AboutPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <h1 className="text-3xl font-bold text-white mb-8">About Stock Pattern Atlas</h1>

            <div className="space-y-6">
                <section className="glass rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-3">What is this?</h2>
                    <p className="text-gray-300 leading-relaxed mb-3">
                        Stock Pattern Atlas is a free, open-source educational reference for candlestick and chart patterns used in stock trading.
                        It documents 100 patterns with structured information including confirmation rules, invalidation criteria, common traps,
                        and the best timeframes for stocks.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                        The goal is to provide a fast, searchable encyclopedia where you can quickly find a pattern, understand its anatomy,
                        and learn how to confirm or invalidate it — all in one place.
                    </p>
                </section>

                <section className="glass rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-3">How to Use</h2>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">→</span><strong>Browse</strong> patterns in the Library with filters for category, bias, context, and reliability.</li>
                        <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">→</span><strong>Search</strong> by name or keyword using fuzzy matching.</li>
                        <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">→</span><strong>Compare</strong> up to 3 patterns side by side to understand their differences.</li>
                        <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">→</span><strong>Study</strong> each pattern&apos;s confirmation rules, traps, and timeframe rankings.</li>
                        <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">→</span>Use the <strong>Glossary</strong> for unfamiliar terms.</li>
                    </ul>
                </section>

                <section className="glass rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-3">Pattern Taxonomy</h2>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h3 className="text-white font-medium mb-2">Categories</h3>
                            <ul className="space-y-1 text-gray-400">
                                <li>🕯️ <strong className="text-gray-300">Candlestick</strong> — Single candle formations</li>
                                <li>📈 <strong className="text-gray-300">Multi-Candle</strong> — 2+ candle sequences</li>
                                <li>📉 <strong className="text-gray-300">Chart Pattern</strong> — Geometric structures</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-medium mb-2">Reliability Tiers</h3>
                            <ul className="space-y-1 text-gray-400">
                                <li>🥇 <strong className="text-amber-400">Tier A</strong> — High reliability, well-documented</li>
                                <li>🥈 <strong className="text-blue-400">Tier B</strong> — Moderate reliability</li>
                                <li>🥉 <strong className="text-gray-300">Tier C</strong> — Lower reliability, needs extra confirmation</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="glass rounded-xl p-6 border border-amber-500/20">
                    <h2 className="text-xl font-semibold text-amber-400 mb-3">⚠️ Disclaimer</h2>
                    <p className="text-gray-300 leading-relaxed mb-3">
                        <strong>Stock Pattern Atlas is for educational purposes only.</strong> Nothing on this site constitutes financial advice,
                        investment advice, trading advice, or any other sort of advice.
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-3">
                        Chart patterns are heuristic tools derived from historical observation. They do not guarantee future results. Past performance
                        is not indicative of future performance. Trading stocks involves substantial risk and may not be suitable for all investors.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                        Always conduct your own research and consult with a licensed financial advisor before making any investment decisions.
                        The reliability ratings, timeframe recommendations, and all other content are educational heuristics, not guarantees.
                    </p>
                </section>

                <section className="glass rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-3">Technical Details</h2>
                    <p className="text-gray-300 leading-relaxed text-sm">
                        Built with Next.js (App Router), TypeScript, and Tailwind CSS. All pages are statically generated (SSG) for maximum speed and SEO.
                        Pattern data is stored in a single JSON source-of-truth. Chart images are generated by a Python pipeline using public OHLC data.
                        No copyrighted images are used.
                    </p>
                </section>
            </div>
        </div>
    );
}
