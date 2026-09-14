import { useMemo, useState } from 'react';
import { Field, FieldRow, NumberInput, Select, Checkbox, SectionCard } from '../FormField';
import { BreakdownView } from '../BreakdownView';
import { calcCpm, calcBoilerExplosion } from '../../engine/engineering';
import { CPM_OPTIONS, BOILER_AGE_BANDS } from '../../tariffs/engineering';

type Product = 'cpm' | 'boiler' | 'car_ear_mb';

const PRODUCT_OPTIONS: { value: Product; label: string }[] = [
  { value: 'cpm', label: "Contractors' Plant & Machinery (CPM)" },
  { value: 'boiler', label: 'Boiler Explosion' },
  { value: 'car_ear_mb', label: 'CAR / EAR / Machinery Breakdown / Electronic Equipment' },
];

export function EngineeringForm() {
  const [product, setProduct] = useState<Product>('cpm');
  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Product" className="no-print">
        <Field label="Engineering Product">
          <Select value={product} onChange={setProduct} options={PRODUCT_OPTIONS} />
        </Field>
      </SectionCard>
      {product === 'cpm' && <CpmPanel />}
      {product === 'boiler' && <BoilerPanel />}
      {product === 'car_ear_mb' && <CarEarPlaceholder />}
    </div>
  );
}

function CpmPanel() {
  const [optionKey, setOptionKey] = useState(CPM_OPTIONS[0].key);
  const [sumInsured, setSumInsured] = useState<number | undefined>(1_000_000);
  const breakdown = useMemo(() => calcCpm({ optionKey, sumInsured: sumInsured ?? 0 }), [optionKey, sumInsured]);
  const opt = CPM_OPTIONS.find((o) => o.key === optionKey)!;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 print:grid-cols-1">
      <SectionCard title="CPM Cover Details" className="no-print">
        <Field label="Cover Option">
          <Select value={optionKey} onChange={setOptionKey} options={CPM_OPTIONS.map((o) => ({ value: o.key, label: `${o.label} - Combined ${(o.combinedRate * 100).toFixed(3)}%, deductible Birr ${o.deductible.flat.toLocaleString()} or ${(o.deductible.pctOfLoss * 100)}% of loss` }))} />
        </Field>
        <Field label="Sum Insured (Birr)">
          <NumberInput value={sumInsured} onChange={setSumInsured} />
        </Field>
        <p className="text-xs text-slate-500">
          Combined cover = CPM own-damage ({(opt.cpmOnlyRate * 100).toFixed(3)}%) + Transit extension ({(opt.transitExtensionRate * 100).toFixed(3)}%) + SRCC extension ({(opt.srccExtensionRate * 100).toFixed(3)}%).
        </p>
      </SectionCard>
      <BreakdownView breakdown={breakdown} />
    </div>
  );
}

function BoilerPanel() {
  const [boilerType, setBoilerType] = useState<'fire_tube' | 'water_tube'>('fire_tube');
  const [ageBandIndex, setAgeBandIndex] = useState(0);
  const [sumInsured, setSumInsured] = useState<number | undefined>(500_000);
  const [includeLiability, setIncludeLiability] = useState(false);
  const [liabilityLimit, setLiabilityLimit] = useState<number | undefined>(100_000);

  const breakdown = useMemo(
    () => calcBoilerExplosion({ boilerType, ageBandIndex, sumInsured: sumInsured ?? 0, includeLiability, liabilityLimit }),
    [boilerType, ageBandIndex, sumInsured, includeLiability, liabilityLimit],
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 print:grid-cols-1">
      <SectionCard title="Boiler Details" className="no-print">
        <FieldRow>
          <Field label="Boiler Type">
            <Select value={boilerType} onChange={setBoilerType} options={[{ value: 'fire_tube', label: 'Fire Tube Boiler' }, { value: 'water_tube', label: 'Water Tube Boiler' }]} />
          </Field>
          <Field label="Boiler Age">
            <Select value={String(ageBandIndex)} onChange={(v) => setAgeBandIndex(Number(v))} options={BOILER_AGE_BANDS.map((b, i) => ({ value: String(i), label: b.label }))} />
          </Field>
        </FieldRow>
        <Field label="Sum Insured / Value of Boiler (Birr)">
          <NumberInput value={sumInsured} onChange={setSumInsured} />
        </Field>
        <Checkbox checked={includeLiability} onChange={setIncludeLiability} label="Include surrounding property / third party liability cover" />
        {includeLiability && (
          <Field label="Liability Limit of Indemnity (Birr)">
            <NumberInput value={liabilityLimit} onChange={setLiabilityLimit} />
          </Field>
        )}
      </SectionCard>
      <BreakdownView breakdown={breakdown} />
    </div>
  );
}

function CarEarPlaceholder() {
  return (
    <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-6 text-sm text-amber-900">
      <p className="font-semibold">Base rates not available in the uploaded tariff</p>
      <p className="mt-2">
        The uploaded "ENGINEERING_RATE_CHART" document contains only the general Munich Re reinsurance-treaty underwriting and rating{' '}
        <em>directives</em> and standard endorsement wordings for Erection All Risks (EAR). The actual numeric Rating Schedule (Section B) -
        i.e. the per-mille base rate by plant/machine type, the susceptibility-class and earthquake-zone tables, the standard deductible
        amounts, and the minimum premium - are all printed as blank "*" placeholders in the source file itself. Contractors' All Risks (CAR),
        Machinery Breakdown and Electronic Equipment Insurance base rates were not included in any uploaded document at all.
      </p>
      <p className="mt-2">The following <strong>structural rules</strong> were numerically stated and are ready to use once base rates are supplied:</p>
      <ul className="mt-1 list-disc space-y-1 pl-5">
        <li>Third Party Liability loading: 5% / 10% / 15% (no special hazard) rising to 15% / 20% / 25% (fire/explosion/collapse exposure in populated areas), by indemnity-limit tier (25% / 50% / 100% of the Reinsurance Treaty Limit).</li>
        <li>Cross Liability extension: +5% of the Section I (items 1 &amp; 2) premium.</li>
        <li>Maintenance Visits extension: +10%; Extended Maintenance: +15% to +20%.</li>
        <li>Deductible-increase discount: 2x deductible &rarr; 7.5% off; 5x &rarr; 15% off; 10x &rarr; 20% off.</li>
      </ul>
      <p className="mt-2">
        To activate CAR / EAR / Machinery Breakdown / Electronic Equipment calculators, provide the filled-in Rating Schedule 1.1 (per plant
        type), the earthquake zone map/table, the standard deductible table, and the minimum premium figure from your reinsurer or Head
        Office circular.
      </p>
    </div>
  );
}
