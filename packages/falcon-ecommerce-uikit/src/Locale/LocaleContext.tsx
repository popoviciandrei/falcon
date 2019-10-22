import React from 'react';
import { BackendConfigQuery } from '../BackendConfig';
import { Omit } from '../types';

export type LocaleContextType = {
  locale: string;
  localeFallback: string;
  currency: string;
  priceFormat: ReturnType<typeof priceFormatFactory>;
  dateTimeFormat: ReturnType<typeof dateTimeFormatFactory>;
};

const LocaleContext = React.createContext<LocaleContextType>({} as any);

export type LocaleProviderProps = {
  currency?: string;
  priceFormatOptions?: PriceFormatOptions;
  dateTimeFormatOptions?: DateTimeFormatOptions;
};
export const LocaleProvider: React.SFC<LocaleProviderProps> = ({
  children,
  priceFormatOptions = {},
  dateTimeFormatOptions = {},
  ...props
}) => (
  <BackendConfigQuery>
    {({ backendConfig }) => {
      const { activeLocale, shop } = backendConfig;

      const locale = activeLocale || 'en';
      const localeFallback = 'en';
      const currency = props.currency || shop.activeCurrency || 'EUR';

      return (
        <LocaleContext.Provider
          value={{
            locale,
            localeFallback,
            currency,
            priceFormat: priceFormatFactory([priceFormatOptions.locale, locale, localeFallback], {
              currency,
              ...priceFormatOptions
            }),
            dateTimeFormat: dateTimeFormatFactory([dateTimeFormatOptions.locale, locale, localeFallback], {
              ...dateTimeFormatOptions
            })
          }}
        >
          {children}
        </LocaleContext.Provider>
      );
    }}
  </BackendConfigQuery>
);

export type LocaleProps = { children: (props: LocaleRenderProps) => any };
export type LocaleRenderProps = {
  locale: string;
  currency: string;
  priceFormat: ReturnType<typeof priceFormatFactory>;
  dateTimeFormat: ReturnType<typeof dateTimeFormatFactory>;
};
export const Locale: React.SFC<LocaleProps> = ({ children }) => (
  <LocaleContext.Consumer>{({ localeFallback, ...props }) => children({ ...props })}</LocaleContext.Consumer>
);

export type PriceFormatOptions = { locale?: string } & Omit<Intl.NumberFormatOptions, 'style'>;
/**
 * Price Format function factory based on Intl api
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
 * @param {string[]} localeCodes localization codes
 * @param {PriceFormatOptions} options formatting options
 * @returns {ReturnType<typeof priceFormatFactory>} price formatter
 */
export function priceFormatFactory(localeCodes: string[], options: PriceFormatOptions) {
  const getPriceFormatter = (locales: string[], numberFormatOptions: Intl.NumberFormatOptions) =>
    new Intl.NumberFormat(locales.filter(x => x), { ...numberFormatOptions, style: 'currency' });

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

export type DateTimeFormatOptions = { locale?: string } & Intl.DateTimeFormatOptions;
export function dateTimeFormatFactory(localeCodes: string[], options: DateTimeFormatOptions) {
  const getDateTimeFormatter = (locales: string[], dateTimeFormatOptions: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locales.filter(x => x), { ...dateTimeFormatOptions });

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
