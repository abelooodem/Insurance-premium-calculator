import { BreakdownBuilder, type PremiumBreakdown } from '../types/engine';
import * as T from '../tariffs/burglary';

export interface BurglaryInput {
  rateKey: string;
  category: 'A' | 'A1';
  sumInsured: number;
  basis: 'full_value' | 'first_loss';
  firstLossAmount?: number;
}

const ALL_RATES = [...T.PRIVATE_PREMISES_RATES, ...T.COMMERCIAL_RATES, ...T.INDUSTRIAL_MACHINERY_RATES, ...T.INDUSTRIAL_CONTENTS_RATES];

export function calcBurglary(input: BurglaryInput): PremiumBreakdown {
  const rateDef = ALL_RATES.find((r) => r.key === input.rateKey);
  const b = new BreakdownBuilder('Burglary / Theft', rateDef ? rateDef.label : 'Burglary / Theft', input.sumInsured);
  if (!rateDef) {
    b.warn('Select a premises/risk classification to compute the rate.');
    return b.build();
  }
  const rate = input.category === 'A' ? rateDef.categoryA : rateDef.categoryA1;
  const fullValuePremium = (input.sumInsured * rate) / 1000;
  b.base(`Full-value premium (Category ${input.category})`, fullValuePremium, `${formatSI(input.sumInsured)} x ${rate} per mille`, 'Burglary Rate Chart');

  if (input.basis === 'first_loss') {
    if (input.sumInsured < T.FIRST_LOSS_MIN_STOCK_VALUE) {
      b.warn(`First Loss policies are not issued where the full value of the stock is under Birr ${T.FIRST_LOSS_MIN_STOCK_VALUE.toLocaleString()}.`);
    }
    const firstLoss = input.firstLossAmount ?? 0;
    const pctOfFullValue = input.sumInsured > 0 ? (firstLoss / input.sumInsured) * 100 : 0;
    const tier = T.FIRST_LOSS_TABLE.find((t) => pctOfFullValue <= t.pctOfFullValue) ?? T.FIRST_LOSS_TABLE[T.FIRST_LOSS_TABLE.length - 1];
    const firstLossPremium = fullValuePremium * (tier.pctOfPremium / 100);
    const reduction = fullValuePremium - firstLossPremium;
    if (reduction > 0) {
      b.discount(
        `First Loss basis adjustment (First Loss = ${pctOfFullValue.toFixed(1)}% of full value → ${tier.pctOfPremium}% of full premium charged)`,
        reduction,
        `Full premium x (1 - ${tier.pctOfPremium}%)`,
        'First Loss Burglary formula',
      );
    }
    b.assume('First Loss policies replace the standard Average clause with the First Loss endorsement per the rate chart (Condition 7 cancelled).');
  } else if (input.sumInsured > T.FULL_VALUE_DISCOUNT_THRESHOLD) {
    const tier = T.FULL_VALUE_DISCOUNT_TIERS.find((t) => input.sumInsured <= t.max)!;
    b.discount(`Full-value basis discount (Sum Insured over Birr ${T.FULL_VALUE_DISCOUNT_THRESHOLD.toLocaleString()})`, fullValuePremium * tier.discount, `${(tier.discount * 100).toFixed(0)}% x Full-value premium`, 'Sec 5, Full Value discount scale');
  }

  b.setMinimumPremium(T.BURGLARY_MIN_PREMIUM);
  return b.build();
}

function formatSI(si: number) {
  return `Birr ${si.toLocaleString()}`;
}
