// ENGINEERING TARIFF CONFIGURATION
// Sources: CPM_revised_rate_chart_2.doc, BOILER_EXPLOSION_INSURANCE_RATE_CHART_3.doc.
//
// IMPORTANT GAP: ENGINEERING_RATE_CHART1406_2.doc (the general Engineering rate chart,
// covering Contractors' All Risks / Erection All Risks / Machinery Breakdown) contains
// only the Munich Re reinsurance-treaty UNDERWRITING & RATING *DIRECTIVES* and endorsement
// wordings. Every numeric base rate, the Section B "Rating Schedule 1.1" per-mille table by
// plant/machine type, the earthquake-zone rate table, the deductible table and the minimum
// premium are printed as "*" placeholders in the source file itself - they were never
// filled in. CAR, EAR (beyond the CPM extract below) and Machinery Breakdown / Electronic
// Equipment base rates are therefore NOT available and are intentionally left unconfigured
// below rather than guessed. Structural rules that ARE numerically stated in that document
// (TPL loading table, cross-liability loading, maintenance loading, deductible-increase
// discount) are captured here and reused by the CAR/EAR panel once base rates are supplied.

// Contractors' Plant & Machinery (CPM) - CPM_revised_rate_chart_2.doc
export interface CpmOption {
  key: string;
  label: string;
  cpmOnlyRate: number; // (1)
  transitExtensionRate: number; // (2)
  srccExtensionRate: number; // (3)
  combinedRate: number; // (1+2+3)
  deductible: { flat: number; pctOfLoss: number }; // "Birr X or Y% of the loss amount, whichever is higher"
}

export const CPM_OPTIONS: CpmOption[] = [
  { key: 'I', label: 'Option I', cpmOnlyRate: 0.003, transitExtensionRate: 0.00075, srccExtensionRate: 0.00025, combinedRate: 0.004, deductible: { flat: 10_000, pctOfLoss: 0.1 } },
  { key: 'II', label: 'Option II', cpmOnlyRate: 0.00275, transitExtensionRate: 0.00075, srccExtensionRate: 0.00025, combinedRate: 0.00375, deductible: { flat: 15_000, pctOfLoss: 0.15 } },
  { key: 'III', label: 'Option III', cpmOnlyRate: 0.00225, transitExtensionRate: 0.00075, srccExtensionRate: 0.00025, combinedRate: 0.00325, deductible: { flat: 17_500, pctOfLoss: 0.175 } },
];

// Boiler Explosion - BOILER_EXPLOSION_INSURANCE_RATE_CHART_3.doc
export interface BoilerAgeBand {
  label: string;
  fireTubeRate: number; // per mille on value of boiler
  waterTubeRate: number;
  liabilityRate: number | null; // per mille on limit of indemnity (surrounding property / third party)
}

export const BOILER_AGE_BANDS: BoilerAgeBand[] = [
  { label: 'Below 20 years old', fireTubeRate: 3.6, waterTubeRate: 2.7, liabilityRate: 1.6 },
  { label: '21 to 30 years old', fireTubeRate: 4.2, waterTubeRate: 3.15, liabilityRate: 1.8 },
  { label: '31 to 40 years old', fireTubeRate: 4.7, waterTubeRate: 3.55, liabilityRate: 2.1 },
  { label: '41 to 55 years old', fireTubeRate: 5.55, waterTubeRate: 4.185, liabilityRate: 2.5 },
];
export const BOILER_MIN_PREMIUM = 150;
export const BOILER_DEDUCTIBLE_NOTE_UNDER30 = 'No deductible stated for boilers below 21 years old / 21-30 years old.';
export const BOILER_DEDUCTIBLE_OVER30 = { pctOfSI: 0.01, min: 500 }; // "1% of sum insured, min Birr 500" for 31+ years

// TPL loading table from the general Engineering directives (applies once CAR/EAR base
// rates are configured) - % of the basic material-damage rate, by indemnity-limit tier
// and hazard exposure.
export const EAR_TPL_LOADING_TABLE: { hazard: string; pct25: number; pct50: number; pct100: number }[] = [
  { hazard: 'Without special hazards', pct25: 0.05, pct50: 0.1, pct100: 0.15 },
  { hazard: 'With fire, explosion or collapse exposure', pct25: 0.1, pct50: 0.15, pct100: 0.2 },
  { hazard: 'With fire, explosion or collapse exposure in populated areas', pct25: 0.15, pct50: 0.2, pct100: 0.25 },
];
export const EAR_CROSS_LIABILITY_LOADING = 0.05; // +5% of Section I items 1&2 premium
export const EAR_MAINTENANCE_VISITS_LOADING = 0.1; // +10%
export const EAR_EXTENDED_MAINTENANCE_LOADING_RANGE = { min: 0.15, max: 0.2 }; // +15% to +20%
export const EAR_DEDUCTIBLE_INCREASE_DISCOUNT: { multiple: number; discount: number }[] = [
  { multiple: 2, discount: 0.075 },
  { multiple: 5, discount: 0.15 },
  { multiple: 10, discount: 0.2 },
];
