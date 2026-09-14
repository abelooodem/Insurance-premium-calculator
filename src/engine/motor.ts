import { BreakdownBuilder, type PremiumBreakdown } from '../types/engine';
import * as T from '../tariffs/motor';
import type { VehicleCategory, CoverType } from '../tariffs/motor';

export interface MotorInput {
  category: VehicleCategory;
  cover: CoverType;
  vehicleValue: number;
  trailerValue?: number;
  engineCC?: number;
  busSeats?: number;
  isOrganization: boolean; // vs individual - only affects excess schedule presentation
  isDutyFree: boolean;
  vehicleAgeYears: number;
  ncdYears: number; // consecutive claim-free years (0 = none)
  oneClaimStepBack: boolean; // exactly one claim in the last period - apply step-back instead of NCD
  fleetVehicleCount: number; // number of vehicles under this one classification (1 = no fleet discount)
  extendedTplLimitBirr?: number; // additional TPL limit requested, beyond the standard limit
  voluntaryExcessBirr?: number; // private car only
  ownPremisesOnly?: boolean; // tractors: confined to insured's own farm
  includePAB?: boolean; // private car
  pabSeatCount?: number;
  vanPickupPabSeats?: { limit: 5000 | 10000; seats: number };
  taxiPassengerSeats?: number;
  pllSeats?: { limitPerPassenger: 10000 | 15000; seats: number };
  includeBSG?: boolean;
  periodDays?: number; // if less than a full year, applies short-period rate
}

const YEAR_DAYS = 365;

function shortPeriodFactor(days: number | undefined): { pct: number; label: string } | null {
  if (days === undefined || days >= YEAR_DAYS) return null;
  const band = T.SHORT_PERIOD_RATES.find((b) => days <= b.maxDays) ?? T.SHORT_PERIOD_RATES[T.SHORT_PERIOD_RATES.length - 1];
  return { pct: band.pct, label: band.label };
}

function basicPremiumRate(cc: number | undefined): number {
  // "BASIC PREMIUM RATE = 300 + 10% of CC" - used as the Third Party Only base for most classes
  const c = cc ?? 0;
  return T.MOTOR_BASIC_PREMIUM_FLAT + T.MOTOR_BASIC_PREMIUM_CC_RATE * c;
}

function isPrivate(category: VehicleCategory): boolean {
  return category === 'private_car';
}

