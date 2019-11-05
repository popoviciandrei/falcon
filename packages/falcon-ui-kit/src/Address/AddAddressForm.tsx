import React from 'react';
import { AddAddressFormProvider } from '@deity/falcon-front-kit';
import { Button, FlexLayout } from '@deity/falcon-ui';
import { T } from '@deity/falcon-i18n';
import { Form, FormProps } from '../Forms';
import { ErrorSummary } from '../Error';
import { AddressFormFields } from './AddressFormFields';

export type AddAddressFormProps = Partial<FormProps> & {
  onSuccess?: () => Promise<void>;
  onCancel?: () => Promise<void>;
};

export const AddAddressForm: React.SFC<AddAddressFormProps> = ({ onSuccess, onCancel, ...formProps }) => (
  <AddAddressFormProvider onSuccess={onSuccess}>
    {({ isSubmitting, status = {} }) => (
      <Form id="add-address" i18nId="addressForm" {...formProps}>
        <AddressFormFields twoColumns askDefault />
        <FlexLayout justifyContent="flex-end" alignItems="center" mt="md">
          <Button onClick={onCancel} mr="md">
            <T id="addAddress.cancelButton" />
          </Button>
          <Button type="submit" variant={isSubmitting ? 'loader' : undefined}>
            <T id="addAddress.submitButton" />
          </Button>
        </FlexLayout>
        {status.error && <ErrorSummary errors={status.error} />}
      </Form>
    )}
  </AddAddressFormProvider>
);
