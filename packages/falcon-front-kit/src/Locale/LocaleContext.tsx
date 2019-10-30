import React from 'react';
import { BackendConfigQuery } from '@deity/falcon-shop-data';
import { ClientConfigQuery } from '../ClientConfig';
import { dateTimeFormatFactory, DateTimeFormatOptions } from './dateTimeFormat';
import { priceFormatFactory, PriceFormatOptions } from './priceFormat';

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
  <ClientConfigQuery>
    {({ data: { clientConfig } }) => (
      <BackendConfigQuery>
        {({ data: { backendConfig } }) => {
          const { activeLocale, shop } = backendConfig;

          const localeFallback = clientConfig.i18n.lng;
          const currency = props.currency || shop.activeCurrency || 'EUR';

          return (
            <LocaleContext.Provider
              value={{
                locale: activeLocale,
                localeFallback,
                currency,
                priceFormat: priceFormatFactory([priceFormatOptions.locale, activeLocale, localeFallback], {
                  currency,
                  ...priceFormatOptions
                }),
                dateTimeFormat: dateTimeFormatFactory([dateTimeFormatOptions.locale, activeLocale, localeFallback], {
                  ...dateTimeFormatOptions
                })
              }}
            >
              {children}
            </LocaleContext.Provider>
          );
        }}
      </BackendConfigQuery>
    )}
  </ClientConfigQuery>
);

export type LocaleProps = {
  children: (props: LocaleRenderProps) => any;
};
export type LocaleRenderProps = {
  locale: string;
  currency: string;
  priceFormat: ReturnType<typeof priceFormatFactory>;
  dateTimeFormat: ReturnType<typeof dateTimeFormatFactory>;
};
export const Locale: React.SFC<LocaleProps> = ({ children }) => (
  <LocaleContext.Consumer>{({ localeFallback, ...props }) => children({ ...props })}</LocaleContext.Consumer>
);
