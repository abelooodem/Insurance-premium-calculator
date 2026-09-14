// MOTOR TARIFF CONFIGURATION
// Source: MOTOR_RATE_CHART_3.doc (uploaded tariff sheet).
// To update rates: edit the values below. Every constant carries a `source`
// comment pointing at the clause in the original rate chart so a reviewer can
// re-check it against a new circular. Nothing here is invented — where the
// source document did not state a number, it is left as `null` and the
// calculator will refuse to compute that line until a value is supplied.

export const MOTOR_MINIMUM_PREMIUM = 300; // Section 8: "MINIMUM PREMIUM: Birr 300.00"

export const MOTOR_BASIC_PREMIUM_FLAT = 300; // "BASIC PREMIUM RATE = 300.00 + 10% of CC"
export const MOTOR_BASIC_PREMIUM_CC_RATE = 0.1;

export type VehicleCategory =
  | 'private_car'
  | 'pickup_van_own_goods'
  | 'truck_own_goods'
  | 'tipper_own_goods'
  | 'tanker'
  | 'general_cartage_truck_pickup'
  | 'tipper_general_cartage'
  | 'bus_public_service'
  | 'bus_own_service'
  | 'taxi'
  | 'hire_car'
  | 'tractor_agricultural'
  | 'motorcycle'
  | 'motor_trade_road_risk';

export const VEHICLE_CATEGORY_LABELS: Record<VehicleCategory, string> = {
  private_car: 'Private Car',
  pickup_van_own_goods: 'Pick-up / Van (Own Goods)',
  truck_own_goods: 'Truck (Own Goods)',
  tipper_own_goods: 'Tipper (Own Goods)',
  tanker: 'Tanker (Fuel)',
  general_cartage_truck_pickup: 'Truck / Pick-up (General Cartage - for hire)',
  tipper_general_cartage: 'Tipper (General Cartage - for hire)',
  bus_public_service: 'Bus - Public Service (fare paying passengers)',
  bus_own_service: 'Bus - Own Service (employee transport)',
  taxi: 'Taxi',
  hire_car: 'Hire Car',
  tractor_agricultural: 'Tractor / Agricultural Vehicle',
  motorcycle: 'Motorcycle',
  motor_trade_road_risk: 'Motor Trade - Road Risk',
};

export const COMMERCIAL_CATEGORIES: VehicleCategory[] = [
  'pickup_van_own_goods',
  'truck_own_goods',
  'tipper_own_goods',
  'tanker',
  'general_cartage_truck_pickup',
  'tipper_general_cartage',
  'bus_public_service',
  'bus_own_service',
  'taxi',
  'hire_car',
  'tractor_agricultural',
];

export type CoverType = 'comprehensive' | 'third_party_only' | 'third_party_fire_theft';

// Section 2.1.1 (private) / 3.1.1 (commercial) Third Party Liability limits
export const TPL_LIMITS = {
  private: { bodilyInjuryPerAccident: 150_000, bodilyInjuryPerPerson: 30_000, propertyDamage: 75_000 },
  commercial: { bodilyInjuryPerAccident: 200_000, bodilyInjuryPerPerson: 30_000, propertyDamage: 100_000 },
};
export const TPL_EXTENSION_RATE = 0.025; // "may be increased at additional premium of 2.5% of the extended limit"

// Section 2.1.2 / 3.1.2 Duty Free Vehicle loading
export const DUTY_FREE_LOADING = { private: 0.25, commercial: 0.15 };

// Section 2.1.5 No Claim Discount - Private vehicles (by consecutive claim-free years)
export const NCD_PRIVATE: { years: number; comprehensive: number; thirdParty: number | null }[] = [
  { years: 1, comprehensive: 0.2, thirdParty: 0.1 },
  { years: 2, comprehensive: 0.25, thirdParty: 0.15 },
  { years: 3, comprehensive: 0.3, thirdParty: 0.2 },
  { years: 4, comprehensive: 0.35, thirdParty: 0.25 },
  { years: 5, comprehensive: 0.4, thirdParty: null },
  { years: 6, comprehensive: 0.45, thirdParty: null },
  { years: 7, comprehensive: 0.5, thirdParty: null }, // "Above seven years"
];

