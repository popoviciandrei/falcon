import React from 'react';
import { SignUpFormProvider } from '@deity/falcon-front-kit';
import { FormField, Form, FormProps, FormSubmit, FormErrorSummary, PasswordRevealInput } from '../Forms';

export type SignUpFormProps = Partial<FormProps> & {
  onSuccess?: Function;
};
export const SignUpForm: React.SFC<SignUpFormProps> = ({ onSuccess, ...formProps }) => (
  <SignUpFormProvider onSuccess={onSuccess}>
    {({ status }) => (
      <Form id="sign-up" i18nId="signUp" {...formProps}>
        <FormField name="firstname" type="text" required autoComplete="given-name" />
        <FormField name="lastname" type="text" required autoComplete="family-name" />
        <FormField name="email" type="email" required autoComplete="email" />

        <FormField name="password" required type="password" autoComplete="new-password">
          {({ field }) => <PasswordRevealInput {...field} />}
        </FormField>

        <FormSubmit value="Create an account" />
        <FormErrorSummary errors={status && status.error} />
      </Form>
    )}
  </SignUpFormProvider>
);
