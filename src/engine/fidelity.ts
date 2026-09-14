import { BreakdownBuilder, type PremiumBreakdown } from '../types/engine';
import * as T from '../tariffs/fidelity';

export interface FidelityInput {
  limitOfIndemnityPerPerson: number;
  numberOfPersons: number;
}

export function calcFidelity(input: FidelityInput): PremiumBreakdown {
  const totalLimit = input.limitOfIndemnityPerPerson * Math.max(1, input.numberOfPersons);
  const b = new BreakdownBuilder('Fidelity Guarantee', 'Fidelity Guarantee Bond', totalLimit);

  if (input.limitOfIndemnityPerPerson > T.FIDELITY_RATE_STATED_CEILING && input.limitOfIndemnityPerPerson < T.FIDELITY_EXCESS_DISCOUNT_THRESHOLD) {
    b.warn(
      `The tariff explicitly rates only limits up to Birr ${T.FIDELITY_RATE_STATED_CEILING.toLocaleString()} per person at 1%, and separately discounts the excess above Birr ${T.FIDELITY_EXCESS_DISCOUNT_THRESHOLD.toLocaleString()}. No rate is stated for the Birr ${T.FIDELITY_RATE_STATED_CEILING.toLocaleString()}-${T.FIDELITY_EXCESS_DISCOUNT_THRESHOLD.toLocaleString()} band; the base 1% rate has been applied uniformly to that band pending confirmation from Head Office.`,
    );
  }

  if (input.limitOfIndemnityPerPerson <= T.FIDELITY_EXCESS_DISCOUNT_THRESHOLD) {
    b.base('Fidelity Guarantee premium', totalLimit * T.FIDELITY_RATE, `Birr ${totalLimit.toLocaleString()} x ${T.FIDELITY_RATE * 100}%`, 'Fidelity Guarantee Rate Chart');
  } else {
    const thresholdTotal = T.FIDELITY_EXCESS_DISCOUNT_THRESHOLD * Math.max(1, input.numberOfPersons);
    const excessTotal = totalLimit - thresholdTotal;
    b.base(`Premium on first Birr ${T.FIDELITY_EXCESS_DISCOUNT_THRESHOLD.toLocaleString()} per person`, thresholdTotal * T.FIDELITY_RATE, `Birr ${thresholdTotal.toLocaleString()} x ${T.FIDELITY_RATE * 100}%`, 'Fidelity Guarantee Rate Chart');
    const discountedRate = T.FIDELITY_RATE * (1 - T.FIDELITY_EXCESS_DISCOUNT);
    b.base(
      `Premium on excess over Birr ${T.FIDELITY_EXCESS_DISCOUNT_THRESHOLD.toLocaleString()} per person (30% discount applied)`,
      excessTotal * discountedRate,
      `Birr ${excessTotal.toLocaleString()} x ${(discountedRate * 100).toFixed(2)}% (${T.FIDELITY_RATE * 100}% less ${T.FIDELITY_EXCESS_DISCOUNT * 100}%)`,
      'Fidelity Guarantee Rate Chart',
    );
  }

  b.setMinimumPremium(T.FIDELITY_MIN_PREMIUM);
  return b.build();
}
