const fs = require('fs');
const path = require('path');

const cats = { C: 'Candlestick', M: 'Multi-Candle', P: 'Chart Pattern' };
const biases = { Bu: 'Bullish', Be: 'Bearish', N: 'Neutral' };
const contexts = { R: 'Trend Reversal', Co: 'Trend Continuation', Ra: 'Range Behavior' };

// [name, slug, cat, bias, context, reliability, short_desc]
const defs = [
    ["Hammer", "hammer", "C", "Bu", "R", "A", "Single candle with small body and long lower shadow signaling bottom reversal"],
    ["Inverted Hammer", "inverted-hammer", "C", "Bu", "R", "B", "Single candle with long upper shadow at bottom, hinting bullish reversal"],
    ["Shooting Star", "shooting-star", "C", "Be", "R", "A", "Single candle with long upper shadow at top, signaling bearish reversal"],
    ["Hanging Man", "hanging-man", "C", "Be", "R", "B", "Hammer shape after uptrend warning of bearish reversal"],
    ["Doji", "doji", "C", "N", "R", "B", "Open equals close showing market indecision"],
    ["Dragonfly Doji", "dragonfly-doji", "C", "Bu", "R", "B", "Doji with long lower shadow showing bullish rejection"],
    ["Gravestone Doji", "gravestone-doji", "C", "Be", "R", "B", "Doji with long upper shadow showing bearish rejection"],
    ["Long-Legged Doji", "long-legged-doji", "C", "N", "R", "C", "Doji with long shadows on both sides showing extreme indecision"],
    ["Spinning Top", "spinning-top", "C", "N", "R", "C", "Small body with moderate shadows showing indecision"],
    ["Marubozu (Bullish)", "bullish-marubozu", "C", "Bu", "Co", "A", "Full bullish body with no shadows showing buyer dominance"],
    ["Marubozu (Bearish)", "bearish-marubozu", "C", "Be", "Co", "A", "Full bearish body with no shadows showing seller dominance"],
    ["Belt Hold (Bullish)", "bullish-belt-hold", "C", "Bu", "R", "C", "Long bullish candle opening at low after downtrend"],
    ["Belt Hold (Bearish)", "bearish-belt-hold", "C", "Be", "R", "C", "Long bearish candle opening at high after uptrend"],
    ["High Wave Candle", "high-wave-candle", "C", "N", "R", "C", "Very long shadows with small body showing extreme volatility"],
    ["Rickshaw Man", "rickshaw-man", "C", "N", "R", "C", "Long-legged doji with body exactly centered"],
    ["Bullish Engulfing", "bullish-engulfing", "M", "Bu", "R", "A", "Second bullish candle completely engulfs prior bearish candle"],
    ["Bearish Engulfing", "bearish-engulfing", "M", "Be", "R", "A", "Second bearish candle completely engulfs prior bullish candle"],
    ["Bullish Harami", "bullish-harami", "M", "Bu", "R", "B", "Small bullish candle contained within prior large bearish candle"],
    ["Bearish Harami", "bearish-harami", "M", "Be", "R", "B", "Small bearish candle contained within prior large bullish candle"],
    ["Harami Cross (Bullish)", "bullish-harami-cross", "M", "Bu", "R", "B", "Doji contained within prior bearish candle body"],
    ["Harami Cross (Bearish)", "bearish-harami-cross", "M", "Be", "R", "B", "Doji contained within prior bullish candle body"],
    ["Tweezer Tops", "tweezer-tops", "M", "Be", "R", "B", "Two candles with matching highs at resistance"],
    ["Tweezer Bottoms", "tweezer-bottoms", "M", "Bu", "R", "B", "Two candles with matching lows at support"],
    ["Piercing Line", "piercing-line", "M", "Bu", "R", "A", "Bullish candle opens below prior low and closes above midpoint"],
    ["Dark Cloud Cover", "dark-cloud-cover", "M", "Be", "R", "A", "Bearish candle opens above prior high and closes below midpoint"],
    ["Bullish Counterattack", "bullish-counterattack", "M", "Bu", "R", "C", "Bullish candle closes at same level as prior bearish close"],
    ["Bearish Counterattack", "bearish-counterattack", "M", "Be", "R", "C", "Bearish candle closes at same level as prior bullish close"],
    ["On-Neck Line", "on-neck-line", "M", "Be", "Co", "C", "Bearish continuation where second candle closes at prior low"],
    ["In-Neck Line", "in-neck-line", "M", "Be", "Co", "C", "Similar to on-neck but second candle closes slightly into prior body"],
    ["Thrusting Pattern", "thrusting-pattern", "M", "Be", "Co", "C", "Second candle pushes into prior body but fails at midpoint"],
    ["Morning Star", "morning-star", "M", "Bu", "R", "A", "Three-candle bullish reversal with small middle candle"],
    ["Evening Star", "evening-star", "M", "Be", "R", "A", "Three-candle bearish reversal with small middle candle"],
    ["Morning Doji Star", "morning-doji-star", "M", "Bu", "R", "A", "Morning star variant with doji as middle candle"],
    ["Evening Doji Star", "evening-doji-star", "M", "Be", "R", "A", "Evening star variant with doji as middle candle"],
    ["Three White Soldiers", "three-white-soldiers", "M", "Bu", "Co", "A", "Three consecutive long bullish candles with higher closes"],
    ["Three Black Crows", "three-black-crows", "M", "Be", "Co", "A", "Three consecutive long bearish candles with lower closes"],
    ["Three Inside Up", "three-inside-up", "M", "Bu", "R", "B", "Harami pattern confirmed by third bullish candle"],
    ["Three Inside Down", "three-inside-down", "M", "Be", "R", "B", "Harami pattern confirmed by third bearish candle"],
    ["Three Outside Up", "three-outside-up", "M", "Bu", "R", "B", "Engulfing pattern confirmed by third bullish candle"],
    ["Three Outside Down", "three-outside-down", "M", "Be", "R", "B", "Engulfing pattern confirmed by third bearish candle"],
    ["Rising Three Methods", "rising-three-methods", "M", "Bu", "Co", "A", "Bullish continuation with three small candles in a pullback"],
    ["Falling Three Methods", "falling-three-methods", "M", "Be", "Co", "A", "Bearish continuation with three small candles in a rally"],
    ["Abandoned Baby (Bullish)", "bullish-abandoned-baby", "M", "Bu", "R", "A", "Rare bullish reversal with gapped doji between bearish and bullish candles"],
    ["Abandoned Baby (Bearish)", "bearish-abandoned-baby", "M", "Be", "R", "A", "Rare bearish reversal with gapped doji between bullish and bearish candles"],
    ["Tri-Star (Bullish)", "bullish-tri-star", "M", "Bu", "R", "B", "Three dojis with middle doji gapping down"],
    ["Tri-Star (Bearish)", "bearish-tri-star", "M", "Be", "R", "B", "Three dojis with middle doji gapping up"],
    ["Upside Tasuki Gap", "upside-tasuki-gap", "M", "Bu", "Co", "C", "Bullish continuation gap partially filled by bearish candle"],
    ["Downside Tasuki Gap", "downside-tasuki-gap", "M", "Be", "Co", "C", "Bearish continuation gap partially filled by bullish candle"],
    ["Mat Hold (Bullish)", "bullish-mat-hold", "M", "Bu", "Co", "B", "Bullish continuation similar to rising three methods"],
    ["Kicking (Bullish)", "bullish-kicking", "M", "Bu", "R", "A", "Bearish marubozu followed by gap-up bullish marubozu"],
    ["Kicking (Bearish)", "bearish-kicking", "M", "Be", "R", "A", "Bullish marubozu followed by gap-down bearish marubozu"],
    ["Ladder Bottom", "ladder-bottom", "M", "Bu", "R", "C", "Five-candle bullish reversal with three black crows then reversal"],
    ["Advance Block", "advance-block", "M", "Be", "R", "C", "Three rising candles with diminishing body size showing weakening"],
    ["Deliberation", "deliberation", "M", "Be", "R", "C", "Similar to advance block with small third candle near highs"],
    ["Two Crows", "two-crows", "M", "Be", "R", "C", "Gap-up small bearish candle followed by larger bearish engulfing"],
    ["Unique Three River Bottom", "unique-three-river", "M", "Bu", "R", "C", "Rare three-candle bullish reversal at bottoms"],
    ["Concealing Baby Swallow", "concealing-baby-swallow", "M", "Bu", "R", "C", "Four-candle rare bullish pattern with engulfed harami"],
    ["Stick Sandwich", "stick-sandwich", "M", "Bu", "R", "C", "Two matching-close bearish candles sandwich a bullish candle"],
    ["Homing Pigeon", "homing-pigeon", "M", "Bu", "R", "C", "Bullish harami variant where both candles are bearish"],
    ["Matching Low", "matching-low", "M", "Bu", "R", "C", "Two bearish candles closing at the same low showing support"],
    ["Upside Gap Two Crows", "upside-gap-two-crows", "M", "Be", "R", "C", "Two small bearish candles gap above prior bullish body"],
    ["Separating Lines (Bullish)", "bullish-separating-lines", "M", "Bu", "Co", "C", "Bearish candle followed by bullish candle opening at same level"],
    ["Separating Lines (Bearish)", "bearish-separating-lines", "M", "Be", "Co", "C", "Bullish candle followed by bearish candle opening at same level"],
    ["Head and Shoulders", "head-and-shoulders", "P", "Be", "R", "A", "Three-peak formation with higher middle peak signaling top reversal"],
    ["Inverse Head and Shoulders", "inverse-head-and-shoulders", "P", "Bu", "R", "A", "Three-trough formation with lower middle trough signaling bottom reversal"],
    ["Double Top", "double-top", "P", "Be", "R", "A", "Two peaks at the same level forming M-shape reversal"],
    ["Double Bottom", "double-bottom", "P", "Bu", "R", "A", "Two troughs at same level forming W-shape reversal"],
    ["Triple Top", "triple-top", "P", "Be", "R", "A", "Three peaks at same resistance level"],
    ["Triple Bottom", "triple-bottom", "P", "Bu", "R", "A", "Three troughs at same support level"],
    ["Ascending Triangle", "ascending-triangle", "P", "Bu", "Co", "A", "Flat resistance with rising support trendline"],
    ["Descending Triangle", "descending-triangle", "P", "Be", "Co", "A", "Flat support with falling resistance trendline"],
    ["Symmetrical Triangle", "symmetrical-triangle", "P", "N", "Co", "B", "Converging trendlines showing decreasing volatility before breakout"],
    ["Rising Wedge", "rising-wedge", "P", "Be", "R", "A", "Both trendlines slope up with converging angle, bearish"],
    ["Falling Wedge", "falling-wedge", "P", "Bu", "R", "A", "Both trendlines slope down with converging angle, bullish"],
    ["Bull Flag", "bull-flag", "P", "Bu", "Co", "A", "Brief downward-sloping channel after sharp rally"],
    ["Bear Flag", "bear-flag", "P", "Be", "Co", "A", "Brief upward-sloping channel after sharp decline"],
    ["Bull Pennant", "bull-pennant", "P", "Bu", "Co", "A", "Small symmetrical triangle after sharp rally"],
    ["Bear Pennant", "bear-pennant", "P", "Be", "Co", "A", "Small symmetrical triangle after sharp decline"],
    ["Cup and Handle", "cup-and-handle", "P", "Bu", "Co", "A", "Rounded bottom with small pullback handle before breakout"],
    ["Inverted Cup and Handle", "inverted-cup-and-handle", "P", "Be", "Co", "B", "Rounded top with small rally handle before breakdown"],
    ["Rounding Bottom", "rounding-bottom", "P", "Bu", "R", "B", "Gradual U-shaped price curve signaling accumulation"],
    ["Rounding Top", "rounding-top", "P", "Be", "R", "B", "Gradual inverted-U price curve signaling distribution"],
    ["Rectangle (Bullish)", "bullish-rectangle", "P", "Bu", "Co", "B", "Horizontal consolidation in uptrend before breakout"],
    ["Rectangle (Bearish)", "bearish-rectangle", "P", "Be", "Co", "B", "Horizontal consolidation in downtrend before breakdown"],
    ["Channel Up", "channel-up", "P", "Bu", "Co", "B", "Parallel ascending trendlines containing price"],
    ["Channel Down", "channel-down", "P", "Be", "Co", "B", "Parallel descending trendlines containing price"],
    ["Broadening Formation", "broadening-formation", "P", "N", "R", "C", "Expanding trendlines with higher highs and lower lows"],
    ["Diamond Top", "diamond-top", "P", "Be", "R", "B", "Broadening pattern that contracts, forming diamond at tops"],
    ["Diamond Bottom", "diamond-bottom", "P", "Bu", "R", "B", "Broadening pattern that contracts, forming diamond at bottoms"],
    ["Bump and Run", "bump-and-run", "P", "Be", "R", "B", "Steep advance followed by trendline break reversal"],
    ["Island Reversal (Bullish)", "bullish-island-reversal", "P", "Bu", "R", "A", "Gap-down then gap-up isolates a cluster of candles at bottom"],
    ["Island Reversal (Bearish)", "bearish-island-reversal", "P", "Be", "R", "A", "Gap-up then gap-down isolates a cluster of candles at top"],
    ["Measured Move Up", "measured-move-up", "P", "Bu", "Co", "B", "Two equal rallies separated by a consolidation"],
    ["Measured Move Down", "measured-move-down", "P", "Be", "Co", "B", "Two equal declines separated by a consolidation"],
    ["Wolfe Wave (Bullish)", "bullish-wolfe-wave", "P", "Bu", "R", "C", "Five-wave convergence pattern targeting reversal to upper line"],
    ["Wolfe Wave (Bearish)", "bearish-wolfe-wave", "P", "Be", "R", "C", "Five-wave convergence pattern targeting reversal to lower line"],
    ["Three Drives (Bullish)", "bullish-three-drives", "P", "Bu", "R", "C", "Three symmetrical pushes to a low with harmonic ratios"],
    ["Three Drives (Bearish)", "bearish-three-drives", "P", "Be", "R", "C", "Three symmetrical pushes to a high with harmonic ratios"],
    ["ABCD (Bullish)", "bullish-abcd", "P", "Bu", "R", "B", "Four-point pattern with two equal legs and Fibonacci ratios"],
    ["ABCD (Bearish)", "bearish-abcd", "P", "Be", "R", "B", "Four-point pattern with two equal legs and Fibonacci ratios"],
];

const tickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'JPM', 'V', 'DIS', 'SPY', 'QQQ', 'AMD', 'BA', 'NFLX', 'CRM', 'PYPL', 'INTC', 'WMT', 'HD'];
const dates = ['2024-01-15', '2024-02-01', '2024-02-15', '2024-03-01', '2024-03-15', '2024-04-01', '2024-05-01', '2024-06-01', '2024-07-01', '2024-08-01'];

function getRelated(slug, allSlugs, cat, bias) {
    return allSlugs.filter(s => s !== slug).filter(s => {
        const other = defs.find(d => d[1] === s);
        return other && (other[2] === cat || other[3] === bias);
    }).slice(0, 4);
}

const confRules = {
    Bu: ["Price closes above the pattern's high on confirmation candle", "Volume increases on the bullish confirmation", "Pattern forms at a known support level or demand zone", "RSI shows bullish divergence or exits oversold territory", "Moving average support nearby adds confluence"],
    Be: ["Price closes below the pattern's low on confirmation candle", "Volume increases on the bearish confirmation", "Pattern forms at a known resistance level or supply zone", "RSI shows bearish divergence or exits overbought territory", "Breakdown below key moving average adds confirmation"],
    N: ["Wait for directional breakout from the pattern's range", "Volume spike confirms the breakout direction", "Key level confluence determines the bias", "Follow-through candle in the breakout direction required", "Oscillator divergence adds weight to the move"],
};

