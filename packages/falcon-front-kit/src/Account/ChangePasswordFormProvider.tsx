import React from 'react';
import { Formik } from 'formik';
import { useGetUserError } from '@deity/falcon-data';
import { ChangePasswordInput } from '@deity/falcon-shop-extension';
import { useChangePasswordMutation, ChangePasswordResponse } from '@deity/falcon-shop-data';
import { FormProviderProps } from '../Forms';

export type ChangePasswordFormProviderProps = FormProviderProps<ChangePasswordInput, ChangePasswordResponse>;
export const ChangePasswordFormProvider: React.SFC<ChangePasswordFormProviderProps> = props => {
  const { onSuccess, initialValues, mutationOptions, ...formikProps } = props;
  const defaultInitialValues: ChangePasswordInput = {
    currentPassword: '',
    password: ''
  };

  const [changePasswordMutation] = useChangePasswordMutation();
  const [getUserError] = useGetUserError();

  return (
    <Formik
      initialStatus={{}}
      initialValues={initialValues || defaultInitialValues}
      onSubmit={(values, { setSubmitting, setStatus }) =>
        changePasswordMutation({ variables: { input: values }, ...(mutationOptions || {}) })
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