export function calcMotor(input: MotorInput): PremiumBreakdown {
  const label = T.VEHICLE_CATEGORY_LABELS[input.category];
  const b = new BreakdownBuilder('Motor', `${label} - ${coverLabel(input.cover)}`, input.vehicleValue);
  const commercial = T.COMMERCIAL_CATEGORIES.includes(input.category);
  const isMotorcycle = input.category === 'motorcycle';
  const isMotorTrade = input.category === 'motor_trade_road_risk';
  const isTractor = input.category === 'tractor_agricultural';

  if (input.category === 'bus_public_service' && !input.busSeats) {
    b.warn('Seating capacity is required for public service buses to determine the rate band.');
  }

  // ---- 1. BASE / OWN DAMAGE-INCLUSIVE PREMIUM ----
  if (input.cover === 'comprehensive') {
    if (isMotorcycle) {
      computeMotorcycleComprehensive(b, input);
    } else if (isMotorTrade) {
      computeMotorTradeRoadRisk(b, input);
    } else if (isTractor) {
      computeTractorComprehensive(b, input);
    } else if (input.category === 'bus_public_service') {
      computeBusPublicServiceComprehensive(b, input);
    } else {
      const f = T.COMPREHENSIVE_FORMULAS[input.category];
      if (!f) {
        b.warn(`No comprehensive rate formula is configured for "${label}". Refer to Head Office.`);
      } else {
        const ccPart = f.ccRate ? f.ccRate * (input.engineCC ?? 0) : 0;
        const valuePart = f.valueRate * input.vehicleValue;
        const amount = f.flat + ccPart + valuePart;
        const formula = f.ccRate
          ? `Birr ${f.flat} + ${pct(f.ccRate)} x CC (${input.engineCC ?? 0}) + ${pct(f.valueRate)} x Value`
          : `Birr ${f.flat} + ${pct(f.valueRate)} x Value`;
        b.base('Comprehensive basic premium', amount, formula, f.sourceRef);
        if (f.trailerValueRate && input.trailerValue) {
          b.base('Trailer own-damage premium', f.trailerValueRate * input.trailerValue, `${pct(f.trailerValueRate)} x Trailer value`, f.sourceRef);
        }
      }
    }
  } else {
    // Third Party Only / Third Party Fire & Theft base premium
    if (isMotorcycle) {
      const amount = T.MOTORCYCLE_TP_FLAT + T.MOTORCYCLE_TP_CC_RATE * (input.engineCC ?? 0);
      b.base('Third Party basic premium (motorcycle)', amount, `Birr ${T.MOTORCYCLE_TP_FLAT} + ${pct(T.MOTORCYCLE_TP_CC_RATE)} x CC`, 'TP Schedule item 8');
    } else if (isMotorTrade) {
      computeMotorTradeRoadRisk(b, input);
    } else {
      const basic = basicPremiumRate(input.engineCC);
      const loading = T.TP_PREMIUM_LOADING[input.category] ?? 0;
      const trailerLoading = T.TP_TRAILER_LOADING[input.category];
      const useTrailerLoading = trailerLoading !== undefined && (input.trailerValue ?? 0) > 0;
      const effectiveLoading = useTrailerLoading ? trailerLoading : loading;
      const amount = basic * (1 + effectiveLoading);
      b.base(
        'Third Party basic premium',
        amount,
        `(Birr ${T.MOTOR_BASIC_PREMIUM_FLAT} + ${pct(T.MOTOR_BASIC_PREMIUM_CC_RATE)} x CC) x (1 + ${pct(effectiveLoading)})`,
        'Third Party Cover Premium Rates schedule',
      );
      if (isPrivate(input.category)) {
        b.assume('Private vehicle Third Party premium = Basic Premium Rate only (no loading), per tariff.');
      }
    }
  }

  // ---- 2. FIRE & THEFT EXTENSION (only meaningful on a Third Party policy) ----
  if (input.cover === 'third_party_fire_theft') {
    const rate = T.FIRE_THEFT_EXTENSION_RATE[input.category];
    if (rate === undefined) {
      b.warn(`Fire & Theft extension is not available for "${label}" per the tariff (e.g. hire cars / taxis are excluded).`);
    } else {
      b.extension('Fire & Theft extension', rate * input.vehicleValue, `${pct(rate)} x Vehicle value`, 'Fire & Theft extension clauses');
    }
  }

  // ---- 3. DUTY FREE LOADING (applies to the base premium, comprehensive & TP) ----
  if (input.isDutyFree) {
    const rate = commercial ? T.DUTY_FREE_LOADING.commercial : T.DUTY_FREE_LOADING.private;
    const basePremiumSoFar = sumType(b, 'base');
    b.loading('Duty-free vehicle loading', basePremiumSoFar * rate, `${pct(rate)} x Base premium`, 'Sec 2.1.2 / 3.1.2');
  }

  // ---- 4. OVER-AGE LOADING ----
  const overageTable = commercial ? T.OVERAGE_COMMERCIAL : T.OVERAGE_PRIVATE;
  const band = overageTable.find((r) => input.vehicleAgeYears >= r.min && input.vehicleAgeYears <= r.max);
  if (band) {
    if (band.loading === 'tp_only') {
      if (input.cover === 'comprehensive') {
        b.warn(`Vehicle age (${input.vehicleAgeYears} yrs) exceeds the comprehensive-cover age limit. Only Third Party cover may be offered.`);
      }
    } else if (band.loading > 0) {
      const basePremiumSoFar = sumType(b, 'base');
      b.loading('Over-age loading', basePremiumSoFar * band.loading, `${pct(band.loading)} x Base premium (vehicle age ${input.vehicleAgeYears} yrs)`, 'Sec 2.2.3 / 3.1.6');
    }
  }

  // ---- 5. TPL LIMIT EXTENSION ----
  if (input.extendedTplLimitBirr && input.extendedTplLimitBirr > 0) {
    b.extension(
      'Extended Third Party Liability limit',
      T.TPL_EXTENSION_RATE * input.extendedTplLimitBirr,
      `${pct(T.TPL_EXTENSION_RATE)} x Extended limit (Birr ${input.extendedTplLimitBirr.toLocaleString()})`,
      'Sec 2.1.1 / 3.1.1',
    );
  }

  // ---- 6. NO CLAIM DISCOUNT / STEP-BACK (own-damage + TP portion, private & commercial only) ----
  if (!isMotorcycle && !isMotorTrade && !isTractor) {
    const ncdTable = commercial ? T.NCD_COMMERCIAL : T.NCD_PRIVATE;
    let ncdRate: number | null = null;
    let ncdSourceLabel = '';
    if (input.oneClaimStepBack) {
      const stepTable = commercial ? T.STEP_BACK_COMMERCIAL : T.STEP_BACK_PRIVATE;
      const attained = attainedNcdRate(ncdTable, input.ncdYears, input.cover);
      const step = attained !== null ? stepTable.find((s) => s.from === attained) : undefined;
      ncdRate = step ? step.to : 0;
      ncdSourceLabel = 'Step-back scheme (one claim in the period)';
      if (attained !== null && !step) {
        b.assume(`Attained NCD of ${pct(attained)} has no listed step-back tier; NCD reduced to Nil per tariff note "Below 35% -> Nil".`);
      }
    } else {
      ncdRate = attainedNcdRate(ncdTable, input.ncdYears, input.cover);
      ncdSourceLabel = `No Claim Discount (${input.ncdYears} claim-free year${input.ncdYears === 1 ? '' : 's'})`;
    }
    if (ncdRate && ncdRate > 0) {
      const basePremiumSoFar = sumType(b, 'base') + sumType(b, 'loading');
      b.discount(ncdSourceLabel, basePremiumSoFar * ncdRate, `${pct(ncdRate)} x (Base + loadings)`, 'Sec 2.1.5/2.1.6 (private), 3.1.4/3.1.5 (commercial)');
    }
  }

  // ---- 7. VOLUNTARY EXCESS DISCOUNT (private car only, comprehensive only) ----
  if (isPrivate(input.category) && input.cover === 'comprehensive' && input.voluntaryExcessBirr) {
    const tier = [...T.VOLUNTARY_EXCESS_DISCOUNT].reverse().find((v) => (input.voluntaryExcessBirr ?? 0) >= v.excess);
    if (tier) {
      const basePremiumSoFar = sumType(b, 'base') + sumType(b, 'loading');
      b.discount(
        `Voluntary excess discount (Birr ${tier.excess.toLocaleString()} excess)`,
        basePremiumSoFar * tier.discount,
        `${pct(tier.discount)} x (Base + loadings)`,
        'Sec 2.2.5',
      );
    }
  }

  // ---- 8. FLEET DISCOUNT ----
  if (input.fleetVehicleCount > 1) {
    const table = commercial ? T.FLEET_DISCOUNT_COMMERCIAL : T.FLEET_DISCOUNT_PRIVATE;
    const tier = table.find((t) => input.fleetVehicleCount >= t.min && input.fleetVehicleCount <= t.max);
    if (tier) {
      const basePremiumSoFar = sumType(b, 'base') + sumType(b, 'loading');
      b.discount(
        `Fleet discount (${input.fleetVehicleCount} vehicles)`,
        basePremiumSoFar * tier.discount,
        `${pct(tier.discount)} x (Base + loadings)`,
        'Sec 2.1.7 / 3.1.8',
      );
    }
  }

  // ---- 9. BSG EXTENSION (commercial, optional) ----
  if (input.includeBSG) {
    const rate = T.BSG_RATE[input.category];
    if (rate === undefined) {
      b.warn(`BSG (Bandit/Shifta/Guerrilla) extension is only defined for trucks, tippers, buses and tankers.`);
    } else {
      b.extension('BSG extension (Bandit, Shifta & Guerrillas)', rate * input.vehicleValue, `${pct(rate)} x Vehicle value`, 'Sec 3.10');
    }
  }

  // ---- 10. PERSONAL ACCIDENT BENEFIT ----
  if (isPrivate(input.category) && input.includePAB && input.pabSeatCount) {
    b.extension(
      `Personal Accident Benefit (${input.pabSeatCount} seat(s) @ Birr ${T.PAB_PRIVATE.benefit.toLocaleString()})`,
      T.PAB_PRIVATE.premiumPerSeat * input.pabSeatCount,
      `Birr ${T.PAB_PRIVATE.premiumPerSeat} x ${input.pabSeatCount} seat(s)`,
      'Sec 2.1.3',
    );
  }
  if ((input.category === 'pickup_van_own_goods') && input.vanPickupPabSeats && input.vanPickupPabSeats.seats > 0) {
    if (input.cover !== 'comprehensive') {
      b.warn('PAB cover for vans & pick-ups requires comprehensive cover (Sec 3.1.9).');
    } else {
      const tier = T.PAB_VAN_PICKUP.find((t) => t.limit === input.vanPickupPabSeats!.limit)!;
      b.extension(
        `PAB - Vans & Pick-ups (${input.vanPickupPabSeats.seats} seat(s) @ Birr ${tier.limit.toLocaleString()})`,
        tier.premiumPerSeat * input.vanPickupPabSeats.seats,
        `Birr ${tier.premiumPerSeat} x ${input.vanPickupPabSeats.seats} seat(s)`,
        'Sec 3.1.9',
      );
    }
  }

  // ---- 11. TAXI PASSENGER COVER ----
  if (input.category === 'taxi' && input.taxiPassengerSeats) {
    if (input.cover !== 'comprehensive') {
      b.warn('Taxi passenger cover requires comprehensive cover (Sec 3.7.2).');
    } else {
      b.extension(
        `Taxi passengers legal liability (${input.taxiPassengerSeats} seat(s))`,
        T.TAXI_PASSENGER_COVER.premiumPerSeat * input.taxiPassengerSeats,
        `Birr ${T.TAXI_PASSENGER_COVER.premiumPerSeat} x ${input.taxiPassengerSeats} seat(s)`,
        'Sec 3.7.2',
      );
    }
  }

  // ---- 12. PUBLIC SERVICE PASSENGERS LEGAL LIABILITY (buses) ----
  if (input.category === 'bus_public_service' && input.pllSeats && input.pllSeats.seats > 0) {
    const tier = T.PLL_RATES.find((t) => t.limitPerPassenger === input.pllSeats!.limitPerPassenger)!;
    b.extension(
      `Passengers Legal Liability (${input.pllSeats.seats} seat(s) @ Birr ${tier.limitPerPassenger.toLocaleString()})`,
      tier.annualPremium * input.pllSeats.seats,
      `Birr ${tier.annualPremium} x ${input.pllSeats.seats} seat(s)`,
      'Sec 3.2.4.1',
    );
  }

  // ---- 13. MINIMUM PREMIUM ----
  b.setMinimumPremium(T.MOTOR_MINIMUM_PREMIUM);

  // ---- 14. SHORT PERIOD PRORATION ----
  const sp = shortPeriodFactor(input.periodDays);
  if (sp) {
    b.assume(`Period of cover is ${input.periodDays} days (< 1 year): Short Period Rate "${sp.label}" = ${pct(sp.pct)} of the annual premium is applied to the whole computed premium.`);
  }

  const built = b.build();
  if (!sp) return built;

  // Apply short period % to every monetary component uniformly, preserving the breakdown lines
  // (each line's displayed amount is scaled) so the underwriter can still see the annual formula.
  const factor = sp.pct;
  const scaledLines = built.lines.map((l) => ({ ...l, amount: l.amount * factor, note: (l.note ? l.note + ' ' : '') + `(x ${pct(factor)} short-period factor)` }));
  const rebuilt = new BreakdownBuilder(built.className, built.productLabel + ` [Short Period: ${sp.label}]`, built.sumInsured);
  scaledLines.forEach((l) => rebuilt.add(l));
  rebuilt.warnings.push(...built.warnings);
  rebuilt.assumptions.push(...built.assumptions);
  rebuilt.setMinimumPremium(T.MOTOR_MINIMUM_PREMIUM);
  return rebuilt.build();
}

