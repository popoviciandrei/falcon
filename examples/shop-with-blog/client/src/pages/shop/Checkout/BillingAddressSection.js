import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { I18n, T } from '@deity/falcon-i18n';
import { Button, Checkbox, Label, FlexLayout } from '@deity/falcon-ui';
import {
  useSetBillingAddress,
  SetCheckoutAddressFormProvider,
  checkoutAddressToSetCheckoutAddressFormValues,
  useCheckout,
  isCustomAddress
} from '@deity/falcon-front-kit';
import { AddressDetails, Form, AddressFormFields, ErrorSummary, Loader } from '@deity/falcon-ui-kit';
import { CustomerWithAddressesQuery } from '@deity/falcon-shop-data';
import { AddressPicker, CheckoutSection, CheckoutSectionHeader, CheckoutSectionContentLayout } from './components';

export const BillingAddressSection = props => {
  const { open, title, onEditRequested, submitLabel } = props;
  const { values } = useCheckout();

  let header;
  if (!open && values.billingAddress) {
    header = (
      <I18n>
        {t => (
          <CheckoutSectionHeader
            title={title}
            onActionClick={onEditRequested}
            editLabel={t('edit')}
            complete
            summary={<AddressDetails {...values.billingAddress} />}
          />
        )}
      </I18n>
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
            {({ data: { customer } }) => (
              <BillingAddressEditor addresses={(customer && customer.addresses) || []} submitLabel={submitLabel} />
            )}
          </CustomerWithAddressesQuery>
        )}
      </CheckoutSectionContentLayout>
    </CheckoutSection>
  );
};
BillingAddressSection.propTypes = {
  // flag that indicates if the section is currently open
  open: PropTypes.bool,
  // title of the section
  title: PropTypes.string,
  // callback that should be called when user requests edit of this particular section
  onEditRequested: PropTypes.func,
  // flag indicates if "use the same address" is selected - if so then address form is hidden
  // label for submit button
  submitLabel: PropTypes.string
};

export const BillingAddressEditor = ({ addresses, submitLabel }) => {
  const defaultBilling = addresses.find(x => x.defaultBilling);
  const [setBillingAddress] = useSetBillingAddress();
  const { values, isBillingSameAsShipping, setBillingSameAsShipping } = useCheckout();
  const shouldAutoSubmit = !values.billingAddress && !!defaultBilling;
  const [address, setAddress] = useState(values.billingAddress || defaultBilling);

  return (
    <SetCheckoutAddressFormProvider setAddress={setBillingAddress} address={address}>
      {({ isSubmitting, setValues, status: { error }, submitCount, submitForm }) => {
        if (shouldAutoSubmit && submitCount === 0) {
          submitForm();
          return;
        }

        return (
          <Form id="billing-address" i18nId="addressForm">
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
            <Button type="submit">{submitLabel}</Button>
            <ErrorSummary errors={error} />
          </Form>
        );
      }}
    </SetCheckoutAddressFormProvider>
  );
};
