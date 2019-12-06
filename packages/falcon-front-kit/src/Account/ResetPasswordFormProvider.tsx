import React from 'react';
import { Formik } from 'formik';
import { useGetUserError } from '@deity/falcon-data';
import { ResetPasswordInput } from '@deity/falcon-shop-extension';
import { useResetPasswordMutation, ResetPasswordResponse } from '@deity/falcon-shop-data';
import { FormProviderProps } from '../Forms';

export type ResetPasswordFormProviderProps = FormProviderProps<ResetPasswordInput, ResetPasswordResponse>;
export const ResetPasswordFormProvider: React.SFC<ResetPasswordFormProviderProps> = props => {
  const { onSuccess, initialValues, ...formikProps } = props;
  const defaultInitialValues: ResetPasswordInput = {
    resetToken: '',
    password: ''
  };

  const [resetPassword] = useResetPasswordMutation();
  const [getUserError] = useGetUserError();

  return (
    <Formik
      initialStatus={{}}
      initialValues={initialValues || defaultInitialValues}
      onSubmit={(values, { setSubmitting, setStatus }) =>
        resetPassword({ variables: { input: values } })
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