// Section 3.1.4 No Claim Discount - Commercial vehicles
export const NCD_COMMERCIAL: { years: number; comprehensive: number; thirdParty: number }[] = [
  { years: 1, comprehensive: 0.2, thirdParty: 0.1 },
  { years: 2, comprehensive: 0.25, thirdParty: 0.15 },
  { years: 3, comprehensive: 0.3, thirdParty: 0.2 },
  { years: 4, comprehensive: 0.35, thirdParty: 0.25 },
  { years: 5, comprehensive: 0.4, thirdParty: 0.25 },
  { years: 6, comprehensive: 0.45, thirdParty: 0.25 },
  { years: 7, comprehensive: 0.47, thirdParty: 0.25 }, // "7-10 consecutive years"
  { years: 11, comprehensive: 0.5, thirdParty: 0.25 },
];

// Section 2.1.6 / 3.1.5 Step-back scheme (applied instead of NCD when exactly one claim in the year)
export const STEP_BACK_PRIVATE: { from: number; to: number }[] = [
  { from: 0.5, to: 0.35 },
  { from: 0.45, to: 0.3 },
  { from: 0.4, to: 0.25 },
  { from: 0.35, to: 0.2 },
];
export const STEP_BACK_COMMERCIAL: { from: number; to: number }[] = [
  { from: 0.5, to: 0.3 },
  { from: 0.45, to: 0.25 },
  { from: 0.4, to: 0.2 },
];

// Section 2.1.7 Fleet discount - Private
export const FLEET_DISCOUNT_PRIVATE: { min: number; max: number; discount: number }[] = [
  { min: 2, max: 2, discount: 0.05 },
  { min: 3, max: 5, discount: 0.075 },
  { min: 6, max: 15, discount: 0.125 },
  { min: 16, max: 30, discount: 0.2 },
  { min: 31, max: 50, discount: 0.25 },
  { min: 51, max: 75, discount: 0.3 },
  { min: 76, max: 125, discount: 0.35 },
  { min: 126, max: Infinity, discount: 0.4 },
];

// Section 3.1.8 Fleet discount - Commercial
export const FLEET_DISCOUNT_COMMERCIAL: { min: number; max: number; discount: number }[] = [
  { min: 2, max: 5, discount: 0.05 },
  { min: 6, max: 15, discount: 0.13 },
  { min: 16, max: 30, discount: 0.18 },
  { min: 31, max: 50, discount: 0.23 },
  { min: 51, max: 75, discount: 0.27 },
  { min: 76, max: 100, discount: 0.33 },
  { min: 101, max: Infinity, discount: 0.37 },
];

// Section 2.2.3 Over-age charge - Private (age of vehicle in years)
export const OVERAGE_PRIVATE: { min: number; max: number; loading: number | 'tp_only' }[] = [
  { min: 0, max: 5, loading: 0 },
  { min: 6, max: 10, loading: 0.05 },
  { min: 11, max: 20, loading: 0.1 },
  { min: 21, max: 25, loading: 0.15 },
  { min: 26, max: 30, loading: 0.2 },
  { min: 31, max: Infinity, loading: 'tp_only' },
];

// Section 3.1.6 Over-age charge - Commercial
export const OVERAGE_COMMERCIAL: { min: number; max: number; loading: number | 'tp_only' }[] = [
  { min: 0, max: 5, loading: 0 },
  { min: 6, max: 10, loading: 0.05 },
  { min: 11, max: 15, loading: 0.1 },
  { min: 16, max: 20, loading: 0.15 },
  { min: 21, max: 25, loading: 0.175 },
  { min: 26, max: 30, loading: 0.2 },
  { min: 31, max: Infinity, loading: 'tp_only' },
];

