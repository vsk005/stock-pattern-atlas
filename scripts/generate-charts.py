"""
Stock Pattern Atlas — Chart Screenshot Generation Pipeline

Generates illustrative candlestick chart images for each pattern example
defined in patterns.json. Contains specific logic to render realistic
shapes for known patterns:
1. Candlestick Patterns (1-3 bars) like Doji, Hammer.
2. Geometric Chart Patterns (20-30 bars) like Double Bottom, H&S.

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

# --- Helper Logic ---
def make_candle_from_target(target, prev_close, rng, volatility=0.5):
    """Generates OHLVC to roughly match a target price trend."""
    # If target is far from prev_close, big body.
    # If target is close, small body.
    
    delta = target - prev_close
    is_bull = delta > 0
    
    # Body size roughly correlated to delta, but with noise
    body = abs(delta) + rng.uniform(-0.2, 0.2)
    body = max(0.1, body) # Min body size
    
    if is_bull:
        o = prev_close
        c = o + body
    else:
        o = prev_close
        c = o - body
        
    # Shadows
    h = max(o, c) + rng.uniform(0, volatility)
    l = min(o, c) - rng.uniform(0, volatility)
    
    return {'Open': o, 'High': h, 'Low': l, 'Close': c}

# --- Geometric Pattern Logic ---

def generate_geometric_series(slug, n=30, rng=None):
    """
    Generates a price series following a geometric shape (W, M, Head&Shoulders).
    Returns list of close prices.
    """
    if rng is None: rng = np.random.RandomState(42)
    
    x = np.linspace(0, n-1, n)
    key_x = []
    key_y = []
    
    # Define shapes normalized to roughly 0-10 range relative to start
    start_p = 100
    
    if 'double-bottom' in slug:
        # Down, Low1, Up, Low2, Up
        key_x = [0, n*0.2, n*0.4, n*0.6, n*0.8, n-1]
        key_y = [105, 95, 102, 95, 108, 110]
    
    elif 'double-top' in slug:
        # Up, High1, Down, High2, Down
        key_x = [0, n*0.2, n*0.4, n*0.6, n*0.8, n-1]
        key_y = [95, 105, 98, 105, 92, 90]
        
    elif 'triple-bottom' in slug:
        key_x = [0, n*0.15, n*0.3, n*0.45, n*0.6, n*0.75, n-1]
        key_y = [105, 95, 102, 95, 102, 95, 108]
        
    elif 'triple-top' in slug:
        key_x = [0, n*0.15, n*0.3, n*0.45, n*0.6, n*0.75, n-1]
        key_y = [95, 105, 98, 105, 98, 105, 90]
        
    elif 'inverse-head-and-shoulders' in slug:
        # Shoulder, Head (lower), Shoulder, Up
        key_x = [0, n*0.2, n*0.35, n*0.5, n*0.65, n*0.8, n-1]
        key_y = [105, 98, 102, 92, 102, 98, 110]
        
    elif 'head-and-shoulders' in slug:
        # Shoulder, Head (higher), Shoulder, Down
        key_x = [0, n*0.2, n*0.35, n*0.5, n*0.65, n*0.8, n-1]
        key_y = [95, 102, 98, 108, 98, 102, 90]
        
    elif 'bullish-flag' in slug or 'bullish-pennant' in slug:
        # Pole Up, consolidation down, break up
        key_x = [0, n*0.3, n*0.7, n-1]
        key_y = [90, 105, 102, 110]
        
    elif 'bearish-flag' in slug or 'bearish-pennant' in slug:
        # Pole Down, consolidation up, break down
        key_x = [0, n*0.3, n*0.7, n-1]
        key_y = [110, 95, 98, 88]
        
    elif 'ascending-triangle' in slug:
        # Flat top, higher lows
        key_x = [0, n*0.2, n*0.4, n*0.6, n*0.8, n-1]
        key_y = [95, 105, 98, 105, 102, 110] # Breakout up
        
    elif 'descending-triangle' in slug:
        # Flat bottom, lower highs
        key_x = [0, n*0.2, n*0.4, n*0.6, n*0.8, n-1]
        key_y = [105, 95, 102, 95, 98, 90] # Breakout down
        
    elif 'symmetrical-triangle' in slug:
        # Coiling
        key_x = [0, n*0.2, n*0.4, n*0.6, n*0.8, n-1]
        key_y = [95, 105, 98, 102, 100, 108] # Breakout usually continuation
        
    elif 'cup-and-handle' in slug:
        # U shape then small dip
        key_x = [0, n*0.2, n*0.5, n*0.8, n*0.9, n-1]
        key_y = [105, 95, 92, 105, 102, 108]
        
    elif 'rounded-bottom' in slug or 'saucer' in slug:
        # Gentle curve
        t = np.linspace(-1, 1, n)
        curve = t**2 * 10
        base = 100
        return base + curve # Parabola

    elif 'rounded-top' in slug:
         t = np.linspace(-1, 1, n)
         curve = -(t**2 * 10)
         base = 100
         return base + curve

    elif 'wedge' in slug:
        if 'rising' in slug:
            # Highs increasing, lows increasing faster (narrowing)
             key_x = [0, n-1]
             key_y = [95, 110] # General trend up but breakdown usually
        else: # falling
             key_x = [0, n-1]
             key_y = [105, 90]

    else:
        return None

    if not key_x: return None
    
    # Interpolate
    return np.interp(x, key_x, key_y)


# --- Pattern Injection Logic (from previous step) ---
def make_candle(prev_close, moves, rng):
    """Construct a single candle based on specs."""
    gap = moves.get('gap', 0)
    body = moves.get('body', 1.0)
    wu = moves.get('wick_upper', 0.2)
    wl = moves.get('wick_lower', 0.2)
    color = moves.get('color', 'bull') # bull or bear or doji

    open_p = prev_close + gap
    if color == 'bull': close_p = open_p + body
    elif color == 'bear': close_p = open_p - body
    else: close_p = open_p # doji
    
    high_p = max(open_p, close_p) + wu
    low_p = min(open_p, close_p) - wl
    # Add noise
    high_p += rng.uniform(0, 0.1)
    low_p -= rng.uniform(0, 0.1)
    
    return {'Open': open_p, 'High': high_p, 'Low': low_p, 'Close': close_p}

def apply_micro_pattern(df, slug, rng):
    """
    Modifies the last N rows of df to match the candlestick pattern.
    Only for non-geometric patterns.
    """
    bull = {'color': 'bull', 'body': 1.5}
    bear = {'color': 'bear', 'body': 1.5}
    small_bull = {'color': 'bull', 'body': 0.5}
    small_bear = {'color': 'bear', 'body': 0.5}
    doji = {'color': 'doji', 'body': 0.05, 'wick_upper': 0.5, 'wick_lower': 0.5}
    hammer = {'color': 'bear', 'body': 0.3, 'wick_lower': 1.5, 'wick_upper': 0.1}
    inv_hammer = {'color': 'bear', 'body': 0.3, 'wick_lower': 0.1, 'wick_upper': 1.5}
    
    chart_pat = []
    
    if 'abandoned-baby' in slug:
        if 'bullish' in slug: chart_pat = [bear, {'gap': -1.5, **doji}, {'gap': 1.5, **bull}]
        else: chart_pat = [bull, {'gap': 1.5, **doji}, {'gap': -1.5, **bear}]
    elif 'morning-star' in slug: chart_pat = [bear, {'gap': -0.5, **small_bull}, {'gap': 0.2, **bull}]
    elif 'evening-star' in slug: chart_pat = [bull, {'gap': 0.5, **small_bull}, {'gap': -0.2, **bear}]
    elif 'engulfing' in slug:
        if 'bullish' in slug: chart_pat = [small_bear, {'gap': -0.2, 'body': 2.0, 'color': 'bull'}]
        else: chart_pat = [small_bull, {'gap': 0.2, 'body': 2.0, 'color': 'bear'}]
    elif 'harami' in slug:
         if 'bullish' in slug: chart_pat = [bear, {'gap': 0.5, 'body': 0.5, 'color': 'bull'}]
         else: chart_pat = [bull, {'gap': -0.5, 'body': 0.5, 'color': 'bear'}]
    elif 'three-white-soldiers' in slug: chart_pat = [{'gap': -0.1, **bull}, {'gap': -0.1, **bull}, {'gap': -0.1, **bull}]
    elif 'three-black-crows' in slug: chart_pat = [{'gap': 0.1, **bear}, {'gap': 0.1, **bear}, {'gap': 0.1, **bear}]
    elif 'hammer' in slug:
        if 'inverted' in slug: chart_pat = [{'gap': -0.5, **inv_hammer}]
        else: chart_pat = [{'gap': -0.5, **hammer}]
    elif 'shooting-star' in slug: chart_pat = [{'gap': 0.5, 'color': 'bear', 'body': 0.3, 'wick_upper': 1.5, 'wick_lower': 0.1}]
    elif 'hanging-man' in slug: chart_pat = [{'gap': 0.5, 'color': 'bear', 'body': 0.3, 'wick_lower': 1.5, 'wick_upper': 0.1}]
    elif 'doji' in slug:
        if 'dragonfly' in slug: chart_pat = [{'gap': 0, 'color': 'doji', 'body': 0, 'wick_lower': 1.5, 'wick_upper': 0.0}]
        elif 'gravestone' in slug: chart_pat = [{'gap': 0, 'color': 'doji', 'body': 0, 'wick_lower': 0.0, 'wick_upper': 1.5}]
        else: chart_pat = [{'gap': 0, **doji}]
    elif 'marubozu' in slug:
        m_bull = {'color': 'bull', 'body': 2.0, 'wick_upper': 0, 'wick_lower': 0}
        m_bear = {'color': 'bear', 'body': 2.0, 'wick_upper': 0, 'wick_lower': 0}
        if 'bullish' in slug or 'white' in slug: chart_pat = [m_bull]
        else: chart_pat = [m_bear]

    if chart_pat:
        n = len(chart_pat)
        df = df.iloc[:-n].copy()
        curr = df.iloc[-1]['Close']
        new_rows = []
        for move in chart_pat:
            c_data = make_candle(curr, move, rng)
            c_data['Volume'] = int(rng.uniform(1e6, 5e6))
            new_rows.append(c_data)
            curr = c_data['Close']
        df = pd.concat([df, pd.DataFrame(new_rows)], ignore_index=True)
    return df

def generate_candles(slug, n=30, trend='up', seed=42):
    """Main generation logic dispatching to geometric or micro patterns."""
    rng = np.random.RandomState(seed)
    
    # 1. Check for Geometric Pattern
    geo_series = generate_geometric_series(slug, n, rng)
    
    if geo_series is not None:
        # Construct candles around the geometric mean path
        data = []
        prev_close = geo_series[0]
        for i, target in enumerate(geo_series):
            # Previous close is best guess, target is where we want to ends
            if i == 0: 
                c_data = {'Open': target-0.5, 'High': target+0.5, 'Low': target-0.5, 'Close': target}
            else:
                c_data = make_candle_from_target(target, prev_close, rng, volatility=0.6)
            
            c_data['Volume'] = int(rng.uniform(1e6, 5e6))
            data.append(c_data)
            prev_close = c_data['Close']
        return pd.DataFrame(data)
        
    else:
        # 2. Fallback to Random Walk + Micro Pattern Injection
        prices = [100.0]
        drift = 0.3 if trend == 'up' else -0.3 if trend == 'down' else 0.0
        for _ in range(n - 1):
            prices.append(prices[-1] + drift + rng.randn() * 1.0)
        
        data = []
        for base in prices:
            body = rng.uniform(0.3, 1.5)
            is_bull = rng.random() > 0.45
            if is_bull: o, c = base - body/2, base + body/2
            else: o, c = base + body/2, base - body/2
            h = max(o, c) + rng.uniform(0.1, 0.8)
            l = min(o, c) - rng.uniform(0.1, 0.8)
            v = int(rng.uniform(1e6, 5e6))
            data.append({'Open': o, 'High': h, 'Low': l, 'Close': c, 'Volume': v})
        
        df = pd.DataFrame(data)
        # Inject candlestick pattern at end if applicable
        df = apply_micro_pattern(df, slug, rng)
        return df

def plot_candlestick(df, title, filepath, figsize=(8, 4)):
    """Plot a candlestick chart and save as SVG."""
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=figsize, height_ratios=[3, 1], gridspec_kw={'hspace': 0.05})
    bg_color = '#0a0f1a'
    fig.patch.set_facecolor(bg_color)
    ax1.set_facecolor(bg_color)
    ax2.set_facecolor(bg_color)

    for i, row in df.iterrows():
        color = '#22c55e' if row['Close'] >= row['Open'] else '#ef4444'
        ax1.plot([i, i], [row['Low'], row['High']], color=color, linewidth=1.5)
        body_bottom = min(row['Open'], row['Close'])
        body_height = abs(row['Close'] - row['Open'])
        if body_height < 0.05: body_height = 0.05
        rect = mpatches.FancyBboxPatch((i - 0.35, body_bottom), 0.7, body_height,
                                        boxstyle="round,pad=0.02", facecolor=color, edgecolor=color)
        ax1.add_patch(rect)
        vcolor = '#22c55e44' if row['Close'] >= row['Open'] else '#ef444444'
        ax2.bar(i, row['Volume'], color=vcolor, width=0.7)

    ax1.set_title(title, color='white', fontsize=12, fontweight='bold', pad=15)
    ax1.set_xlim(-1, len(df))
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
    with open(PATTERNS_FILE, 'r') as f:
        patterns = json.load(f)

    total = 0
    # Global seed for consistency
    rng = np.random.RandomState(42) 
    
    for p in patterns:
        slug = p['slug']
        bias = p.get('bias', 'Neutral')
        trend = 'up' if bias == 'Bearish' else 'down' if bias == 'Bullish' else 'flat'
        
        for j, ex in enumerate(p.get('examples', [])):
            ticker = ex.get('ticker', 'SPY')
            tf = ex.get('timeframe', '1D')
            start = ex.get('start', '')
            end = ex.get('end', '')
            
            filename = f"{ticker}_{tf}_{start}_{end}.svg"
            filepath = os.path.join(OUTPUT_DIR, slug, filename)

            # Generate Data
            # Note: We don't use the 'trend' param for geometric patterns as they define their own trend
            # But we pass it for fallback
            
            # Unique seed per chart
            chart_seed = hash(slug + str(j)) % 10000
            df = generate_candles(slug, n=30, trend=trend, seed=chart_seed)

            title = f"{p['name']} — {ticker} {tf}"
            plot_candlestick(df, title, filepath)
            total += 1

    print(f"Generated {total} charts in {OUTPUT_DIR}")

if __name__ == '__main__':
    main()
