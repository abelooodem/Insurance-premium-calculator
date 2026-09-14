// PERSONAL ACCIDENT / GPA TARIFF CONFIGURATION
// Source: GPA_RATE_CHART_2.doc

export interface PaClass {
  classNo: 1 | 2 | 3 | 4 | 5;
  label: string;
  deathRate: number; // % of Capital Sum Insured for Death
  permanentDisabilityRate: number; // % of Capital Sum Insured for Permanent Disability
  ttdRate: number; // % of the Monthly Indemnity sum insured, Temporary Total Disablement
  medicalExpensesRate: number; // % of the Medical Expenses limit
  examples: string[];
}

export const PA_CLASSES: PaClass[] = [
  {
    classNo: 1,
    label: 'Class 1 - Administrative/Clerical, non-hazardous occupations',
    deathRate: 0.056,
    permanentDisabilityRate: 0.08,
    ttdRate: 2.72,
    medicalExpensesRate: 1.92,
    examples: ['Accountant', 'Architect (office)', 'Banker', 'Barrister', 'Clerk', 'Insurance Official', 'Physician', 'Shopkeeper (excl. use of tools)'],
  },
  {
    classNo: 2,
    label: 'Class 2 - Managers/supervisors/foremen not engaged in manual work',
    deathRate: 0.08,
    permanentDisabilityRate: 0.14,
    ttdRate: 3.8,
    medicalExpensesRate: 2.56,
    examples: ['Builder (supervising only)', 'Clerk of Works', 'Engineer (supervising)', 'Motor Driver (private car)', 'Guards', 'Cleaners', 'Messengers'],
  },
  {
    classNo: 3,
    label: 'Class 3 - Tradesmen in manual labor (excl. woodworking machinery)',
    deathRate: 0.14,
    permanentDisabilityRate: 0.19,
    ttdRate: 4.9,
    medicalExpensesRate: 3.2,
    examples: ['Brewer (working)', 'Butcher', 'Engineer - Mechanical (working)', 'Motor Driver (commercial vehicle)', 'Tool Maker', 'Veterinary Surgeon'],
  },
  {
    classNo: 4,
    label: 'Class 4 - Skilled manual trades',
    deathRate: 0.22,
    permanentDisabilityRate: 0.24,
    ttdRate: 9.2,
    medicalExpensesRate: 4.32,
    examples: ['Blacksmith (Shoeing)', 'Builder (working, excl. woodworking machinery)', 'Carpenter, joiner and cabinet maker', 'Electrical Engineer (working)', 'Furniture remover'],
  },
  {
    classNo: 5,
    label: 'Class 5 - All trades involving use of woodworking machinery',
    deathRate: 0.24,
    permanentDisabilityRate: 0.31,
    ttdRate: 12.24,
    medicalExpensesRate: 5.05,
    examples: ['All trades using woodworking machinery'],
  },
];

export const PA_MIN_PREMIUM = 100;
export const PA_AGE_MIN = 14;
export const PA_AGE_MAX = 65;
export const PA_MIN_INSURED_PERSONS = 10;

export const SPORT_LOADINGS: { key: string; label: string; rate: number }[] = [
  { key: 'football', label: 'Football', rate: 0.1 },
  { key: 'motor_cycling', label: 'Motor Cycling', rate: 0.18 },
  { key: 'racing', label: 'Racing of any kind', rate: 0.32 },
  { key: 'swimming', label: 'Swimming', rate: 0.1 },
];

export const WORLDWIDE_EXTENSION_RATE = 0.0675; // 6.75% of basic premium

export const MEDICAL_ILLNESS_EXTENSION = {
  rate: 0.15, // 15% of the limit of medical expenses
  excessPerClaim: 30,
  minIndemnityPerPerson: 3_000,
  maxIndemnityPerPerson: 10_000,
};
