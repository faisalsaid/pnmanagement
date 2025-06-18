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
}

/**
 * Format a number using thousand separators (".") and decimal separators (","),
 * following the Indonesian locale, with optional currency symbol.
 *
 * @example
 * formatNumber(1234);                          // "1.234"
 * formatNumber(1234, { currency: "Rp" });      // "Rp 1.234"
 * formatNumber(1234, { decimals: true });      // "1.234,00"
 * formatNumber(1234, { currency: "$", decimals: true }); // "$ 1.234,00"
 */
export function formatNumber(
  value: number | string,
  { currency, decimals }: FormatNumberOptions = {},
): string {
  const fractionDigits =
    typeof decimals === 'number' ? decimals : decimals ? 2 : 0;

  // "id-ID" locale uses "." as thousand separator and "," as decimal separator
  const formatter = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  const formatted = formatter.format(Number(value));

  return currency ? `${currency} ${formatted}` : formatted;
}
