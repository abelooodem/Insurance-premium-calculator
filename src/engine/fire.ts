import { BreakdownBuilder, type PremiumBreakdown } from '../types/engine';
import * as T from '../tariffs/fire';

export type ConstructionClass = 'classI' | 'classII' | 'classIII';

export interface FireGeneralInput {
  occupancyCode: string;
  constructionClass: ConstructionClass;
  sumsInsured: { building: number; contents: number; stock: number; machinery: number; furniture: number; other: number };
  hasFireBrigadeAccess: boolean; // Area discount (10%)
  isConflagrationArea: boolean; // Area loading (15%) - mutually exclusive with the above
  selectedPerils: string[]; // keys into SPECIAL_PERILS
}

function totalSI(s: FireGeneralInput['sumsInsured']): number {
  return s.building + s.contents + s.stock + s.machinery + s.furniture + s.other;
}

export function calcFireGeneral(input: FireGeneralInput): PremiumBreakdown {
  const occ = T.FIRE_GENERAL_RISKS.find((o) => o.code === input.occupancyCode);
  const si = totalSI(input.sumsInsured);
  const b = new BreakdownBuilder('Fire & Property', occ ? `General Risk - ${occ.name}` : 'General Risk', si);

  if (!occ) {
    b.warn('Select an occupancy/trade classification to compute the Fire rate.');
    b.setMinimumPremium(T.FIRE_MINIMUM_PREMIUM);
    return b.build();
  }

  const rate = occ[input.constructionClass];
  if (rate === null) {
    b.warn(
      `The rate chart does not print a usable ${labelForClass(input.constructionClass)} rate for "${occ.name}"${occ.note ? ` (${occ.note})` : ''}. Refer to Head Office for this class of construction.`,
    );
  } else {
    b.base(`Fire base premium - ${occ.name} (${labelForClass(input.constructionClass)})`, (si * rate) / 1000, `${formatSI(si)} x ${rate} per mille`, `General Risks item ${occ.code}`);
  }
  if (occ.note && rate !== null) {
    b.assume(occ.note);
  }

  for (const key of input.selectedPerils) {
    const peril = T.SPECIAL_PERILS.find((p) => p.key === key);
    if (!peril) continue;
    b.base(`Special Peril extension - ${peril.label}`, (si * peril.ratePerMille) / 1000, `${formatSI(si)} x ${peril.ratePerMille} per mille`, 'Special Perils rate chart');
  }

  const baseSoFar = sumBase(b);

  if (input.isConflagrationArea) {
    b.loading('Area loading (conflagration/congested area, no fire brigade access)', baseSoFar * T.AREA_LOADING_RATE, `${pctLabel(T.AREA_LOADING_RATE)} x Fire + Special Perils premium`, 'Sec 3');
  } else if (input.hasFireBrigadeAccess) {
    b.discount('Area discount (fire brigade access)', baseSoFar * T.AREA_DISCOUNT_RATE, `${pctLabel(T.AREA_DISCOUNT_RATE)} x Fire + Special Perils premium`, 'Sec 1');
  }

  const afterArea = sumBase(b) + sumLoading(b) + sumDiscount(b);
  const tier = T.SPECIAL_DISCOUNT_TIERS.find((t) => si > t.min && si <= t.max) ?? (si === 0 ? T.SPECIAL_DISCOUNT_TIERS[0] : undefined);
  if (tier && tier.discount > 0) {
    b.discount(`Special discount (Sum Insured tier: over Birr ${tier.min.toLocaleString()})`, afterArea * tier.discount, `${pctLabel(tier.discount)} x Fire + Special Perils premium (after area adjustment)`, 'Sec 2');
  }

  b.setMinimumPremium(T.FIRE_MINIMUM_PREMIUM);
  b.assume('No VAT / statutory tax or revenue stamp figure was specified for Fire policies in the uploaded tariff; none has been added. Configure this if your company applies one.');
  return b.build();
}

export interface FirePrivateDwellingInput {
  addisAbaba: boolean;
  constructionClass: ConstructionClass;
  sumInsured: number;
  selectedPerils: string[];
}

export function calcFirePrivateDwelling(input: FirePrivateDwellingInput): PremiumBreakdown {
  const occ = input.addisAbaba ? T.FIRE_PRIVATE_DWELLINGS[0] : T.FIRE_PRIVATE_DWELLINGS[1];
  const si = input.sumInsured;
  const b = new BreakdownBuilder('Fire & Property', `Private Dwelling - ${occ.name}`, si);
  const rate = occ[input.constructionClass];
  if (rate === null) {
    b.warn('Rate unavailable for this construction class.');
  } else {
    b.base(`Private dwelling base premium (${labelForClass(input.constructionClass)})`, (si * rate) / 1000, `${formatSI(si)} x ${rate} per mille`, `Rating Schedule B, item ${occ.code}`);
  }
  for (const key of input.selectedPerils) {
    const peril = T.SPECIAL_PERILS.find((p) => p.key === key);
    if (!peril) continue;
    b.base(`Special Peril extension - ${peril.label}`, (si * peril.ratePerMille) / 1000, `${formatSI(si)} x ${peril.ratePerMille} per mille`, 'Special Perils rate chart');
  }
  b.setMinimumPremium(T.FIRE_MINIMUM_PREMIUM);
  return b.build();
}

