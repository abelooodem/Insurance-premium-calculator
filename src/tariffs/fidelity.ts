// FIDELITY GUARANTEE (BOND) TARIFF CONFIGURATION
// Source: FIDELITY_GUARANTEE_RATE_CHART_2.doc

export const FIDELITY_RATE = 0.01; // 1% on total Limit of Indemnity, without excess
export const FIDELITY_RATE_STATED_CEILING = 25_000; // "rates apply only for limits of indemnity up to Birr 25,000 per person guaranteed"
export const FIDELITY_EXCESS_DISCOUNT_THRESHOLD = 100_000; // discount applies to the amount above this threshold
export const FIDELITY_EXCESS_DISCOUNT = 0.3; // 30% discount, applied to the excess portion only
export const FIDELITY_MIN_PREMIUM = 100;
