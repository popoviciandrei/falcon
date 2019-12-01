const getDateTimeFormatter = (locales: string[], dateTimeFormatOptions: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(
    locales.filter(x => x),
    { ...dateTimeFormatOptions }
  );

export type DateTimeFormatOptions = {
  locale?: string;
} & Intl.DateTimeFormatOptions;

export function dateTimeFormatFactory(localeCodes: string[], options: DateTimeFormatOptions) {
  const memoizedFormatter = getDateTimeFormatter([options.locale, ...localeCodes], options);

  /**
   * DateTime Format (memoized)
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param {number | string | Date} value value to format
   * @returns {string} formatted value
   */
  function dateTimeFormat(value: number | string | Date): string;
  /**
   * DateTime Format (not memoized, because of custom options, so the performance penalty could be paid)
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param {number | string | Date} value value to format
   * @param {DateTimeFormatOptions} overrides `LocaleProvider.dateTimeFormatOptions` options overrides
   * @returns {string} formatted value
   */
  function dateTimeFormat(value: number | string | Date, overrides: DateTimeFormatOptions): string;
  function dateTimeFormat(value: number | string | Date, overrides?: DateTimeFormatOptions): string {
    return overrides
      ? getDateTimeFormatter([overrides.locale, options.locale, ...localeCodes], {
          ...options,
          ...overrides
        }).format(new Date(value))
      : memoizedFormatter.format(new Date(value));
  }

  return dateTimeFormat;
}