export interface PlateGlassInput {
  propertyType: 'residence' | 'business';
  floor: 'ground' | 'first_to_third' | 'over_third';
  value: number;
}

export function calcPlateGlass(input: PlateGlassInput): PremiumBreakdown {
  const b = new BreakdownBuilder('Fire & Property', 'Plate Glass', input.value);
  if (input.propertyType === 'residence') {
    b.base('Plate glass premium - Private dwelling / flat', input.value * T.PLATE_GLASS.residenceRate, `${formatSI(input.value)} x ${pctLabel(T.PLATE_GLASS.residenceRate)}`, 'Plate Glass Rate Chart §1');
    b.setMinimumPremium(T.PLATE_GLASS.residenceMinPremium);
  } else {
    const rate =
      input.floor === 'ground' ? T.PLATE_GLASS.businessGroundFloorRate : input.floor === 'first_to_third' ? T.PLATE_GLASS.business1stTo3rdFloorRate : T.PLATE_GLASS.businessOver3rdFloorRate;
    b.base(`Plate glass premium - Business premises (${floorLabel(input.floor)})`, input.value * rate, `${formatSI(input.value)} x ${pctLabel(rate)}`, 'Plate Glass Rate Chart §2');
    b.setMinimumPremium(T.PLATE_GLASS.businessMinPremium);
  }
  return b.build();
}

export interface ConsequentialLossInput {
  annualGrossProfit: number;
  indemnityMonths: number;
  occupancyCode: string;
  constructionClass: ConstructionClass;
}

export function calcConsequentialLoss(input: ConsequentialLossInput): PremiumBreakdown {
  const occ = T.FIRE_GENERAL_RISKS.find((o) => o.code === input.occupancyCode);
  const b = new BreakdownBuilder('Fire & Property', 'Consequential Loss (Business Interruption)', input.annualGrossProfit, 'Annual Gross Profit (Sum Insured)');
  const tier = findIndemnityTier(input.indemnityMonths);
  if (!tier) {
    b.warn('No indemnity-period adjustment factor found for the entered period.');
    return b.build();
  }
  const adjustedSI = (input.annualGrossProfit * tier.pct) / 100;
  b.info(`Adjusted Sum Insured for ${input.indemnityMonths}-month indemnity period`, 0, `Birr ${input.annualGrossProfit.toLocaleString()} x ${tier.pct}%`);
  if (!occ || occ[input.constructionClass] === null) {
    b.warn('Select a valid occupancy and construction class to price this cover.');
  } else {
    const rate = occ[input.constructionClass] as number;
    b.base(
      `Consequential Loss premium - ${occ.name} (${labelForClass(input.constructionClass)})`,
      (adjustedSI * rate) / 1000,
      `${formatSI(adjustedSI)} (adjusted) x ${rate} per mille`,
      `General Risks item ${occ.code} rate applied to adjusted sum insured`,
    );
  }
  b.assume(
    'The source rate chart gives only the Indemnity Period -> % table used to gross up/down the Annual Gross Profit sum insured for periods other than 12 months; it does not separately state a Consequential Loss rate. This calculator applies the same Fire material-damage rate (by occupancy/construction class) to the adjusted sum insured, which is standard market practice, but this assumption should be confirmed with Head Office before issuing a quotation.',
  );
  return b.build();
}

function findIndemnityTier(months: number) {
  const table = T.CONSEQUENTIAL_LOSS_INDEMNITY_TABLE;
  const notExceeding = table.filter((t) => t.comparator === 'not_exceeding').sort((a, z) => a.months - z.months);
  const exact = notExceeding.find((t) => months <= t.months);
  if (exact) return exact;
  const notLessThan = table.filter((t) => t.comparator === 'not_less_than').sort((a, z) => z.months - a.months);
  const nlt = notLessThan.find((t) => months >= t.months);
  if (nlt) return nlt;
  return table.find((t) => t.comparator === 'exceeding');
}

function sumBase(b: BreakdownBuilder) {
  return b.lines.filter((l) => l.type === 'base').reduce((a, l) => a + l.amount, 0);
}
function sumLoading(b: BreakdownBuilder) {
  return b.lines.filter((l) => l.type === 'loading').reduce((a, l) => a + l.amount, 0);
}
function sumDiscount(b: BreakdownBuilder) {
  return b.lines.filter((l) => l.type === 'discount').reduce((a, l) => a + l.amount, 0);
}
function labelForClass(c: ConstructionClass) {
  return c === 'classI' ? 'Class I' : c === 'classII' ? 'Class II' : 'Class III';
}
function floorLabel(f: PlateGlassInput['floor']) {
  return f === 'ground' ? 'Ground Floor' : f === 'first_to_third' ? '1st-3rd Floor' : 'Over 3rd Floor';
}
function pctLabel(rate: number) {
  const p = rate * 100;
  return `${Number.isInteger(p) ? p : p.toFixed(2).replace(/\.?0+$/, '')}%`;
}
function formatSI(si: number) {
  return `Birr ${si.toLocaleString()}`;
}
