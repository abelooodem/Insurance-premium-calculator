import { useMemo, useState } from 'react';
import { Field, FieldRow, NumberInput, Select, Checkbox, SectionCard } from '../FormField';
import { BreakdownView } from '../BreakdownView';
import { calcCarriersLiability } from '../../engine/carriersLiability';

export function CarriersLiabilityForm() {
  const [cargoType, setCargoType] = useState<'fuel' | 'dry'>('dry');
  const [liabilityLimitPerVehicle, setLiabilityLimitPerVehicle] = useState<number | undefined>(200_000);
  const [numberOfVehicles, setNumberOfVehicles] = useState<number | undefined>(20);
  const [extendToSudan, setExtendToSudan] = useState(false);
  const [includeBSG, setIncludeBSG] = useState(false);

  const breakdown = useMemo(
    () =>
      calcCarriersLiability({
        cargoType,
        liabilityLimitPerVehicle: liabilityLimitPerVehicle ?? 0,
        numberOfVehicles: numberOfVehicles ?? 0,
        extendToSudan,
        includeBSG,
      }),
    [cargoType, liabilityLimitPerVehicle, numberOfVehicles, extendToSudan, includeBSG],
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 print:grid-cols-1">
      <div className="flex flex-col gap-5 no-print">
        <SectionCard title="Fleet & Cargo Details">
          <Field label="Cargo Type">
            <Select value={cargoType} onChange={setCargoType} options={[{ value: 'dry', label: 'Dry Cargo' }, { value: 'fuel', label: 'Fuel Cargo' }]} />
          </Field>
          <FieldRow>
            <Field label="Liability Limit per Truck & Trailer (Birr)">
              <NumberInput value={liabilityLimitPerVehicle} onChange={setLiabilityLimitPerVehicle} />
            </Field>
            <Field label="Number of Vehicles">
              <NumberInput value={numberOfVehicles} onChange={setNumberOfVehicles} />
            </Field>
          </FieldRow>
        </SectionCard>
        <SectionCard title="Extensions">
          <Checkbox checked={extendToSudan} onChange={setExtendToSudan} label="Extend geographical limit to Sudan (+25%)" />
          <Checkbox checked={includeBSG} onChange={setIncludeBSG} label="Include BSG extension" />
        </SectionCard>
      </div>
      <BreakdownView breakdown={breakdown} />
    </div>
  );
}
