"""
Stock Pattern Atlas — Chart Screenshot Generation Pipeline

Generates illustrative candlestick chart images for each pattern example
defined in patterns.json.

Usage:
  pip install -r requirements.txt
  python generate-charts.py

To use real data via yfinance:
  pip install yfinance
  python generate-charts.py --real-data

Environment variables:
  ALPHA_VANTAGE_KEY — API key for Alpha Vantage data provider (optional)
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

def generate_synthetic_candles(n=30, trend='up', seed=42):
    """Generate synthetic OHLC data for illustration."""
    rng = np.random.RandomState(seed)
    prices = [100.0]
    drift = 0.3 if trend == 'up' else -0.3 if trend == 'down' else 0.0
    for _ in range(n - 1):
        prices.append(prices[-1] + drift + rng.randn() * 1.5)
    
    data = []
    for i, base in enumerate(prices):
        body = rng.uniform(0.3, 2.0)
        is_bull = rng.random() > 0.45
        if is_bull:
            o, c = base - body/2, base + body/2
        else:
            o, c = base + body/2, base - body/2
        h = max(o, c) + rng.uniform(0.1, 1.5)
        l = min(o, c) - rng.uniform(0.1, 1.5)
        v = int(rng.uniform(1e6, 5e6))
        data.append({'Open': o, 'High': h, 'Low': l, 'Close': c, 'Volume': v})
    return pd.DataFrame(data)

def plot_candlestick(df, title, filepath, figsize=(8, 4)):
    """Plot a candlestick chart and save as PNG."""
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=figsize, height_ratios=[3, 1],
                                     gridspec_kw={'hspace': 0.05})
    fig.patch.set_facecolor('#0a0f1a')
    ax1.set_facecolor('#0a0f1a')
    ax2.set_facecolor('#0a0f1a')

    for i, row in df.iterrows():
        color = '#22c55e' if row['Close'] >= row['Open'] else '#ef4444'
        ax1.plot([i, i], [row['Low'], row['High']], color=color, linewidth=0.8)
        body_bottom = min(row['Open'], row['Close'])
        body_height = abs(row['Close'] - row['Open'])
        rect = mpatches.FancyBboxPatch((i - 0.35, body_bottom), 0.7, max(body_height, 0.05),
                                        boxstyle="round,pad=0.02", facecolor=color, edgecolor=color)
        ax1.add_patch(rect)
        vcolor = '#22c55e88' if row['Close'] >= row['Open'] else '#ef444488'
        ax2.bar(i, row['Volume'], color=vcolor, width=0.7)

    ax1.set_title(title, color='white', fontsize=10, fontweight='bold', pad=10)
    ax1.set_xlim(-1, len(df))
    for ax in [ax1, ax2]:
        ax.tick_params(colors='#4b5563', labelsize=7)
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['bottom'].set_color('#1f2937')
        ax.spines['left'].set_color('#1f2937')
        ax.grid(True, alpha=0.1, color='#374151')
    ax1.set_xticklabels([])
    ax2.set_ylabel('Vol', color='#4b5563', fontsize=7)

    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    plt.savefig(filepath, dpi=150, bbox_inches='tight', facecolor='#0a0f1a')
    plt.close()

def main():
    use_real = '--real-data' in sys.argv

    with open(PATTERNS_FILE, 'r') as f:
        patterns = json.load(f)

    total = 0
    for p in patterns:
        slug = p['slug']
        bias = p.get('bias', 'Neutral')
        trend = 'up' if bias == 'Bearish' else 'down' if bias == 'Bullish' else 'flat'
        
        for j, ex in enumerate(p.get('examples', [])):
            ticker = ex.get('ticker', 'SPY')
            tf = ex.get('timeframe', '1D')
            start = ex.get('start', '')
            end = ex.get('end', '')
            
            filename = f"{ticker}_{tf}_{start}_{end}.png"
            filepath = os.path.join(OUTPUT_DIR, slug, filename)

            if use_real:
                try:
                    import yfinance as yf
                    data = yf.download(ticker, start=start, end=end, interval='1d', progress=False)
                    if not data.empty:
                        df = data[['Open','High','Low','Close','Volume']].head(30)
                        df.columns = ['Open','High','Low','Close','Volume']
                        df = df.reset_index(drop=True)
                    else:
                        df = generate_synthetic_candles(30, trend, seed=hash(slug + str(j)) % 10000)
                except Exception:
                    df = generate_synthetic_candles(30, trend, seed=hash(slug + str(j)) % 10000)
            else:
                df = generate_synthetic_candles(30, trend, seed=hash(slug + str(j)) % 10000)

            title = f"{p['name']} — {ticker} {tf}"
            plot_candlestick(df, title, filepath)
            total += 1

    print(f"Generated {total} chart images in {OUTPUT_DIR}")

if __name__ == '__main__':
    main()
