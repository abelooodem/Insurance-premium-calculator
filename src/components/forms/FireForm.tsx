import { useMemo, useState } from 'react';
import { Field, FieldRow, NumberInput, Select, Checkbox, SectionCard } from '../FormField';
import { BreakdownView } from '../BreakdownView';
import { calcFireGeneral, calcFirePrivateDwelling, calcPlateGlass, calcConsequentialLoss, type ConstructionClass } from '../../engine/fire';
import { FIRE_GENERAL_RISKS, SPECIAL_PERILS } from '../../tariffs/fire';

type Product = 'general' | 'private_dwelling' | 'plate_glass' | 'consequential_loss';

const PRODUCT_OPTIONS: { value: Product; label: string }[] = [
  { value: 'general', label: 'General Risk (Commercial / Industrial)' },
  { value: 'private_dwelling', label: 'Private Dwelling' },
  { value: 'plate_glass', label: 'Plate Glass' },
  { value: 'consequential_loss', label: 'Consequential Loss (Business Interruption)' },
];

const CLASS_OPTIONS: { value: ConstructionClass; label: string }[] = [
  { value: 'classI', label: 'Class I (Stone / Brick / Concrete walls, incombustible roof)' },
  { value: 'classII', label: 'Class II (Metal/Asbestos sheet on steel frame, Chicka plastered)' },
  { value: 'classIII', label: 'Class III (Metal/Asbestos sheet on wooden frame, inferior material)' },
];

const OCCUPANCY_OPTIONS = FIRE_GENERAL_RISKS.map((o) => ({ value: o.code, label: `${o.code} - ${o.name}` }));

export function FireForm() {
  const [product, setProduct] = useState<Product>('general');

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Product" className="no-print">
        <Field label="Fire & Property Product">
          <Select value={product} onChange={setProduct} options={PRODUCT_OPTIONS} />
        </Field>
      </SectionCard>
      {product === 'general' && <GeneralRiskPanel />}
      {product === 'private_dwelling' && <PrivateDwellingPanel />}
      {product === 'plate_glass' && <PlateGlassPanel />}
      {product === 'consequential_loss' && <ConsequentialLossPanel />}
    </div>
  );
}

function PerilPicker({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {SPECIAL_PERILS.map((p) => (
        <Checkbox
          key={p.key}
          checked={selected.includes(p.key)}
          onChange={(checked) => onChange(checked ? [...selected, p.key] : selected.filter((k) => k !== p.key))}
          label={`${p.label} (${p.ratePerMille}‰)`}
        />
      ))}
    </div>
  );
}

function GeneralRiskPanel() {
  const [occupancyCode, setOccupancyCode] = useState(OCCUPANCY_OPTIONS[0].value);
  const [constructionClass, setConstructionClass] = useState<ConstructionClass>('classI');
  const [building, setBuilding] = useState<number | undefined>(0);
  const [contents, setContents] = useState<number | undefined>(0);
  const [stock, setStock] = useState<number | undefined>(1_000_000);
  const [machinery, setMachinery] = useState<number | undefined>(0);
  const [furniture, setFurniture] = useState<number | undefined>(0);
  const [other, setOther] = useState<number | undefined>(0);
  const [hasFireBrigadeAccess, setHasFireBrigadeAccess] = useState(false);
  const [isConflagrationArea, setIsConflagrationArea] = useState(false);
  const [selectedPerils, setSelectedPerils] = useState<string[]>([]);

  const breakdown = useMemo(
    () =>
      calcFireGeneral({
        occupancyCode,
        constructionClass,
        sumsInsured: {
          building: building ?? 0,
          contents: contents ?? 0,
          stock: stock ?? 0,
          machinery: machinery ?? 0,
          furniture: furniture ?? 0,
          other: other ?? 0,
        },
        hasFireBrigadeAccess,
        isConflagrationArea,
        selectedPerils,
      }),
    [occupancyCode, constructionClass, building, contents, stock, machinery, furniture, other, hasFireBrigadeAccess, isConflagrationArea, selectedPerils],
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 print:grid-cols-1">
      <div className="flex flex-col gap-5 no-print">
        <SectionCard title="Occupancy & Construction">
          <Field label="Occupancy / Trade Classification">
            <Select value={occupancyCode} onChange={setOccupancyCode} options={OCCUPANCY_OPTIONS} />
          </Field>
          <Field label="Class of Construction">
            <Select value={constructionClass} onChange={setConstructionClass} options={CLASS_OPTIONS} />
          </Field>
        </SectionCard>

        <SectionCard title="Sums Insured (Birr)" subtitle="Enter separate sums insured for each category of property.">
          <FieldRow>
            <Field label="Building"><NumberInput value={building} onChange={setBuilding} /></Field>
            <Field label="Contents"><NumberInput value={contents} onChange={setContents} /></Field>
          </FieldRow>
          <FieldRow>
            <Field label="Stock"><NumberInput value={stock} onChange={setStock} /></Field>
            <Field label="Machinery"><NumberInput value={machinery} onChange={setMachinery} /></Field>
          </FieldRow>
          <FieldRow>
            <Field label="Furniture & Fixtures"><NumberInput value={furniture} onChange={setFurniture} /></Field>
            <Field label="Other Property"><NumberInput value={other} onChange={setOther} /></Field>
          </FieldRow>
        </SectionCard>

        <SectionCard title="Area & Special Perils">
          <Checkbox checked={hasFireBrigadeAccess} onChange={(v) => { setHasFireBrigadeAccess(v); if (v) setIsConflagrationArea(false); }} label="Access roads for Fire Brigade available (10% area discount)" />
          <Checkbox checked={isConflagrationArea} onChange={(v) => { setIsConflagrationArea(v); if (v) setHasFireBrigadeAccess(false); }} label="Conflagration / congested area, no fire brigade access (15% area loading)" />
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Special Perils Extensions</p>
            <PerilPicker selected={selectedPerils} onChange={setSelectedPerils} />
          </div>
        </SectionCard>
      </div>
      <BreakdownView breakdown={breakdown} />
    </div>
  );
}

