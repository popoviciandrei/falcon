import React from 'react';
import { Formik } from 'formik';
import { useGetUserError } from '@deity/falcon-data';
import { useSignUpMutation, SignUpResponse } from '@deity/falcon-shop-data';
import { FormProviderProps } from '../Forms';

export type SignUpFormValues = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  autoSignIn: boolean;
};
export type SignUpFormProviderProps = FormProviderProps<SignUpFormValues, SignUpResponse>;
export const SignUpFormProvider: React.SFC<SignUpFormProviderProps> = props => {
  const { onSuccess, initialValues, mutationOptions, ...formikProps } = props;
  const defaultInitialValues: SignUpFormValues = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    autoSignIn: true
  };

  const [signUp] = useSignUpMutation();
  const [getUserError] = useGetUserError();

  return (
    <Formik
      initialStatus={{}}
      initialValues={initialValues || defaultInitialValues}
      onSubmit={(values, { setSubmitting, setStatus }) =>
        signUp({ variables: { input: values }, ...(mutationOptions || {}) })
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
