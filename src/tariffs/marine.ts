// MARINE CARGO TARIFF CONFIGURATION
// Source: MARINE_RATE_CHART_3.docx (uploaded tariff sheet, "RATES FOR ALL RISKS COVER").
// Rates are in % of insured value (NOT per mille). To update: edit the tables below.

export type PackingMethod = 'cases' | 'cartons' | 'bags';

export interface CommodityRate {
  code: string;
  name: string;
  cases?: number;
  cartons?: number;
  bags?: number;
  note?: string;
}

export interface CommodityGroup {
  groupCode: string;
  groupName: string;
  items: CommodityRate[];
}

export const MARINE_COMMODITIES: CommodityGroup[] = [
  {
    groupCode: '1', groupName: 'Food Stuff & Animal Products', items: [
      { code: '1.1', name: 'Coffee, Tea, Mate & Spices', cases: 0.11, cartons: 0.12, bags: 0.18 },
      { code: '1.2', name: 'Milk & Dairy products (in paper bags)', cases: 0.38, cartons: 0.42 },
      { code: '1.3', name: 'Milk & Dairy products in tins (excl. denting & blowing)', cases: 0.21, cartons: 0.25 },
      { code: '1.4', name: 'Cereals', bags: 0.18 },
      { code: '1.5', name: 'Rice', bags: 0.18 },
      { code: '1.6', name: 'Sugar Confectionery (chewing gums & candy)', cases: 0.23, cartons: 0.26 },
      { code: '1.7', name: 'Chocolates', cases: 0.38, cartons: 0.42 },
      { code: '1.8', name: 'Sugar in bags', bags: 0.18 },
      { code: '1.9', name: 'Pasta', cases: 0.19, cartons: 0.23 },
      { code: '1.10', name: 'Dates (Canned or Tinned)', cartons: 0.19, bags: 0.23 },
      { code: '1.11', name: 'Meat & Edible meat offal (Canned or Tinned)', cases: 0.19, cartons: 0.23 },
      { code: '1.12', name: 'Fish and Crustaceans, Molluscs & other invertebrates (canned/tinned)', cases: 0.19, cartons: 0.23 },
      { code: '1.13', name: 'Fish/Crustaceans/Molluscs or fresh animal sea food (refrigerated)', cases: 0.19, cartons: 0.23 },
      { code: '1.14', name: 'Cereals Flour, Starch, Vegetable Fruits, Nuts, Cocoa etc (canned/tinned)', cases: 0.19, cartons: 0.23 },
      { code: '1.15', name: 'Edible fruits, Vegetables, Roots & Tubers, Cut Flowers etc (refrigerated)', cases: 0.38, cartons: 0.42 },
      { code: '1.16', name: 'Flour in bags', bags: 0.18 },
      { code: '1.17', name: 'Malt, Starches, Insulin, Wheat Gluten', cases: 0.23, cartons: 0.26, bags: 0 },
      { code: '1.18', name: 'Oil seeds, Oleaginous Fruits', bags: 0.18 },
      { code: '1.19', name: 'Animal or vegetable Fat Oils, Edible Fats, Waxes (tinned/canned)', cases: 0.19, cartons: 0.23 },
      { code: '1.20', name: 'Live Animals', note: 'To be referred to Head Office' },
      { code: '1.21', name: 'Natural Honey & its products', cases: 0.18, cartons: 0.19, bags: 0.23 },
      { code: '1.22', name: 'Residues & waste from Food Industries, Prepared animal fodder', cases: 0.19, cartons: 0.23 },
      { code: '1.23', name: 'Livestock - Chickens Species', cases: 0.35 },
      { code: '1.24', name: 'Active & Inactive Yeasts', cases: 0.23, cartons: 0.26 },
      { code: '1.25', name: 'Food Flavors & Coloring', cases: 0.3, cartons: 0.34 },
    ],
  },
  {
    groupCode: '2', groupName: 'Mineral Water, Squash, Wines, Spirits, Liquors, Beverages & Vinegar', items: [
      { code: '2.1', name: 'Bottles (subject to label clause)', cases: 0.28, cartons: 0.33 },
      { code: '2.2', name: 'Plastic bottles (subject to label clause)', cases: 0.18, cartons: 0.21 },
      { code: '2.3', name: 'Tins (excl. denting and blowing)', cases: 0.18, cartons: 0.21 },
    ],
  },
  {
    groupCode: '3', groupName: 'Tobacco', items: [
      { code: '3.1', name: 'Tobacco leaf in bales', bags: 0.1 },
      { code: '3.2', name: 'Tobacco in tins', bags: 0.19 },
      { code: '3.3', name: 'Cigarettes in boxes', bags: 0.25 },
      { code: '3.4', name: 'Cigars in boxes', bags: 0.25 },
      { code: '3.5', name: 'Cigarette paper', cases: 0.18, cartons: 0.19 },
      { code: '3.6', name: 'Cigarette wrapping foils', cases: 0.15, cartons: 0.18 },
    ],
  },
  {
    groupCode: '4', groupName: 'Fibers', items: [
      { code: '4.1', name: 'Jute and fiber in bales', bags: 0.27 },
      { code: '4.2', name: 'Gummy and hessian cloths in bales', bags: 0.27 },
      { code: '4.3', name: 'Synthetic fiber in bales', bags: 0.37 },
      { code: '4.4', name: 'Jute bags', bags: 0.37 },
    ],
  },
  {
    groupCode: '5', groupName: 'Machinery', items: [
      { code: '5.1', name: 'Mechanical Plants', cases: 0.38 },
      { code: '5.2', name: 'Electrical Plants', cases: 0.43 },
      { code: '5.3', name: 'Chemical / Process Plants', cases: 0.49 },
      { code: '5.4', name: 'Mechanical Machinery and Equipment', cases: 0.15 },
      { code: '5.5', name: 'Electrical Machinery & Equipment', cases: 0.17 },
      { code: '5.6', name: 'Mechanical Appliances', cases: 0.1 },
      { code: '5.7', name: 'Construction Plants', cases: 0.38 },
      { code: '5.8', name: 'Construction Machinery and Equipment', cases: 0.13 },
      { code: '5.9', name: 'Agricultural equipment and implements', cases: 0.13 },
      { code: '5.10', name: 'Furnaces', cases: 0.17 },
      { code: '5.11a', name: 'Boilers - Steam or other vapor generating boilers', cases: 0.17 },
      { code: '5.11b', name: 'Boilers - Pressure Vessels', cases: 0.19 },
      { code: '5.12', name: 'Machinery Spare Parts and accessories', cases: 0.1 },
    ],
  },
  {
    groupCode: '6', groupName: 'Motor Vehicles, Vessels & Associated Transport Equipment & Accessories',
    items: [
      { code: '6.1', name: 'Motor cars (new, under deck)', cases: 0.25, note: 'Excess Birr 1,000 per car. Second-hand: rate +50%, excess unchanged.' },
      { code: '6.2', name: 'Trucks - assembled (new, under deck)', cases: 0.12, note: 'Excess Birr 1,000 per vehicle. Second-hand: rate +50%.' },
      { code: '6.3', name: 'Trucks - unassembled', cases: 0.1, note: 'Second-hand: rate +50%.' },
      { code: '6.4', name: 'Trailers', cases: 0.1, note: 'Excess Birr 500 per trailer. Second-hand: rate +50%.' },
      { code: '6.5', name: 'Buses - assembled', cases: 0.18, note: 'Excess Birr 1,000 per vehicle. Second-hand: rate +50%.' },
      { code: '6.6', name: 'Buses - unassembled', cases: 0.1, note: 'Second-hand: rate +50%.' },
      { code: '6.7', name: 'Tractors and agricultural vehicles', cases: 0.11, note: 'Excess Birr 500 per vehicle.' },
      { code: '6.8', name: 'Spare parts & Accessories', cases: 0.1, note: 'Cover excludes rusting, oxidization and discoloration.' },
      { code: '6.9', name: 'Windshield Glass', cases: 0.94, note: 'Return 20% premium if no claim is lodged.' },
      { code: '6.10', name: 'Bicycles, Motorcycles, Scooters (unassembled)', cases: 0.12, cartons: 0.25 },
      { code: '6.11', name: 'Canvas', cases: 0.14 },
      { code: '6.12', name: 'Tires and Tubes', cases: 0.1 },
      { code: '6.13', name: 'Ships, boats and floating structures', cases: 0.25, note: 'Excess Birr 1,000 per item.' },
      { code: '6.14', name: 'Aircraft, spacecraft and parts thereof', cases: 0.25, note: 'Excess Birr 1,000 per item.' },
      { code: '6.15', name: 'Traffic Signaling equipment of all kinds', cases: 0.28, note: 'Excess Birr 500 per item.' },
    ],
  },
  {
    groupCode: '7', groupName: 'Chemicals', items: [
      { code: '7.1', name: 'In drums', cases: 0.24 },
      { code: '7.2', name: 'In cases (jars and demijohn bottles)', cases: 0.3 },
      { code: '7.3', name: 'Tins', cases: 0.28 },
      { code: '7.4', name: 'Powder in bags', cases: 0.38 },
      { code: '7.5', name: 'In cartons', cases: 0.26 },
      { code: '7.6', name: 'Acids in demijohn bottles', cases: 0.28 },
      { code: '7.7', name: 'Acids in approved containers', cases: 0.24 },
    ],
  },
  {
    groupCode: '8', groupName: 'Products of the Chemical Industry', items: [
      { code: '8.1', name: 'Photographic or Cinematographic goods or films', cases: 0.18, cartons: 0.21 },
      { code: '8.2', name: 'Batteries (Storage-liquid)', cases: 0.12, cartons: 0.14 },
      { code: '8.3', name: 'Fire Extinguishers', cases: 0.11 },
      { code: '8.4', name: 'Dry Cells', cases: 0.11 },
      { code: '8.5', name: 'Bullets', cases: 0.29, cartons: 0.41 },
      { code: '8.6', name: 'Matches', cases: 0.12, cartons: 0.18 },
      { code: '8.7', name: 'Modified Starches and Enzymes', cases: 0.11, cartons: 0.12 },
      { code: '8.8', name: 'Explosives (Dynamite)', cases: 0.25, note: 'Parts should be separated in two or more lots during the voyage.' },
      { code: '8.9', name: 'Candles, tapers & the like, artificial & prepared waxes', cases: 0.12, cartons: 0.18 },
      { code: '8.10', name: 'Polishes and creams for footwear, furniture, floors, metals etc.', cases: 0.11, cartons: 0.12 },
      { code: '8.11', name: 'Wall & metal paints', cases: 0.18, cartons: 0.21 },
      { code: '8.12', name: 'Adhesives (industrial) like glues and pastes', cases: 0.12, cartons: 0.14, note: '0.5% excess for whole shipment.' },
      { code: '8.13', name: 'Inland (in drums or containers)', cases: 0.25 },
      { code: '8.14', name: 'Incense', cases: 0.12, cartons: 0.18 },
    ],
  },
  {
    groupCode: '11', groupName: 'Electrical Materials and Appliances', items: [
      { code: '11.1', name: 'Washing machines, refrigerators (incl gas stoves), boilers, cold stores/rooms', cases: 0.21, cartons: 0.35 },
      { code: '11.2', name: 'Electro-mechanical domestic appliances (shavers, hair dryers, A/C, toasters, etc.)', cases: 0.21, cartons: 0.24, note: 'Excludes denting, chipping, scratching and mechanical/electrical derangement.' },
      { code: '11.3', name: 'TV/radio/sound equipment, video/digital cameras, VCD/CD/DVD players, projectors', cases: 0.45, cartons: 0.57, note: 'Excludes warping and distortion.' },
      { code: '11.4', name: 'Switching/protecting/connecting apparatus (switches, relays, fuses, sockets, etc.)', cases: 0.21, cartons: 0.35 },
      { code: '11.5', name: 'Communication equipment (video/TV receivers, traffic control, sirens, radios)', cases: 0.3, cartons: 0.35, note: 'Excludes mechanical and electrical derangement.' },
      { code: '11.6', name: 'Electrical lamps & tubes and flashlights', cases: 0.38, cartons: 0.42 },
      { code: '11.7', name: 'Lamp shades', cases: 0.28, cartons: 0.32 },
      { code: '11.8', name: 'Crystal chandeliers', cases: 0.66, cartons: 0.95 },
      { code: '11.9', name: 'Insulated and uninsulated wires & cables', cases: 0.19, cartons: 0.21 },
      { code: '11.10', name: 'Spare parts for electrical appliances', cases: 0.15, cartons: 0.21 },
      { code: '11.11', name: 'Computers & printers', cases: 0.35, cartons: 0.45 },
      { code: '11.12', name: 'Computer spare parts and accessories', cases: 0.15, cartons: 0.21 },
      { code: '11.13', name: 'Optical fibers, optical fiber bundles, and cables', cases: 0.21, cartons: 0.35 },
    ],
  },
  {
    groupCode: '12', groupName: 'Pulps, Printed Matters, Papers, Stationery and Office Equipment', items: [
      { code: '12.1', name: 'Paper and paper products (envelopes, cards, wallpapers, towels etc.)', cases: 0.14, cartons: 0.18 },
      { code: '12.2', name: 'Paper in bales', cartons: 0.14 },
      { code: '12.3', name: 'Ball pens, pens, felt pens, refills, pencils', cases: 0.14, cartons: 0.15 },
      { code: '12.4', name: 'Ink, oil paints (for drawing), stencil ink and similar', cases: 0.19, cartons: 0.21 },
      { code: '12.5', name: 'Clips, pins, erasers, ribbons, adhesive tapes, staplers etc.', cases: 0.14, cartons: 0.15 },
      { code: '12.6', name: 'Carbon paper, stencils, folders, box files, photocopying paper', cases: 0.15, cartons: 0.18 },
      { code: '12.7', name: 'Chalk', cases: 0.15, cartons: 0.18 },
      { code: '12.8', name: 'Printed papers (paperbacks, newspapers, magazines, maps etc.)', cases: 0.11, cartons: 0.18 },
      { code: '12.9', name: 'Used newspapers for wrapping purposes in bales', cases: 0.08, cartons: 0.09 },
      { code: '12.10', name: 'Bound books', cases: 0.18, cartons: 0.21 },
      { code: '12.11', name: 'News print for printing in rolls', bags: 0.1 },
      { code: '12.12', name: 'Metal office furniture (desks, filing cabinets etc, excl. glass tops)', cases: 0.14, cartons: 0.18 },
      { code: '12.13', name: 'Wooden office furniture', cases: 0.18, cartons: 0.23 },
      { code: '12.14', name: 'Typewriters, calculators, duplicators, photocopiers, Dictaphones', cases: 0.11, cartons: 0.14, note: 'Excludes denting, scratching, chipping and mechanical derangement.' },
      { code: '12.15', name: 'Spare parts for item 12.14', cases: 0.08, cartons: 0.11 },
      { code: '12.16', name: 'Safes (excl. denting, scratching & chipping)', cases: 0.1 },
      { code: '12.17', name: 'Pulp of wood, paperboard, articles of paper pulp', cases: 0.18, cartons: 0.23 },
      { code: '12.18', name: 'Photographic paper', cases: 0.18, cartons: 0.21 },
      { code: '12.19', name: 'Postage stamps', cases: 0.1, cartons: 0.12 },
      { code: '12.20', name: 'Transparency materials', cases: 0.11, cartons: 0.14 },
      { code: '12.21', name: 'Adhesives (domestic) - glues, tapes, adhesive paper', cases: 0.11, cartons: 0.12 },
    ],
  },
  {
    groupCode: '13', groupName: 'Furniture & Fixtures (Excluding Bruising & Scratching)', items: [
      { code: '13.1', name: 'Furniture, new, other than metal', cases: 0.18, cartons: 0.27 },
      { code: '13.2', name: 'Furniture, metal, new', cases: 0.14, cartons: 0.18 },
      { code: '13.3', name: 'Furniture, all types (second hand)', cases: 0.21, cartons: 0.25 },
    ],
  },
  {
    groupCode: '14', groupName: 'Kitchenware & Fixtures (Excluding Bruising & Scratching)', items: [
      { code: '14.1', name: 'Glassware, ceramics, chinaware, porcelain ware', cases: 0.95, cartons: 1.12, note: 'Return 15% if no claim.' },
      { code: '14.2', name: 'Enamelware (excl. flaking and chipping)', cases: 0.28, cartons: 0.35 },
      { code: '14.3', name: 'Utensils - metal', cases: 0.1, cartons: 0.13 },
      { code: '14.4', name: 'Silverware (cutlery)', cases: 0.25, cartons: 0.28 },
      { code: '14.5', name: 'Water filters', cases: 0.28, cartons: 0.35 },
      { code: '14.6', name: 'Plastic ware', cases: 0.11, cartons: 0.13 },
      { code: '14.7', name: 'Brooms & Brushes', cases: 0.14, cartons: 0.17 },
      { code: '14.8', name: 'Lamps (Kerosene and gas)', cases: 0.28, cartons: 0.35 },
      { code: '14.9', name: 'Thermos flasks and refills, including breakage', cases: 0.42, cartons: 0.47, note: '1% excess on whole shipment. Excluding breakage: cases 0.12%, cartons 0.14%.' },
      { code: '14.10', name: 'Empty bottles', cases: 0.5, cartons: 0.56 },
      { code: '14.11', name: 'Gas stove Lighters', cases: 0.11, cartons: 0.13 },
      { code: '14.12', name: 'Mica & Articles of Mica', cases: 0.28, cartons: 0.35 },
    ],
  },
  {
    groupCode: '15', groupName: 'Petroleum Products', items: [
      { code: '15.1', name: 'Crude oil - in bulk', note: 'Refer to Head Office' },
      { code: '15.2', name: 'Refined products (benzene, gas oil, kerosene) in bulk', cases: 0.17, cartons: 0.42, note: 'Excess 1% of the whole shipment.' },
      { code: '15.3.1', name: 'Lubricating oils, greases, other lubricating preparations - in drums', cases: 0.14, note: 'Including leakage.' },
      { code: '15.3.2', name: 'Lubricating oils, greases etc - in tins', cases: 0.19, cartons: 0.25 },
      { code: '15.4.1', name: 'Asphalt and bitumen in drums, excluding leakage', cartons: 0.24, note: 'Excess 1% of whole shipment.' },
      { code: '15.4.2', name: 'Asphalt and bitumen in drums, including leakage', cartons: 0.38, note: 'Excess 1% of whole shipment.' },
      { code: '15.5.1', name: 'Gas cylinders, empty', cartons: 0.14, note: 'Excess 1% of whole shipment.' },
      { code: '15.5.2', name: 'Gas cylinders, full', cartons: 0.19, note: '3% excess on whole shipment.' },
      { code: '15.5.3', name: 'Gas in pressure regulators', cases: 0.14, cartons: 0.16 },
      { code: '15.6', name: 'Paraffin Wax in bags', cartons: 0.32, note: '3% excess on whole shipment.' },
      { code: '15.7', name: 'Insecticides and pesticides & herbicides', cases: 0.26, cartons: 0.3, bags: 0.42 },
    ],
  },
  {
    groupCode: '16', groupName: 'Rubber Foam, Rubber, Plastic & Plastic Products', items: [
      { code: '16.1', name: 'Raw rubber and synthetic rubber', bags: 0.1 },
      { code: '16.2', name: 'Rubber and foam rubber products, excluding tires and tubes', cases: 0.1, cartons: 0.12 },
      { code: '16.3', name: 'Plastic raw materials - PVC, polyethylene', bags: 0.23 },
      { code: '16.4', name: 'Plastic products (artificial flowers, bags, shoes, furniture, toothbrushes)', cases: 0.12, cartons: 0.14 },
      { code: '16.5', name: 'Plastic (rubber) Hoses', cases: 0.11 },
      { code: '16.6', name: 'Gloves and balloons', cases: 0.12 },
      { code: '16.7', name: 'Plastic models (educational materials)', cases: 0.12 },
      { code: '16.8', name: 'Christmas trees and other gift articles of plastic', cases: 0.12 },
    ],
  },
  {
    groupCode: '17', groupName: 'Textiles, Wearing Apparels, Leather & Leather Products and Headgear', items: [
      { code: '17.1', name: 'Cotton fabrics and synthetic products', cases: 0.07, cartons: 0.09, note: 'Bales 0.13%' },
      { code: '17.2', name: 'Woolen, silk fabrics, animal hair fabrics', cases: 0.09, note: 'Bales 0.14%' },
      { code: '17.3', name: 'Readymade garments incl. underwear, socks, stockings, bed sheets', cases: 0.12, cartons: 0.13, note: 'Bales 0.16%' },
      { code: '17.4', name: 'Shoes, leather and non-leather belts, wallets, gloves, leather garments', cases: 0.09, cartons: 0.13 },
      { code: '17.5', name: 'Empty handbags, suitcases and briefcases', cases: 0.12, cartons: 0.12 },
      { code: '17.6', name: 'Carpets and rugs', cases: 0.17, cartons: 0.13, note: 'Bales 0.26%' },
      { code: '17.7', name: 'Mats', cases: 0.68, cartons: 0.28, note: 'Bales 0.13%' },
      { code: '17.8', name: 'Tanning or dying extracts, derivative dyes, pigments and colorants', cases: 0.09, cartons: 0.12 },
      { code: '17.9', name: 'Personal effects & wearing apparels', cases: 0.68, cartons: 0.12, note: 'Excess Birr 500 on each article.' },
      { code: '17.10', name: 'Head gear & parts thereof (hats, safety helmets etc.)', cases: 0.09, cartons: 0.9 },
      { code: '17.11', name: 'Canvas works (tents, sails & clothing)', cases: 0.14, cartons: 0.12 },
    ],
  },
  {
    groupCode: '18', groupName: 'Cotton and Wool', items: [
      { code: '18.1', name: 'Raw cotton (excluding spontaneous combustion)', cartons: 0.11 },
      { code: '18.2', name: 'Ginned Cotton', cartons: 0.11 },
      { code: '18.3', name: 'Yarn', cases: 0.11, cartons: 0.12, note: 'Bales 0.14%' },
      { code: '18.4', name: 'Threads', cases: 0.12, cartons: 0.14 },
      { code: '18.5', name: 'Knitting wool', cases: 0.14, cartons: 0.18 },
    ],
  },
  {
    groupCode: '19', groupName: 'Building Materials and Hardware', items: [
      { code: '19.1', name: 'Aluminum and steel crated sheets', cases: 0.12, cartons: 0.21, note: 'Bundles 0.22%' },
      { code: '19.2', name: 'Asbestos Products, crated', cases: 0.53, note: 'Loose 1.06%' },
      { code: '19.3', name: 'Asbestos rock in jute bags', cartons: 0.12, note: 'Recommend ICC(C) basis. Bales 0.14%' },
      { code: '19.4', name: 'Brassware (door handles etc), excl. cracks & pressing of brass tubes', cases: 0.11, cartons: 0.14 },
      { code: '19.5', name: 'Padlocks, locks and key sets', cases: 0.11, cartons: 0.14 },
      { code: '19.6', name: 'Tools', cases: 0.11, cartons: 0.18, note: 'Excludes rusting, oxidization and discoloration (items 19.6-19.10 per N.B.)' },
      { code: '19.7', name: 'Iron pipes', cartons: 0.12, note: 'In bundles' },
      { code: '19.8', name: 'Iron pipes (cast iron with asbestos pipes within)', cases: 0.15, cartons: 0.19, note: 'Crates / Loose' },
      { code: '19.9', name: 'Reinforcing steel', cartons: 0.1, note: 'In bundles' },
      { code: '19.10', name: 'Rails, iron bars, and angle irons etc', cartons: 0.1, note: 'In bundles' },
      { code: '19.11', name: 'Metal doors, windows and frames', cartons: 0.12, note: 'In bundles' },
      { code: '19.12', name: 'Plastic shutters', cartons: 0.18, note: 'In bundles' },
      { code: '19.13', name: 'Glass sheets / Mirrors', cases: 1.5, note: 'Return 15% if no claim.' },
      { code: '19.14', name: 'Nails, bolts & nuts, screws, pipe joints etc', cases: 0.12, cartons: 0.18, note: 'Excludes rusting, oxidization and discoloration.' },
      { code: '19.15', name: 'Plywood, veneered panels & similar laminated wood', cartons: 0.24, note: 'In bundles' },
      { code: '19.16', name: 'Sanitary ware (porcelain)', cases: 1.0, note: 'Return 15% if no claim.' },
      { code: '19.17', name: 'Sanitary ware (others)', cases: 0.35 },
      { code: '19.18', name: 'Wall tiles, floor tiles, bricks', cases: 1.1, note: 'Return 15% if no claim.' },
      { code: '19.19', name: 'Cement in bags', cartons: 0.25, note: '2% excess whole shipment, warranted spare bags.' },
      { code: '19.20', name: 'Marble (finished)', cases: 1.15, cartons: 1.3, note: 'Cartons rate is for crates.' },
      { code: '19.21', name: 'All other ceramic products', cases: 1.1, note: 'Return 15% if no claim.' },
      { code: '19.22', name: 'Plaster', cartons: 0.19, note: '2% excess whole shipment.' },
      { code: '19.23', name: 'Magnesite bricks (excl. chipping)', cartons: 0.14 },
      { code: '19.24', name: 'Shellac', cases: 0.14, note: 'Tins' },
      { code: '19.25', name: 'Paints, varnishes and lacquers', cases: 0.21, note: 'Tins & drums, 0.5% excess of whole shipment.' },
      { code: '19.26', name: 'Galvanized and corrugated iron sheets in bundles or rolls', cartons: 0.11, note: 'Excludes rusting, oxidization and discoloration.' },
      { code: '19.27', name: 'Plastic corrugated sheets', cases: 0.12, cartons: 0.14 },
      { code: '19.28', name: 'PVC-Skirting (plastic or rubber made)', cases: 0.12 },
      { code: '19.29', name: 'Paint doors, windows & frames', cases: 0.18 },
      { code: '19.30', name: 'Paint Brushes', cartons: 0.19 },
      { code: '19.31', name: 'Welding goggles', cartons: 0.18, note: 'In rolls' },
      { code: '19.32', name: 'Linoleum', cartons: 0.11 },
      { code: '19.33', name: 'Mahogany veneer', cases: 0.12, cartons: 0.14, note: 'In pallets' },
    ],
  },
  {
    groupCode: '20', groupName: 'Jewellery and Gift Articles', items: [
      { code: '20.1', name: 'Jewelry - Golden', bags: 0.47 },
      { code: '20.2', name: 'Jewelry - Silver', bags: 0.47 },
      { code: '20.3', name: 'Jewelry - Others', bags: 0.43 },
      { code: '20.4', name: 'Gift articles', cases: 0.32, cartons: 0.39 },
      { code: '20.5', name: 'Toys, games, sport requisites', bags: 0.39 },
      { code: '20.6', name: 'Precious stones', note: 'Refer to the Head Office' },
      { code: '20.7', name: 'Antiques & Works of art', note: 'Refer to the Head Office' },
      { code: '20.8', name: 'Ivory made articles', cases: 0.25 },
    ],
  },
  {
    groupCode: '21', groupName: 'Cosmetics and Cleaning Preparation', items: [
      { code: '21.1', name: 'Cosmetics, perfumery or toilet preparations', cases: 0.14, cartons: 0.18 },
      { code: '21.2', name: 'Soap, surface active agents, detergents or washing preparations', cases: 0.24, cartons: 0.28 },
      { code: '21.3', name: 'Civets', cases: 0.11, cartons: 0.14 },
      { code: '21.4', name: 'Tooth pastes', cases: 0.11, cartons: 0.14 },
    ],
  },
  {
    groupCode: '22', groupName: 'Mineral Products, Base Metals and Articles of Base Metals', items: [
      { code: '22.1', name: 'Iron & steel, Copper, Nickel, Aluminum, Lead, Zinc, Tin and other base metals', cases: 0.08 },
      { code: '22.2', name: 'Articles of base metals (tools, cutlery, wires, bars, rails, chains, locks etc)', cases: 0.1 },
      { code: '22.3', name: 'Salt, sulphur, coal slag ash and other mineral products and ores', cases: 0.13 },
    ],
  },
  {
    groupCode: '23', groupName: 'Miscellaneous Manufactured Articles Not Classified Elsewhere', items: [
      { code: '23.1', name: 'Clocks & watches', cases: 0.32, cartons: 0.35 },
      { code: '23.2', name: 'Medical & surgical instruments', cases: 0.22, cartons: 0.29 },
      { code: '23.3', name: 'Laboratory equipment and instruments', cases: 0.22, cartons: 0.29 },
      { code: '23.4', name: 'Measuring and controlling instruments and equipment', cases: 0.21, cartons: 0.25 },
      { code: '23.5', name: 'Scales (excl. rusting, oxidization and discoloration)', cases: 0.14, cartons: 0.25 },
      { code: '23.6', name: 'Musical Instruments', cartons: 0.28 },
      { code: '23.7', name: 'Sporting Equipment', cases: 0.12, cartons: 0.14 },
      { code: '23.8', name: 'Imported wood and articles of wood', cases: 0.21, cartons: 0.24 },
      { code: '23.9', name: 'Prefabricated structural components for building/civil engineering', cases: 0.19 },
      { code: '23.10', name: 'Millstones & grindstones', cartons: 0.11 },
      { code: '23.11', name: 'Tarpaulins', cases: 0.14, cartons: 0.18 },
      { code: '23.12', name: 'Umbrellas and sun umbrellas (incl. walking stick / garden umbrellas)', cases: 0.14, cartons: 0.18 },
      { code: '23.13', name: 'Fiber glass', cases: 0.21, cartons: 0.25 },
      { code: '23.14', name: 'Smoking pipes, smoker with shield (beekeeping tools)', cases: 0.1, cartons: 0.13 },
      { code: '23.15', name: 'Contact lenses, eye glasses and frames', cases: 0.32, cartons: 0.35 },
      { code: '23.16', name: 'Green house structures', cases: 0.1 },
      { code: '23.16.1', name: 'Green house - Steel structures', cases: 0.12, cartons: 0.14 },
      { code: '23.16.2', name: 'Green house - Plastic cladding', cases: 0.1 },
      { code: '23.16.3', name: 'Green house - Fittings & accessories', cases: 0.32, cartons: 0.35 },
      { code: '23.16.5', name: 'Green house - Propagation paper (horticulture)', cases: 0.14, cartons: 0.15 },
      { code: '23.17', name: 'Photograph frames (metals)', cases: 0.12, cartons: 0.14 },
      { code: '23.18', name: 'Cork and articles of cork', cases: 0.1, cartons: 0.12 },
      { code: '23.19', name: 'Manufactures of straw / plaiting materials, basket ware and wicker work', cases: 0.21, cartons: 0.25 },
    ],
  },
  {
    groupCode: '24', groupName: 'Export Commodities', items: [
      { code: '24.1', name: 'Cereals', cases: 0.14, note: 'Excess 1% on whole shipment.' },
      { code: '24.2', name: 'Coffee (washed)', cases: 0.14, note: 'Excluding loss of color.' },
      { code: '24.3', name: 'Coffee (unwashed)', cases: 0.12, note: 'Excess 1% on whole shipment.' },
      { code: '24.4', name: 'Cotton in bales', cases: 0.12, note: 'Excluding heating & sweating.' },
      { code: '24.5', name: 'Ground nuts', cases: 0.12 },
      { code: '24.6', name: 'Gums', cases: 0.11 },
      { code: '24.7', name: 'Hide and skins', cases: 0.14, note: 'Excluding heating & sweating.' },
      { code: '24.8', name: 'Pulses', cases: 0.14 },
      { code: '24.9', name: 'Seeds', cases: 0.11, note: 'Excess 1% on whole shipment.' },
      { code: '24.10', name: 'Oil cakes (expellers)', cases: 0.14, note: 'Excluding spontaneous combustion, excess 1% on whole shipment.' },
      { code: '24.11', name: 'Haricot beans', cases: 0.12 },
      { code: '24.12.1', name: 'Berbere', cases: 0.18, note: 'Excluding water damage.' },
      { code: '24.12.2', name: 'Berbere, full cover', cases: 0.25 },
      { code: '24.12.3', name: 'Berbere (other)', cases: 0.18 },
      { code: '24.13', name: 'Live Animals', cases: 0.25, note: 'To be referred to Head Office.' },
    ],
  },
];