const invalRules = {
    Bu: ["Price closes below the pattern's low invalidates the setup", "No bullish follow-through within 2-3 candles", "Volume dries up after the pattern forms"],
    Be: ["Price closes above the pattern's high invalidates the setup", "No bearish follow-through within 2-3 candles", "Volume dries up after the pattern forms"],
    N: ["Price returns inside the pattern range after breakout", "False breakout with immediate reversal", "No volume on the breakout move"],
};

const tfRankings = [
    { timeframe: "1D", rank: 1, rationale: "Most reliable on daily charts with clear trend context" },
    { timeframe: "4H", rank: 2, rationale: "Good for swing trade entries and exits" },
    { timeframe: "1H", rank: 3, rationale: "Useful for intraday timing at key levels" },
    { timeframe: "15m", rank: 4, rationale: "Scalping only; higher noise and lower reliability" },
];

const contextMap = {
    Bu: { R: "Most effective at horizontal support, rising trendlines, or Fibonacci retracement levels after a sustained downtrend. Volume expansion on the pattern and confirmation increases reliability.", Co: "Best during established uptrends at pullback support levels. Look for the pattern to form at moving averages or prior breakout zones with above-average volume.", Ra: "Effective at range lows when price repeatedly bounces from the same support level. Volume spike at support adds conviction." },
    Be: { R: "Most effective at horizontal resistance, declining trendlines, or Fibonacci extension levels after a sustained uptrend. Volume expansion confirms distribution.", Co: "Best during established downtrends at rally resistance levels. Look for the pattern to form at declining moving averages or prior breakdown zones.", Ra: "Effective at range highs when price repeatedly fails at the same resistance level." },
    N: { R: "Signals indecision at key levels. The direction of the next candle or breakout determines bias. Most significant after extended trends.", Co: "In trends, neutral patterns suggest a pause. Wait for resolution before trading.", Ra: "Common in ranges and often noise. Only significant at range extremes with volume confirmation." },
};

