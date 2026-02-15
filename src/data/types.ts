export type Category = 'Candlestick' | 'Multi-Candle' | 'Chart Pattern';
export type Bias = 'Bullish' | 'Bearish' | 'Neutral';
export type Context = 'Trend Reversal' | 'Trend Continuation' | 'Range Behavior';
export type Reliability = 'A' | 'B' | 'C';
export type Timeframe = '1D' | '4H' | '1H' | '15m';

export interface PatternExample {
  ticker: string;
  timeframe: Timeframe;
  start: string;
  end: string;
  caption: string;
  image: string;
}

export interface TimeframeRanking {
  timeframe: Timeframe;
  rank: number;
  rationale: string;
}

export interface Pattern {
  name: string;
  slug: string;
  category: Category;
  bias: Bias;
  context: Context;
  reliability: Reliability;
  short_description: string;
  definition: string;
  anatomy: string;
  confirmation_rules: string[];
  invalidation_rules: string[];
  best_timeframes: TimeframeRanking[];
  best_context: string;
  quick_checklist: string[];
  common_traps: string[];
  examples: PatternExample[];
  related_patterns: string[];
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}
