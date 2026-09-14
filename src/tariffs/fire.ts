// FIRE & PROPERTY TARIFF CONFIGURATION
// Source: FIRE_RATE_CHART_2.doc and PLATE_GLASS_RATE_CHART_2.doc (uploaded tariff sheets).
// Rates are "per mille" (per Birr 1,000 of sum insured) as printed in Rating Schedule A
// (General Risks) and Rating Schedule B (Private Dwellings) of the source document.
// To update rates: edit the arrays below. `null` in a rate column means the source
// document did not print a usable figure there (an OCR/formatting gap in the original
// table) - the calculator will refuse that specific class of construction until a real
// figure is supplied.

export interface OccupancyRate {
  code: string; // item number / sub-letter as in the rate chart, for audit traceability
  name: string;
  classI: number | null;
  classII: number | null;
  classIII: number | null;
  note?: string;
}

// Rating Schedule A - General Risks. Rate per mille of sum insured, by class of construction.
export const FIRE_GENERAL_RISKS: OccupancyRate[] = [
  { code: '1a', name: 'Aerated water Factories - with Warranty 9', classI: 0.6, classII: 0.93, classIII: 1.75 },
  { code: '1b', name: 'Aerated water Factories - without Warranty 9', classI: 0.68, classII: 1.1, classIII: 2.08 },
  { code: '2', name: 'Aerodromes & Aeroplane Hangars', classI: 0.75, classII: 1.1, classIII: 1.6 },
  { code: '3', name: 'Agricultural Show Grounds', classI: 1.15, classII: 1.6, classIII: 2.43 },
  { code: '4a', name: 'Aluminum Pressing Works - with Warranty 8', classI: 0.93, classII: 1.6, classIII: 2.43 },
  { code: '4b', name: 'Aluminum Pressing Works - without Warranty 8', classI: 1.6, classII: 1.93, classIII: 2.75 },
  { code: '5a', name: 'Automobile Sale Rooms - with Warranty 5', classI: 0.6, classII: 0.93, classIII: 1.75 },
  { code: '5b', name: 'Automobile Sale Rooms - with Warranty 6', classI: 0.68, classII: 1.0, classIII: 1.83 },
  { code: '5c', name: 'Automobile Sale Rooms - with Warranty 7', classI: 0.75, classII: 1.1, classIII: 1.88 },
  { code: '6a', name: 'Bacon Factories - with Warranties 9 & 17', classI: 0.93, classII: 1.6, classIII: 2.43 },
  { code: '6b', name: 'Bacon Factories - without such warranties', classI: 1.25, classII: 1.93, classIII: 2.75 },
  { code: '7', name: 'Bakeries', classI: 1.25, classII: 1.93, classIII: 2.75 },
  { code: '8', name: 'Bars (not part of hotel premises, Clubs, Cinemas, Theatres, Cafes and Restaurants)', classI: 0.93, classII: 1.25, classIII: 2.43 },
  { code: '9', name: 'Banks', classI: 0.43, classII: 0.58, classIII: 0.9 },
  { code: '10', name: 'Black Smiths', classI: 1.25, classII: 1.93, classIII: 2.75 },
  { code: '11', name: 'Boarding Houses (No liqueur)', classI: 0.58, classII: 1.25, classIII: 2.43 },
  { code: '12', name: 'Boiler Houses (20 meters distant or over from other buildings)', classI: 0.78, classII: 1.25, classIII: 2.08 },
  { code: '13a', name: 'Boot and Shoe Factories - with Warranty 10', classI: 0.93, classII: 1.6, classIII: 2.43 },
  { code: '13b', name: 'Boot and Shoe Factories - without such warranty', classI: 1.1, classII: 1.75, classIII: 2.55 },
  { code: '14', name: 'Brick and Tile Works', classI: 1.1, classII: 1.6, classIII: 2.43 },
  { code: '15', name: 'Breweries', classI: 0.9, classII: 1.4, classIII: 2.05 },
  { code: '16', name: 'Broadcasting Station', classI: 0.43, classII: 0.58, classIII: 1.08 },
  { code: '17', name: 'Butter and Cheese Factories', classI: 0.75, classII: 1.1, classIII: 1.75 },
  { code: '18', name: 'Cafes and Restaurants (not on hotel premises)', classI: 1.25, classII: 1.93, classIII: 2.75 },
  { code: '19', name: 'Churches and Chapels', classI: 0.75, classII: 1.43, classIII: 2.08 },
  { code: '20', name: 'Cigarette Factories', classI: 0.68, classII: 0.85, classIII: 1.15 },
  { code: '21a', name: 'Cinemas (buildings & contents incl safety films) - with Warranties 18 & 19', classI: 1.25, classII: 1.93, classIII: 3.4 },
  { code: '21b', name: 'Cinemas - with Warranties 18, 19 and 19(a)', classI: 0.93, classII: 1.6, classIII: 2.43 },
  { code: '22', name: 'Clothing Factories', classI: 0.85, classII: 1.15, classIII: 1.75 },
  { code: '23', name: 'Clubs', classI: 0.93, classII: 1.6, classIII: 2.43 },
  { code: '24', name: 'Coffee Mills or Factories', classI: 0.9, classII: 1.4, classIII: 2.05 },
  { code: '25', name: 'Cement Plants', classI: 0.68, classII: 0.85, classIII: 1.4 },
  { code: '26a', name: 'Concrete Block works (wet process) - with Warranty 9', classI: 0.75, classII: 1.1, classIII: 1.58 },
  { code: '26b', name: 'Concrete Block works (wet process) - without such warranty', classI: 0.93, classII: 1.25, classIII: 1.75 },
  { code: '27', name: 'Coffee cleaning Machine', classI: 1.13, classII: 1.5, classIII: 2.45 },
  { code: '28', name: 'Confectioners (Manufacturing)', classI: 1.0, classII: 1.6, classIII: 2.18 },
  { code: '29', name: 'Cosmetic Factory', classI: 1.13, classII: 1.65, classIII: 3.15 },
  { code: '30', name: 'Department Stores', classI: 0.75, classII: 1.25, classIII: 2.08 },
  { code: '31', name: 'Distilleries', classI: 1.15, classII: 1.75, classIII: 2.43 },
  { code: '32a', name: 'Dry Cleaners - using non-inflammable solvents, with Warranties 22 & 24', classI: 1.15, classII: 1.93, classIII: 2.75 },
  { code: '32b', name: 'Dry Cleaners - using inflammable solvents, with Warranties 14 & 25', classI: 1.6, classII: 2.6, classIII: 3.4 },
  { code: '33', name: 'Electric Light & Power Station', classI: 0.5, classII: 0.68, classIII: 1.08 },
  { code: '34a', name: 'Engineering Workshops - with Warranty 14 & 15', classI: 0.93, classII: 1.6, classIII: 2.43 },
  { code: '34b', name: 'Engineering Workshops - with Warranty 21', classI: 1.25, classII: 1.93, classIII: 2.75 },
  { code: '34c', name: 'Engineering Workshops - without either warranty', classI: 1.65, classII: 2.3, classIII: 3.13 },
  { code: '35', name: 'Fibre Factories', classI: 1.3, classII: 2.0, classIII: 2.83 },
  { code: '36a', name: 'Flour Mills (and buildings within 15m used in connection) - with Warranty 9', classI: 0.85, classII: 1.25, classIII: 1.9 },
  { code: '36b', name: 'Flour Mills - with Warranty 11', classI: 0.75, classII: 1.08, classIII: 1.75 },
  { code: '36c', name: 'Flour Mills - without either warranty', classI: 1.1, classII: 1.6, classIII: 2.43 },
  { code: '37', name: 'Fire Extinguisher Assembly Plant', classI: 2.08, classII: 3.18, classIII: 4.4 },
  { code: '38a', name: 'Fruit Juice Factories - with Warranty 9', classI: 0.75, classII: 1.1, classIII: 1.75 },
  { code: '38b', name: 'Fruit Juice Factories - without such warranty', classI: 0.93, classII: 1.25, classIII: 2.08 },
  { code: '39', name: 'Filwuha (Hot water bath services)', classI: 0.68, classII: 1.25, classIII: 2.43 },
  { code: '40a', name: 'Garages (Trade) - with Warranty 5', classI: 0.75, classII: 1.1, classIII: 2.08 },
  { code: '40b', name: 'Garages (Trade) - with Warranty 6', classI: 0.93, classII: 1.25, classIII: 2.23 },
  { code: '40c', name: 'Garages (Trade) - with Warranty 7', classI: 1.1, classII: 1.43, classIII: 2.43 },
  { code: '41', name: 'Gas and Chemical Factories', classI: 2.08, classII: 3.18, classIII: 4.4 },
  { code: '42', name: 'Ghee Factories', classI: 1.6, classII: 2.28, classIII: 3.4 },
  { code: '43', name: 'Glass Factories', classI: 0.93, classII: 1.6, classIII: 2.75 },
  { code: '44a', name: 'Godowns and Merchantile stores (wholesale) - with Warranties 1 & 23', classI: 0.6, classII: 1.25, classIII: 2.43 },
  { code: '44b', name: 'Godowns and Merchantile stores - with Warranties 1 & 26', classI: 0.68, classII: 1.35, classIII: 2.48 },
  { code: '44c', name: 'Godowns and Merchantile stores - with Warranties 1, 2 & 3', classI: 0.75, classII: 1.1, classIII: 2.55 },
  { code: '44d', name: 'Godowns and Merchantile stores - with Warranties 1 & 3', classI: 0.93, classII: 1.6, classIII: 2.75 },
  { code: '44e', name: 'Godowns and Merchantile stores - with Warranty 1', classI: 1.1, classII: 1.75, classIII: 2.9 },
  { code: '45', name: 'Goods in Government Bonded Warehouse', classI: 0.75, classII: 0.93, classIII: 1.25 },
  {
    code: '46a',
    name: 'Goods in the Open, not otherwise provided for - Non-Hazardous',
    classI: null,
    classII: 0.93,
    classIII: null,
    note: 'Only a single (unclassed) rate of 0.93 per mille was printed for this item in the source document; Class I/III figures were not legible. Bush Fire cover: +0.83 per mille with Bush Fire Endorsement.',
  },
  {
    code: '46b',
    name: 'Goods in the Open, not otherwise provided for - Hazardous',
    classI: null,
    classII: 1.6,
    classIII: null,
    note: 'Only a single (unclassed) rate of 1.60 per mille was printed for this item in the source document. Bush Fire cover: +0.83 per mille with Bush Fire Endorsement.',
  },
  {
    code: '47a',
    name: 'Goods in transit (in the open, or in any building, whilst in transit) - Non-Hazardous',
    classI: null,
    classII: 1.25,
    classIII: null,
    note: 'Only a single (unclassed) rate of 1.25 per mille was printed. Bush Fire cover: +0.83 per mille with Bush Fire Endorsement.',
  },
  {
    code: '47b',
    name: 'Goods in transit - Hazardous',
    classI: null,
    classII: null,
    classIII: 1.93,
    note: 'Only a single (unclassed) rate of 1.93 per mille was printed. Bush Fire cover: +0.83 per mille with Bush Fire Endorsement.',
  },
  { code: '48', name: 'Gum Factory', classI: 1.25, classII: 1.93, classIII: 2.75 },
  { code: '49', name: 'Hospitals', classI: 0.6, classII: 0.93, classIII: 1.75 },
  { code: '50', name: 'Hotels', classI: 0.68, classII: 1.25, classIII: 2.43 },
  { code: '51', name: 'Injera Factories', classI: 1.15, classII: 1.93, classIII: 3.4 },
  { code: '52a', name: 'Jam, Pickle and Cans Factories (sugar) / fruit boiling by steam heat only - with Warranty 9', classI: 0.75, classII: 1.1, classIII: 1.75 },
  { code: '52b', name: 'Jam, Pickle and Cans Factories - without such warranty', classI: 0.85, classII: 1.25, classIII: 1.9 },
  { code: '52c', name: 'Jam, Pickle and Cans Factories - boiling other than by steam heat', classI: 0.93, classII: 1.25, classIII: 2.08 },
  { code: '53', name: 'Joineries & Furniture Dealers', classI: 1.1, classII: 1.43, classIII: 2.43 },
  { code: '54', name: 'Knitting Works', classI: 0.93, classII: 1.25, classIII: 2.08 },
  { code: '55a1', name: 'Laundries - with Warranty 10, using non-inflammable solvents (w22 & 24)', classI: 0.93, classII: 1.6, classIII: 2.43 },
  { code: '55a2', name: 'Laundries - with Warranty 10, using inflammable solvents (w14 & 25)', classI: 1.6, classII: 2.28, classIII: 3.4 },
  { code: '55b1', name: 'Laundries - without Warranty 10, using non-inflammable solvents (w22 & 24)', classI: 1.1, classII: 1.75, classIII: 2.55 },
  { code: '55b2', name: 'Laundries - without Warranty 10, using inflammable solvents (w14 & 25)', classI: 1.75, classII: 2.4, classIII: 3.73 },
  { code: '56', name: 'Laboratory', classI: 1.1, classII: 1.6, classIII: 3.15 },
  { code: '57', name: 'Macaroni & Pasta Factories', classI: 0.78, classII: 1.1, classIII: 1.75 },
  { code: '58', name: 'Marble works', classI: 0.85, classII: 1.5, classIII: 2.43 },
  { code: '59', name: 'Match Factories', classI: 1.6, classII: 2.25, classIII: 3.4 },
  { code: '60', name: 'Metal Workers (General)', classI: 0.93, classII: 1.25, classIII: 2.08 },
  { code: '61', name: 'News Agency', classI: 0.43, classII: 0.6, classIII: 1.08 },
  { code: '62a', name: 'Offices - not sample rooms (manufacturers reps, produce dealers etc.)', classI: 0.6, classII: 0.78, classIII: 1.4 },
  { code: '62b1', name: 'Offices - Sample rooms, subject to Warranties 1, 2 & 3', classI: 0.75, classII: 0.93, classIII: 1.58 },
  { code: '62b2', name: 'Offices - Sample rooms, subject to Warranty 1 & 3 only', classI: 0.85, classII: 1.0, classIII: 1.65 },
  { code: '62b3', name: 'Offices - Sample rooms, subject to Warranty 1 only', classI: 0.93, classII: 1.1, classIII: 1.75 },
  { code: '63', name: 'Paper Bags / Envelope work', classI: 0.93, classII: 1.25, classIII: 2.43 },
  { code: '64a', name: 'Petrol Filling Stations - with Warranty 27', classI: 0.78, classII: 1.1, classIII: 2.43 },
  { code: '64b', name: 'Petrol Filling Stations - without such warranty', classI: 0.85, classII: 1.15, classIII: 2.5 },
  { code: '65a', name: 'Plastic Goods Factories - nylon/phenol/urea/melamine formaldehyde group, w29(a)&(d)', classI: 1.25, classII: 1.6, classIII: 2.08 },
  { code: '65b', name: 'Plastic Goods Factories - polystyrene/polythene/methyl methacrylate group, w29(b)&(d)', classI: 1.6, classII: 1.93, classIII: 2.43 },
  { code: '65c', name: 'Plastic Goods Factories - other plastics excl. nitrocellulose base, w29(c)&(d)', classI: 1.93, classII: 2.28, classIII: 2.75 },
  { code: '66a', name: 'Printing works - with Warranty 10', classI: 0.93, classII: 1.25, classIII: 2.43 },
  { code: '66b', name: 'Printing works - without such warranty', classI: 1.0, classII: 1.35, classIII: 2.48 },
  { code: '67', name: 'Public Buildings including Government Offices', classI: 0.6, classII: 0.93, classIII: 1.75 },
  { code: '68a', name: 'Pump and Engine Houses - with Warranty 9', classI: 0.6, classII: 0.93, classIII: 1.75 },
  { code: '68b', name: 'Pump and Engine Houses - without such warranty', classI: 0.75, classII: 1.1, classIII: 1.9 },
  { code: '69', name: 'Rubber Goods Factories, Tyre Factories and Tyre Retreading works, with Warranties 9, 14, 16 & 28', classI: 1.1, classII: 1.6, classIII: 2.43 },
  { code: '70', name: 'Saw Mills', classI: null, classII: null, classIII: null, note: 'Source states "See Wood Works" - use item 86 (Woodworkers, Saw Mills, Joiners) rate.' },
  { code: '71', name: 'Schools', classI: 0.6, classII: 0.93, classIII: 1.75 },
  { code: '72a1', name: 'Shops - Groceries, with Warranty 22', classI: 0.93, classII: 1.43, classIII: 2.43 },
  { code: '72a2', name: 'Shops - Groceries, with Warranty 2', classI: 1.0, classII: 1.5, classIII: 2.9 },
  { code: '72a3', name: 'Shops - Groceries, without either warranty', classI: 1.25, classII: 1.75, classIII: 3.4 },
  { code: '72b', name: 'Shops - Building Materials, Machinery (general), Spare Parts & Tools Dealers', classI: 1.0, classII: 1.5, classIII: 2.75 },
  { code: '72c', name: 'Shops - Sport Article Dealers', classI: 0.93, classII: 1.43, classIII: 2.55 },
  { code: '72d', name: 'Shops - Radio, Tape recorder, T/V, Watches, musical instruments, Electrical Equipment Dealers', classI: 0.93, classII: 1.43, classIII: 2.55 },
  { code: '72e', name: 'Shops - Tyre & Tubes and Butanegaz Dealers', classI: 1.6, classII: 2.08, classIII: 4.08 },
  { code: '72f', name: 'Shops - Textiles, wearing apparels, shoes & boots, leather article dealers, haberdashers', classI: 1.1, classII: 1.6, classIII: 3.1 },
  { code: '72g', name: 'Shops - Pharmacies & Chemists', classI: 1.1, classII: 1.75, classIII: 3.1 },
  { code: '72h', name: 'Shops - Butchers', classI: 0.85, classII: 1.35, classIII: 2.43 },
  { code: '72i', name: 'Shops - Barber Shops, Beauty Salons and Perfumery', classI: 0.85, classII: 1.35, classIII: 2.43 },
  { code: '72j', name: 'Shops - Toy and Gift Articles Dealers', classI: 0.85, classII: 1.35, classIII: 2.43 },
  { code: '72k', name: 'Shops - Stationeries & Book Stores', classI: 1.15, classII: 1.68, classIII: 3.23 },
  { code: '72l', name: 'Shops - Tailors', classI: 1.1, classII: 1.5, classIII: 2.75 },
  { code: '72m', name: 'Shops - Florists and Vegetable Dealers', classI: 0.85, classII: 1.35, classIII: 2.43 },
  { code: '72n', name: 'Shops - China & Glassware Dealers, including Opticians', classI: 0.85, classII: 1.35, classIII: 2.43 },
  { code: '72o', name: 'Shops - Jeweller, Goldsmiths & Silversmiths', classI: 1.1, classII: 1.6, classIII: 3.1 },
  { code: '72p', name: 'Shops - Plastic Articles Dealers', classI: 1.25, classII: 1.75, classIII: 3.1 },
  { code: '72q', name: 'Shops - Spirits and Wine Dealers (other than Bars)', classI: 1.25, classII: 1.75, classIII: 3.4 },
  { code: '72r', name: 'Shops - Photographers, Picture Frame and Camera Dealer', classI: 1.25, classII: 1.75, classIII: 3.4 },
  { code: '72s1', name: 'Shops - All other Shops not classified above, with Warranty 22', classI: 1.0, classII: 1.5, classIII: 2.9 },
  { code: '72s2', name: 'Shops - All other Shops not classified above, with Warranty 2', classI: 1.15, classII: 1.68, classIII: 3.1 },
  { code: '72s3', name: 'Shops - All other Shops not classified above, without either warranty', classI: 1.43, classII: 1.93, classIII: 4.08 },
  { code: '73a', name: 'Silent Risks - with Warranty 12', classI: 0.43, classII: 0.6, classIII: 1.4 },
  { code: '73b', name: 'Silent Risks - with Warranty 12(a)', classI: null, classII: null, classIII: null, note: 'Rate not printed in the source document for this sub-item.' },
  { code: '74a', name: 'Soap Factories - with Warranty 20', classI: 1.25, classII: 1.6, classIII: 2.75 },
  { code: '74b', name: 'Soap Factories - without such warranty', classI: 1.6, classII: 1.93, classIII: 3.4 },
  { code: '75', name: 'Spice Extraction plants', classI: 0.93, classII: 1.25, classIII: 2.08 },
  { code: '76', name: 'Sugar Mills (without refinery or distillery) and related buildings, subject to Warranty 2', classI: 0.68, classII: 0.93, classIII: 1.4 },
  { code: '77', name: 'Sugar refineries (without distillery)', classI: 0.93, classII: 1.25, classIII: 1.75 },
  { code: '78', name: 'Tanneries', classI: 0.93, classII: 1.25, classIII: 2.08 },
  { code: '79', name: 'Textile, synthetic textile or Cotton Factories', classI: 1.3, classII: 2.0, classIII: 2.83 },
  { code: '80a', name: 'Timber Stores and store sheds - Sawn Timber sheds with Warranty 13', classI: 0.93, classII: 1.25, classIII: 2.08 },
  { code: '80b', name: 'Timber Stores - Timber bulks or unhewn logs in the open, with Warranty 13', classI: null, classII: null, classIII: 1.1, note: 'Only the Class III rate was printed for this sub-item.' },
  { code: '80c', name: 'Timber Stores - Sawn Timber in the open, with Warranty 13', classI: null, classII: null, classIII: 1.43, note: 'Only the Class III rate was printed for this sub-item.' },
  { code: '81', name: 'Tobacco Factories (no curing, box making or snuff grinding)', classI: 0.68, classII: 0.85, classIII: 1.15, note: 'If snuff grinding and/or box making is carried on, add 0.40 per mille.' },
  { code: '82', name: 'Unoccupied Risks (with Warranty 4)', classI: 0.6, classII: 0.93, classIII: 1.75 },
  { code: '83a', name: 'Vinegar Factories - with Warranty 9', classI: 0.93, classII: 1.25, classIII: 2.08 },
  { code: '83b', name: 'Vinegar Factories - without such warranty', classI: 1.0, classII: 1.35, classIII: 2.18 },
  { code: '84a', name: 'Wine Bottling Premises - with Warranty 9', classI: 0.75, classII: 0.93, classIII: 1.5 },
  { code: '84b', name: 'Wine Bottling Premises - without such warranty', classI: 0.85, classII: 1.0, classIII: 1.65 },
  { code: '85', name: 'Woodworkers, carpenters & upholsterers (excl. Saw Mills), hand power or electric power <= 5HP, Warranty 21', classI: 1.6, classII: 1.93, classIII: 3.4, note: 'Warranty 21 may be omitted for an additional 0.54 per mille.' },
  { code: '86', name: 'Woodworkers, Saw Mills, Joiners, Cabinet makers and upholsterers with power (Warranties 14, 15 & 21)', classI: 1.93, classII: 2.28, classIII: 3.73, note: 'Warranty 21 may be omitted for an additional 0.54 per mille.' },
];

