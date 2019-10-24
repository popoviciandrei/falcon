import React from 'react';
import { FormikProps } from 'formik';
import { I18n } from '@deity/falcon-i18n';
import { FormContext } from './FormContext';

export type SubmitRenderProps<TValue = any> = {
  form: FormikProps<TValue> & {
    id?: number | string;
  };
  submit: {
    value?: string;
  };
  i18nIds: {
    value?: string;
  };
};

export type SubmitProps<TValue = any> = {
  form: FormikProps<TValue>;
  value?: string;
  children?: (props: SubmitRenderProps<TValue>) => React.ReactNode;
};

export const Submit: React.SFC<SubmitProps> = ({ form: formikForm, value, children, ...restProps }) => {
  if (!children) {
    return null;
  }

  return (
    <FormContext.Consumer>
      {({ id: formId, i18nId: formI18nId }) => (
        <I18n>
          {t => {
            const valueId = `${formI18nId}.submitButton`;
            return children({
              form: {
                ...formikForm,
                id: formId
              },
              submit: {
                value: value || t(valueId), // TODO: test if value override works
                ...restProps
              },
              i18nIds: {
                value: valueId
              }
            });
          }}
        </I18n>
      )}
    </FormContext.Consumer>
  );
};
