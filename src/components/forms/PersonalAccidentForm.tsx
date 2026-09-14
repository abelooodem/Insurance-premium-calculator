import { useMemo, useState } from 'react';
import { Field, FieldRow, NumberInput, Select, Checkbox, SectionCard } from '../FormField';
import { BreakdownView } from '../BreakdownView';
import { calcPersonalAccident } from '../../engine/personalAccident';
import { PA_CLASSES, SPORT_LOADINGS } from '../../tariffs/personalAccident';

export function PersonalAccidentForm() {
  const [classNo, setClassNo] = useState<'1' | '2' | '3' | '4' | '5'>('1');
  const [numberOfPersons, setNumberOfPersons] = useState<number | undefined>(10);
  const [deathSumInsured, setDeathSumInsured] = useState<number | undefined>(100_000);
  const [permanentDisabilitySumInsured, setPermanentDisabilitySumInsured] = useState<number | undefined>(100_000);
  const [ttdMonthlyIndemnity, setTtdMonthlyIndemnity] = useState<number | undefined>(2_000);
  const [medicalExpensesLimit, setMedicalExpensesLimit] = useState<number | undefined>(10_000);
  const [sportLoadings, setSportLoadings] = useState<string[]>([]);
  const [worldwideExtension, setWorldwideExtension] = useState(false);
  const [includeMedicalIllnessExtension, setIncludeMedicalIllnessExtension] = useState(false);
  const [illnessMedicalLimit, setIllnessMedicalLimit] = useState<number | undefined>(5_000);

  const breakdown = useMemo(
    () =>
      calcPersonalAccident({
        classNo: Number(classNo) as 1 | 2 | 3 | 4 | 5,
        numberOfPersons: numberOfPersons ?? 0,
        deathSumInsured: deathSumInsured ?? 0,
        permanentDisabilitySumInsured: permanentDisabilitySumInsured ?? 0,
        ttdMonthlyIndemnity: ttdMonthlyIndemnity ?? 0,
        medicalExpensesLimit: medicalExpensesLimit ?? 0,
        sportLoadings,
        worldwideExtension,
        includeMedicalIllnessExtension,
        illnessMedicalLimit,
      }),
    [classNo, numberOfPersons, deathSumInsured, permanentDisabilitySumInsured, ttdMonthlyIndemnity, medicalExpensesLimit, sportLoadings, worldwideExtension, includeMedicalIllnessExtension, illnessMedicalLimit],
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 print:grid-cols-1">
      <div className="flex flex-col gap-5 no-print">
        <SectionCard title="Occupation Class & Group Size">
          <Field label="Occupation Classification">
            <Select<'1' | '2' | '3' | '4' | '5'>
              value={classNo}
              onChange={setClassNo}
              options={PA_CLASSES.map((c) => ({ value: String(c.classNo) as '1' | '2' | '3' | '4' | '5', label: c.label }))}
            />
          </Field>
          <p className="text-xs text-slate-500">Examples: {PA_CLASSES.find((c) => String(c.classNo) === classNo)?.examples.join(', ')}</p>
          <Field label="Number of Insured Persons" hint="Group Personal Accident requires 10 or more">
            <NumberInput value={numberOfPersons} onChange={setNumberOfPersons} />
          </Field>
        </SectionCard>

        <SectionCard title="Benefits (per person, Birr)">
          <FieldRow>
            <Field label="Death Benefit (Capital Sum Insured)"><NumberInput value={deathSumInsured} onChange={setDeathSumInsured} /></Field>
            <Field label="Permanent Disability (Capital Sum Insured)"><NumberInput value={permanentDisabilitySumInsured} onChange={setPermanentDisabilitySumInsured} /></Field>
          </FieldRow>
          <FieldRow>
            <Field label="Temporary Total Disablement (Monthly Indemnity)"><NumberInput value={ttdMonthlyIndemnity} onChange={setTtdMonthlyIndemnity} /></Field>
            <Field label="Medical Expenses Limit"><NumberInput value={medicalExpensesLimit} onChange={setMedicalExpensesLimit} /></Field>
          </FieldRow>
        </SectionCard>

        <SectionCard title="Extensions & Loadings">
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Sport Activity Loadings</p>
            <div className="grid grid-cols-2 gap-2">
              {SPORT_LOADINGS.map((s) => (
                <Checkbox
                  key={s.key}
                  checked={sportLoadings.includes(s.key)}
                  onChange={(checked) => setSportLoadings(checked ? [...sportLoadings, s.key] : sportLoadings.filter((k) => k !== s.key))}
                  label={`${s.label} (+${s.rate * 100}%)`}
                />
              ))}
            </div>
          </div>
          <Checkbox checked={worldwideExtension} onChange={setWorldwideExtension} label="Worldwide geographical extension (+6.75% of basic premium)" />
          <Checkbox checked={includeMedicalIllnessExtension} onChange={setIncludeMedicalIllnessExtension} label="Medical Expenses for Illness extension (15% of limit, per person)" />
          {includeMedicalIllnessExtension && (
            <Field label="Illness Medical Expenses Limit (Birr 3,000 - 10,000/person)">
              <NumberInput value={illnessMedicalLimit} onChange={setIllnessMedicalLimit} />
            </Field>
          )}
        </SectionCard>
      </div>
      <BreakdownView breakdown={breakdown} />
    </div>
  );
}