// Section 2.2.5 Voluntary excess discount (private, own damage section only)
export const VOLUNTARY_EXCESS_DISCOUNT: { excess: number; discount: number }[] = [
  { excess: 500, discount: 0.1 },
  { excess: 1000, discount: 0.15 },
  { excess: 1500, discount: 0.2 },
  { excess: 2000, discount: 0.25 },
];

// Section 2.1.3 Personal Accident Benefit (private car only, ages 14-65)
export const PAB_PRIVATE = { benefit: 10_000, premiumPerSeat: 20 };
// Section 3.1.9 PAB for vans & pickups (comprehensive only)
export const PAB_VAN_PICKUP: { limit: number; premiumPerSeat: number }[] = [
  { limit: 5_000, premiumPerSeat: 25 },
  { limit: 10_000, premiumPerSeat: 45 },
];
// Section 2.1.4 Free medical benefits, private car (informational - no separate premium)
export const MEDICAL_BENEFIT_CHILD_UNDER_14 = 500; // per person per accident
export const MEDICAL_BENEFIT_ELDERLY_OVER_65 = 1000; // per person per accident

// Section 3.2.4.1 Public Service Passengers Legal Liability (PLL)
export const PLL_RATES: { limitPerPassenger: number; annualPremium: number }[] = [
  { limitPerPassenger: 10_000, annualPremium: 15 },
  { limitPerPassenger: 15_000, annualPremium: 22.5 },
];

// Section 3.7.2 Taxi passengers cover (comprehensive only)
export const TAXI_PASSENGER_COVER = { limitPerPerson: 10_000, premiumPerSeat: 35 };

// Fire & Theft extension rates when added to a Third Party policy, % of vehicle value
export const FIRE_THEFT_EXTENSION_RATE: Partial<Record<VehicleCategory, number>> = {
  private_car: 0.01, // Section 2.3.2
  pickup_van_own_goods: 0.015, // Section 3.3.4 (Own Goods)
  truck_own_goods: 0.015,
  tipper_own_goods: 0.015,
  tanker: 0.025, // Section 3.4.3
  general_cartage_truck_pickup: 0.016, // Section 3.5.3
  tipper_general_cartage: 0.016, // Section 3.6.3
  bus_public_service: 0.015, // Section 3.2.3
  bus_own_service: 0.015,
  tractor_agricultural: 0.01, // Section 3.8.3
  motorcycle: 0.01, // Section 4.3
  // Section 3.7.3: "No additional cover is provided for Fire and Theft" for hire cars / taxis
};

// Section 3.10 BSG (Bandit, Shifta & Guerrilla) extension - commercial only
export const BSG_RATE: Partial<Record<VehicleCategory, number>> = {
  truck_own_goods: 0.003,
  tipper_own_goods: 0.003,
  general_cartage_truck_pickup: 0.003,
  tipper_general_cartage: 0.003,
  bus_public_service: 0.005,
  bus_own_service: 0.005,
  tanker: 0.005,
};

// Section "MOTOR THIRD PARTY INSURANCE COVER PREMIUM RATES" - multiplier on Basic Premium Rate
// (300 + 10% of CC), used for Third Party Only cover.
export const TP_PREMIUM_LOADING: Partial<Record<VehicleCategory, number>> = {
  private_car: 0, // Basic Premium only
  pickup_van_own_goods: 0.25, // Own Goods without trailer
  truck_own_goods: 0.25,
  tipper_own_goods: 0.25,
  tanker: 0.6, // Tankers (fuel) without trailer
  general_cartage_truck_pickup: 0.5, // General Cartage without trailer
  tipper_general_cartage: 0.5,
  bus_public_service: 0.5,
  bus_own_service: 0.2,
  taxi: 0.3, // Hire-Cars & Taxis <12 seats
  hire_car: 0.3,
};
export const TP_TRAILER_LOADING: Partial<Record<VehicleCategory, number>> = {
  pickup_van_own_goods: 0.35,
  truck_own_goods: 0.35,
  tipper_own_goods: 0.35,
  tanker: 0.7,
  general_cartage_truck_pickup: 0.6,
  tipper_general_cartage: 0.6,
};

