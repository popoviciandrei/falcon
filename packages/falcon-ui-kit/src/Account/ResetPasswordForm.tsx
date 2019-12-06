import React from 'react';
import { ResetPasswordFormProvider } from '@deity/falcon-front-kit';
import { ErrorSummary } from '../Error';
import { FormField, Form, FormProps, FormSubmit, PasswordRevealInput } from '../Forms';

export type ResetPasswordFormProps = Partial<FormProps> & {
  onSuccess?: () => Promise<void>;
  resetToken: string;
};
export const ResetPasswordForm: React.SFC<ResetPasswordFormProps> = ({ onSuccess, resetToken, ...formProps }) => (
  <ResetPasswordFormProvider initialValues={{ resetToken, password: '' }} onSuccess={onSuccess}>
    {({ status }) => (
      <Form id="reset-password" i18nId="resetPassword" {...formProps}>
        <FormField name="password" required type="password" autoComplete="new-password">
          {({ field }) => <PasswordRevealInput {...field} />}
        </FormField>
        <FormSubmit justifySelf="center" />
        <ErrorSummary errors={status.error} />
      </Form>
    )}
  </ResetPasswordFormProvider>
);
