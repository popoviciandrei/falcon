import React from 'react';
import { EditAddressFormProvider } from '@deity/falcon-front-kit';
import { Button, FlexLayout } from '@deity/falcon-ui';
import { T } from '@deity/falcon-i18n';
import { AddressQuery } from '@deity/falcon-shop-data';
import { Form, FormProps } from '../Forms';
import { ErrorSummary } from '../Error';
import { AddressFormFields } from './AddressFormFields';

export type EditAddressFormProps = Partial<FormProps> & {
  id: number;
  onSuccess?: () => Promise<void>;
  onCancel?: () => Promise<void>;
};

export const EditAddressForm: React.SFC<EditAddressFormProps> = ({ id, onSuccess, onCancel, ...formProps }) => (
  <AddressQuery variables={{ id }}>
    {({ data: { address } }) => (
      <EditAddressFormProvider
        id={id}
        onSuccess={onSuccess}
        initialValues={{
          firstname: address.firstname,
          lastname: address.lastname,
          street1: address.street[0],
          street2: address.street.length > 1 ? address.street[1] : '',
          postcode: address.postcode,
          city: address.city,
          countryId: address.countryId,
          company: address.company || undefined,
          telephone: address.telephone,
          defaultBilling: address.defaultBilling,
          defaultShipping: address.defaultShipping
        }}
      >
        {({ isSubmitting, status = {} }) => (
          <Form id="edit-address" i18nId="addressForm" {...formProps}>
            <AddressFormFields twoColumns askDefault />
            <FlexLayout justifyContent="flex-end" alignItems="center" mt="md">
              <Button onClick={onCancel} mr="md">
                <T id="editAddress.cancelButton" />
              </Button>
              <Button type="submit" variant={isSubmitting ? 'loader' : undefined}>
                <T id="editAddress.submitButton" />
              </Button>
            </FlexLayout>
            {status.error && <ErrorSummary errors={status.error} />}
          </Form>
        )}
      </EditAddressFormProvider>
    )}
  </AddressQuery>
);
