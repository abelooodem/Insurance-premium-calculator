import { useState } from 'react';
import { INSURANCE_CLASSES, type InsuranceClassId } from './insuranceClasses';
import { PolicyHeaderForm, type PolicyInfo } from './components/PolicyHeader';
import { MotorForm } from './components/forms/MotorForm';
import { FireForm } from './components/forms/FireForm';
import { MarineForm } from './components/forms/MarineForm';
import { EngineeringForm } from './components/forms/EngineeringForm';
import { PersonalAccidentForm } from './components/forms/PersonalAccidentForm';
import { BurglaryForm } from './components/forms/BurglaryForm';
import { MoneyForm } from './components/forms/MoneyForm';
import { FidelityForm } from './components/forms/FidelityForm';
import { CarriersLiabilityForm } from './components/forms/CarriersLiabilityForm';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function App() {
  const [classId, setClassId] = useState<InsuranceClassId>('motor');
  const [policy, setPolicy] = useState<PolicyInfo>({ insuredName: '', quoteRef: '', quoteDate: todayISO(), preparedBy: '' });
  const [resetKey, setResetKey] = useState(0);

  const activeMeta = INSURANCE_CLASSES.find((c) => c.id === classId)!;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="no-print border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Insurance Premium Calculator</h1>
              <p className="text-sm text-slate-500">Ethiopian underwriting & quotation workbench &middot; amounts in Ethiopian Birr (ETB)</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Print Quotation
              </button>
              <button
                onClick={() => setResetKey((k) => k + 1)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="no-print border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6">
          <div className="flex gap-1 py-2">
            {INSURANCE_CLASSES.map((c) => (
              <button
                key={c.id}
                onClick={() => setClassId(c.id)}
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  classId === c.id ? 'bg-blue-600 text-white' : c.available ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300'
                }`}
              >
                {c.shortLabel}
                {!c.available && ' ○'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-4 no-print">
          <h2 className="text-lg font-bold text-slate-900">{activeMeta.label}</h2>
        </div>

        <div className="mb-6">
          <PolicyHeaderForm value={policy} onChange={setPolicy} />
          <PrintQuotationHeader policy={policy} classLabel={activeMeta.label} />
        </div>

        {activeMeta.available ? (
          <div key={`${classId}-${resetKey}`}>
            <ClassForm classId={classId} />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            <p className="font-semibold">This class is not yet configured.</p>
            <p className="mt-1 text-sm">{activeMeta.note}</p>
          </div>
        )}

        <footer className="no-print mt-10 border-t border-slate-200 pt-4 text-xs text-slate-400">
          <p>
            All rates, formulas, minimum premiums and discounts are drawn directly from the uploaded company rate charts and are held in
            the configurable tariff files under <code>src/tariffs/</code>. See the calculator's accompanying documentation for how to
            update rates and which items require Head Office confirmation.
          </p>
        </footer>
      </main>
    </div>
  );
}

function ClassForm({ classId }: { classId: InsuranceClassId }) {
  switch (classId) {
    case 'motor':
      return <MotorForm />;
    case 'fire':
      return <FireForm />;
    case 'marine':
      return <MarineForm />;
    case 'engineering':
      return <EngineeringForm />;
    case 'personal_accident':
      return <PersonalAccidentForm />;
    case 'burglary':
      return <BurglaryForm />;
    case 'money':
      return <MoneyForm />;
    case 'fidelity':
      return <FidelityForm />;
    case 'carriers_liability':
      return <CarriersLiabilityForm />;
    default:
      return null;
  }
}

function PrintQuotationHeader({ policy, classLabel }: { policy: PolicyInfo; classLabel: string }) {
  return (
    <div className="hidden print:block print:mb-6 print:border-b print:border-slate-300 print:pb-4">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Premium Quotation</h1>
        <span className="text-sm text-slate-500">{classLabel}</span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-slate-700">
        <div><span className="font-semibold">Insured:</span> {policy.insuredName || '—'}</div>
        <div><span className="font-semibold">Quotation Ref:</span> {policy.quoteRef || '—'}</div>
        <div><span className="font-semibold">Date:</span> {policy.quoteDate || '—'}</div>
        <div><span className="font-semibold">Prepared By:</span> {policy.preparedBy || '—'}</div>
      </div>
    </div>
  );
}
