// MONEY INSURANCE TARIFF CONFIGURATION
// Source: MONEY_INSURANCE_RATE_CHART_2.doc. All rates are per mille.

export const MONEY_IN_TRANSIT = {
  singleLossLimitWithinTown: 2.5,
  singleLossLimitBetweenTowns: 4,
  annualCarryingRate: 0.15,
};
export const MONEY_IN_SAFE_RATE = 2;
export const MONEY_MIN_PREMIUM = 100;

// Special discount on the annual-carrying rate component, for risks with annual carryings over Birr 1,000,000.
// NB: the source document's own tier boundaries jump from "up to 2,250,000" to "over 2,500,000" - this gap
// (2,250,000 to 2,500,000) is exactly as printed in the rate chart; it has not been smoothed over.
export const MONEY_SPECIAL_DISCOUNT_TIERS: { min: number; max: number; discount: number }[] = [
  { min: 1_000_000, max: 2_250_000, discount: 0.125 },
  { min: 2_500_000, max: 5_000_000, discount: 0.175 },
  { min: 5_000_000, max: 10_000_000, discount: 0.2 },
  { min: 10_000_000, max: Infinity, discount: 0.25 },
];
