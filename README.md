# Insurance Premium Calculator

A configurable underwriting / quotation calculator built from the company's own uploaded
tariff sheets. React + TypeScript + Vite + Tailwind CSS. All amounts are in Ethiopian Birr
(ETB).

## Running it

```bash
npm install
npm run dev      # dev server
npm run build    # type-check + production build to dist/
```

## How the calculator is organized

Each insurance class has exactly three files, kept deliberately separate so rates can be
updated without touching any calculation logic or UI code:

```
src/tariffs/<class>.ts       <- the configurable tariff data (rates, tables, thresholds)
src/engine/<class>.ts        <- pure calculation functions (tariff data -> PremiumBreakdown)
src/components/forms/<Class>Form.tsx  <- the input form + calls the engine + renders the breakdown
```

`src/types/engine.ts` defines the shared `PremiumBreakdown` / `LineItem` shape used by every
class, and `BreakdownBuilder`, a small helper every engine function uses to accumulate base
premium, loadings, extensions, discounts, tax and charges, and to apply the minimum premium
floor consistently. `src/components/BreakdownView.tsx` renders that breakdown - every line
shows its formula and a reference back to the source rate chart clause, so an underwriter can
audit exactly how a premium was produced.

## How to update rates

1. Open the relevant file in `src/tariffs/`.
2. Change the number. Every constant has a comment citing the section of the source rate
   chart it came from - update that comment too if the new figure comes from a different
   circular, so the audit trail stays accurate.
3. Save. Vite hot-reloads instantly; no rebuild of the rest of the app is needed.
4. If you are adding a brand-new rate tier, table row, or vehicle/commodity/occupancy type,
   add it to the relevant array in the tariff file - the forms and dropdowns are generated
   from these arrays, so a new table row automatically appears as a selectable option.

No rate, formula, discount, minimum premium or tax anywhere in this app was invented. Every
number traces to a specific line in the uploaded rate charts (see "Source documents" below).
Where the source did not provide a number, the calculator either leaves the field
unconfigured and warns the user, or (for Engineering CAR/EAR/Machinery Breakdown/Electronic
Equipment) disables the calculator entirely with an explanation - see "Known gaps" below.

## Source documents

| File | Classes covered |
|---|---|
| `MOTOR_RATE_CHART_3.doc` | Motor |
| `FIRE_RATE_CHART_2.doc` | Fire & Property (General Risks, Private Dwellings, Special Perils, Consequential Loss) |
| `PLATE_GLASS_RATE_CHART_2.doc` | Plate Glass (bundled into the Fire & Property module) |
| `MARINE_RATE_CHART_3.docx` | Marine Cargo (All Risks commodity tariff, Inland Transit) |
| `ENGINEERING_RATE_CHART1406_2.doc` | Engineering - general EAR underwriting directives only (see gap below) |
| `CPM_revised_rate_chart_2.doc` | Engineering - Contractors' Plant & Machinery |
| `BOILER_EXPLOSION_INSURANCE_RATE_CHART_3.doc` | Engineering - Boiler Explosion |
| `GPA_RATE_CHART_2.doc` | Personal Accident / GPA |
| `BURGLARY_RATE_CHART_2.doc` | Burglary / Theft |
| `MONEY_INSURANCE_RATE_CHART_2.doc` | Money Insurance |
| `FIDELITY_GUARANTEE_RATE_CHART_2.doc` | Fidelity Guarantee (Bond) |
| `CARRIERS_LIABILITY_RATE_CHART_2.docx` | Carriers' Liability |

## General calculation structure

Every engine function follows the same shape, matching the tariff's own logic for that class
(never a one-size-fits-all formula):

```
Base Premium = Sum Insured (or benefit/limit) x Applicable Rate
  + Loadings (duty-free, over-age, area, deck cargo, etc.)
  + Extensions (optional riders: PAB, Fire & Theft, Special Perils, BSG, TPL extension, ...)
  - Discounts (No Claim Discount, fleet, sum-insured tier, area, open cover, ...)
  = subject to Minimum Premium
  + Tax / Statutory Charges (only where the tariff states one - see below)
  = Final Payable Premium
```

The minimum premium floor is applied to (base + loadings + discounts) *before* optional
extensions are added back on top - extensions are separately-rated add-ons, not part of the
base cover the minimum premium protects.

## Known gaps - do not treat these as bugs

These were not guessed. They are explicitly surfaced in the UI (as a warning banner or a
disabled-module notice) wherever they affect a calculation:

- **Engineering - CAR / EAR / Machinery Breakdown / Electronic Equipment base rates**: the
  uploaded `ENGINEERING_RATE_CHART1406_2.doc` is the Munich Re reinsurance-treaty
  *underwriting and rating directives* document. Every numeric base rate, the Section B
  per-mille Rating Schedule by plant/machine type, the earthquake-zone table, the deductible
  table and the minimum premium are printed as blank `"*"` placeholders in the source file
  itself - they were never filled in for this company. Only the structural loading rules
  (TPL loading table, cross-liability +5%, maintenance +10%/+15-20%, deductible-increase
  discount scale) were numerically stated, and those are captured in
  `src/tariffs/engineering.ts` ready to use once real base rates are supplied. Contractors'
  Plant & Machinery and Boiler Explosion, which had complete numeric tariffs in their own
  separate documents, are fully implemented.
- **Fire rate chart items 46, 47, 73(b), 80(b), 80(c)**: the source table's column alignment
  breaks for these rows (a formatting artifact of the original document) so only some
  construction-class rates are printed. The calculator surfaces exactly what was printed and
  refuses to guess the missing cells.
- **Carriers' Liability fleet discount table**: the source prints the fifth tier boundary as
  "115-200", which breaks the otherwise contiguous sequence (101-150, ???, 201-300). This has
  been treated as a likely typo for "151-200" and is flagged as a warning whenever that tier
  is used, so it can be confirmed with Head Office rather than silently trusted.
