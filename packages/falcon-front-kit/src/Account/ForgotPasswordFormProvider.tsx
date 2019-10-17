import React from 'react';
import { Formik } from 'formik';
import { RequestPasswordResetInput } from '@deity/falcon-shop-extension';
import { RequestPasswordResetMutation } from '@deity/falcon-shop-data';
import { FormProviderProps } from '../Forms';

export type ForgotPasswordFormValues = RequestPasswordResetInput;
export type ForgotPasswordFormProviderProps = FormProviderProps<ForgotPasswordFormValues>;
export const ForgotPasswordFormProvider: React.SFC<ForgotPasswordFormProviderProps> = props => {
  const { onSuccess, initialValues, ...formikProps } = props;
  const defaultInitialValues: ForgotPasswordFormValues = {
    email: ''
  };

  return (
    <RequestPasswordResetMutation>
      {requestPasswordReset => (
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
                formikActions.setStatus({ error: e.message });
              })
          }
          {...formikProps}
        />
      )}
    </RequestPasswordResetMutation>
  );
};
