// formatNumber.ts
export interface FormatNumberOptions {
  /** Currency symbol, e.g., "Rp", "$", "€" */
  currency?: string;
  /**
   * Decimals:
   *  - false/undefined → 0 digits
   *  - true            → 2 digits
   *  - number n        → n digits
   */
  decimals?: boolean | number;
  /**
   * Compact notation:
   *  - true  → 1.2K / 3M / 4B
   *  - false → full value with thousands separators (default)
   */
  compact?: boolean;
}

/**
 * Format a number following the Indonesian locale:
 *   • standard mode  → "1.234,56"
 *   • compact mode   → "1,2K", "3M", "4B"
 *   • currency mix   → "$ 1B", "Rp 1,2K", etc.
 *
 * @example
 * formatNumber(1234);                                   // "1.234"
 * formatNumber(1234, { currency: "Rp" });               // "Rp 1.234"
 * formatNumber(1234, { decimals: true });               // "1.234,00"
 * formatNumber(1234, { currency: "$", decimals: true }); // "$ 1.234,00"
 * formatNumber(1235, { compact: true });                // "1K"
 * formatNumber(1_234_567, { compact: true });           // "1M"
 * formatNumber(1_234_567_890, { currency: "$", compact: true }); // "$ 1B"
 */
export function formatNumber(
  value: number | string,
  { currency, decimals, compact }: FormatNumberOptions = {},
): string {
  const numeric = Number(value);

  // Resolve requested fraction digits
  const fractionDigits =
    typeof decimals === 'number' ? decimals : decimals ? 2 : 0;

  /** Helper: apply locale formatter */
  const formatLocale = (num: number) =>
    new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(num);

  let formatted: string;

  if (compact) {
    const abs = Math.abs(numeric);
    let divisor = 1;
    let suffix = '';

    if (abs >= 1_000_000_000) {
      divisor = 1_000_000_000;
      suffix = 'B';
    } else if (abs >= 1_000_000) {
      divisor = 1_000_000;
      suffix = 'M';
    } else if (abs >= 1_000) {
      divisor = 1_000;
      suffix = 'K';
    }

    formatted = formatLocale(numeric / divisor) + suffix;
  } else {
    formatted = formatLocale(numeric);
  }

  return currency ? `${currency} ${formatted}` : formatted;
}
