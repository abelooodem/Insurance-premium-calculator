import { useMemo, useState } from 'react';
import { Field, FieldRow, NumberInput, Select, Checkbox, SectionCard } from '../FormField';
import { BreakdownView } from '../BreakdownView';
import { calcMotor, type MotorInput } from '../../engine/motor';
import { VEHICLE_CATEGORY_LABELS, COMMERCIAL_CATEGORIES, type VehicleCategory } from '../../tariffs/motor';
import type { CoverType } from '../../tariffs/motor';

const CATEGORY_OPTIONS = (Object.keys(VEHICLE_CATEGORY_LABELS) as VehicleCategory[]).map((c) => ({
  value: c,
  label: VEHICLE_CATEGORY_LABELS[c],
}));

const COVER_OPTIONS: { value: CoverType; label: string }[] = [
  { value: 'comprehensive', label: 'Comprehensive (OD + TP)' },
  { value: 'third_party_only', label: 'Third Party Only' },
  { value: 'third_party_fire_theft', label: 'Third Party, Fire & Theft' },
];

export function MotorForm() {
  const [category, setCategory] = useState<VehicleCategory>('private_car');
  const [cover, setCover] = useState<CoverType>('comprehensive');
  const [vehicleValue, setVehicleValue] = useState<number | undefined>(500_000);
  const [trailerValue, setTrailerValue] = useState<number | undefined>(undefined);
  const [engineCC, setEngineCC] = useState<number | undefined>(1600);
  const [busSeats, setBusSeats] = useState<number | undefined>(undefined);
  const [isOrganization, setIsOrganization] = useState(false);
  const [isDutyFree, setIsDutyFree] = useState(false);
  const [vehicleAgeYears, setVehicleAgeYears] = useState<number | undefined>(2);
  const [ncdYears, setNcdYears] = useState<number | undefined>(0);
  const [oneClaimStepBack, setOneClaimStepBack] = useState(false);
  const [fleetVehicleCount, setFleetVehicleCount] = useState<number | undefined>(1);
  const [extendedTplLimitBirr, setExtendedTplLimitBirr] = useState<number | undefined>(undefined);
  const [voluntaryExcessBirr, setVoluntaryExcessBirr] = useState<number | undefined>(undefined);
  const [ownPremisesOnly, setOwnPremisesOnly] = useState(false);
  const [includePAB, setIncludePAB] = useState(false);
  const [pabSeatCount, setPabSeatCount] = useState<number | undefined>(1);
  const [includeBSG, setIncludeBSG] = useState(false);
  const [periodDays, setPeriodDays] = useState<number | undefined>(365);

  const commercial = COMMERCIAL_CATEGORIES.includes(category);
  const isPrivate = category === 'private_car';
  const isMotorcycle = category === 'motorcycle';
  const isMotorTrade = category === 'motor_trade_road_risk';
  const isTractor = category === 'tractor_agricultural';
  const usesCC = isPrivate || isMotorcycle;
  const usesValue = !isMotorTrade;

  const input: MotorInput = useMemo(
    () => ({
      category,
      cover,
      vehicleValue: vehicleValue ?? 0,
      trailerValue,
      engineCC,
      busSeats,
      isOrganization,
      isDutyFree,
      vehicleAgeYears: vehicleAgeYears ?? 0,
      ncdYears: ncdYears ?? 0,
      oneClaimStepBack,
      fleetVehicleCount: fleetVehicleCount ?? 1,
      extendedTplLimitBirr,
      voluntaryExcessBirr,
      ownPremisesOnly,
      includePAB,
      pabSeatCount,
      includeBSG,
      periodDays,
    }),
    [
      category, cover, vehicleValue, trailerValue, engineCC, busSeats, isOrganization, isDutyFree,
      vehicleAgeYears, ncdYears, oneClaimStepBack, fleetVehicleCount, extendedTplLimitBirr,
      voluntaryExcessBirr, ownPremisesOnly, includePAB, pabSeatCount, includeBSG, periodDays,
    ],
  );

  const breakdown = useMemo(() => calcMotor(input), [input]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 print:grid-cols-1">
      <div className="flex flex-col gap-5 no-print">
        <SectionCard title="Vehicle & Cover">
          <FieldRow>
            <Field label="Vehicle Category">
              <Select value={category} onChange={setCategory} options={CATEGORY_OPTIONS} />
            </Field>
            <Field label="Cover Type">
              <Select value={cover} onChange={setCover} options={COVER_OPTIONS} />
            </Field>
          </FieldRow>
          <FieldRow>
            {usesValue && (
              <Field label="Vehicle Value / Sum Insured (Birr)">
                <NumberInput value={vehicleValue} onChange={setVehicleValue} />
              </Field>
            )}
            {usesCC && (
              <Field label="Engine Capacity (CC)">
                <NumberInput value={engineCC} onChange={setEngineCC} />
              </Field>
            )}
            {category === 'bus_public_service' && (
              <Field label="Seating Capacity (incl. driver)">
                <NumberInput value={busSeats} onChange={setBusSeats} />
              </Field>
            )}
            {!isMotorTrade && !isMotorcycle && (
              <Field label="Trailer Value (Birr, if any)">
                <NumberInput value={trailerValue} onChange={setTrailerValue} />
              </Field>
            )}
          </FieldRow>
          <FieldRow>
            <Field label="Vehicle Age (years)">
              <NumberInput value={vehicleAgeYears} onChange={setVehicleAgeYears} />
            </Field>
            <Field label="Period of Cover (days)" hint="365 = full annual policy">
              <NumberInput value={periodDays} onChange={setPeriodDays} />
            </Field>
          </FieldRow>
          <Checkbox checked={isDutyFree} onChange={setIsDutyFree} label={`Duty-free vehicle (+${commercial ? '15' : '25'}% loading)`} />
          <Checkbox checked={isOrganization} onChange={setIsOrganization} label="Insured is an organization (vs. individual) - affects excess schedule" />
        </SectionCard>

        <SectionCard title="No Claim Discount & Fleet">
          <FieldRow>
            <Field label="Consecutive Claim-Free Years">
              <NumberInput value={ncdYears} onChange={setNcdYears} />
            </Field>
            <Field label="Number of Vehicles (this classification)" hint="2+ triggers fleet discount">
              <NumberInput value={fleetVehicleCount} onChange={setFleetVehicleCount} min={1} />
            </Field>
          </FieldRow>
          <Checkbox checked={oneClaimStepBack} onChange={setOneClaimStepBack} label="Exactly one claim in the period (apply Step-Back scheme instead of NCD)" />
        </SectionCard>

        <SectionCard title="Extensions & Loadings">
          <FieldRow>
            <Field label="Extended TPL Limit (Birr, beyond standard)" hint="+2.5% of the extended amount">
              <NumberInput value={extendedTplLimitBirr} onChange={setExtendedTplLimitBirr} />
            </Field>
            {isPrivate && cover === 'comprehensive' && (
              <Field label="Voluntary Excess (Birr)" hint="500 / 1,000 / 1,500 / 2,000">
                <NumberInput value={voluntaryExcessBirr} onChange={setVoluntaryExcessBirr} />
              </Field>
            )}
          </FieldRow>
          {isTractor && (
            <Checkbox checked={ownPremisesOnly} onChange={setOwnPremisesOnly} label="Use confined to insured's own farm premises (-30%)" />
          )}
          {isPrivate && (
            <>
              <Checkbox checked={includePAB} onChange={setIncludePAB} label="Include Personal Accident Benefit (Birr 20/seat, limit Birr 10,000)" />
              {includePAB && (
                <Field label="PAB Seat Count">
                  <NumberInput value={pabSeatCount} onChange={setPabSeatCount} />
                </Field>
              )}
            </>
          )}
          {commercial && (
            <Checkbox checked={includeBSG} onChange={setIncludeBSG} label="Include BSG extension (Bandit, Shifta & Guerrillas) - trucks/tippers/buses/tankers only" />
          )}
        </SectionCard>
      </div>

      <div className="flex flex-col gap-4">
        <BreakdownView breakdown={breakdown} />
      </div>
    </div>
  );
}
