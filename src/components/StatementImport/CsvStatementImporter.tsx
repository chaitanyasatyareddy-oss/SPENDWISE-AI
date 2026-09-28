import React, { useState } from 'react';
import { FileSpreadsheet, Upload, CheckCircle2, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Expense } from '../../types';

export const CsvStatementImporter: React.FC = () => {
  const { addExpense } = useApp();
  const { formatMoney } = useLanguage();

  const [parsedRows, setParsedRows] = useState<Partial<Expense>[]>([]);
  const [importedCount, setImportedCount] = useState<number | null>(null);

  const sampleCsvContent = `Date,Description,Amount,Category,Tag
2026-09-28,Starbucks Coffee,380,Food,Want
2026-09-28,HPCL Petrol Bunk,1200,Transport,Need
2026-09-27,Decathlon Sports,2400,Shopping,Want
2026-09-26,Practo Doctor Consultation,600,Healthcare,Need`;

  const parseCsvText = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    const results: Partial<Expense>[] = [];

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split(',');
      if (parts.length >= 3) {
        const date = parts[0]?.trim() || new Date().toISOString().split('T')[0];
        const merchant = parts[1]?.trim() || 'Unknown';
        const amount = parseFloat(parts[2]?.trim() || '0');
        const category = (parts[3]?.trim() || 'Other') as Expense['category'];
        const tag = (parts[4]?.trim() || 'Want') as Expense['needWantTag'];

        results.push({
          merchant,
          amount,
          date,
          category,
          needWantTag: tag,
          paymentMethod: 'NetBanking',
          source: 'statement',
          notes: 'Imported via CSV bank statement parser'
        });
      }
    }

    setParsedRows(results);
    setImportedCount(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCsvText(text);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    parseCsvText(sampleCsvContent);
  };

  const handleCommitImport = () => {
    let count = 0;
    for (const row of parsedRows) {
      if (row.merchant && row.amount) {
        addExpense({
          userId: 'usr_spendwise_demo_01',
          merchant: row.merchant,
          amount: row.amount,
          category: row.category || 'Other',
          date: row.date || new Date().toISOString().split('T')[0],
          paymentMethod: row.paymentMethod || 'NetBanking',
          needWantTag: row.needWantTag || 'Want',
          source: 'statement',
          notes: row.notes
        });
        count++;
      }
    }

    setImportedCount(count);
    setParsedRows([]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
          <FileSpreadsheet className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">
            Bank Statement Import Pipeline (CSV)
          </h3>
          <p className="text-[11px] text-slate-400">
            Automated schema mapping of raw bank statements into normalized transactions
          </p>
        </div>
      </div>

      {/* Upload & Quick Sample Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-4 text-center relative bg-slate-950/40">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-1.5 pointer-events-none">
            <Upload className="w-6 h-6 text-emerald-400" />
            <span className="text-xs font-semibold text-white">Upload Bank CSV File</span>
            <span className="text-[10px] text-slate-400">HDFC, ICICI, SBI or custom format</span>
          </div>
        </div>

        <button
          onClick={handleLoadSample}
          className="p-4 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 rounded-xl text-left transition-all flex flex-col justify-between"
        >
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
            <FileText className="w-4 h-4" />
            <span>Load Sample Bank Statement</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Instant 4-row statement (Starbucks, HPCL, Decathlon, Practo)
          </p>
          <span className="text-[10px] text-indigo-300 font-mono">Click to preview</span>
        </button>
      </div>

      {/* Success Notification */}
      {importedCount !== null && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Successfully imported {importedCount} transactions into SpendWise ledger!</span>
        </div>
      )}

      {/* Preview Table */}
      {parsedRows.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <span>Parsed Statement Transactions Preview ({parsedRows.length})</span>
            <button
              onClick={handleCommitImport}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all"
            >
              <span>Commit All to Database</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Merchant</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Class</th>
                  <th className="p-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                {parsedRows.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 text-slate-300">
                    <td className="p-2.5 font-mono text-[11px]">{r.date}</td>
                    <td className="p-2.5 font-semibold text-white">{r.merchant}</td>
                    <td className="p-2.5">{r.category}</td>
                    <td className="p-2.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        r.needWantTag === 'Need'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {r.needWantTag}
                      </span>
                    </td>
                    <td className="p-2.5 font-mono font-bold text-right text-white">
                      {formatMoney(r.amount || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
