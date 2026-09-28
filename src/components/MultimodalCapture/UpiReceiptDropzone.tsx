import React, { useState } from 'react';
import {
  UploadCloud,
  FileCheck2,
  AlertCircle,
  Loader2,
  CheckCircle,
  Smartphone,
  Sparkles,
  Receipt,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  SAMPLE_UPI_PRESETS,
  parseReceiptOrUpiImage,
  ParsedTransactionResult
} from '../../services/ocrParser';

export const UpiReceiptDropzone: React.FC = () => {
  const { addExpense } = useApp();
  const { formatMoney } = useLanguage();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ParsedTransactionResult | null>(null);
  const [successSaved, setSuccessSaved] = useState(false);

  // Trigger OCR with a preset
  const handleSelectPreset = async (presetId: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessSaved(false);
    try {
      const result = await parseReceiptOrUpiImage(null, presetId);
      setExtractedData(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process screenshot');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger OCR with uploaded file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessSaved(false);

    try {
      const result = await parseReceiptOrUpiImage(file);
      setExtractedData(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Image unreadable. Please upload a clear photo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save the extracted result into AppContext
  const handleConfirmSave = () => {
    if (!extractedData) return;

    addExpense({
      userId: 'usr_spendwise_demo_01',
      merchant: extractedData.merchantName,
      amount: extractedData.totalAmount,
      category: extractedData.category,
      paymentMethod: extractedData.paymentMethod,
      date: extractedData.transactionDate,
      needWantTag: extractedData.needWantTag,
      source: 'receipt',
      notes: `Ref: ${extractedData.referenceNumber}. ${extractedData.justification}`,
      referenceNumber: extractedData.referenceNumber,
      items: extractedData.lineItems.map((li, idx) => ({
        id: `item_${Date.now()}_${idx}`,
        expenseId: '',
        itemName: li.itemName,
        unitPrice: li.unitPrice,
        quantity: li.quantity,
        totalPrice: li.totalPrice
      }))
    });

    setSuccessSaved(true);
    setTimeout(() => {
      setExtractedData(null);
      setSuccessSaved(false);
    }, 1800);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Multimodal OCR & UPI Screenshot Parser
            </h3>
            <p className="text-[11px] text-slate-400">
              Powered by Gemini Vision extraction API for Google Pay, PhonePe, and Paytm
            </p>
          </div>
        </div>
      </div>

      {/* 1-Click Simulation Presets (Mandatory Verification Flow) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
          <span>Quick Verification Presets (Simulate UPI Screenshot)</span>
          <span className="text-[10px] text-indigo-400 font-mono">Instant Test</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SAMPLE_UPI_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              disabled={isLoading}
              className="p-3 bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 rounded-xl text-left transition-all group flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {preset.appName}
                </span>
                <span className="text-xs font-mono font-bold text-white group-hover:text-indigo-400">
                  ₹{preset.result.totalAmount}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-200 line-clamp-1">
                {preset.result.merchantName}
              </p>
              <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
                <span>{preset.result.category}</span>
                <span className="text-emerald-400 font-semibold">{preset.result.needWantTag}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Manual File Dropzone */}
      <div className="relative border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-2xl p-6 text-center transition-colors bg-slate-950/40">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isLoading}
          aria-label="Upload payment screenshot or bill receipt"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-xs text-indigo-300 font-medium">
                Gemini Vision API parsing receipt payload & line items...
              </p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 shadow-inner">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  Drop UPI screenshot or bill receipt here
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Supports Google Pay, PhonePe, Paytm, supermarket invoices (PNG, JPG)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl flex items-center gap-2 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Extracted Structured Transaction Result Modal / Box */}
      {extractedData && (
        <div className="bg-slate-950 border border-indigo-500/40 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Extracted Transaction Payload
              </h4>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
              Confidence: {Math.round(extractedData.confidenceScore * 100)}%
            </span>
          </div>

          {/* Key fields */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">Merchant</span>
              <p className="font-bold text-white truncate">{extractedData.merchantName}</p>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">Total Amount</span>
              <p className="font-bold text-emerald-400 font-mono text-sm">{formatMoney(extractedData.totalAmount)}</p>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">Category</span>
              <p className="font-semibold text-indigo-300">{extractedData.category}</p>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">Classification</span>
              <p className="font-bold text-amber-400">{extractedData.needWantTag}</p>
            </div>
          </div>

          {/* Reference and Justification */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-1 text-xs">
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>Ref: {extractedData.referenceNumber}</span>
              <span>Date: {extractedData.transactionDate}</span>
            </div>
            <p className="text-[11px] text-indigo-200/90 pt-1">
              <strong>Analytical Justification:</strong> {extractedData.justification}
            </p>
          </div>

          {/* Itemized Decomposition */}
          {extractedData.lineItems.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400">
                Itemized Receipt Decomposition:
              </span>
              <div className="space-y-1 max-h-28 overflow-y-auto">
                {extractedData.lineItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-xs bg-slate-900/40 px-2.5 py-1.5 rounded-lg border border-slate-800/60"
                  >
                    <span className="text-slate-300">{item.itemName} (x{item.quantity})</span>
                    <span className="font-mono font-semibold text-white">{formatMoney(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => setExtractedData(null)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Discard
            </button>
            <button
              onClick={handleConfirmSave}
              disabled={successSaved}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                successSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
              }`}
            >
              {successSaved ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Saved to Ledger & Dashboard!</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Confirm & Save Transaction</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
