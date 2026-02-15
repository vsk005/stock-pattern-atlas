# Screenshot Generation Pipeline

## Quick Start

```bash
cd scripts
pip install -r requirements.txt
python generate-charts.py
```

## Using Real Market Data

```bash
pip install yfinance
python generate-charts.py --real-data
```

## How to Add a Pattern

1. Add the pattern object to `src/data/patterns.json` with all required fields
2. Include 3-6 entries in the `examples` array with ticker, timeframe, start/end dates
3. Run `python scripts/generate-charts.py` to generate chart images
4. Images are saved to `public/examples/{slug}/`

## How to Add New Examples

1. Edit the pattern in `patterns.json` and add entries to the `examples` array
2. Each example needs: `ticker`, `timeframe`, `start`, `end`, `caption`
3. Re-run the script to generate new images

## Switching Data Providers

By default, the script generates synthetic/illustrative charts. To use real data:

- **yfinance** (free): `pip install yfinance` then `python generate-charts.py --real-data`
- **Alpha Vantage**: Set `ALPHA_VANTAGE_KEY` env var and modify the script's data fetch section
- **Custom CSV**: Place OHLC CSV files in `scripts/data/` and modify the data loading section

## Image Naming Convention

```
public/examples/{slug}/{TICKER}_{TIMEFRAME}_{START}_{END}.png
```

Example: `public/examples/hammer/AAPL_1D_2024-01-15_2024-02-15.png`