// Rating Schedule B - Private Dwellings. Rate per mille.
export const FIRE_PRIVATE_DWELLINGS: OccupancyRate[] = [
  { code: 'B1', name: 'Private dwellings & domestic outbuildings within the Municipal area of Addis Ababa', classI: 0.6, classII: 0.78, classIII: 1.4 },
  { code: 'B2', name: 'Private dwellings & domestic outbuildings in areas other than Addis Ababa municipal area', classI: 0.85, classII: 1.14, classIII: 2.06 },
];

export const FIRE_MINIMUM_PREMIUM = 100; // both General Risks and Private Dwellings schedules

// Rates for Special Perils offered as an extension to Fire policies - per mille, flat
// (not split by class of construction).
export const SPECIAL_PERILS: { key: string; label: string; ratePerMille: number }[] = [
  { key: 'aircraft', label: 'Aircraft damage', ratePerMille: 0.02 },
  { key: 'impact', label: 'Impact damage', ratePerMille: 0.05 },
  { key: 'earthquake', label: 'Earthquake', ratePerMille: 0.17 },
  { key: 'spontaneous_combustion', label: 'Spontaneous Combustion', ratePerMille: 0.15 },
  { key: 'storm_tempest_flood', label: 'Storm, Tempest & Flood', ratePerMille: 0.1 },
  { key: 'bursting_water_apparatus', label: 'Bursting or overflowing of water apparatus/tanks/pipes', ratePerMille: 0.06 },
  { key: 'bush_fire', label: 'Bush Fire', ratePerMille: 0.02 },
  { key: 'subsidence_collapse', label: 'Subsidence and/or Collapse', ratePerMille: 0.06 },
  { key: 'srcc', label: 'Strike, Riot & Malicious Damage', ratePerMille: 0.25 },
  { key: 'explosion', label: 'Explosion', ratePerMille: 0.05 },
];

