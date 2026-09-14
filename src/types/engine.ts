// Core types shared by every insurance class calculation engine.
// A LineItem is one row of the transparent premium breakdown shown to the underwriter.

export type LineItemType =
  | 'base' // base premium (sum insured x rate, or a formula-based basic premium)
  | 'extension' // additional cover / rider, adds premium
  | 'loading' // surcharge / age loading / area loading etc, adds premium
  | 'discount' // reduces premium (store as a negative amount)
  | 'tax' // statutory tax (e.g. sales tax / VAT)
  | 'charge' // statutory or administrative charge (stamp duty, BSG, service charge)
  | 'info'; // a zero-amount line used purely to show an intermediate value

export interface LineItem {
  label: string;
  formula?: string; // human-readable formula, e.g. "1,200,000 x 0.30%"
  amount: number; // signed ETB amount; discounts are negative
  type: LineItemType;
  note?: string;
  sourceRef?: string; // citation into the source tariff document, for audit
}

export interface PremiumBreakdown {
  className: string;
  productLabel: string;
  sumInsured: number;
  sumInsuredLabel: string;
  lines: LineItem[];
  basePremium: number;
  totalExtensions: number;
  totalLoading: number;
  totalDiscount: number;
  subtotalBeforeMinimum: number;
  minimumPremium?: number;
  minimumPremiumApplied: boolean;
  premiumAfterMinimum: number;
  totalTax: number;
  totalCharges: number;
  finalPremium: number;
  warnings: string[];
  assumptions: string[];
}

export interface ValidationIssue {
  field: string;
  message: string;
}

/** Helper to accumulate line items and derive the standard breakdown totals. */
export class BreakdownBuilder {
  className: string;
  productLabel: string;
  sumInsured: number;
  sumInsuredLabel: string;
  lines: LineItem[] = [];
  warnings: string[] = [];
  assumptions: string[] = [];
  minimumPremium?: number;

  constructor(className: string, productLabel: string, sumInsured: number, sumInsuredLabel = 'Total Sum Insured') {
    this.className = className;
    this.productLabel = productLabel;
    this.sumInsured = sumInsured;
    this.sumInsuredLabel = sumInsuredLabel;
  }

  add(line: LineItem) {
    this.lines.push(line);
    return this;
  }

  base(label: string, amount: number, formula?: string, sourceRef?: string) {
    return this.add({ label, amount, type: 'base', formula, sourceRef });
  }

  extension(label: string, amount: number, formula?: string, sourceRef?: string) {
    return this.add({ label, amount, type: 'extension', formula, sourceRef });
  }

  loading(label: string, amount: number, formula?: string, sourceRef?: string) {
    return this.add({ label, amount, type: 'loading', formula, sourceRef });
  }

  discount(label: string, amount: number, formula?: string, sourceRef?: string) {
    // amount is passed as a positive magnitude; stored as negative
    return this.add({ label, amount: -Math.abs(amount), type: 'discount', formula, sourceRef });
  }

  tax(label: string, amount: number, formula?: string, sourceRef?: string) {
    return this.add({ label, amount, type: 'tax', formula, sourceRef });
  }

  charge(label: string, amount: number, formula?: string, sourceRef?: string) {
    return this.add({ label, amount, type: 'charge', formula, sourceRef });
  }

  info(label: string, amount = 0, formula?: string) {
    return this.add({ label, amount, type: 'info', formula });
  }

  warn(message: string) {
    this.warnings.push(message);
    return this;
  }

  assume(message: string) {
    this.assumptions.push(message);
    return this;
  }

  setMinimumPremium(amount: number) {
    this.minimumPremium = amount;
    return this;
  }

  build(): PremiumBreakdown {
    const basePremium = sum(this.lines, 'base');
    const totalExtensions = sum(this.lines, 'extension');
    const totalLoading = sum(this.lines, 'loading');
    const totalDiscount = sum(this.lines, 'discount');
    const subtotalBeforeMinimum = basePremium + totalExtensions + totalLoading + totalDiscount;

    // The minimum premium floor applies to the base cover (base + loading + discount),
    // not to optional extensions, which are separately rated add-ons. Extensions are
    // added back on top after the floor is applied.
    const baseSubtotal = basePremium + totalLoading + totalDiscount;
    let baseAfterMinimum = baseSubtotal;
    let minimumPremiumApplied = false;
    if (this.minimumPremium !== undefined && baseSubtotal < this.minimumPremium) {
      baseAfterMinimum = this.minimumPremium;
      minimumPremiumApplied = true;
    }
    const premiumAfterMinimum = baseAfterMinimum + totalExtensions;

    const totalTax = sum(this.lines, 'tax');
    const totalCharges = sum(this.lines, 'charge');
    const finalPremium = premiumAfterMinimum + totalTax + totalCharges;

    return {
      className: this.className,
      productLabel: this.productLabel,
      sumInsured: this.sumInsured,
      sumInsuredLabel: this.sumInsuredLabel,
      lines: this.lines,
      basePremium,
      totalExtensions,
      totalLoading,
      totalDiscount,
      subtotalBeforeMinimum,
      minimumPremium: this.minimumPremium,
      minimumPremiumApplied,
      premiumAfterMinimum,
      totalTax,
      totalCharges,
      finalPremium,
      warnings: this.warnings,
      assumptions: this.assumptions,
    };
  }
}

function sum(lines: LineItem[], type: LineItemType): number {
  return lines.filter((l) => l.type === type).reduce((acc, l) => acc + l.amount, 0);
}