const checklistMap = {
    Bu: ["Confirm preceding downtrend or pullback", "Pattern forms at support or demand zone", "Confirmation candle closes above key level", "Volume expands on confirmation", "Risk defined below pattern low", "Check for higher timeframe trend alignment"],
    Be: ["Confirm preceding uptrend or rally", "Pattern forms at resistance or supply zone", "Confirmation candle closes below key level", "Volume expands on confirmation", "Risk defined above pattern high", "Check for higher timeframe trend alignment"],
    N: ["Identify the preceding trend or range context", "Wait for directional breakout", "Volume confirms the breakout", "Define risk at pattern extremes", "Check for key level confluence", "Avoid trading inside the pattern range"],
};

const trapsMap = {
    Bu: ["Trading before confirmation leads to premature entries", "Pattern at minor support can fail easily", "Strong downtrend may overwhelm bullish signals", "Low volume patterns often fail", "Confusing similar patterns leads to false reads", "Multiple patterns without follow-through = stay out"],
    Be: ["Trading before confirmation leads to premature entries", "Pattern at minor resistance can fail easily", "Strong uptrend may overwhelm bearish signals", "Low volume patterns often fail", "Confusing similar patterns leads to false reads", "Short squeezes can invalidate bearish setups quickly"],
    N: ["Neutral patterns are not directional—don't pick sides early", "Very common in ranges—most are noise", "Can persist without resolution in choppy markets", "Trading the pattern itself leads to whipsaws", "Waiting too long for confirmation can miss the move"],
};

