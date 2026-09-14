import { BreakdownBuilder, type PremiumBreakdown } from '../types/engine';
import * as T from '../tariffs/personalAccident';

export interface PersonalAccidentInput {
  classNo: 1 | 2 | 3 | 4 | 5;
  numberOfPersons: number;
  deathSumInsured: number;
  permanentDisabilitySumInsured: number;
  ttdMonthlyIndemnity: number;
  medicalExpensesLimit: number;
  sportLoadings: string[];
  worldwideExtension: boolean;
  includeMedicalIllnessExtension: boolean;
  illnessMedicalLimit?: number;
}

export function calcPersonalAccident(input: PersonalAccidentInput): PremiumBreakdown {
  const cls = T.PA_CLASSES.find((c) => c.classNo === input.classNo)!;
  const totalCapital = (input.deathSumInsured + input.permanentDisabilitySumInsured + input.ttdMonthlyIndemnity + input.medicalExpensesLimit) * Math.max(1, input.numberOfPersons);
  const b = new BreakdownBuilder('Personal Accident / GPA', `${cls.label} (${input.numberOfPersons} person(s))`, totalCapital, 'Total Capital Sum Insured (all benefits, all persons)');

  if (input.numberOfPersons < T.PA_MIN_INSURED_PERSONS) {
    b.warn(`Tariff requires the number of insured persons to be not less than ${T.PA_MIN_INSURED_PERSONS} (Group Personal Accident).`);
  }

  const n = Math.max(1, input.numberOfPersons);

  b.base('Death benefit premium', input.deathSumInsured * (cls.deathRate / 100) * n, `Birr ${input.deathSumInsured.toLocaleString()} x ${cls.deathRate}% x ${n} person(s)`, 'Rate Chart, Death column');
  b.base(
    'Permanent Disability benefit premium',
    input.permanentDisabilitySumInsured * (cls.permanentDisabilityRate / 100) * n,
    `Birr ${input.permanentDisabilitySumInsured.toLocaleString()} x ${cls.permanentDisabilityRate}% x ${n} person(s)`,
    'Rate Chart, Permanent Disability column',
  );
  b.base(
    'Temporary Total Disablement premium',
    input.ttdMonthlyIndemnity * (cls.ttdRate / 100) * n,
    `Birr ${input.ttdMonthlyIndemnity.toLocaleString()} (monthly indemnity) x ${cls.ttdRate}% x ${n} person(s)`,
    'Rate Chart, TTD column',
  );
  b.base(
    'Medical Expenses premium',
    input.medicalExpensesLimit * (cls.medicalExpensesRate / 100) * n,
    `Birr ${input.medicalExpensesLimit.toLocaleString()} x ${cls.medicalExpensesRate}% x ${n} person(s)`,
    'Rate Chart, Medical Expenses column',
  );

  const baseSoFar = sumBase(b);

  for (const key of input.sportLoadings) {
    const s = T.SPORT_LOADINGS.find((x) => x.key === key);
    if (!s) continue;
    b.loading(`${s.label} loading`, baseSoFar * s.rate, `${pct(s.rate)} x Basic premium`, 'Additional charges for sport activities');
  }

  if (input.worldwideExtension) {
    b.extension('Worldwide geographical extension', baseSoFar * T.WORLDWIDE_EXTENSION_RATE, `${pct(T.WORLDWIDE_EXTENSION_RATE)} x Basic premium`, 'Geographical Limit extension');
  }

  if (input.includeMedicalIllnessExtension && input.illnessMedicalLimit) {
    b.extension(
      'Medical Expenses for Illness extension',
      input.illnessMedicalLimit * T.MEDICAL_ILLNESS_EXTENSION.rate * n,
      `Birr ${input.illnessMedicalLimit.toLocaleString()} x ${pct(T.MEDICAL_ILLNESS_EXTENSION.rate)} x ${n} person(s)`,
      'Medical Expenses for Illness (Extension)',
    );
    if (input.illnessMedicalLimit < T.MEDICAL_ILLNESS_EXTENSION.minIndemnityPerPerson || input.illnessMedicalLimit > T.MEDICAL_ILLNESS_EXTENSION.maxIndemnityPerPerson) {
      b.warn(
        `Illness medical expenses limit must be between Birr ${T.MEDICAL_ILLNESS_EXTENSION.minIndemnityPerPerson.toLocaleString()} and Birr ${T.MEDICAL_ILLNESS_EXTENSION.maxIndemnityPerPerson.toLocaleString()} per person.`,
      );
    }
    b.assume(`Excess of Birr ${T.MEDICAL_ILLNESS_EXTENSION.excessPerClaim} applies to each and every illness claim under this extension.`);
  }

  b.setMinimumPremium(T.PA_MIN_PREMIUM);
  return b.build();
}

function sumBase(b: BreakdownBuilder) {
  return b.lines.filter((l) => l.type === 'base').reduce((a, l) => a + l.amount, 0);
}
function pct(rate: number) {
  const p = rate * 100;
  return `${Number.isInteger(p) ? p : p.toFixed(2).replace(/\.?0+$/, '')}%`;
}
