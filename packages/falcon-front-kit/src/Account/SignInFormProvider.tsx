import React from 'react';
import { Formik } from 'formik';
import { useGetUserError } from '@deity/falcon-data';
import { useSignInMutation, SignInResponse } from '@deity/falcon-shop-data';
import { FormProviderProps } from '../Forms';

export type SignInFormValues = {
  email: string;
  password: string;
};
export type SignInFormProvider = FormProviderProps<SignInFormValues, SignInResponse>;
export const SignInFormProvider: React.SFC<SignInFormProvider> = props => {
  const { onSuccess, initialValues, mutationOptions, ...formikProps } = props;
  const defaultInitialValues = {
    email: '',
    password: ''
  };

  const [signIn] = useSignInMutation();
  const [getUserError] = useGetUserError();

  return (
    <Formik
      initialStatus={{}}
      initialValues={initialValues || defaultInitialValues}
      onSubmit={(values, { setSubmitting, setStatus }) =>
        signIn({ variables: { input: values }, ...(mutationOptions || {}) })
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
