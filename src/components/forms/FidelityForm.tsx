import { useMemo, useState } from 'react';
import { Field, FieldRow, NumberInput, SectionCard } from '../FormField';
import { BreakdownView } from '../BreakdownView';
import { calcFidelity } from '../../engine/fidelity';

export function FidelityForm() {
  const [limitOfIndemnityPerPerson, setLimitOfIndemnityPerPerson] = useState<number | undefined>(25_000);
  const [numberOfPersons, setNumberOfPersons] = useState<number | undefined>(1);

  const breakdown = useMemo(
    () => calcFidelity({ limitOfIndemnityPerPerson: limitOfIndemnityPerPerson ?? 0, numberOfPersons: numberOfPersons ?? 1 }),
    [limitOfIndemnityPerPerson, numberOfPersons],
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 print:grid-cols-1">
      <SectionCard title="Fidelity Guarantee Details" className="no-print">
        <FieldRow>
          <Field label="Limit of Indemnity per Person (Birr)">
            <NumberInput value={limitOfIndemnityPerPerson} onChange={setLimitOfIndemnityPerPerson} />
          </Field>
          <Field label="Number of Persons Guaranteed">
            <NumberInput value={numberOfPersons} onChange={setNumberOfPersons} min={1} />
          </Field>
        </FieldRow>
      </SectionCard>
      <BreakdownView breakdown={breakdown} />
    </div>
  );
}
