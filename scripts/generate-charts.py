"""
Stock Pattern Atlas — Chart Screenshot Generation Pipeline

Generates illustrative candlestick chart images for each pattern example
defined in patterns.json. Contains specific logic to render realistic
shapes for known patterns (Doji, Hammer, Engulfing, etc).

Usage:
  pip install -r requirements.txt
  python scripts/generate-charts.py
"""

import json
import os
import sys
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
PATTERNS_FILE = os.path.join(PROJECT_DIR, 'src', 'data', 'patterns.json')
OUTPUT_DIR = os.path.join(PROJECT_DIR, 'public', 'examples')

# --- Pattern Generation Logic ---

def make_candle(prev_close, moves, rng):
    """
    Construct a single candle based on specs.
    moves: dict with 'gap', 'body', 'wick_upper', 'wick_lower', 'color'
    """
    gap = moves.get('gap', 0)
    body = moves.get('body', 1.0)
    wu = moves.get('wick_upper', 0.2)
    wl = moves.get('wick_lower', 0.2)
    color = moves.get('color', 'bull') # bull or bear or doji

    open_p = prev_close + gap
    
    if color == 'bull':
        close_p = open_p + body
    elif color == 'bear':
        close_p = open_p - body
    else: # doji
        close_p = open_p # Flat body
    
    high_p = max(open_p, close_p) + wu
    low_p = min(open_p, close_p) - wl
    
    # Add some noise
    high_p += rng.uniform(0, 0.1)
    low_p -= rng.uniform(0, 0.1)
    
    return {'Open': open_p, 'High': high_p, 'Low': low_p, 'Close': close_p}

def apply_pattern(df, slug, rng):
    """
    Modifies the last N rows of df to match the pattern slug.
    Returns modified df.
    """
    last_close = df.iloc[-5]['Close']
    
    # Define primitives
    bull = {'color': 'bull', 'body': 1.5}
    bear = {'color': 'bear', 'body': 1.5}
    small_bull = {'color': 'bull', 'body': 0.5}
    small_bear = {'color': 'bear', 'body': 0.5}
    doji = {'color': 'doji', 'body': 0.05, 'wick_upper': 0.5, 'wick_lower': 0.5}
    hammer = {'color': 'bear', 'body': 0.3, 'wick_lower': 1.5, 'wick_upper': 0.1}
    inv_hammer = {'color': 'bear', 'body': 0.3, 'wick_lower': 0.1, 'wick_upper': 1.5}
    
    # Specific sequences based on slug keywords
    chart_pat = []
    
    # Reversal / Special Patterns
    if 'abandoned-baby' in slug:
        if 'bullish' in slug:
            # Bearish candle, Gap Down Doji, Gap Up Bullish
            chart_pat = [bear, {'gap': -1.5, **doji}, {'gap': 1.5, **bull}]
        else:
            # Bullish candle, Gap Up Doji, Gap Down Bearish
            chart_pat = [bull, {'gap': 1.5, **doji}, {'gap': -1.5, **bear}]
            
    elif 'morning-star' in slug:
        # Long Bear, Gap Down Small Bull/Doji, Bullish
        chart_pat = [bear, {'gap': -0.5, **small_bull}, {'gap': 0.2, **bull}]
        
    elif 'evening-star' in slug:
        # Long Bull, Gap Up Small/Doji, Bearish
        chart_pat = [bull, {'gap': 0.5, **small_bull}, {'gap': -0.2, **bear}]
    
    elif 'engulfing' in slug:
        if 'bullish' in slug:
            # Small Bear, Big Bull engulfing it
            # To engulf, Open must be lower than prev Close, Close higher than prev Open
            chart_pat = [small_bear, {'gap': -0.2, 'body': 2.0, 'color': 'bull'}]
        else: # bearish
            chart_pat = [small_bull, {'gap': 0.2, 'body': 2.0, 'color': 'bear'}]
            
    elif 'harami' in slug:
        if 'bullish' in slug:
            # Big Bear, Small Bull inside
            chart_pat = [bear, {'gap': 0.5, 'body': 0.5, 'color': 'bull'}] # Gap ignores strict inside logic here relative to Open, but visual is close
        else:
            chart_pat = [bull, {'gap': -0.5, 'body': 0.5, 'color': 'bear'}]

    elif 'three-white-soldiers' in slug:
        chart_pat = [{'gap': -0.1, **bull}, {'gap': -0.1, **bull}, {'gap': -0.1, **bull}]
        
    elif 'three-black-crows' in slug:
        chart_pat = [{'gap': 0.1, **bear}, {'gap': 0.1, **bear}, {'gap': 0.1, **bear}]
        
    elif 'hammer' in slug:
        if 'inverted' in slug:
             chart_pat = [{'gap': -0.5, **inv_hammer}]
        else:
             chart_pat = [{'gap': -0.5, **hammer}]

    elif 'shooting-star' in slug:
        chart_pat = [{'gap': 0.5, 'color': 'bear', 'body': 0.3, 'wick_upper': 1.5, 'wick_lower': 0.1}]
        
    elif 'hanging-man' in slug:
        chart_pat = [{'gap': 0.5, 'color': 'bear', 'body': 0.3, 'wick_lower': 1.5, 'wick_upper': 0.1}]
        
    elif 'doji' in slug:
        if 'dragonfly' in slug:
             chart_pat = [{'gap': 0, 'color': 'doji', 'body': 0, 'wick_lower': 1.5, 'wick_upper': 0.0}]
        elif 'gravestone' in slug:
             chart_pat = [{'gap': 0, 'color': 'doji', 'body': 0, 'wick_lower': 0.0, 'wick_upper': 1.5}]
        else:
             chart_pat = [{'gap': 0, **doji}]

    elif 'marubozu' in slug:
        m_bull = {'color': 'bull', 'body': 2.0, 'wick_upper': 0, 'wick_lower': 0}
        m_bear = {'color': 'bear', 'body': 2.0, 'wick_upper': 0, 'wick_lower': 0}
        if 'bullish' in slug or 'white' in slug:
            chart_pat = [m_bull]
        else:
            chart_pat = [m_bear]

    else:
        # Default fallback: Just ensure trend direction matches bias slightly
        pass

    # Apply the pattern to the end of the dataframe
    if chart_pat:
        # Remove last N rows
        n = len(chart_pat)
        df = df.iloc[:-n].copy()
        
        # Start from last close
        curr = df.iloc[-1]['Close']
        
        new_rows = []
        for move in chart_pat:
            c_data = make_candle(curr, move, rng)
            c_data['Volume'] = int(rng.uniform(1e6, 5e6))
            new_rows.append(c_data)
            curr = c_data['Close']
            
        df = pd.concat([df, pd.DataFrame(new_rows)], ignore_index=True)
        
    return df

