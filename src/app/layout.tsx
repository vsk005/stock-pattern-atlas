import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stock Pattern Atlas — 100 Candlestick & Chart Patterns",
  description: "A fast, searchable encyclopedia of 100 candlestick and chart patterns for stocks. Find patterns, see chart examples, and understand confirmation rules and traps.",
  openGraph: {
    title: "Stock Pattern Atlas",
    description: "The definitive encyclopedia of 100 stock chart patterns with examples, confirmation rules, and common traps.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-950 text-gray-100 font-sans antialiased min-h-screen flex flex-col">
        <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-gray-950 font-bold text-sm">SP</div>
                <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Stock Pattern Atlas</span>
              </a>
              <div className="hidden md:flex items-center gap-1">
                {[
                  { href: "/", label: "Home" },
                  { href: "/library", label: "Library" },
                  { href: "/compare", label: "Compare" },
                  { href: "/glossary", label: "Glossary" },
                  { href: "/about", label: "About" },
                ].map((link) => (
                  <a key={link.href} href={link.href} className="px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all">{link.label}</a>
                ))}
              </div>
              <div className="md:hidden">
                <details className="relative">
                  <summary className="list-none cursor-pointer p-2 rounded-lg hover:bg-gray-800/50">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                  </summary>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-xl border border-gray-800 shadow-2xl p-2">
                    {["/", "/library", "/compare", "/glossary", "/about"].map((href, i) => (
                      <a key={href} href={href} className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white">{["Home", "Library", "Compare", "Glossary", "About"][i]}</a>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-800/50 bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-xs text-gray-500 text-center max-w-2xl mx-auto">
              <strong>Disclaimer:</strong> Stock Pattern Atlas is for educational purposes only. Nothing on this site constitutes financial advice.
              Chart patterns do not guarantee outcomes. Always do your own research and consult with a qualified financial advisor before trading.
            </p>
            <p className="text-xs text-gray-600 text-center mt-4">© 2024 Stock Pattern Atlas. All chart images are generated from public data.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