function attainedNcdRate(
  table: { years: number; comprehensive: number; thirdParty: number | null }[],
  years: number,
  cover: CoverType,
): number | null {
  if (years <= 0) return null;
  const applicable = [...table].reverse().find((t) => years >= t.years);
  if (!applicable) return null;
  if (cover === 'comprehensive') return applicable.comprehensive;
  if (cover === 'third_party_only' || cover === 'third_party_fire_theft') return applicable.thirdParty;
  return null;
}

function computeMotorcycleComprehensive(b: BreakdownBuilder, input: MotorInput) {
  const cc = input.engineCC ?? 0;
  const band = T.MOTORCYCLE_BANDS.find((x) => cc <= x.maxCC) ?? T.MOTORCYCLE_BANDS[T.MOTORCYCLE_BANDS.length - 1];
  const isPrivatePolicy = true; // category selection for motorcycle assumed private unless commercial fleet - simplification
  const flatForFirstTier = isPrivatePolicy ? band.privateInsuredOnly : band.commercialInsuredOnly;
  const extraSI = Math.max(0, input.vehicleValue - T.MOTORCYCLE_SI_FIRST_TIER);
  const steps = Math.ceil(extraSI / T.MOTORCYCLE_SI_STEP);
  const stepCharge = steps * T.MOTORCYCLE_SI_STEP_CHARGE;
  b.base(
    `Motorcycle comprehensive premium (${band.label})`,
    flatForFirstTier + stepCharge,
    `Birr ${flatForFirstTier} for first Birr ${T.MOTORCYCLE_SI_FIRST_TIER.toLocaleString()} of value, + Birr ${T.MOTORCYCLE_SI_STEP_CHARGE} per additional Birr ${T.MOTORCYCLE_SI_STEP} (${steps} step(s))`,
    'Sec 4.1',
  );
  b.assume(`Motorcycle band assumed "insured only driving, private policy". If commercial use or "any driver" applies, rates differ per the CC table (Sec 4.1) - adjust manually.`);
}

