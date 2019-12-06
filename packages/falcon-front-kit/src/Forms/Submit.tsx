import React from 'react';
import { useFormikContext, FormikProps } from 'formik';
import { useI18n } from '@deity/falcon-i18n';
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
  children?: (props: SubmitRenderProps<TValue>) => React.ReactNode;
};

export const Submit: React.SFC<SubmitProps> = ({ children, ...restProps }) => {
  const { t } = useI18n();
  const formik = useFormikContext();

  if (!children) {
    return null;
  }

  return (
    <FormContext.Consumer>
      {({ id: formId, i18nId: formI18nId }) => {
        const valueId = `${formI18nId}.submitButton`;

        return children({
          form: {
            ...formik,
            id: formId
          },
          submit: {
            value: t(valueId),
            ...restProps
          },
          i18nIds: {
            value: valueId
          }
        });
      }}
    </FormContext.Consumer>
  );
};
