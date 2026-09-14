import { BreakdownBuilder, type PremiumBreakdown } from '../types/engine';
import * as T from '../tariffs/engineering';

export interface CpmInput {
  optionKey: string;
  sumInsured: number;
}

export function calcCpm(input: CpmInput): PremiumBreakdown {
  const opt = T.CPM_OPTIONS.find((o) => o.key === input.optionKey)!;
  const b = new BreakdownBuilder('Engineering', `Contractors' Plant & Machinery - ${opt.label} (Combined Cover)`, input.sumInsured);
  b.base(
    'CPM combined premium (own damage + transit + SRCC)',
    input.sumInsured * opt.combinedRate,
    `${formatSI(input.sumInsured)} x ${pct(opt.combinedRate)}`,
    'CPM Rate Chart',
  );
  b.info(`Applicable deductible: Birr ${opt.deductible.flat.toLocaleString()} or ${pct(opt.deductible.pctOfLoss)} of the loss (incl. protection & removal cost), whichever is higher`);
  return b.build();
}

export interface BoilerInput {
  boilerType: 'fire_tube' | 'water_tube';
  ageBandIndex: number;
  sumInsured: number;
  includeLiability: boolean;
  liabilityLimit?: number;
}

export function calcBoilerExplosion(input: BoilerInput): PremiumBreakdown {
  const band = T.BOILER_AGE_BANDS[input.ageBandIndex];
  const b = new BreakdownBuilder('Engineering', `Boiler Explosion - ${input.boilerType === 'fire_tube' ? 'Fire Tube' : 'Water Tube'} Boiler (${band.label})`, input.sumInsured);
  const rate = input.boilerType === 'fire_tube' ? band.fireTubeRate : band.waterTubeRate;
  b.base('Boiler explosion premium (on value of boiler)', (input.sumInsured * rate) / 1000, `${formatSI(input.sumInsured)} x ${rate} per mille`, 'Boiler Explosion Rate Chart');

  if (input.includeLiability && input.liabilityLimit) {
    if (band.liabilityRate === null) {
      b.warn('No surrounding-property / third-party liability rate is available for this age band.');
    } else {
      b.extension(
        'Surrounding property / Third Party Liability',
        (input.liabilityLimit * band.liabilityRate) / 1000,
        `${formatSI(input.liabilityLimit)} (limit) x ${band.liabilityRate} per mille`,
        'Boiler Explosion Rate Chart',
      );
    }
  }

  b.setMinimumPremium(T.BOILER_MIN_PREMIUM);

  if (input.ageBandIndex >= 2) {
    b.assume(`Deductible: ${pct(T.BOILER_DEDUCTIBLE_OVER30.pctOfSI)} of sum insured, minimum Birr ${T.BOILER_DEDUCTIBLE_OVER30.min}.`);
  } else {
    b.assume('No deductible is specified in the tariff for boilers up to 30 years old.');
  }
  b.assume('Cover is subject to a satisfactory inspection report, per the rate chart.');
  return b.build();
}

function pct(rate: number) {
  const p = rate * 100;
  return `${Number.isInteger(p) ? p : p.toFixed(3).replace(/\.?0+$/, '')}%`;
}
function formatSI(si: number) {
  return `Birr ${si.toLocaleString()}`;
}
