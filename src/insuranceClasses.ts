export type InsuranceClassId =
  | 'motor'
  | 'fire'
  | 'marine'
  | 'engineering'
  | 'personal_accident'
  | 'burglary'
  | 'money'
  | 'fidelity'
  | 'carriers_liability'
  | 'workmen_compensation'
  | 'liability'
  | 'bond';

export interface InsuranceClassMeta {
  id: InsuranceClassId;
  label: string;
  shortLabel: string;
  available: boolean; // false => tariff data not yet supplied, calculator disabled
  note?: string;
}

export const INSURANCE_CLASSES: InsuranceClassMeta[] = [
  { id: 'motor', label: 'Motor Insurance', shortLabel: 'Motor', available: true },
  { id: 'fire', label: 'Fire & Property Insurance', shortLabel: 'Fire & Property', available: true },
  { id: 'marine', label: 'Marine Cargo Insurance', shortLabel: 'Marine', available: true },
  { id: 'engineering', label: 'Engineering Insurance', shortLabel: 'Engineering', available: true },
  { id: 'personal_accident', label: 'Personal Accident / GPA', shortLabel: 'Personal Accident', available: true },
  { id: 'burglary', label: 'Burglary / Theft Insurance', shortLabel: 'Burglary', available: true },
  { id: 'money', label: 'Money Insurance', shortLabel: 'Money', available: true },
  { id: 'fidelity', label: 'Fidelity Guarantee (Bond)', shortLabel: 'Fidelity Guarantee', available: true },
  { id: 'carriers_liability', label: "Carriers' Liability", shortLabel: "Carriers' Liability", available: true },
  {
    id: 'workmen_compensation',
    label: "Workmen's Compensation",
    shortLabel: "Workmen's Comp.",
    available: false,
    note: 'No tariff/rate sheet has been supplied for this class yet. Provide the rate chart to activate this calculator.',
  },
  {
    id: 'liability',
    label: 'General Liability Insurance',
    shortLabel: 'Liability',
    available: false,
    note: 'No general liability tariff has been supplied yet (only Carriers’ Liability was provided). Provide the rate chart to activate this calculator.',
  },
  {
    id: 'bond',
    label: 'Bond Insurance',
    shortLabel: 'Bond',
    available: false,
    note: 'No dedicated Bond tariff was supplied. If your Bond products are rated the same as Fidelity Guarantee, use that module; otherwise provide the Bond rate chart.',
  },
];
