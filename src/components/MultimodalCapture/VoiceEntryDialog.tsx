import React, { useState } from 'react';
import { Mic, MicOff, Sparkles, CheckCircle, Volume2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Expense } from '../../types';

export const VoiceEntryDialog: React.FC = () => {
  const { addExpense } = useApp();
  const { formatMoney } = useLanguage();

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedExpense, setParsedExpense] = useState<Partial<Expense> | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Natural language transaction phrases
  const sampleVoicePhrases = [
    "I spent ₹250 on lunch at McDonald's using UPI",
    "Paid ₹450 for Swiggy biryani delivery with Google Pay",
    "Spent ₹180 on metro train ride ticket via cash",
    "Bought ₹1,200 groceries at Blinkit using credit card"
  ];

  // Natural language rule-based parser
  const parseNaturalPhrase = (text: string) => {
    let amount = 0;
    let merchant = 'Unknown Merchant';
    let category: Expense['category'] = 'Other';
    let paymentMethod: Expense['paymentMethod'] = 'UPI';
    let needWantTag: Expense['needWantTag'] = 'Want';

    // Extract amount
    const amtMatch = text.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)/i);
    if (amtMatch) {
      amount = parseFloat(amtMatch[1].replace(/,/g, ''));
    }

    // Extract merchant & category heuristics
    const lower = text.toLowerCase();
    if (lower.includes("mcdonald's") || lower.includes("mcdonalds")) {
      merchant = "McDonald's";
      category = 'Food';
      needWantTag = 'Want';
    } else if (lower.includes('swiggy')) {
      merchant = 'Swiggy';
      category = 'Food';
      needWantTag = 'Want';
    } else if (lower.includes('metro') || lower.includes('uber') || lower.includes('ola')) {
      merchant = lower.includes('metro') ? 'Metro Rail' : 'Uber';
      category = 'Transport';
      needWantTag = 'Need';
    } else if (lower.includes('blinkit') || lower.includes('groceries') || lower.includes('supermarket')) {
      merchant = 'Blinkit Supermarket';
      category = 'Groceries';
      needWantTag = 'Need';
    } else {
      merchant = 'Retail Merchant';
      category = 'Shopping';
    }

    // Payment method detection
    if (lower.includes('upi') || lower.includes('google pay') || lower.includes('phonepe') || lower.includes('paytm')) {
      paymentMethod = 'UPI';
    } else if (lower.includes('credit card')) {
      paymentMethod = 'Credit Card';
    } else if (lower.includes('cash')) {
      paymentMethod = 'Cash';
    }

    return {
      merchant,
      amount,
      category,
      paymentMethod,
      date: new Date().toISOString().split('T')[0],
      needWantTag,
      source: 'voice' as const,
      notes: `Voice input: "${text}"`
    };
  };

  const handleStartListening = () => {
    setIsSaved(false);
    // Check Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsRecording(true);

        recognition.onresult = (event: any) => {
          const phrase = event.results[0][0].transcript;
          setTranscript(phrase);
          setParsedExpense(parseNaturalPhrase(phrase));
          setIsRecording(false);
        };

        recognition.onerror = () => {
          setIsRecording(false);
          // Fallback simulation
          simulateSpeechRecognition();
        };

        recognition.start();
        return;
      } catch (e) {
        // Fallback
      }
    }

    // Default simulation if Web Speech is blocked or unsupported in current environment
    simulateSpeechRecognition();
  };

  const simulateSpeechRecognition = () => {
    setIsRecording(true);
    setTimeout(() => {
      const phrase = "I spent ₹250 on lunch at McDonald's using UPI";
      setTranscript(phrase);
      setParsedExpense(parseNaturalPhrase(phrase));
      setIsRecording(false);
    }, 1200);
  };

  const handleSelectSample = (phrase: string) => {
    setTranscript(phrase);
    setParsedExpense(parseNaturalPhrase(phrase));
    setIsSaved(false);
  };

  const handleConfirmSave = () => {
    if (!parsedExpense || !parsedExpense.amount || !parsedExpense.merchant) return;

    addExpense({
      userId: 'usr_spendwise_demo_01',
      merchant: parsedExpense.merchant,
      amount: parsedExpense.amount,
      category: parsedExpense.category || 'Other',
      paymentMethod: parsedExpense.paymentMethod || 'UPI',
      date: parsedExpense.date || new Date().toISOString().split('T')[0],
      needWantTag: parsedExpense.needWantTag || 'Want',
      source: 'voice',
      notes: parsedExpense.notes
    });

    setIsSaved(true);
    setTimeout(() => {
      setParsedExpense(null);
      setTranscript('');
      setIsSaved(false);
    }, 1800);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
          <Mic className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">
            Natural Voice Expense Entry
          </h3>
          <p className="text-[11px] text-slate-400">
            Speak naturally to parse unstructured speech into structured transaction fields
          </p>
        </div>
      </div>

      {/* Voice Record Button & Mic Animation */}
      <div className="flex flex-col items-center justify-center p-6 bg-slate-950/40 border border-slate-800 rounded-2xl space-y-3">
        <button
          onClick={handleStartListening}
          disabled={isRecording}
          aria-label={isRecording ? "Listening to voice input" : "Start speaking voice expense"}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            isRecording
              ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-500/20'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
          }`}
        >
          {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
        </button>
        <span className="text-xs font-semibold text-slate-300">
          {isRecording ? 'Listening... Speak now' : 'Click to Speak Expense'}
        </span>
      </div>

      {/* Sample Phrase Quick Buttons */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-400">
          Or click a sample voice transcription phrase:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {sampleVoicePhrases.map((phrase, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(phrase)}
              className="text-left p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-300 transition-all flex items-center gap-2 group"
            >
              <Volume2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 group-hover:scale-110" />
              <span className="truncate">{phrase}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Structured Confirmation Dialog */}
      {parsedExpense && (
        <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-4 space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Parsed Natural Transaction Confirmation</span>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
            "{transcript}"
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400">Merchant</span>
              <p className="font-bold text-white truncate">{parsedExpense.merchant}</p>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400">Amount</span>
              <p className="font-bold text-emerald-400 font-mono">{formatMoney(parsedExpense.amount || 0)}</p>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400">Category</span>
              <p className="font-semibold text-indigo-300">{parsedExpense.category}</p>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400">Payment</span>
              <p className="font-medium text-slate-300">{parsedExpense.paymentMethod}</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => setParsedExpense(null)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSave}
              disabled={isSaved}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isSaved ? 'bg-emerald-600 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Added to Expenses!</span>
                </>
              ) : (
                <>
                  <span>Save to Ledger</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
