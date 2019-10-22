import React from 'react';
import { Formik } from 'formik';
import { useGetUserError } from '@deity/falcon-data';
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
  const [getUserError] = useGetUserError();

  return (
    <Formik
      initialValues={initialValues || defaultInitialValues}
      onSubmit={(values, { setSubmitting, setStatus }) =>
        requestPasswordReset({ variables: { input: values } })
          .then(() => {
            setSubmitting(false);
            return onSuccess && onSuccess();
          })
          .catch(e => {
            const error = getUserError(e);
            if (error.length) {
              setStatus({ error });
              setSubmitting(false);
            }
          })
      }
      {...formikProps}
    />
  );
};
