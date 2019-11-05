import React, { useContext } from 'react';
import { BackendConfigQuery } from '@deity/falcon-shop-data';
import { useLocale } from '../Locale';
import { priceFormatFactory, PriceFormatOptions } from './priceFormat';

export type CurrencyContextType = {
  currency: string;
  priceFormat: ReturnType<typeof priceFormatFactory>;
};

const CurrencyContext = React.createContext<CurrencyContextType>({} as any);

export type CurrencyProviderProps = {
  /** if not provided  then `backendConfig.shop.activeCurrency` will be used */
  currency?: string;
  priceFormatOptions?: PriceFormatOptions;
};
/**
 * Depends on `LocaleProvider`
 */
export const CurrencyProvider: React.SFC<CurrencyProviderProps> = ({ currency, priceFormatOptions = {}, children }) => {
  const { locale, localeFallback } = useLocale();

  if (currency) {
    return (
      <CurrencyContext.Provider
        value={{
          currency,
          priceFormat: priceFormatFactory([priceFormatOptions.locale, locale, localeFallback], {
            currency,
            ...priceFormatOptions
          })
        }}
      >
        {children}
      </CurrencyContext.Provider>
    );
  }

  return (
    <BackendConfigQuery>
      {({ data: { backendConfig } }) => {
        const { shop } = backendConfig;
        currency = (shop && shop.activeCurrency) || 'EUR';

        return (
          <CurrencyContext.Provider
            value={{
              currency,
              priceFormat: priceFormatFactory([priceFormatOptions.locale, locale, localeFallback], {
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
  );
};

export const useCurrency = (): CurrencyContextType => useContext(CurrencyContext);

export type CurrencyRenderProps = CurrencyContextType;
export type CurrencyProps = {
  children: (props: CurrencyRenderProps) => any;
};
export const Currency: React.SFC<CurrencyProps> = ({ children }) => children({ ...useCurrency() });
