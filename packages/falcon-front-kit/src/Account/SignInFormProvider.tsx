import React from 'react';
import { Formik } from 'formik';
import { useGetUserError } from '@deity/falcon-data';
import { useSignMutation } from '@deity/falcon-shop-data';
import { FormProviderProps } from '../Forms';

export type SignInFormValues = {
  email: string;
  password: string;
};
export type SignInFormProvider = FormProviderProps<SignInFormValues>;
export const SignInFormProvider: React.SFC<SignInFormProvider> = props => {
  const { onSuccess, initialValues, ...formikProps } = props;
  const defaultInitialValues = {
    email: '',
    password: ''
  };

  const [signIn] = useSignMutation();
  const [getUserError] = useGetUserError();

  return (
    <Formik
      initialValues={initialValues || defaultInitialValues}
      onSubmit={(values, { setSubmitting, setStatus }) =>
        signIn({ variables: { input: values } })
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
