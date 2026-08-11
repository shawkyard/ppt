# Alma loyalty pre-scope engine

The honest ROI engine behind the opportunity report. Given a brand (or a whole
market), it decides whether a loyalty program will actually make that company
money, and classifies it **ACT NOW / WATCH / DROP**.

Pure functions, no dependencies, no framework. Runs in the browser (for the
Horizon screens) or in Node.

## Run it

```bash
node src/lib/loyalty/verify.mjs
```

Prints a ranked market, the Verano annual bridge, and asserts the math. Exits
non-zero if anything is wrong.

## Why this exists

The old spreadsheet computed incremental revenue as the **interaction term only**
(`ΔAOV × ΔPF`), the smallest piece of the behavioral lift. That understated the
true increment by ~24× and made 98% of the market look unprofitable. This engine
computes the **full lift** — basket term + frequency term + interaction — so the
ranking reflects reality.

## The files

| File | Does |
|------|------|
| `roi.js` | The bridge math. `computeLoyaltyROI()` and the closed-form `breakEvenCombinedLift()`. |
| `score.js` | `fitScore()` (0–100, explainable), `classify()` (ACT/WATCH/DROP), `positiveRoiProbability()`. |
| `defaults.js` | Governed segment priors, the conservative haircut, provenance weights, default cost model. |
| `prescope.js` | `prescopeAccount()` — one account → full result. `rankMarket()` / `marketSummary()` — a whole universe. |
| `demoBrands.js` | Three illustrative accounts spanning the verdict range. |
| `verify.mjs` | Runnable checks + printed demo. |

## The rules it enforces

- **Full lift, never the interaction term alone.** The three terms always sum to
  the true per-member increment.
- **Benefit-cost and net ROI are separate, labelled numbers** — never conflated.
- **Expected *and* conservative cases.** An account qualifies (green) only if it
  still returns in the conservative case — margin of safety, not the headline.
- **No blanket self-selection haircut.** The uplift priors already represent net
  incremental behavior; discounting them again would double-count.
- **Provenance on every input.** Missing values are filled from segment priors
  and tagged `modeled`; evidence coverage feeds both the fit score and an
  honesty-shrunk positive-ROI probability.

## Using it

```js
import { prescopeAccount, rankMarket } from './src/lib/loyalty/prescope.js'

const result = prescopeAccount({
  name: 'Some Brand', segment: 'fastCasual',
  revenue: 400_000_000, units: 160, vendorFit: 8,
  inputs: { aov: 26, purchaseFrequency: 22, activeMembers: 300_000 }, // rest filled from priors
})
// → result.verdict.label, result.fitScore, result.expected, result.conservative, result.evidence

const ranked = rankMarket(listOfBrands) // sorted, with percentile + verdict
```

Segments available: `fastCasual`, `qsr`, `grocery`, `convenience`, `beautyRetail`,
`apparel`, `petSupplies`, `generic`. Add more in `defaults.js`.