- **Money Insurance special discount tiers**: the source itself has a gap between "up to Birr
  2,250,000" and "over Birr 2,500,000" - annual carryings in that band have no stated
  discount. The calculator warns rather than picking one side.
- **Fidelity Guarantee**: the tariff rates only limits of indemnity up to Birr 25,000/person
  at 1%, and separately discounts amounts *over* Birr 100,000/person by 30%. No rate is
  stated for the Birr 25,000-100,000 band. The calculator applies the base 1% rate there and
  flags the gap.
- **VAT / Revenue Stamp / statutory charges**: only the Marine tariff explicitly states a tax
  (5% Sales Tax) and a Stamp Duty line (amount left blank on the source template). No other
  class's rate chart mentions VAT or a revenue stamp figure, so none has been added elsewhere
  - adding one for other classes without a source figure would be inventing a rate. If your
  company applies VAT/stamp duty to classes beyond Marine, add the rate as a `tax`/`charge`
  line in that class's engine file, citing your VAT circular.
- **Short-period / cancellation proration**: implemented in full for Motor only (a complete
  table was given in the tariff). Other classes' cancellation/short-period scales were not
  all supplied; add them to the relevant tariff file the same way `SHORT_PERIOD_RATES` is
  structured in `src/tariffs/motor.ts` if you have the table.
- **Workmen's Compensation, general Liability (beyond Carriers'), and Bond (if distinct from
  Fidelity Guarantee)**: no tariff was supplied for these at all. They appear in the class
  selector, disabled, with an explanation - the architecture supports adding them the moment
  a rate chart is provided (new `tariffs/`, `engine/`, and `forms/` file, then one line in
  `src/insuranceClasses.ts` and `src/App.tsx`'s `ClassForm` switch).
- **Branch Manager's discretionary discount** (Motor up to 20-30%, Marine up to 30%): this is
  a manual, authorization-gated discretion in the source tariff, not an automatic rule. It is
  exposed as an optional manual input (Marine) or documented but not yet wired into the Motor
  UI, and is never applied automatically.

## Testing performed

No client-supplied sample calculations were provided with the tariff sheets, so there are no
"expected result" test cases to compare against yet. Instead, every module's arithmetic was
hand-verified against the source formulas while building it - see the worked examples below,
each of which matches what the running calculator produces:

- **Motor**, Private Car, Comprehensive, CC 1600, value Birr 500,000: `300 + 10% x 1600 + 1.5%
  x 500,000 = 300 + 160 + 7,500 = Birr 7,960.00` ✓
- **Fire**, General Risk, "Aerated water Factories - with Warranty 9", Class I, SI Birr
  1,000,000: `1,000,000 x 0.60‰ = 600`; Special Discount tier for SI over Birr 500,000 =
  12.5% → `600 - 75 = Birr 525.00` ✓
- **Marine**, Coffee/Tea/Mate & Spices, Cases, SI Birr 500,000, sea: `500,000 x 0.11% = 550`;
  Sum Insured discount (over Birr 250,000) 20% → `550 - 110 = 440`; Sales Tax 5% →
  `440 + 22 = Birr 462.00` ✓
- **Engineering (CPM)**, Option I, SI Birr 1,000,000: `1,000,000 x 0.4% = Birr 4,000.00` ✓
- **Personal Accident**, Class 1, 10 persons, Death/PD Birr 100,000, TTD Birr 2,000/month,
  Medical Birr 10,000: `(100,000×0.056% + 100,000×0.08% + 2,000×2.72% +
  10,000×1.92%) × 10 = (56+80+54.4+192)×10 = Birr 3,824.00` ✓
- **Burglary**, Private Premises Ground Floor, Category A, SI Birr 500,000, full value:
  `500,000 x 1‰ = 500`; full-value discount (over Birr 100,000, up to 500,000) 10% →
  `Birr 450.00` ✓
- **Money**, In-Transit, within towns, single loss limit Birr 100,000, annual carrying Birr
  3,000,000: `100,000×2.5‰ + 3,000,000×0.15‰ = 250+450 = 700`; special
  discount on the carrying portion (over Birr 2,500,000) 17.5% of 450 = 78.75 → `Birr
  621.25` ✓
- **Fidelity Guarantee**, limit Birr 25,000, 1 person: `25,000 x 1% = Birr 250.00` ✓
- **Carriers' Liability**, Dry Cargo, limit Birr 200,000/vehicle, 20 vehicles: annual carrying
  `200,000 × 36 × 20 = 144,000,000`; premium `144,000,000 × 0.12% = 172,800`;
  fleet discount (10-25 vehicles) 15% → `Birr 146,880.00` ✓

If/when you provide sample calculations from real quotations, drop them into a new
`test-cases/` folder (or hand them to whoever maintains this app) and each one can be wired
up as an automated regression test.

## Assumptions requiring your confirmation

These are called out inline in the app (as an "Assumptions applied" note on the relevant
breakdown) as well as here:

- **Consequential Loss (Business Interruption)** rate: the source only gives the Indemnity
  Period → % table used to gross up/down the Annual Gross Profit sum insured; it does not
  separately state a CL rate. This calculator applies the same Fire material-damage rate (by
  occupancy/construction class) to the adjusted sum insured, which is standard market
  practice, but was not explicitly written in the source document.
- **Minimum premium scope**: applied to (base + loadings + discounts), with extensions added
  back afterwards - see "General calculation structure" above.
- **Motorcycle comprehensive rating**: assumes "insured only driving, private policy" by
  default; the full CC/driver/policy-type table is in `src/tariffs/motor.ts` if you need to
  wire up the other combinations in the UI.
