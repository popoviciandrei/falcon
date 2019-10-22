import React from 'react';
import { T } from '@deity/falcon-i18n';
import { Text } from '@deity/falcon-ui';
import { ForgotPasswordFormProvider } from '@deity/falcon-front-kit';
import { ErrorSummary } from '../Error';
import { FormField, Form, FormSubmit, FormProps } from '../Forms';

export type ForgetPasswordFormProps = Partial<FormProps> & {
  onSuccess?: () => void;
};
export const ForgotPasswordForm: React.SFC<ForgetPasswordFormProps> = ({ onSuccess, ...formProps }) => (
  <ForgotPasswordFormProvider onSuccess={onSuccess}>
    {({ isSubmitting, status = {}, values, submitCount, isValid }) => {
      const { error } = status;
      const submitSucceed = isValid && !isSubmitting && submitCount > 0 && !error;

      return (
        <Form id="forgot-password" i18nId="forgotPassword" {...formProps}>
          <FormField name="email" required type="email" autoComplete="email" />
          <FormSubmit value="Reset my password" />
          {status.error && <ErrorSummary errors={error} />}

          {submitSucceed && (
            <Text mt="md" fontSize="md">
              <T id="forgotPassword.successMessage" email={values.email} />
            </Text>
          )}
        </Form>
      );
    }}
  </ForgotPasswordFormProvider>
);
