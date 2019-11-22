import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useI18n, T } from '@deity/falcon-i18n';
import { Button } from '@deity/falcon-ui';
import {
  useSetShippingAddress,
  SetCheckoutAddressFormProvider,
  checkoutAddressToSetCheckoutAddressFormValues,
  useCheckout,
  isCustomAddress
} from '@deity/falcon-front-kit';
import { AddressDetails, Form, AddressFormFields, ErrorSummary, FormSubmit, Loader } from '@deity/falcon-ui-kit';
import { CustomerWithAddressesQuery } from '@deity/falcon-shop-data';
import {
  AddressPicker,
  CheckoutSection,
  CheckoutSectionHeader,
  CheckoutSectionFooter,
  CheckoutSectionContentLayout
} from './components';

export const ShippingAddressSection = props => {
  const { open, title, onEdit } = props;
  const { t } = useI18n();
  const { values } = useCheckout();

  let header;
  if (!open && values.shippingAddress) {
    header = (
      <CheckoutSectionHeader
        title={title}
        complete
        summary={<AddressDetails {...values.shippingAddress} />}
        action={
          <Button variant="checkout" onClick={onEdit}>
            {t('edit')}
          </Button>
        }
      />
    );
  } else {
    header = <CheckoutSectionHeader title={title} open={open} />;
  }

  return (
    <CheckoutSection open={open}>
      {header}
      <CheckoutSectionContentLayout>
        {open && (
          <CustomerWithAddressesQuery>
            {({ data: { customer } }) => <ShippingAddressEditor addresses={(customer && customer.addresses) || []} />}
          </CustomerWithAddressesQuery>
        )}
      </CheckoutSectionContentLayout>
    </CheckoutSection>
  );
};
ShippingAddressSection.propTypes = {
  // flag that indicates if the section is currently open
  open: PropTypes.bool,
  // title of the section
  title: PropTypes.string,
  // callback that should be called when user requests edit of this particular section
  onEdit: PropTypes.func
};

export const ShippingAddressEditor = ({ addresses }) => {
  const defaultShipping = addresses.find(x => x.defaultShipping);
  const [setShippingAddress] = useSetShippingAddress();
  const { values } = useCheckout();
  const shouldAutoSubmit = !values.shippingAddress && !!defaultShipping;
  const [address, setAddress] = useState(values.shippingAddress || defaultShipping);

  return (
    <SetCheckoutAddressFormProvider setAddress={setShippingAddress} address={address}>
      {({ isSubmitting, setValues, status: { error } }) => (
        <Form id="shipping-address" i18nId="addressForm" autoSubmit={shouldAutoSubmit}>
          {isSubmitting && <Loader variant="overlay" />}
          {addresses.length > 0 && (
            <AddressPicker
              options={addresses}
              selected={address}
              onChange={x => {
                setAddress(x);
                setValues(checkoutAddressToSetCheckoutAddressFormValues(x));
              }}
            />
          )}
          {isCustomAddress(address) && <AddressFormFields autoCompleteSection="shipping-address" />}
          <CheckoutSectionFooter>
            <FormSubmit>
              <T id="checkout.nextStep" />
            </FormSubmit>
            <ErrorSummary errors={error} />
          </CheckoutSectionFooter>
        </Form>
      )}
    </SetCheckoutAddressFormProvider>
  );
};
