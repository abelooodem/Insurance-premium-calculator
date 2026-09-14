import { useMemo, useState } from 'react';
import { Field, FieldRow, NumberInput, Select, SectionCard } from '../FormField';
import { BreakdownView } from '../BreakdownView';
import { calcMoney } from '../../engine/money';

export function MoneyForm() {
  const [coverType, setCoverType] = useState<'in_transit' | 'in_safe'>('in_transit');
  const [withinTown, setWithinTown] = useState(true);
  const [singleLossLimit, setSingleLossLimit] = useState<number | undefined>(100_000);
  const [annualCarrying, setAnnualCarrying] = useState<number | undefined>(3_000_000);
  const [safeSumInsured, setSafeSumInsured] = useState<number | undefined>(200_000);

  const breakdown = useMemo(
    () =>
      calcMoney({
        coverType,
        withinTown,
        singleLossLimit: singleLossLimit ?? 0,
        annualCarrying: annualCarrying ?? 0,
        safeSumInsured: safeSumInsured ?? 0,
      }),
    [coverType, withinTown, singleLossLimit, annualCarrying, safeSumInsured],
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 print:grid-cols-1">
      <div className="flex flex-col gap-5 no-print">
        <SectionCard title="Cover Type">
          <Field label="Cover">
            <Select value={coverType} onChange={setCoverType} options={[{ value: 'in_transit', label: 'Money In-Transit' }, { value: 'in_safe', label: 'Money in Safe' }]} />
          </Field>
        </SectionCard>
        {coverType === 'in_transit' ? (
          <SectionCard title="In-Transit Details">
            <Field label="Route">
              <Select value={withinTown ? 'within' : 'between'} onChange={(v) => setWithinTown(v === 'within')} options={[{ value: 'within', label: 'Within Towns' }, { value: 'between', label: 'Between Towns' }]} />
            </Field>
            <FieldRow>
              <Field label="Single Loss Limit (Birr)"><NumberInput value={singleLossLimit} onChange={setSingleLossLimit} /></Field>
              <Field label="Estimated Annual Carrying (Birr)"><NumberInput value={annualCarrying} onChange={setAnnualCarrying} /></Field>
            </FieldRow>
          </SectionCard>
        ) : (
          <SectionCard title="In-Safe Details">
            <Field label="Sum Insured on Money in Safe (Birr)">
              <NumberInput value={safeSumInsured} onChange={setSafeSumInsured} />
            </Field>
          </SectionCard>
        )}
      </div>
      <BreakdownView breakdown={breakdown} />
    </div>
  );
}
