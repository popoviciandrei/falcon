import React from 'react';
import { NavLink } from 'react-router-dom';
import { T } from '@deity/falcon-i18n';
import { ChangePasswordFormProvider } from '@deity/falcon-front-kit';
import { H1, FlexLayout, GridLayout, Button } from '@deity/falcon-ui';
import {
  Form,
  FormField,
  FormSubmit,
  ErrorSummary,
  PasswordRevealInput,
  TwoColumnsLayout,
  TwoColumnsLayoutArea
} from '@deity/falcon-ui-kit';

const ChangePassword = ({ history }) => (
  <GridLayout>
    <H1>
      <T id="changePassword.title" />
    </H1>
    <TwoColumnsLayout>
      <ChangePasswordFormProvider onSuccess={() => history.push('/account')}>
        {({ status }) => (
          <Form id="change-password" i18nId="changePassword" gridArea={TwoColumnsLayoutArea.left}>
            <FormField name="currentPassword" type="password" required validate={[]}>
              {({ field }) => <PasswordRevealInput {...field} />}
            </FormField>
            <FormField name="password" type="password" required autoComplete="new-password">
              {({ field }) => <PasswordRevealInput {...field} />}
            </FormField>
            <FlexLayout justifyContent="flex-end" alignItems="center" mt="md">
              <Button as={NavLink} to="/account/personal-information" mr="md">
                <T id="changePassword.cancelButton" />
              </Button>
              <FormSubmit />
            </FlexLayout>
            <ErrorSummary errors={status.error} />
          </Form>
        )}
      </ChangePasswordFormProvider>
    </TwoColumnsLayout>
  </GridLayout>
);

export default ChangePassword;
