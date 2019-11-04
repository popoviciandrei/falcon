import React from 'react';
import { Formik } from 'formik';
import { useGetUserError } from '@deity/falcon-data';
import { ChangePasswordInput } from '@deity/falcon-shop-extension';
import { useChangePasswordMutation } from '@deity/falcon-shop-data';
import { FormProviderProps } from '../Forms';

export type ChangePasswordFormValues = ChangePasswordInput;
export type ChangePasswordFormProviderProps = FormProviderProps<ChangePasswordFormValues>;
export const ChangePasswordFormProvider: React.SFC<ChangePasswordFormProviderProps> = props => {
  const { onSuccess, initialValues, ...formikProps } = props;
  const defaultInitialValues: ChangePasswordFormValues = {
    currentPassword: '',
    password: ''
  };

  const [changePasswordMutation] = useChangePasswordMutation();
  const [getUserError] = useGetUserError();

  return (
    <Formik
      initialValues={initialValues || defaultInitialValues}
      onSubmit={(values, { setSubmitting, setStatus }) =>
        changePasswordMutation({ variables: { input: values } })
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