// Area Discount - General Risks only. "Access roads for Fire Brigades ... easily obtained"
export const AREA_DISCOUNT_RATE = 0.1;
// Area Loading - conflagration/congested areas with no fire brigade access
export const AREA_LOADING_RATE = 0.15;

// Special Discount tiers by Sum Insured, applied AFTER the area discount, to Fire + Special Perils rate
export const SPECIAL_DISCOUNT_TIERS: { min: number; max: number; discount: number }[] = [
  { min: 0, max: 500_000, discount: 0 },
  { min: 500_000, max: 2_000_000, discount: 0.125 },
  { min: 2_000_000, max: 5_000_000, discount: 0.175 },
  { min: 5_000_000, max: 10_000_000, discount: 0.2 },
  { min: 10_000_000, max: 20_000_000, discount: 0.25 },
  { min: 20_000_000, max: Infinity, discount: 0.3 },
];

// Consequential Loss (Business Interruption) - Indemnity Period adjustment table.
// The source states this percentage is applied to the Annual Gross Profit sum insured to
// reflect indemnity periods shorter/longer than 12 months (it does NOT separately state the
// rate to charge on the adjusted sum - see assumption noted in the calculator).
export const CONSEQUENTIAL_LOSS_INDEMNITY_TABLE: { months: number; comparator: 'not_exceeding' | 'not_less_than' | 'exceeding'; pct: number }[] = [
  { months: 1, comparator: 'not_exceeding', pct: 45 },
  { months: 2, comparator: 'not_exceeding', pct: 55 },
  { months: 3, comparator: 'not_exceeding', pct: 70 },
  { months: 4, comparator: 'not_exceeding', pct: 80 },
  { months: 5, comparator: 'not_exceeding', pct: 90 },
  { months: 6, comparator: 'not_exceeding', pct: 100 },
  { months: 9, comparator: 'not_exceeding', pct: 120 },
  { months: 12, comparator: 'not_exceeding', pct: 140 },
  { months: 15, comparator: 'not_less_than', pct: 135 },
  { months: 18, comparator: 'not_less_than', pct: 130 },
  { months: 21, comparator: 'not_less_than', pct: 125 },
  { months: 24, comparator: 'not_less_than', pct: 115 },
  { months: 30, comparator: 'not_less_than', pct: 110 },
  { months: 36, comparator: 'not_less_than', pct: 105 },
  { months: 48, comparator: 'not_less_than', pct: 100 },
  { months: 60, comparator: 'not_less_than', pct: 95 },
  { months: 72, comparator: 'not_less_than', pct: 90 },
  { months: 73, comparator: 'exceeding', pct: 85 },
];

// PLATE_GLASS_RATE_CHART_2.doc
export const PLATE_GLASS = {
  residenceRate: 0.018, // 1.80% on total value
  residenceMinPremium: 40,
  businessGroundFloorRate: 0.036, // 3.60%
  business1stTo3rdFloorRate: 0.027, // 2.70%
  businessOver3rdFloorRate: 0.018, // 1.80%
  businessMinPremium: 55,
};