// Motorcycle Third Party rate (Item 8 of the TP schedule): flat Birr 100 + 5% of CC
export const MOTORCYCLE_TP_FLAT = 100;
export const MOTORCYCLE_TP_CC_RATE = 0.05;

// Section 3.3.1 / 3.4.1 / 3.5.1 / 3.6.1 / 3.2.1 / 3.7.1 Comprehensive basic-premium formulas.
// "flat" is a fixed Birr amount, "ccRate" applies to engine CC (private car only),
// "valueRate" applies as a percentage of the insured vehicle value.
export interface ComprehensiveFormula {
  flat: number;
  ccRate?: number; // only private car uses (300 + 10% of CC)
  valueRate: number;
  trailerValueRate?: number; // additional % of trailer value, charged separately, if applicable
  sourceRef: string;
}

export const COMPREHENSIVE_FORMULAS: Partial<Record<VehicleCategory, ComprehensiveFormula>> = {
  private_car: { flat: 300, ccRate: 0.1, valueRate: 0.015, sourceRef: 'Sec 2.2.1' },
  pickup_van_own_goods: { flat: 300, ccRate: 0.1, valueRate: 0.016, sourceRef: 'Sec 3.3.1' },
  truck_own_goods: { flat: 2000, valueRate: 0.017, sourceRef: 'Sec 3.3.1' },
  tipper_own_goods: { flat: 2000, valueRate: 0.0175, sourceRef: 'Sec 3.3.1' },
  tanker: { flat: 2500, valueRate: 0.025, sourceRef: 'Sec 3.4.1' },
  general_cartage_truck_pickup: { flat: 2000, valueRate: 0.02, trailerValueRate: 0.02, sourceRef: 'Sec 3.5.1' },
  tipper_general_cartage: { flat: 2000, valueRate: 0.02, trailerValueRate: 0.02, sourceRef: 'Sec 3.6.1' },
  taxi: { flat: 600, valueRate: 0.0325, sourceRef: 'Sec 3.7.1(b) Unnamed Driver & Taxis' },
  hire_car: { flat: 600, valueRate: 0.025, sourceRef: 'Sec 3.7.1(a) Own Driver' },
  bus_own_service: { flat: 300, ccRate: 0.1, valueRate: 0.015, sourceRef: 'Sec 3.2.1(b) "Apply private motor car rate"' },
};
// Buses (public service) are banded by seating capacity - see Section 3.2.1(a):
export const BUS_PUBLIC_SERVICE_BANDS: { maxSeats: number; flat: number; valueRate: number }[] = [
  { maxSeats: 12, flat: 1500, valueRate: 0.03 },
  { maxSeats: 36, flat: 2000, valueRate: 0.027 },
  { maxSeats: Infinity, flat: 2500, valueRate: 0.02 },
];

// Section 3.8 Tractors (agricultural, insured under commercial policy)
export const TRACTOR_COMPREHENSIVE = {
  flatBelow10k: 500, // value up to Birr 10,000: flat Birr 500
  threshold: 10_000,
  flatAbove10k: 200, // value over Birr 10,000: Birr 200 + 1% of the excess over 10,000
  rateAbove10k: 0.01,
  ownPremisesDiscount: 0.3, // "confined solely to the insured farm area" - reduce by 30%
  trailerValueRate: 0.005,
};
export const TRACTOR_TP = {
  flat: 350,
  ownPremisesFlat: 300,
  trailerFlat: 300,
};
export const TRACTOR_FIRE_THEFT_RATE = 0.01;