function computeMotorTradeRoadRisk(b: BreakdownBuilder, input: MotorInput) {
  const namedDrivers = Math.max(1, input.fleetVehicleCount || 1);
  const t = T.MOTOR_TRADE_ROAD_RISK;
  let first = 0;
  let each = 0;
  if (input.cover === 'comprehensive') {
    first = t.comprehensiveFirst;
    each = t.comprehensiveEach;
  } else if (input.cover === 'third_party_fire_theft') {
    first = t.tpFireTheftFirst;
    each = t.tpFireTheftEach;
  } else {
    first = t.tpOnlyFirst;
    each = t.tpOnlyEach;
  }
  const additional = Math.max(0, namedDrivers - 1);
  b.base(
    `Motor Trade Road Risk (${namedDrivers} named driver(s)/plate(s))`,
    first + each * additional,
    `Birr ${first} (1st) + Birr ${each} x ${additional} additional`,
    'Sec 5.1.1',
  );
  if (input.ncdYears > 0) {
    b.discount('No Claim Discount', (first + each * additional) * t.ncd, `${pct(t.ncd)} x Base premium`, 'Sec 5.1.1');
  }
}

function computeTractorComprehensive(b: BreakdownBuilder, input: MotorInput) {
  const t = T.TRACTOR_COMPREHENSIVE;
  let amount: number;
  let formula: string;
  if (input.vehicleValue <= t.threshold) {
    amount = t.flatBelow10k;
    formula = `Flat Birr ${t.flatBelow10k} (value <= Birr ${t.threshold.toLocaleString()})`;
  } else {
    const excess = input.vehicleValue - t.threshold;
    amount = t.flatAbove10k + t.rateAbove10k * excess;
    formula = `Birr ${t.flatAbove10k} + ${pct(t.rateAbove10k)} x (Value - Birr ${t.threshold.toLocaleString()})`;
  }
  b.base('Tractor comprehensive premium', amount, formula, 'Sec 3.8.1');
  if (input.ownPremisesOnly) {
    b.discount('Confined to own farm premises', amount * t.ownPremisesDiscount, `${pct(t.ownPremisesDiscount)} x Base premium`, 'Sec 3.8.1(b)');
  }
  if (input.trailerValue) {
    b.base('Trailer premium', t.trailerValueRate * input.trailerValue, `${pct(t.trailerValueRate)} x Trailer value`, 'Sec 3.8.1(c)');
  }
}