function PrivateDwellingPanel() {
  const [addisAbaba, setAddisAbaba] = useState(true);
  const [constructionClass, setConstructionClass] = useState<ConstructionClass>('classI');
  const [sumInsured, setSumInsured] = useState<number | undefined>(1_000_000);
  const [selectedPerils, setSelectedPerils] = useState<string[]>([]);

  const breakdown = useMemo(
    () => calcFirePrivateDwelling({ addisAbaba, constructionClass, sumInsured: sumInsured ?? 0, selectedPerils }),
    [addisAbaba, constructionClass, sumInsured, selectedPerils],
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 print:grid-cols-1">
      <div className="flex flex-col gap-5 no-print">
        <SectionCard title="Dwelling Details">
          <FieldRow>
            <Field label="Location">
              <Select value={addisAbaba ? 'aa' : 'other'} onChange={(v) => setAddisAbaba(v === 'aa')} options={[{ value: 'aa', label: 'Within Addis Ababa Municipal Area' }, { value: 'other', label: 'Other Areas' }]} />
            </Field>
            <Field label="Class of Construction">
              <Select value={constructionClass} onChange={setConstructionClass} options={CLASS_OPTIONS} />
            </Field>
          </FieldRow>
          <Field label="Sum Insured (Birr)">
            <NumberInput value={sumInsured} onChange={setSumInsured} />
          </Field>
        </SectionCard>
        <SectionCard title="Special Perils Extensions">
          <PerilPicker selected={selectedPerils} onChange={setSelectedPerils} />
        </SectionCard>
      </div>
      <BreakdownView breakdown={breakdown} />
    </div>
  );
}

function PlateGlassPanel() {
  const [propertyType, setPropertyType] = useState<'residence' | 'business'>('residence');
  const [floor, setFloor] = useState<'ground' | 'first_to_third' | 'over_third'>('ground');
  const [value, setValue] = useState<number | undefined>(50_000);

  const breakdown = useMemo(() => calcPlateGlass({ propertyType, floor, value: value ?? 0 }), [propertyType, floor, value]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 print:grid-cols-1">
      <SectionCard title="Plate Glass Details" className="no-print">
        <Field label="Property Type">
          <Select value={propertyType} onChange={setPropertyType} options={[{ value: 'residence', label: 'Private Dwelling House / Flat' }, { value: 'business', label: 'Business Premises' }]} />
        </Field>
        {propertyType === 'business' && (
          <Field label="Floor">
            <Select value={floor} onChange={setFloor} options={[{ value: 'ground', label: 'Ground Floor' }, { value: 'first_to_third', label: '1st to 3rd Floor' }, { value: 'over_third', label: 'Over 3rd Floor' }]} />
          </Field>
        )}
        <Field label="Total Value of Glass (Birr)">
          <NumberInput value={value} onChange={setValue} />
        </Field>
      </SectionCard>
      <BreakdownView breakdown={breakdown} />
    </div>
  );
}

function ConsequentialLossPanel() {
  const [occupancyCode, setOccupancyCode] = useState(OCCUPANCY_OPTIONS[0].value);
  const [constructionClass, setConstructionClass] = useState<ConstructionClass>('classI');
  const [annualGrossProfit, setAnnualGrossProfit] = useState<number | undefined>(1_000_000);
  const [indemnityMonths, setIndemnityMonths] = useState<number | undefined>(12);

  const breakdown = useMemo(
    () => calcConsequentialLoss({ occupancyCode, constructionClass, annualGrossProfit: annualGrossProfit ?? 0, indemnityMonths: indemnityMonths ?? 12 }),
    [occupancyCode, constructionClass, annualGrossProfit, indemnityMonths],
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 print:grid-cols-1">
      <SectionCard title="Business Interruption Details" className="no-print">
        <Field label="Occupancy / Trade Classification (for underlying Fire rate)">
          <Select value={occupancyCode} onChange={setOccupancyCode} options={OCCUPANCY_OPTIONS} />
        </Field>
        <Field label="Class of Construction">
          <Select value={constructionClass} onChange={setConstructionClass} options={CLASS_OPTIONS} />
        </Field>
        <Field label="Annual Gross Profit (Sum Insured, Birr)">
          <NumberInput value={annualGrossProfit} onChange={setAnnualGrossProfit} />
        </Field>
        <Field label="Indemnity Period (months)">
          <NumberInput value={indemnityMonths} onChange={setIndemnityMonths} />
        </Field>
      </SectionCard>
      <BreakdownView breakdown={breakdown} />
    </div>
  );
}
