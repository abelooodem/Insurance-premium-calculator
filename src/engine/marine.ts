import { BreakdownBuilder, type PremiumBreakdown } from '../types/engine';
import * as T from '../tariffs/marine';
import type { PackingMethod } from '../tariffs/marine';

export interface MarineCargoInput {
  commodityCode: string;
  packing: PackingMethod;
  sumInsuredBirr: number;
  mode: 'sea' | 'air';
  isDeckCargo: boolean;
  transshipmentCount: number;
  extensionDaysBeyond60: number;
  beyondEthiopia: boolean;
  isContainer: boolean;
  isOpenCover: boolean;
  includeBSG: boolean;
  branchManagerDiscretionPct?: number; // 0-30, manual, applied after other discounts
}

function findCommodity(code: string) {
  for (const g of T.MARINE_COMMODITIES) {
    const item = g.items.find((i) => i.code === code);
    if (item) return { group: g, item };
  }
  return null;
}

export function calcMarineCargo(input: MarineCargoInput): PremiumBreakdown {
  const found = findCommodity(input.commodityCode);
  const b = new BreakdownBuilder('Marine Cargo', found ? `${found.group.groupName} - ${found.item.name}` : 'Marine Cargo', input.sumInsuredBirr);

  if (!found) {
    b.warn('Select a commodity to compute the marine cargo rate.');
    return b.build();
  }
  const rate = found.item[input.packing];
  if (rate === undefined) {
    b.warn(`No rate is published for "${found.item.name}" under packing method "${input.packing}". Try another packing method or refer to Head Office.`);
    if (found.item.note) b.assume(found.item.note);
    return b.build();
  }
  if (found.item.note) b.assume(found.item.note);

  let effectiveRate = rate / 100; // source rate is a %, convert to fraction
  let rateLabel = `${rate}%`;

  // Deck cargo: double the under-deck rate
  if (input.isDeckCargo) {
    effectiveRate *= T.DECK_CARGO_MULTIPLIER;
    rateLabel = `${rate}% x 2 (deck cargo) = ${(rate * T.DECK_CARGO_MULTIPLIER).toFixed(2)}%`;
  }

  // Beyond Ethiopia's territorial limits
  if (input.beyondEthiopia) {
    effectiveRate *= 1 + T.BEYOND_ETHIOPIA_LOADING;
  }

  let base = input.sumInsuredBirr * effectiveRate;
  b.base('Basic marine cargo premium', base, `${formatSI(input.sumInsuredBirr)} x ${rateLabel}${input.beyondEthiopia ? ` x (1 + ${pct(T.BEYOND_ETHIOPIA_LOADING)} beyond Ethiopia)` : ''}`, `All Risks rate chart item ${found.item.code}`);

  // Air freight: 40% of sea premium (only meaningful if the base rate table is a sea rate; per tariff practice apply factor)
  if (input.mode === 'air') {
    const airPremium = base * T.AIR_FREIGHT_RATE_OF_SEA;
    b.info('Air freight premium replaces sea premium above', 0, `${pct(T.AIR_FREIGHT_RATE_OF_SEA)} x Sea premium (Sec D)`);
    // Replace the base line with the air-adjusted one
    b.lines[b.lines.length - 2].amount = airPremium;
    b.lines[b.lines.length - 2].label += ' (Air freight: 40% of sea premium)';
    base = airPremium;
  }

  // Transshipment loading
  if (input.transshipmentCount > 0) {
    const amt = base * T.TRANSSHIPMENT_LOADING * input.transshipmentCount;
    b.loading(`Transshipment charge (${input.transshipmentCount}x)`, amt, `${pct(T.TRANSSHIPMENT_LOADING)} x Basic premium x ${input.transshipmentCount}`, 'Sec B');
  }

  // Extension beyond 60 days
  if (input.extensionDaysBeyond60 > 0) {
    const first15 = Math.min(15, input.extensionDaysBeyond60);
    const remaining = Math.max(0, input.extensionDaysBeyond60 - 15);
    const further15Blocks = Math.ceil(remaining / 15);
    const pctTotal = (first15 > 0 ? T.EXTENSION_BEYOND_60_DAYS.first15Days : 0) + further15Blocks * T.EXTENSION_BEYOND_60_DAYS.eachFurther15Days;
    b.loading(
      `Extension beyond 60 days cover (${input.extensionDaysBeyond60} additional days)`,
      base * pctTotal,
      `${pct(T.EXTENSION_BEYOND_60_DAYS.first15Days)} (first 15 days) + ${pct(T.EXTENSION_BEYOND_60_DAYS.eachFurther15Days)} x ${further15Blocks} further 15-day block(s)`,
      'Sec C',
    );
  }

  // BSG extension
  if (input.includeBSG) {
    b.extension('BSG extension (Inland Transit / All Risks)', input.sumInsuredBirr * T.BSG_COVER_RATE, `${formatSI(input.sumInsuredBirr)} x ${pct(T.BSG_COVER_RATE)}`, 'B.S.G Cover');
  }

  const subtotalForDiscounts = base + sumType(b, 'loading');

  // Open cover discount (25%)
  if (input.isOpenCover) {
    b.discount('Open Cover discount', subtotalForDiscounts * T.OPEN_COVER_DISCOUNT, `${pct(T.OPEN_COVER_DISCOUNT)} x Premium`, 'Sec H.1');
  }

  // Sum insured discount tiers
  const siTier = [...T.SUM_INSURED_DISCOUNT_TIERS].reverse().find((t) => input.sumInsuredBirr > t.min);
  if (siTier) {
    b.discount(`Sum Insured discount (over Birr ${siTier.min.toLocaleString()})`, subtotalForDiscounts * siTier.discount, `${pct(siTier.discount)} x Premium`, 'Sec H.2');
  }

  // Container discount
  if (input.isContainer) {
    b.discount('Container discount', subtotalForDiscounts * T.CONTAINER_DISCOUNT, `${pct(T.CONTAINER_DISCOUNT)} x Premium`, 'Sec H.3');
  }

  // Branch manager discretionary discount (manual, capped at 30%)
  if (input.branchManagerDiscretionPct && input.branchManagerDiscretionPct > 0) {
    const capped = Math.min(input.branchManagerDiscretionPct, T.BRANCH_MANAGER_DISCRETION_MAX * 100) / 100;
    if (input.branchManagerDiscretionPct / 100 > T.BRANCH_MANAGER_DISCRETION_MAX) {
      b.warn(`Branch Manager discretionary discount is capped at ${pct(T.BRANCH_MANAGER_DISCRETION_MAX)} without Head Office approval; the entered value was capped.`);
    }
    b.discount('Branch Manager discretionary discount', subtotalForDiscounts * capped, `${pct(capped)} x Premium (manual, requires authorization)`, 'Sec H.4');
  }

  const minimumPremium = input.mode === 'sea' ? T.MARINE_MINIMUM_PREMIUM.sea : T.MARINE_MINIMUM_PREMIUM.air;
  b.setMinimumPremium(minimumPremium);

  const preTaxSubtotal = base + sumType(b, 'loading') + sumType(b, 'discount');
  const floored = Math.max(preTaxSubtotal, minimumPremium);
  b.tax('Sales Tax (5%)', floored * T.MARINE_SALES_TAX_RATE, `${pct(T.MARINE_SALES_TAX_RATE)} x Premium`, 'Marine Premium Calculation Sheet');
  b.charge(
    'Stamp Duty',
    0,
    'Amount not specified in the source tariff (left blank on the premium calculation sheet template)',
  );
  b.assume('Stamp Duty amount was left blank on the source "Marine Insurance Premium Calculation Sheet" template; configure the correct statutory amount before issuing a real quotation.');

  return b.build();
}

function sumType(b: BreakdownBuilder, type: 'loading' | 'discount') {
  return b.lines.filter((l) => l.type === type).reduce((a, l) => a + l.amount, 0);
}
function pct(rate: number) {
  const p = rate * 100;
  return `${Number.isInteger(p) ? p : p.toFixed(2).replace(/\.?0+$/, '')}%`;
}
function formatSI(si: number) {
  return `Birr ${si.toLocaleString()}`;
}
