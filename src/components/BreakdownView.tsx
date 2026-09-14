import type { PremiumBreakdown, LineItem, LineItemType } from '../types/engine';
import { formatETB } from '../utils/currency';

const TYPE_STYLES: Record<LineItemType, string> = {
  base: 'text-slate-800',
  extension: 'text-blue-700',
  loading: 'text-amber-700',
  discount: 'text-emerald-700',
  tax: 'text-rose-700',
  charge: 'text-rose-700',
  info: 'text-slate-500 italic',
};

const TYPE_LABELS: Record<LineItemType, string> = {
  base: 'Base',
  extension: 'Extension',
  loading: 'Loading',
  discount: 'Discount',
  tax: 'Tax',
  charge: 'Charge',
  info: 'Info',
};

function LineRow({ line }: { line: LineItem }) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="py-2 pr-3 align-top">
        <div className={`font-medium ${TYPE_STYLES[line.type]}`}>{line.label}</div>
        {line.formula && <div className="mt-0.5 font-mono text-xs text-slate-400">{line.formula}</div>}
        {line.note && <div className="mt-0.5 text-xs text-slate-400">{line.note}</div>}
        {line.sourceRef && <div className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-300">Ref: {line.sourceRef}</div>}
      </td>
      <td className="py-2 pl-2 text-right align-top">
        <span className="inline-block rounded bg-slate-50 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">{TYPE_LABELS[line.type]}</span>
      </td>
      <td className={`py-2 pl-4 text-right align-top font-mono tabular-nums whitespace-nowrap ${TYPE_STYLES[line.type]}`}>{formatETB(line.amount)}</td>
    </tr>
  );
}

function TotalRow({ label, amount, bold, tone }: { label: string; amount: number; bold?: boolean; tone?: string }) {
  return (
    <tr className={bold ? 'border-t-2 border-slate-300' : 'border-t border-slate-200'}>
      <td colSpan={2} className={`py-2 pr-3 ${bold ? 'text-base font-bold text-slate-900' : 'text-sm font-semibold text-slate-600'}`}>
        {label}
      </td>
      <td className={`py-2 pl-4 text-right font-mono tabular-nums whitespace-nowrap ${bold ? 'text-base font-bold' : 'text-sm font-semibold'} ${tone ?? 'text-slate-900'}`}>
        {formatETB(amount)}
      </td>
    </tr>
  );
}

export function BreakdownView({ breakdown }: { breakdown: PremiumBreakdown }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-base font-semibold text-slate-800">Premium Calculation Breakdown</h3>
        <p className="text-xs text-slate-500">{breakdown.productLabel}</p>
      </div>

      {breakdown.warnings.length > 0 && (
        <div className="mx-5 mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
          <p className="mb-1 font-semibold">Underwriter attention required</p>
          <ul className="list-disc space-y-0.5 pl-4">
            {breakdown.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="overflow-x-auto px-5 pb-2 pt-4">
        <table className="w-full text-sm">
          <tbody>
            {breakdown.sumInsured > 0 && <TotalRow label={breakdown.sumInsuredLabel} amount={breakdown.sumInsured} />}
            {breakdown.lines.map((l, i) => (
              <LineRow key={i} line={l} />
            ))}
            <TotalRow label="Base + Loadings + Extensions + Discounts" amount={breakdown.subtotalBeforeMinimum} />
            {breakdown.minimumPremiumApplied && (
              <TotalRow
                label={`Minimum premium applied (Birr ${breakdown.minimumPremium?.toLocaleString()})`}
                amount={breakdown.premiumAfterMinimum}
                tone="text-amber-700"
              />
            )}
            {breakdown.totalTax !== 0 && <TotalRow label="Tax" amount={breakdown.totalTax} />}
            {breakdown.totalCharges !== 0 && <TotalRow label="Statutory / Other Charges" amount={breakdown.totalCharges} />}
            <TotalRow label="Final Payable Premium" amount={breakdown.finalPremium} bold tone="text-blue-700" />
          </tbody>
        </table>
      </div>

      {breakdown.assumptions.length > 0 && (
        <div className="mx-5 mb-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <p className="mb-1 font-semibold text-slate-700">Assumptions applied</p>
          <ul className="list-disc space-y-0.5 pl-4">
            {breakdown.assumptions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
