import React from 'react';
import { Formik } from 'formik';
import { SignInMutation } from '@deity/falcon-shop-data';
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

  return (
    <SignInMutation>
      {signIn => (
        <Formik
          initialValues={initialValues || defaultInitialValues}
          onSubmit={(values, formikActions) =>
            signIn({ variables: { input: values } })
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
    </SignInMutation>
  );
};
