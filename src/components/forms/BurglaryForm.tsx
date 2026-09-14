import { useMemo, useState } from 'react';
import { Field, NumberInput, Select, SectionCard } from '../FormField';
import { BreakdownView } from '../BreakdownView';
import { calcBurglary } from '../../engine/burglary';
import { PRIVATE_PREMISES_RATES, COMMERCIAL_RATES, INDUSTRIAL_MACHINERY_RATES, INDUSTRIAL_CONTENTS_RATES } from '../../tariffs/burglary';

const RATE_GROUPS = [
  { label: 'Private Premises', rates: PRIVATE_PREMISES_RATES },
  { label: 'Commercial Risks', rates: COMMERCIAL_RATES },
  { label: 'Industrial - Machinery Only', rates: INDUSTRIAL_MACHINERY_RATES },
  { label: 'Industrial - Other Contents', rates: INDUSTRIAL_CONTENTS_RATES },
];
const RATE_OPTIONS = RATE_GROUPS.flatMap((g) => g.rates.map((r) => ({ value: r.key, label: r.label })));

export function BurglaryForm() {
  const [rateKey, setRateKey] = useState(RATE_OPTIONS[0].value);
  const [category, setCategory] = useState<'A' | 'A1'>('A');
  const [sumInsured, setSumInsured] = useState<number | undefined>(500_000);
  const [basis, setBasis] = useState<'full_value' | 'first_loss'>('full_value');
  const [firstLossAmount, setFirstLossAmount] = useState<number | undefined>(100_000);

  const breakdown = useMemo(
    () => calcBurglary({ rateKey, category, sumInsured: sumInsured ?? 0, basis, firstLossAmount }),
    [rateKey, category, sumInsured, basis, firstLossAmount],
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 print:grid-cols-1">
      <div className="flex flex-col gap-5 no-print">
        <SectionCard title="Risk Classification">
          <Field label="Premises / Risk Type">
            <Select value={rateKey} onChange={setRateKey} options={RATE_OPTIONS} />
          </Field>
          <Field label="Protection Category" hint="A = adequate protection & watchmen. A1 = adequate protection, no watchmen.">
            <Select value={category} onChange={setCategory} options={[{ value: 'A', label: 'Category A (with watchmen)' }, { value: 'A1', label: 'Category A1 (without watchmen)' }]} />
          </Field>
        </SectionCard>
        <SectionCard title="Sum Insured & Basis">
          <Field label="Full Sum Insured (Birr)">
            <NumberInput value={sumInsured} onChange={setSumInsured} />
          </Field>
          <Field label="Basis of Cover">
            <Select value={basis} onChange={setBasis} options={[{ value: 'full_value', label: 'Full Value Basis' }, { value: 'first_loss', label: 'First Loss Basis' }]} />
          </Field>
          {basis === 'first_loss' && (
            <Field label="First Loss Amount (Birr)" hint="Must reflect the practical maximum risk">
              <NumberInput value={firstLossAmount} onChange={setFirstLossAmount} />
            </Field>
          )}
        </SectionCard>
      </div>
      <BreakdownView breakdown={breakdown} />
    </div>
  );
}
