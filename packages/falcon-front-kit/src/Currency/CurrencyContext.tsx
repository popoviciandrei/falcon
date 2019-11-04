import React, { useContext } from 'react';
import { BackendConfigQuery } from '@deity/falcon-shop-data';
import { ClientConfigQuery } from '../ClientConfig';
import { priceFormatFactory, PriceFormatOptions } from './priceFormat';

export type CurrencyContextType = {
  currency: string;
  priceFormat: ReturnType<typeof priceFormatFactory>;
};

const CurrencyContext = React.createContext<CurrencyContextType>({} as any);

export type CurrencyProviderProps = {
  currency?: string;
  priceFormatOptions?: PriceFormatOptions;
};
export const CurrencyProvider: React.SFC<CurrencyProviderProps> = ({ children, priceFormatOptions = {}, ...props }) => (
  <ClientConfigQuery>
    {({ data: { clientConfig } }) => (
      <BackendConfigQuery>
        {({ data: { backendConfig } }) => {
          const { activeLocale, shop } = backendConfig;

          const localeFallback = clientConfig.i18n.lng;
          const currency = props.currency || shop.activeCurrency || 'EUR';

          return (
            <CurrencyContext.Provider
              value={{
                currency,
                priceFormat: priceFormatFactory([priceFormatOptions.locale, activeLocale, localeFallback], {
                  currency,
                  ...priceFormatOptions
                })
              }}
            >
              {children}
            </CurrencyContext.Provider>
          );
        }}
      </BackendConfigQuery>
    )}
  </ClientConfigQuery>
);

export const useCurrency = (): CurrencyContextType => useContext(CurrencyContext);

export type CurrencyRenderProps = CurrencyContextType;
export type CurrencyProps = {
  children: (props: CurrencyRenderProps) => any;
};
export const Currency: React.SFC<CurrencyProps> = ({ children }) => children({ ...useCurrency() });