const allSlugs = defs.map(d => d[1]);

const patterns = defs.map((d, i) => {
    const [name, slug, catKey, biasKey, ctxKey, rel, short] = d;
    const category = cats[catKey];
    const bias = biases[biasKey];
    const context = contexts[ctxKey];
    const bk = biasKey;

    // Generate 3-4 examples
    const numEx = 3 + (i % 2);
    const examples = [];
    for (let j = 0; j < numEx; j++) {
        const t = tickers[(i * 3 + j) % tickers.length];
        const tf = ['1D', '4H', '1H', '15m'][j % 4];
        const si = (i + j) % dates.length;
        const ei = Math.min(si + 1, dates.length - 1);
        examples.push({
            ticker: t, timeframe: tf, start: dates[si], end: dates[ei],
            caption: `${name} pattern on ${t} ${tf} chart — ${short.toLowerCase()}`,
            image: `/examples/${slug}/${t}_${tf}_${dates[si]}_${dates[ei]}.svg`
        });
    }

    return {
        name, slug, category, bias, context, reliability: rel,
        short_description: short + '.',
        definition: `The ${name} is a ${category.toLowerCase()} pattern with ${bias.toLowerCase()} bias, commonly observed in ${context.toLowerCase()} scenarios. ${short}. Traders use this pattern to anticipate potential ${bias === 'Bullish' ? 'upward' : bias === 'Bearish' ? 'downward' : 'directional'} price movement when confirmed with volume and price action.`,
        anatomy: `${category === 'Chart Pattern' ? 'Forms over multiple candles/bars creating a recognizable geometric structure.' : category === 'Multi-Candle' ? 'Consists of multiple candles forming a specific sequential arrangement.' : 'Single candle with distinctive body and shadow proportions.'} ${short}. The pattern is identified by its characteristic shape and the market context in which it appears.`,
        confirmation_rules: confRules[bk],
        invalidation_rules: invalRules[bk],
        best_timeframes: tfRankings,
        best_context: contextMap[bk][ctxKey],
        quick_checklist: checklistMap[bk],
        common_traps: trapsMap[bk],
        examples,
        related_patterns: getRelated(slug, allSlugs, catKey, biasKey),
    };
});

// Write output
const outPath = path.join(__dirname, '..', 'src', 'data', 'patterns.json');
fs.writeFileSync(outPath, JSON.stringify(patterns, null, 2));
console.log(`Generated ${patterns.length} patterns to ${outPath}`);
