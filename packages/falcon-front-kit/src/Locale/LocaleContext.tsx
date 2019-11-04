import React, { useContext } from 'react';
import { BackendConfigQuery } from '@deity/falcon-shop-data';
import { ClientConfigQuery } from '../ClientConfig';
import { dateTimeFormatFactory, DateTimeFormatOptions } from './dateTimeFormat';

export type LocaleContextType = {
  locale: string;
  localeFallback: string;
  dateTimeFormat: ReturnType<typeof dateTimeFormatFactory>;
};

const LocaleContext = React.createContext<LocaleContextType>({} as any);

export type LocaleProviderProps = {
  dateTimeFormatOptions?: DateTimeFormatOptions;
};
export const LocaleProvider: React.SFC<LocaleProviderProps> = ({ children, dateTimeFormatOptions = {} }) => (
  <ClientConfigQuery>
    {({ data: { clientConfig } }) => (
      <BackendConfigQuery>
        {({ data: { backendConfig } }) => {
          const { activeLocale } = backendConfig;

          const localeFallback = clientConfig.i18n.lng;

          return (
            <LocaleContext.Provider
              value={{
                locale: activeLocale,
                localeFallback,
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

export const useLocale = (): LocaleContextType => useContext(LocaleContext);

export type LocaleRenderProps = LocaleContextType;
export type LocaleProps = {
  children: (props: LocaleRenderProps) => any;
};

export const Locale: React.SFC<LocaleProps> = ({ children }) => children({ ...useLocale() });
