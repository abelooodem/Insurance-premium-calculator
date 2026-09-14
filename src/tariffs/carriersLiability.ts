// CARRIERS' LIABILITY TARIFF CONFIGURATION
// Source: CARRIERS_LIABILITY_RATE_CHART_2.docx
// Guideline: Annual Carrying = Liability Limit per truck & trailer x 36. Premium = Annual
// Carrying x Rate. Multiply by number of vehicles for the fleet total.

export const CARRIERS_LIABILITY_RATES = {
  fuelCargo: 0.003, // 0.30%
  dryCargo: 0.0012, // 0.12%
};
export const CARRIERS_LIABILITY_ANNUAL_CARRYING_MULTIPLIER = 36;
export const CARRIERS_LIABILITY_SUDAN_LOADING = 0.25; // extend geographical limit to Sudan: +25%

export const CARRIERS_LIABILITY_BSG_RATES = {
  fuelCargo: 0.0003, // 0.03%
  dryCargo: 0.0002, // 0.02%
};

// Fleet discount by number of vehicles. NOTE: the source document prints the fifth tier as
// "115-200" which breaks the otherwise-continuous sequence (101-150, ???, 201-300); this is
// treated as a probable typo for "151-200" to keep the bands contiguous, and is flagged in
// the calculator rather than silently assumed correct.
export const CARRIERS_LIABILITY_FLEET_DISCOUNT: { min: number; max: number; discount: number }[] = [
  { min: 10, max: 25, discount: 0.15 },
  { min: 26, max: 50, discount: 0.2 },
  { min: 51, max: 75, discount: 0.25 },
  { min: 76, max: 100, discount: 0.3 },
  { min: 101, max: 150, discount: 0.35 },
  { min: 151, max: 200, discount: 0.4 },
  { min: 201, max: 300, discount: 0.5 },
  { min: 301, max: Infinity, discount: 0.6 },
];

export const CARRIERS_LIABILITY_EXCESS = {
  fuelCargo: { flat: 5_000, pctOfLoss: 0.1 },
  dryCargoTiers: [
    { maxLimit: 100_000, flat: 3_000, pctOfLoss: 0.05 },
    { maxLimit: 200_000, flat: 4_000, pctOfLoss: 0.05 },
    { maxLimit: 300_000, flat: 5_000, pctOfLoss: 0.05 },
    { maxLimit: 400_000, flat: 6_000, pctOfLoss: 0.05 },
    { maxLimit: 500_000, flat: 6_500, pctOfLoss: 0.05 },
    { maxLimit: 700_000, flat: 6_000, pctOfLoss: 0.05 },
  ],
};
export const CARRIERS_LIABILITY_CRANE_CARGO_LIMIT = 30_000; // per event, included within the vehicle's liability limit