function computeBusPublicServiceComprehensive(b: BreakdownBuilder, input: MotorInput) {
  const seats = input.busSeats ?? 0;
  const band = T.BUS_PUBLIC_SERVICE_BANDS.find((x) => seats <= x.maxSeats) ?? T.BUS_PUBLIC_SERVICE_BANDS[T.BUS_PUBLIC_SERVICE_BANDS.length - 1];
  const amount = band.flat + band.valueRate * input.vehicleValue;
  b.base(
    `Public service bus premium (up to ${band.maxSeats === Infinity ? '36+' : band.maxSeats} seats incl. driver)`,
    amount,
    `Birr ${band.flat} + ${pct(band.valueRate)} x Value`,
    'Sec 3.2.1(a)',
  );
}

function sumType(b: BreakdownBuilder, type: 'base' | 'loading'): number {
  return b.lines.filter((l) => l.type === type).reduce((acc, l) => acc + l.amount, 0);
}

function pct(rate: number): string {
  const p = rate * 100;
  return `${Number.isInteger(p) ? p : p.toFixed(2).replace(/\.?0+$/, '')}%`;
}

function coverLabel(cover: CoverType): string {
  switch (cover) {
    case 'comprehensive':
      return 'Comprehensive';
    case 'third_party_only':
      return 'Third Party Only';
    case 'third_party_fire_theft':
      return 'Third Party, Fire & Theft';
  }
}
