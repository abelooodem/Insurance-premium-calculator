// BURGLARY / THEFT TARIFF CONFIGURATION
// Source: BURGLARY_RATE_CHART_2.doc
// Category A = adequate protection & watchmen. Category A1 = adequate protection, no watchmen.

export interface BurglaryRate {
  key: string;
  label: string;
  categoryA: number; // rate per mille
  categoryA1: number;
}

export const PRIVATE_PREMISES_RATES: BurglaryRate[] = [
  { key: 'private_ground', label: 'Private Premises - Ground Floor', categoryA: 1.0, categoryA1: 1.33 },
  { key: 'private_upper', label: 'Private Premises - All Floors Above Ground', categoryA: 0.66, categoryA1: 0.84 },
];

export const COMMERCIAL_RATES: BurglaryRate[] = [
  { key: 'commercial_1', label: 'Commercial Risks - Class 1', categoryA: 1.33, categoryA1: 2.0 },
  { key: 'commercial_2', label: 'Commercial Risks - Class 2', categoryA: 1.66, categoryA1: 2.5 },
  { key: 'commercial_3', label: 'Commercial Risks - Class 3', categoryA: 2.0, categoryA1: 3.0 },
];

export const INDUSTRIAL_MACHINERY_RATES: BurglaryRate[] = [
  { key: 'industrial_machinery_1', label: 'Industrial - Machinery Only, Class 1', categoryA: 0.33, categoryA1: 0.5 },
  { key: 'industrial_machinery_2', label: 'Industrial - Machinery Only, Class 2', categoryA: 0.5, categoryA1: 0.84 },
  { key: 'industrial_machinery_3', label: 'Industrial - Machinery Only, Class 3', categoryA: 0.84, categoryA1: 1.25 },
];

export const INDUSTRIAL_CONTENTS_RATES: BurglaryRate[] = [
  { key: 'industrial_contents_1', label: 'Industrial - Other Contents, Class 1', categoryA: 1.33, categoryA1: 2.0 },
  { key: 'industrial_contents_2', label: 'Industrial - Other Contents, Class 2', categoryA: 1.66, categoryA1: 2.5 },
  { key: 'industrial_contents_3', label: 'Industrial - Other Contents, Class 3', categoryA: 2.0, categoryA1: 3.0 },
];

export const COMMERCIAL_CLASS_EXAMPLES: Record<'1' | '2' | '3', string[]> = {
  '1': ['Butchers', 'Fruit & Vegetable dealers', 'Churches', 'Cinemas', 'Dairy products', 'Machinery (heavy)', 'Plumbers', 'Schools', 'Builders merchants', 'Cafes', 'Chemists', 'Hotels', 'Motor Garages', 'Offices', 'Tailors', 'Doctor’s Clinic', 'Hospitals', 'Petrol Filling Stations', 'Pharmacist'],
  '2': ['Furniture Dealers', 'China & glassware dealers', 'Distillers', 'Hardware', 'Opticians', 'Printers', 'Stationers', 'Warehouses', 'Barbers', 'Bicycle Dealers', 'Carpets', 'Confectionery shops', 'Clothiers', 'Drapers', 'Grocers', 'Leather goods', 'Restaurants', 'Theaters', 'Tool Shops', 'Dry Cleaners'],
  '3': ['Electrical Appliances (Radios & TVs)', 'Boot & Shoe dealers/repairers', 'Camera dealers', 'Fancy goods', 'Firearms', 'Cotton yarn', 'Record dealers', 'Photographic supplies', 'Athletic Clubs', 'Bazaars', 'Dance Halls', 'Exhibitions', 'Furriers', 'Watchmakers', 'Goldsmith & Silversmith'],
};

export const INDUSTRIAL_CLASS_EXAMPLES: Record<'1' | '2' | '3', string[]> = {
  '1': ['Box and carton Manufacturers', 'Brewers', 'Building Material Manufacturers', 'Confectioners', 'Furniture Manufacturers', 'Sheet Metal Manufacturers', 'Nail & Iron wire Manufacturers', 'Wood Workers', 'Fuel Briquette Factory'],
  '2': ['Battery Manufacturers', 'Biscuit Manufacturers', 'Brush & Broom Manufacturers', 'Manufacturing Chemist', 'Tanneries'],
  '3': ['Boot & Shoe Manufacturers', 'Clothing manufacturers', 'Mattress Factories', 'Knitwear Factories', 'Wine & Spirit Manufacturers'],
};

export const BURGLARY_MIN_PREMIUM = 100;

// First Loss basis: % of full value that the First Loss amount represents -> % of full annual premium charged
export const FIRST_LOSS_TABLE: { pctOfFullValue: number; pctOfPremium: number }[] = [
  { pctOfFullValue: 5, pctOfPremium: 35 },
  { pctOfFullValue: 10, pctOfPremium: 45 },
  { pctOfFullValue: 15, pctOfPremium: 50 },
  { pctOfFullValue: 20, pctOfPremium: 55 },
  { pctOfFullValue: 25, pctOfPremium: 60 },
  { pctOfFullValue: 30, pctOfPremium: 65 },
  { pctOfFullValue: 35, pctOfPremium: 70 },
  { pctOfFullValue: 40, pctOfPremium: 75 },
  { pctOfFullValue: 50, pctOfPremium: 80 },
  { pctOfFullValue: 60, pctOfPremium: 85 },
  { pctOfFullValue: 65, pctOfPremium: 90 },
  { pctOfFullValue: 70, pctOfPremium: 100 },
];
export const FIRST_LOSS_MIN_STOCK_VALUE = 30_000; // no first loss policy if full value of stock is under this

// Full-value basis discount tiers for sums insured over Birr 100,000
export const FULL_VALUE_DISCOUNT_TIERS: { max: number; discount: number }[] = [
  { max: 500_000, discount: 0.1 },
  { max: 750_000, discount: 0.15 },
  { max: 1_000_000, discount: 0.2 },
  { max: 1_500_000, discount: 0.3 },
  { max: 2_000_000, discount: 0.4 },
  { max: 2_500_000, discount: 0.5 },
  { max: Infinity, discount: 0.6 },
];
export const FULL_VALUE_DISCOUNT_THRESHOLD = 100_000;
