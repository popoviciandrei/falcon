import React from 'react';
import { Formik } from 'formik';
import { useGetUserError } from '@deity/falcon-data';
import { RequestPasswordResetInput } from '@deity/falcon-shop-extension';
import { useRequestPasswordResetMutation, RequestPasswordResetResponse } from '@deity/falcon-shop-data';
import { FormProviderProps } from '../Forms';

export type ForgotPasswordFormProviderProps = FormProviderProps<
  RequestPasswordResetInput,
  RequestPasswordResetResponse
>;
export const ForgotPasswordFormProvider: React.SFC<ForgotPasswordFormProviderProps> = props => {
  const { onSuccess, initialValues, mutationOptions, ...formikProps } = props;
  const defaultInitialValues: RequestPasswordResetInput = {
    email: ''
  };

  const [requestPasswordReset] = useRequestPasswordResetMutation();
  const [getUserError] = useGetUserError();

  return (
    <Formik
      initialStatus={{}}
      initialValues={initialValues || defaultInitialValues}
      onSubmit={(values, { setSubmitting, setStatus }) =>
        requestPasswordReset({ variables: { input: values }, ...(mutationOptions || {}) })
          .then(({ data }) => {
            setSubmitting(false);
            setStatus({ data });
            return onSuccess && onSuccess(data);
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
