import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useI18n, T } from '@deity/falcon-i18n';
import { Checkbox, Label, FlexLayout, Button } from '@deity/falcon-ui';
import {
  useSetBillingAddress,
  SetCheckoutAddressFormProvider,
  checkoutAddressToSetCheckoutAddressFormValues,
  useCheckout,
  isCustomAddress
} from '@deity/falcon-front-kit';
import { AddressDetails, Form, FormSubmit, AddressFormFields, ErrorSummary, Loader } from '@deity/falcon-ui-kit';
import { CustomerWithAddressesQuery } from '@deity/falcon-shop-data';
import {
  AddressPicker,
  CheckoutSection,
  CheckoutSectionHeader,
  CheckoutSectionFooter,
  CheckoutSectionContentLayout
} from './components';

export const BillingAddressSection = props => {
  const { open, title, onEdit } = props;
  const { t } = useI18n();
  const { values } = useCheckout();

  let header;
  if (!open && values.billingAddress) {
    header = (
      <CheckoutSectionHeader
        title={title}
        complete
        summary={<AddressDetails {...values.billingAddress} />}
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
      {open && (
        <CheckoutSectionContentLayout>
          <CustomerWithAddressesQuery>
            {({ data: { customer } }) => <BillingAddressEditor addresses={(customer && customer.addresses) || []} />}
          </CustomerWithAddressesQuery>
        </CheckoutSectionContentLayout>
      )}
    </CheckoutSection>
  );
};
BillingAddressSection.propTypes = {
  // flag that indicates if the section is currently open
  open: PropTypes.bool,
  // title of the section
  title: PropTypes.string,
  // callback that should be called when user requests edit of this particular section
  onEdit: PropTypes.func
};

export const BillingAddressEditor = ({ addresses }) => {
  const defaultBilling = addresses.find(x => x.defaultBilling);
  const [setBillingAddress] = useSetBillingAddress();
  const { values, isBillingSameAsShipping, setBillingSameAsShipping } = useCheckout();
  const shouldAutoSubmit = !values.billingAddress && !!defaultBilling;
  const [address, setAddress] = useState(values.billingAddress || defaultBilling);

  return (
    <SetCheckoutAddressFormProvider setAddress={setBillingAddress} address={address}>
      {({ isSubmitting, setValues, status: { error } }) => (
        <Form id="billing-address" i18nId="addressForm" autoSubmit={shouldAutoSubmit}>
          {isSubmitting && <Loader variant="overlay" />}
          <FlexLayout mb="md">
            <Checkbox
              id="use-the-same-as-shipping"
              size="sm"
              checked={isBillingSameAsShipping}
              onChange={e => {
                setBillingSameAsShipping(e.target.checked);
                setValues(checkoutAddressToSetCheckoutAddressFormValues(e.target.checked && values.shippingAddress));
              }}
            />
            <Label ml="xs" htmlFor="use-the-same-as-shipping">
              <T id="checkout.useTheSameAddress" />
            </Label>
          </FlexLayout>
          {!isBillingSameAsShipping && addresses.length > 0 && (
            <AddressPicker
              options={addresses}
              selected={address}
              onChange={x => {
                setAddress(x);
                setValues(checkoutAddressToSetCheckoutAddressFormValues(x));
              }}
            />
          )}
          {!isBillingSameAsShipping && isCustomAddress(address) && (
            <AddressFormFields autoCompleteSection="billing-address" />
          )}
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
