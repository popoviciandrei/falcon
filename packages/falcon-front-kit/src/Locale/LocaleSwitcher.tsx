import React from 'react';
import { MutationFetchResult } from '@apollo/react-common';
import { I18n } from '@deity/falcon-i18n';
import { SetLocaleMutation, SetLocaleResponse } from '@deity/falcon-data';
import { Locale } from '../Locale';

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
          <Locale>
            {({ locale, locales }) => {
              const items = locales.map(code => ({ code, name: t(`languages.${code}`) }));
              const value = { code: locale, name: t(`languages.${locale}`) };

              const onChange = ({ code }: LocaleItem) =>
                setLocale({ variables: { locale: code } }).then(({ data }: MutationFetchResult<SetLocaleResponse>) => {
                  i18n.changeLanguage(data.setLocale.activeLocale);
                });

              return children && children({ items, value, onChange });
            }}
          </Locale>
        )}
      </SetLocaleMutation>
    )}
  </I18n>
);
