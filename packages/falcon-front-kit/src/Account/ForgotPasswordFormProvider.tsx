import React from 'react';
import { Formik } from 'formik';
import { apolloErrorToErrorModelList } from '@deity/falcon-data';
import { RequestPasswordResetInput } from '@deity/falcon-shop-extension';
import { useRequestPasswordResetMutation } from '@deity/falcon-shop-data';
import { FormProviderProps } from '../Forms';

export type ForgotPasswordFormValues = RequestPasswordResetInput;
export type ForgotPasswordFormProviderProps = FormProviderProps<ForgotPasswordFormValues>;
export const ForgotPasswordFormProvider: React.SFC<ForgotPasswordFormProviderProps> = props => {
  const { onSuccess, initialValues, ...formikProps } = props;
  const defaultInitialValues: ForgotPasswordFormValues = {
    email: ''
  };

  const [requestPasswordReset] = useRequestPasswordResetMutation();

  return (
    <Formik
      initialValues={initialValues || defaultInitialValues}
      onSubmit={(values, formikActions) =>
        requestPasswordReset({ variables: { input: values } })
          .then(() => {
            formikActions.setSubmitting(false);
            return onSuccess && onSuccess();
          })
          .catch(e => {
            formikActions.setSubmitting(false);
            formikActions.setStatus({ error: apolloErrorToErrorModelList(e) });
          })
      }
      {...formikProps}
    />
  );
};
