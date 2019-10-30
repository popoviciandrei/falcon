import React from 'react';
import { MutationFetchResult } from '@apollo/react-common';
import { I18n } from '@deity/falcon-i18n';
import { SetLocaleMutation, SetLocaleResponse, BackendConfigQuery } from '@deity/falcon-data';
import { ClientConfigQuery } from '../ClientConfig';

export const addCimodeLocale = (locales: string[]) => {
  if (process.env.NODE_ENV === 'development') {
    if (!locales.find(x => x === 'cimode')) {
      locales.unshift('cimode');
    }
  }

  return locales;
};

export type LocaleItem = {
  code: string;
  name: string;
};

export type LocaleSwitcherRenderProps = {
  onChange: (value: LocaleItem) => Promise<void>;
  value: LocaleItem;
  items: LocaleItem[];
};

export type LocaleSwitcherProps = {
  children: (props: LocaleSwitcherRenderProps) => JSX.Element;
};

export const LocaleSwitcher: React.SFC<LocaleSwitcherProps> = ({ children }) => (
  <I18n>
    {(t, i18n) => (
      <SetLocaleMutation>
        {setLocale => (
          <ClientConfigQuery>
            {({ data: { clientConfig } }) => (
              <BackendConfigQuery>
                {({ data: { backendConfig } }) => {
                  const { locales, activeLocale } = backendConfig;
                  const { whitelist } = clientConfig.i18n;

                  const whitelistedLocales = locales.filter(locale => whitelist.some(x => locale.startsWith(x)));
                  const items = addCimodeLocale(whitelistedLocales).map(x => ({
                    code: x,
                    name: t(`languages.${x}`)
                  }));

                  const value = {
                    code: activeLocale,
                    name: t(`languages.${activeLocale}`)
                  };

                  const onChange = (x: LocaleItem) =>
                    setLocale({ variables: { locale: x.code } }).then(
                      ({ data }: MutationFetchResult<SetLocaleResponse>) => {
                        i18n.changeLanguage(data.setLocale.activeLocale);
                      }
                    );

                  return children && children({ items, value, onChange });
                }}
              </BackendConfigQuery>
            )}
          </ClientConfigQuery>
        )}
      </SetLocaleMutation>
    )}
  </I18n>
);
