import { BreakdownBuilder, type PremiumBreakdown } from '../types/engine';
import * as T from '../tariffs/carriersLiability';

export interface CarriersLiabilityInput {
  cargoType: 'fuel' | 'dry';
  liabilityLimitPerVehicle: number;
  numberOfVehicles: number;
  extendToSudan: boolean;
  includeBSG: boolean;
}

export function calcCarriersLiability(input: CarriersLiabilityInput): PremiumBreakdown {
  const annualCarryingPerVehicle = input.liabilityLimitPerVehicle * T.CARRIERS_LIABILITY_ANNUAL_CARRYING_MULTIPLIER;
  const totalAnnualCarrying = annualCarryingPerVehicle * input.numberOfVehicles;
  const b = new BreakdownBuilder(
    'Carriers’ Liability',
    `${input.cargoType === 'fuel' ? 'Fuel' : 'Dry'} Cargo - ${input.numberOfVehicles} vehicle(s)`,
    totalAnnualCarrying,
    'Total Annual Carrying (fleet)',
  );

  const rate = input.cargoType === 'fuel' ? T.CARRIERS_LIABILITY_RATES.fuelCargo : T.CARRIERS_LIABILITY_RATES.dryCargo;
  b.info(`Annual Carrying per vehicle = Birr ${input.liabilityLimitPerVehicle.toLocaleString()} x ${T.CARRIERS_LIABILITY_ANNUAL_CARRYING_MULTIPLIER}`, 0);
  let premium = totalAnnualCarrying * rate;
  b.base('Carriers’ Liability premium', premium, `${formatSI(totalAnnualCarrying)} (total annual carrying) x ${rate * 100}%`, 'Carriers’ Liability Rate Chart');

  if (input.extendToSudan) {
    b.loading('Geographical extension to Sudan', premium * T.CARRIERS_LIABILITY_SUDAN_LOADING, `${T.CARRIERS_LIABILITY_SUDAN_LOADING * 100}% x Base premium`, 'Sudan extension clause');
  }

  const tier = T.CARRIERS_LIABILITY_FLEET_DISCOUNT.find((t) => input.numberOfVehicles >= t.min && input.numberOfVehicles <= t.max);
  if (tier) {
    const soFar = sumBaseLoading(b);
    b.discount(`Fleet discount (${input.numberOfVehicles} vehicles)`, soFar * tier.discount, `${(tier.discount * 100).toFixed(0)}% x Premium`, 'Fleet Discount table');
    if (tier.min === 151 && tier.max === 200) {
      b.warn('The fleet discount table prints this tier as "115-200" in the source document, which breaks the otherwise sequential bands (101-150, then 201-300). This has been treated as a likely typo for "151-200" - confirm with Head Office before relying on it.');
    }
  }

  if (input.includeBSG) {
    const bsgRate = input.cargoType === 'fuel' ? T.CARRIERS_LIABILITY_BSG_RATES.fuelCargo : T.CARRIERS_LIABILITY_BSG_RATES.dryCargo;
    b.extension('BSG extension', totalAnnualCarrying * bsgRate, `${formatSI(totalAnnualCarrying)} x ${bsgRate * 100}%`, 'BSG Rate (no fleet discount applies)');
  }

  const excessNote = input.cargoType === 'fuel'
    ? `Excess: Birr ${T.CARRIERS_LIABILITY_EXCESS.fuelCargo.flat.toLocaleString()} or ${T.CARRIERS_LIABILITY_EXCESS.fuelCargo.pctOfLoss * 100}% of the loss amount, whichever is higher.`
    : excessNoteForDry(input.liabilityLimitPerVehicle);
  b.assume(excessNote);
  b.assume(`Crane and cargo-handling limit: up to Birr ${T.CARRIERS_LIABILITY_CRANE_CARGO_LIMIT.toLocaleString()} per event, included within the liability limit per truck and trailer.`);

  return b.build();
}

function excessNoteForDry(limit: number): string {
  const tier = T.CARRIERS_LIABILITY_EXCESS.dryCargoTiers.find((t) => limit <= t.maxLimit);
  if (!tier) return 'Liability limit exceeds Birr 700,000 per truck and trailer - refer to Head Office.';
  return `Excess: Birr ${tier.flat.toLocaleString()} or ${tier.pctOfLoss * 100}% of the loss amount, whichever is higher (for liability limit up to Birr ${tier.maxLimit.toLocaleString()} per truck & trailer).`;
}

function sumBaseLoading(b: BreakdownBuilder) {
  return b.lines.filter((l) => l.type === 'base' || l.type === 'loading').reduce((a, l) => a + l.amount, 0);
}
function formatSI(si: number) {
  return `Birr ${si.toLocaleString()}`;
}