// Inland Transit rates by destination category (item "25" of the tariff) - % of value
export const INLAND_TRANSIT_RATES: { code: string; commodity: string; beyondMunicipal: number | null; withinMunicipal: number | null; note?: string }[] = [
  { code: '25.1', commodity: 'Fragile goods', beyondMunicipal: 0.35, withinMunicipal: 0.17 },
  { code: '25.2', commodity: 'Food products (refrigerated)', beyondMunicipal: 0.17, withinMunicipal: 0.1 },
  { code: '25.3', commodity: 'Export Commodities (Coffee, Cereals, Pulses, etc.)', beyondMunicipal: 0.1, withinMunicipal: 0.07 },
  { code: '25.4', commodity: 'Furniture', beyondMunicipal: 0.17, withinMunicipal: 0.14 },
  { code: '25.5', commodity: 'Machinery', beyondMunicipal: 0.24, withinMunicipal: 0.17 },
  { code: '25.6', commodity: 'General Cargo (other than above)', beyondMunicipal: 0.17, withinMunicipal: 0.1 },
  { code: '25.7', commodity: 'Live Animals', beyondMunicipal: null, withinMunicipal: null, note: 'To be referred to Head Office' },
];

export const ICC_C_RATE = { sea: 0.005, air: 0.0025, minimumPremium: 100 }; // 0.50% sea, 0.25% air
export const TRANSSHIPMENT_LOADING = 0.25; // +25% of tariff rate per transshipment
export const EXTENSION_BEYOND_60_DAYS = { first15Days: 0.1, eachFurther15Days: 0.05 }; // % of basic rate
export const AIR_FREIGHT_RATE_OF_SEA = 0.4; // Air = 40% of sea premium
export const DECK_CARGO_MULTIPLIER = 2; // double the under-deck rate
export const BEYOND_ETHIOPIA_LOADING = 0.3; // +30% beyond territorial limits
export const CONTAINER_DISCOUNT = 0.1;
export const OPEN_COVER_DISCOUNT = 0.25;
export const BSG_COVER_RATE = 0.0006; // 0.06% for BSG extension on Inland Transit / All Risks
export const BRANCH_MANAGER_DISCRETION_MAX = 0.3; // after other discounts

export const MARINE_MINIMUM_PREMIUM = { sea: 75, air: 50, bsg: 75, pureInlandTransit: 100, allRisksInlandTransit: 100 };
export const SERVICE_CHARGE = { rate: 0.15, min: 50, max: 100 }; // on cancellation, deducted from refund

export const SUM_INSURED_DISCOUNT_TIERS: { min: number; max: number; discount: number }[] = [
  { min: 100_000, max: 150_000, discount: 0.1 },
  { min: 150_000, max: 250_000, discount: 0.15 },
  { min: 250_000, max: 500_000, discount: 0.2 },
  { min: 500_000, max: 1_000_000, discount: 0.225 },
  { min: 1_000_000, max: 2_000_000, discount: 0.25 },
  { min: 2_000_000, max: 5_000_000, discount: 0.275 },
  { min: 5_000_000, max: 10_000_000, discount: 0.3 },
  { min: 10_000_000, max: Infinity, discount: 0.325 },
];

export const MARINE_SALES_TAX_RATE = 0.05; // "SALES TAX (5%)" printed on the premium computation sheet