def generate_synthetic_candles(n=30, trend='up', seed=42):
    """Generate synthetic OHLC data for illustration."""
    rng = np.random.RandomState(seed)
    prices = [100.0]
    drift = 0.3 if trend == 'up' else -0.3 if trend == 'down' else 0.0
    for _ in range(n - 1):
        prices.append(prices[-1] + drift + rng.randn() * 1.0)
    
    data = []
    for i, base in enumerate(prices):
        body = rng.uniform(0.3, 1.5)
        is_bull = rng.random() > 0.45
        if is_bull:
            o, c = base - body/2, base + body/2
        else:
            o, c = base + body/2, base - body/2
        h = max(o, c) + rng.uniform(0.1, 0.8)
        l = min(o, c) - rng.uniform(0.1, 0.8)
        v = int(rng.uniform(1e6, 5e6))
        data.append({'Open': o, 'High': h, 'Low': l, 'Close': c, 'Volume': v})
    return pd.DataFrame(data)

def plot_candlestick(df, title, filepath, figsize=(8, 4)):
    """Plot a candlestick chart and save as SVG."""
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=figsize, height_ratios=[3, 1],
                                     gridspec_kw={'hspace': 0.05})
    # Cyberpunk style
    bg_color = '#0a0f1a'
    fig.patch.set_facecolor(bg_color)
    ax1.set_facecolor(bg_color)
    ax2.set_facecolor(bg_color)

    for i, row in df.iterrows():
        color = '#22c55e' if row['Close'] >= row['Open'] else '#ef4444'
        # Wick
        ax1.plot([i, i], [row['Low'], row['High']], color=color, linewidth=1.5) # Thicker wicks for visibility
        # Body
        body_bottom = min(row['Open'], row['Close'])
        body_height = abs(row['Close'] - row['Open'])
        # Add min height for doji visibility
        if body_height < 0.05: body_height = 0.05
        
        rect = mpatches.FancyBboxPatch((i - 0.35, body_bottom), 0.7, body_height,
                                        boxstyle="round,pad=0.02", facecolor=color, edgecolor=color)
        ax1.add_patch(rect)
        
        # Volume
        vcolor = '#22c55e44' if row['Close'] >= row['Open'] else '#ef444444'
        ax2.bar(i, row['Volume'], color=vcolor, width=0.7)

    ax1.set_title(title, color='white', fontsize=12, fontweight='bold', pad=15)
    ax1.set_xlim(-1, len(df))
    
    # Auto-scale y-axis with some padding
    all_prices = pd.concat([df['Low'], df['High']])
    y_min, y_max = all_prices.min(), all_prices.max()
    margin = (y_max - y_min) * 0.1
    ax1.set_ylim(y_min - margin, y_max + margin)

    for ax in [ax1, ax2]:
        ax.tick_params(colors='#9ca3af', labelsize=8)
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['bottom'].set_color('#1f2937')
        ax.spines['left'].set_color('#1f2937')
        ax.grid(True, alpha=0.1, color='#374151', linestyle='--')
        
    ax1.set_xticklabels([])
    ax2.set_ylabel('Vol', color='#9ca3af', fontsize=8)

    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    plt.savefig(filepath, format='svg', bbox_inches='tight', facecolor=bg_color)
    plt.close()

def main():
    use_real = '--real-data' in sys.argv

    with open(PATTERNS_FILE, 'r') as f:
        patterns = json.load(f)

    total = 0
    rng = np.random.RandomState(42) # Global seed for consistency
    
    for p in patterns:
        slug = p['slug']
        # Determine trend for background
        bias = p.get('bias', 'Neutral')
        trend = 'up' if bias == 'Bearish' else 'down' if bias == 'Bullish' else 'flat'
        
        for j, ex in enumerate(p.get('examples', [])):
            ticker = ex.get('ticker', 'SPY')
            tf = ex.get('timeframe', '1D')
            start = ex.get('start', '')
            end = ex.get('end', '')
            
            filename = f"{ticker}_{tf}_{start}_{end}.svg"
            filepath = os.path.join(OUTPUT_DIR, slug, filename)

            # Generate base data
            df = generate_synthetic_candles(30, trend, seed=hash(slug + str(j)) % 10000)
            
            # Inject Pattern Logic
            # We pass a specific RNG for pattern details to vary slightly per example
            pat_rng = np.random.RandomState(hash(filepath) % 10000)
            df = apply_pattern(df, slug, pat_rng)

            title = f"{p['name']} — {ticker} {tf}"
            plot_candlestick(df, title, filepath)
            total += 1

    print(f"Generated {total} pattern-specific chart images in {OUTPUT_DIR}")

if __name__ == '__main__':
    main()
