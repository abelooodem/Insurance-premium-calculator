import { useMemo, useState } from 'react';
import { Field, FieldRow, NumberInput, Select, Checkbox, SectionCard } from '../FormField';
import { BreakdownView } from '../BreakdownView';
import { calcMarineCargo, type MarineCargoInput } from '../../engine/marine';
import { MARINE_COMMODITIES, type PackingMethod } from '../../tariffs/marine';

const COMMODITY_OPTIONS = MARINE_COMMODITIES.flatMap((g) =>
  g.items.map((i) => ({ value: i.code, label: `${i.code} ${i.name} (${g.groupName})` })),
);

const PACKING_OPTIONS: { value: PackingMethod; label: string }[] = [
  { value: 'cases', label: 'Cases' },
  { value: 'cartons', label: 'Cartons' },
  { value: 'bags', label: 'Bags' },
];

export function MarineForm() {
  const [commodityCode, setCommodityCode] = useState(COMMODITY_OPTIONS[0].value);
  const [packing, setPacking] = useState<PackingMethod>('cases');
  const [sumInsuredBirr, setSumInsuredBirr] = useState<number | undefined>(500_000);
  const [mode, setMode] = useState<'sea' | 'air'>('sea');
  const [isDeckCargo, setIsDeckCargo] = useState(false);
  const [transshipmentCount, setTransshipmentCount] = useState<number | undefined>(0);
  const [extensionDaysBeyond60, setExtensionDaysBeyond60] = useState<number | undefined>(0);
  const [beyondEthiopia, setBeyondEthiopia] = useState(false);
  const [isContainer, setIsContainer] = useState(false);
  const [isOpenCover, setIsOpenCover] = useState(false);
  const [includeBSG, setIncludeBSG] = useState(false);
  const [branchManagerDiscretionPct, setBranchManagerDiscretionPct] = useState<number | undefined>(0);

  const input: MarineCargoInput = useMemo(
    () => ({
      commodityCode,
      packing,
      sumInsuredBirr: sumInsuredBirr ?? 0,
      mode,
      isDeckCargo,
      transshipmentCount: transshipmentCount ?? 0,
      extensionDaysBeyond60: extensionDaysBeyond60 ?? 0,
      beyondEthiopia,
      isContainer,
      isOpenCover,
      includeBSG,
      branchManagerDiscretionPct,
    }),
    [commodityCode, packing, sumInsuredBirr, mode, isDeckCargo, transshipmentCount, extensionDaysBeyond60, beyondEthiopia, isContainer, isOpenCover, includeBSG, branchManagerDiscretionPct],
  );

  const breakdown = useMemo(() => calcMarineCargo(input), [input]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 print:grid-cols-1">
      <div className="flex flex-col gap-5 no-print">
        <SectionCard title="Cargo & Cover">
          <Field label="Commodity">
            <Select value={commodityCode} onChange={setCommodityCode} options={COMMODITY_OPTIONS} />
          </Field>
          <FieldRow>
            <Field label="Packing Method">
              <Select value={packing} onChange={setPacking} options={PACKING_OPTIONS} />
            </Field>
            <Field label="Sum Insured (Birr)">
              <NumberInput value={sumInsuredBirr} onChange={setSumInsuredBirr} />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label="Shipment Mode">
              <Select value={mode} onChange={setMode} options={[{ value: 'sea', label: 'Sea Freight' }, { value: 'air', label: 'Air Freight (40% of sea premium)' }]} />
            </Field>
          </FieldRow>
          <Checkbox checked={isDeckCargo} onChange={setIsDeckCargo} label="Deck cargo (double the under-deck rate)" />
          <Checkbox checked={beyondEthiopia} onChange={setBeyondEthiopia} label="Transit extends beyond Ethiopian territorial limits (+30%)" />
        </SectionCard>

        <SectionCard title="Extensions & Loadings">
          <FieldRow>
            <Field label="Number of Transshipments" hint="+25% of premium per transshipment">
              <NumberInput value={transshipmentCount} onChange={setTransshipmentCount} />
            </Field>
            <Field label="Extension Beyond 60 Days (additional days)">
              <NumberInput value={extensionDaysBeyond60} onChange={setExtensionDaysBeyond60} />
            </Field>
          </FieldRow>
          <Checkbox checked={includeBSG} onChange={setIncludeBSG} label="Include BSG extension (0.06% of value)" />
        </SectionCard>

        <SectionCard title="Discounts">
          <Checkbox checked={isOpenCover} onChange={setIsOpenCover} label="Open Cover policy (25% automatic discount)" />
          <Checkbox checked={isContainer} onChange={setIsContainer} label="Containerized shipment (10% discount, container clause attached)" />
          <Field label="Branch Manager Discretionary Discount (%)" hint="Max 30%, requires authorization">
            <NumberInput value={branchManagerDiscretionPct} onChange={setBranchManagerDiscretionPct} />
          </Field>
        </SectionCard>
      </div>
      <BreakdownView breakdown={breakdown} />
    </div>
  );
}
