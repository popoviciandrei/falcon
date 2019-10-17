const getPriceFormatter = (locales: string[], numberFormatOptions: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat(locales.filter(x => x), { ...numberFormatOptions, style: 'currency' });

export type PriceFormatOptions = {
  locale?: string;
} & Omit<Intl.NumberFormatOptions, 'style'>;

/**
 * Price Format function factory based on Intl api
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
 * @param {string[]} localeCodes localization codes
 * @param {PriceFormatOptions} options formatting options
 * @returns {ReturnType<typeof priceFormatFactory>} price formatter
 */
export function priceFormatFactory(localeCodes: string[], options: PriceFormatOptions) {
  const memoizedFormatter = getPriceFormatter([options.locale, ...localeCodes], options);

  /**
   * Price Format (memoized)
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
   * @param {number} value value to format
   * @returns {string} formatted value
   */
  function priceFormat(value: number): string;
  /**
   * Price Format (not memoized, because of custom options, so the performance penalty could be paid)
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
   * @param {number} value value to format
   * @param {PriceFormatOptions} overrides `LocaleProvider.priceFormatOptions` options overrides
   * @returns {string} formatted value
   */
  function priceFormat(value: number, overrides: PriceFormatOptions): string;
  function priceFormat(value: number, overrides?: PriceFormatOptions): string {
    return overrides
      ? getPriceFormatter([overrides.locale, options.locale, ...localeCodes], {
          ...options,
          ...overrides
        }).format(value)
      : memoizedFormatter.format(value);
  }

  return priceFormat;
}