// Section 4.1 Motorcycle Comprehensive premium schedule (per mille bands of CC, first Birr 1,000
// of sum insured priced at the flat amount, then Birr 12 per additional Birr 500 of sum insured).
export interface MotorcycleBand {
  maxCC: number;
  label: string;
  privateInsuredOnly: number;
  privateAnyDriver: number;
  commercialInsuredOnly: number;
  commercialAnyDriver: number;
}
export const MOTORCYCLE_BANDS: MotorcycleBand[] = [
  { maxCC: 0, label: 'Auto cycles / mechanically assisted pedal cycles', privateInsuredOnly: 50, privateAnyDriver: 61, commercialInsuredOnly: 77, commercialAnyDriver: 94 },
  { maxCC: 200, label: 'Motor scooters not exceeding 200cc', privateInsuredOnly: 61, privateAnyDriver: 77, commercialInsuredOnly: 94, commercialAnyDriver: 110 },
  { maxCC: 350, label: 'Exceeding 200cc but not exceeding 350cc', privateInsuredOnly: 100, privateAnyDriver: 150, commercialInsuredOnly: 200, commercialAnyDriver: 250 },
  { maxCC: 500, label: 'Exceeding 350cc but not exceeding 500cc', privateInsuredOnly: 150, privateAnyDriver: 200, commercialInsuredOnly: 250, commercialAnyDriver: 300 },
  { maxCC: Infinity, label: 'Exceeding 500cc', privateInsuredOnly: 200, privateAnyDriver: 250, commercialInsuredOnly: 270, commercialAnyDriver: 400 },
];
export const MOTORCYCLE_SI_FIRST_TIER = 1000; // premium above covers the first Birr 1,000 of sum insured
export const MOTORCYCLE_SI_STEP = 500; // then Birr 12 per additional Birr 500
export const MOTORCYCLE_SI_STEP_CHARGE = 12;
export const MOTORCYCLE_EXCESS = 200; // own damage excess, Section 4.1

// Section 5.1.1 Motor Trade - Road Risk (named driver / trade plate basis)
export const MOTOR_TRADE_ROAD_RISK = {
  comprehensiveFirst: 210,
  comprehensiveEach: 130,
  tpFireTheftFirst: 125,
  tpFireTheftEach: 75,
  tpOnlyFirst: 110,
  tpOnlyEach: 55,
  excess: 250, // comprehensive only
  ncd: 0.1, // if no claim in preceding year
};

// Section 5. Short Period Rates (also used for cancellations, Section 7)
export const SHORT_PERIOD_RATES: { maxDays: number; label: string; pct: number }[] = [
  { maxDays: 3, label: 'Not exceeding 3 days', pct: 0.05 },
  { maxDays: 10, label: 'Exceeding 3 days but not 10 days', pct: 0.1 },
  { maxDays: 30, label: 'Exceeding 10 days but not 1 month', pct: 0.2 },
  { maxDays: 45, label: 'Exceeding 1 month but not 1.5 months', pct: 0.25 },
  { maxDays: 60, label: 'Exceeding 1.5 months but not 2 months', pct: 0.3 },
  { maxDays: 90, label: 'Exceeding 2 months but not 3 months', pct: 0.4 },
  { maxDays: 120, label: 'Exceeding 3 months but not 4 months', pct: 0.5 },
  { maxDays: 150, label: 'Exceeding 4 months but not 5 months', pct: 0.6 },
  { maxDays: 180, label: 'Exceeding 5 months but not 6 months', pct: 0.7 },
  { maxDays: 210, label: 'Exceeding 6 months but not 7 months', pct: 0.75 },
  { maxDays: 240, label: 'Exceeding 7 months but not 8 months', pct: 0.8 },
  { maxDays: 270, label: 'Exceeding 8 months but not 9 months', pct: 0.85 },
  { maxDays: 300, label: 'Exceeding 9 months but not 10 months', pct: 0.9 },
  { maxDays: 335, label: 'Exceeding 10 months but not 11 months', pct: 0.95 },
  { maxDays: Infinity, label: 'Exceeding 11 months', pct: 1 },
];

// Section 15. Branch Manager's discretionary discount ceiling - a manual, authorization-gated
// discount, not auto-applied. Encoded here only as the maximum the UI should allow / warn against.
export const BRANCH_MANAGER_DISCRETION_MAX: Partial<Record<VehicleCategory, number>> = {
  private_car: 0.3,
  tanker: 0.25,
};
export const BRANCH_MANAGER_DISCRETION_MAX_DEFAULT = 0.2;
