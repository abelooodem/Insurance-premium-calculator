import { BreakdownBuilder, type PremiumBreakdown } from '../types/engine';
import * as T from '../tariffs/money';

export interface MoneyInput {
  coverType: 'in_transit' | 'in_safe';
  withinTown: boolean;
  singleLossLimit: number;
  annualCarrying: number;
  safeSumInsured: number;
}

export function calcMoney(input: MoneyInput): PremiumBreakdown {
  if (input.coverType === 'in_safe') {
    const b = new BreakdownBuilder('Money Insurance', 'Money in Safe', input.safeSumInsured);
    b.base('Money in safe premium', (input.safeSumInsured * T.MONEY_IN_SAFE_RATE) / 1000, `Birr ${input.safeSumInsured.toLocaleString()} x ${T.MONEY_IN_SAFE_RATE} per mille`, 'In Safe rate');
    b.setMinimumPremium(T.MONEY_MIN_PREMIUM);
    return b.build();
  }

  const b = new BreakdownBuilder('Money Insurance', 'Money In-Transit', input.singleLossLimit, 'Single Loss Limit');
  const rate = input.withinTown ? T.MONEY_IN_TRANSIT.singleLossLimitWithinTown : T.MONEY_IN_TRANSIT.singleLossLimitBetweenTowns;
  b.base(
    `Single Loss Limit premium (${input.withinTown ? 'within towns' : 'between towns'})`,
    (input.singleLossLimit * rate) / 1000,
    `Birr ${input.singleLossLimit.toLocaleString()} x ${rate} per mille`,
    'In-Transit rate',
  );

  const annualCarryingPremium = (input.annualCarrying * T.MONEY_IN_TRANSIT.annualCarryingRate) / 1000;
  b.base('Estimated Annual Carrying premium', annualCarryingPremium, `Birr ${input.annualCarrying.toLocaleString()} x ${T.MONEY_IN_TRANSIT.annualCarryingRate} per mille`, 'In-Transit rate');

  const tier = T.MONEY_SPECIAL_DISCOUNT_TIERS.find((t) => input.annualCarrying >= t.min && input.annualCarrying <= t.max);
  if (tier) {
    b.discount(
      `Special discount on annual carrying (over Birr ${tier.min.toLocaleString()})`,
      annualCarryingPremium * tier.discount,
      `${(tier.discount * 100).toFixed(1)}% x Annual Carrying premium`,
      'Special Discount table',
    );
  } else if (input.annualCarrying > 2_250_000 && input.annualCarrying < 2_500_000) {
    b.warn('Annual carrying falls in a gap between the printed discount tiers (over Birr 2,250,000 but not yet over Birr 2,500,000) - this gap is exactly as printed in the source tariff. Confirm the applicable discount with Head Office.');
  }

  b.setMinimumPremium(T.MONEY_MIN_PREMIUM);
  return b.build();
}
