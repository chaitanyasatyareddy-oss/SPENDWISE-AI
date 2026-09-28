import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Volume2, ShieldAlert, Languages } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { askFinancialCoach } from '../../services/geminiService';
import { ChatMessage } from '../../types';

export const MultilingualCoachChat: React.FC = () => {
  const { expenses, budgets, savingsGoals, subscriptions, bills, userProfile } = useApp();
  const { language } = useLanguage();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `Hello ${userProfile.fullName || 'there'}! I am your SpendWise Multilingual AI Financial Coach. You can ask me questions about your monthly spending, category breakdowns, daily limit, or savings targets in English, Telugu, Hindi, Spanish, Arabic, or any supported language.\n\n*(Disclaimer: Informational analysis only; not professional financial advice)*`,
      timestamp: '9:41 AM',
      detectedLanguage: 'English',
      isCodeSwitched: false,
      suggestedActions: [
        'How much did I spend on food this month?',
        'ఈ నెల food మీద ఎంత spend చేశాను?',
        'Where am I overspending this month?',
        'What is my recommended daily spending limit?'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Query AI Coach with activeLanguage parameter
    setTimeout(async () => {
      try {
        const response = await askFinancialCoach(query, {
          expenses,
          budgets,
          savingsGoals,
          subscriptions,
          bills,
          monthlyBudget: userProfile.targetMonthlyBudget,
          monthlyIncome: userProfile.monthlyIncome,
          activeLanguage: language,
        });

        const assistantMsg: ChatMessage = {
          id: `msg_asst_${Date.now()}`,
          sender: 'assistant',
          text: response.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          detectedLanguage: response.detectedLanguage,
          isCodeSwitched: response.isCodeSwitched,
          suggestedActions: response.suggestedActions
        };

        setMessages(prev => [...prev, assistantMsg]);
      } catch (err) {
        console.error('Coach query error:', err);
      }
    }, 200);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[#*()]/g, ''));
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col h-[650px] overflow-hidden shadow-xl transition-colors">
      {/* Coach Header */}
      <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>SpendWise AI Financial Coach</span>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                Online
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Multilingual NLP engine with intra-sentential code-switching
            </p>
          </div>
        </div>

        {/* Active Language Badge */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <Languages className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-slate-700 dark:text-slate-300 font-medium uppercase">{language}</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-3xl p-4 text-xs space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md'
                  : 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm'
              }`}
            >
              {/* Header metadata */}
              <div className="flex items-center justify-between gap-4 text-[10px] opacity-75 border-b border-current/10 pb-1.5">
                <span className="font-semibold">
                  {msg.sender === 'user' ? (userProfile.username ? `@${userProfile.username}` : 'You') : 'SpendWise AI Coach'}
                </span>
                <div className="flex items-center gap-2">
                  {msg.detectedLanguage && (
                    <span className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.2 rounded text-indigo-700 dark:text-indigo-300">
                      {msg.detectedLanguage}
                    </span>
                  )}
                  <span>{msg.timestamp}</span>
                </div>
              </div>

              {/* Message Content formatted */}
              <div className="whitespace-pre-line leading-relaxed">
                {msg.text}
              </div>

              {/* Speech action for assistant */}
              {msg.sender === 'assistant' && (
                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={() => handleSpeak(msg.text)}
                    className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded-lg transition-colors"
                    title="Read aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Suggested Action Chips (if provided) */}
            {msg.suggestedActions && msg.suggestedActions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                {msg.suggestedActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(action)}
                    className="text-[11px] bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800/90 dark:hover:bg-indigo-950/60 border border-slate-200 hover:border-indigo-300 dark:border-slate-700 dark:hover:border-indigo-500/50 text-indigo-700 dark:text-indigo-200 px-3 py-1 rounded-full transition-all text-left"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-2 transition-colors">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask in English, Telugu, Hindi, Spanish, or Arabic..."
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-md transition-all active:scale-95 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
          <span>Non-advisory compliance enforced</span>
          <span className="font-mono">18 Languages & RTL Supported</span>
        </div>
      </div>
    </div>
  );
};
