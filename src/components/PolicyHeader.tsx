import { Field, FieldRow, TextInput } from './FormField';

export interface PolicyInfo {
  insuredName: string;
  quoteRef: string;
  quoteDate: string;
  preparedBy: string;
}

export function PolicyHeaderForm({ value, onChange }: { value: PolicyInfo; onChange: (v: PolicyInfo) => void }) {
  return (
    <div className="no-print rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-base font-semibold text-slate-800">Policy / Quotation Information</h3>
      <FieldRow>
        <Field label="Name of Insured">
          <TextInput value={value.insuredName} onChange={(v) => onChange({ ...value, insuredName: v })} placeholder="e.g. ABC Trading PLC" />
        </Field>
        <Field label="Quotation / Policy Reference">
          <TextInput value={value.quoteRef} onChange={(v) => onChange({ ...value, quoteRef: v })} placeholder="e.g. QT-2018-0001" />
        </Field>
      </FieldRow>
      <FieldRow>
        <Field label="Date">
          <input
            type="date"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={value.quoteDate}
            onChange={(e) => onChange({ ...value, quoteDate: e.target.value })}
          />
        </Field>
        <Field label="Prepared By (Underwriting Officer)">
          <TextInput value={value.preparedBy} onChange={(v) => onChange({ ...value, preparedBy: v })} placeholder="e.g. A. Alemu" />
        </Field>
      </FieldRow>
    </div>
  );
}
