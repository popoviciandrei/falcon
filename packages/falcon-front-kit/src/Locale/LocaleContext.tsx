import React, { useContext } from 'react';
import { BackendConfigQuery } from '@deity/falcon-data';
import { ClientConfigQuery } from '../ClientConfig';
import { dateTimeFormatFactory, DateTimeFormatOptions } from './dateTimeFormat';

export type LocaleContextType = {
  locale: string;
  localeFallback: string;
  locales: string[];
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
          const { activeLocale, locales } = backendConfig;
          const { fallbackLng, whitelist } = clientConfig.i18n;
          const whitelistedLocales = locales.filter(locale => whitelist.some(x => locale.startsWith(x)));

          return (
            <LocaleContext.Provider
              value={{
                locale: activeLocale,
                localeFallback: fallbackLng,
                locales: whitelistedLocales,
                dateTimeFormat: dateTimeFormatFactory([dateTimeFormatOptions.locale, activeLocale, fallbackLng], {
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
