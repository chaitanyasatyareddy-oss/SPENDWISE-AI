import { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', rateAgainstINR: 1, name: 'Indian Rupee' },
  USD: { code: 'USD', symbol: '$', rateAgainstINR: 0.012, name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', rateAgainstINR: 0.011, name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', rateAgainstINR: 0.0094, name: 'British Pound' },
  JPY: { code: 'JPY', symbol: '¥', rateAgainstINR: 1.82, name: 'Japanese Yen' },
  AED: { code: 'AED', symbol: 'AED ', rateAgainstINR: 0.044, name: 'UAE Dirham' },
};

export function formatCurrency(
  amountInINR: number,
  currencyCode: CurrencyCode = 'INR',
  showSymbol: boolean = true
): string {
  const config = CURRENCY_CONFIGS[currencyCode] || CURRENCY_CONFIGS.INR;
  const converted = amountInINR * config.rateAgainstINR;

  let formattedNumber: string;
  if (currencyCode === 'INR') {
    formattedNumber = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(converted);
  } else if (currencyCode === 'JPY') {
    formattedNumber = new Intl.NumberFormat('ja-JP', {
      maximumFractionDigits: 0,
    }).format(converted);
  } else {
    formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
  }

  return showSymbol ? `${config.symbol}${formattedNumber}` : formattedNumber;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}
