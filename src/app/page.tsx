import Link from 'next/link';
import patterns from '@/data/patterns.json';

const stats = [
  { label: 'Total Patterns', value: patterns.length, icon: '📊' },
  { label: 'Candlestick', value: patterns.filter((p: any) => p.category === 'Candlestick').length, icon: '🕯️' },
  { label: 'Multi-Candle', value: patterns.filter((p: any) => p.category === 'Multi-Candle').length, icon: '📈' },
  { label: 'Chart Patterns', value: patterns.filter((p: any) => p.category === 'Chart Pattern').length, icon: '📉' },
];

const categories = [
  { name: 'Bullish Reversals', desc: 'Patterns signaling potential bottoms', filter: 'Bullish&context=Trend+Reversal', gradient: 'from-emerald-500/20 to-emerald-900/20', border: 'border-emerald-500/30', icon: '🟢' },
  { name: 'Bearish Reversals', desc: 'Patterns signaling potential tops', filter: 'Bearish&context=Trend+Reversal', gradient: 'from-red-500/20 to-red-900/20', border: 'border-red-500/30', icon: '🔴' },
  { name: 'Continuations', desc: 'Patterns confirming trend continuation', filter: '&context=Trend+Continuation', gradient: 'from-blue-500/20 to-blue-900/20', border: 'border-blue-500/30', icon: '🔵' },
  { name: 'Chart Patterns', desc: 'Geometric formations on the chart', filter: '&category=Chart+Pattern', gradient: 'from-purple-500/20 to-purple-900/20', border: 'border-purple-500/30', icon: '🟣' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-gray-950 to-cyan-900/20" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(52,211,153,0.08) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(6,182,212,0.08) 0%, transparent 50%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-emerald-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {patterns.length} Patterns Documented
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">Stock Pattern</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Atlas</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 mb-8 leading-relaxed">
              The definitive encyclopedia of candlestick and chart patterns for stocks.
              <br className="hidden sm:block" /> Find patterns · See examples · Master confirmation rules.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/library" className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-gray-950 font-semibold hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/25">
                Browse All Patterns →
              </Link>
              <Link href="/compare" className="px-6 py-3 rounded-xl glass text-gray-300 font-medium hover:text-white hover:border-gray-600 transition-all">
                Compare Patterns
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-xl p-4 text-center card-hover">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-2xl font-bold text-white mb-2">Browse by Category</h2>
        <p className="text-gray-400 mb-8">Explore patterns organized by their market signal.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link key={c.name} href={`/library?bias=${c.filter}`} className={`rounded-xl p-6 bg-gradient-to-br ${c.gradient} border ${c.border} card-hover block`}>
              <div className="text-3xl mb-3">{c.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-1">{c.name}</h3>
              <p className="text-sm text-gray-400">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Patterns */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-bold text-white mb-2">Most Reliable Patterns</h2>
        <p className="text-gray-400 mb-8">Top-tier (A-rated) patterns every trader should know.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {patterns.filter((p: any) => p.reliability === 'A').slice(0, 6).map((p: any) => (
            <Link key={p.slug} href={`/patterns/${p.slug}`} className="glass rounded-xl p-5 card-hover block group">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${p.bias === 'Bullish' ? 'bg-emerald-500/20 text-emerald-400' : p.bias === 'Bearish' ? 'bg-red-500/20 text-red-400' : 'bg-gray-600/20 text-gray-400'}`}>{p.bias}</span>
                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-amber-500/20 text-amber-400">Tier A</span>
                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-700/50 text-gray-400">{p.category}</span>
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors mb-1">{p.name}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">{p.short_description}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/library" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">View all {patterns.length} patterns →</Link>
        </div>
      </section>
    </div>
  );
}
