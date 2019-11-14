import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@deity/falcon-i18n';
import { Details, DetailsContent, Button } from '@deity/falcon-ui';
import {
  SetShippingAddressFormProvider,
  checkoutAddressToSetCheckoutAddressFormValues,
  useCheckoutState
} from '@deity/falcon-front-kit';
import { AddressDetails, Form, AddressFormFields, ErrorSummary, Loader } from '@deity/falcon-ui-kit';
import { CustomerWithAddressesQuery } from '@deity/falcon-shop-data';
import SectionHeader from './CheckoutSectionHeader';
import { AddressPicker, isAddressCustom } from './components';

export const ShippingAddressSection = props => {
  const { open, title, onEditRequested, submitLabel } = props;
  const { shippingAddress } = useCheckoutState();

  let header;
  if (!open && shippingAddress) {
    header = (
      <I18n>
        {t => (
          <SectionHeader
            title={title}
            onActionClick={onEditRequested}
            editLabel={t('edit')}
            complete
            summary={<AddressDetails {...shippingAddress} />}
          />
        )}
      </I18n>
    );
  } else {
    header = <SectionHeader title={title} />;
  }

  return (
    <Details open={open}>
      {header}
      <DetailsContent>
        {open && (
          <CustomerWithAddressesQuery>
            {({ data: { customer } }) => (
              <ShippingAddressEditor addresses={(customer && customer.addresses) || []} submitLabel={submitLabel} />
            )}
          </CustomerWithAddressesQuery>
        )}
      </DetailsContent>
    </Details>
  );
};
ShippingAddressSection.propTypes = {
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

export const ShippingAddressEditor = ({ addresses, submitLabel }) => {
  const defaultShipping = addresses.find(x => x.defaultShipping);
  const values = useCheckoutState();
  const shouldAutoSubmit = !values.shippingAddress && !!defaultShipping;
  const [address, setAddress] = useState(values.shippingAddress || defaultShipping);

  return (
    <SetShippingAddressFormProvider address={address}>
      {({ isSubmitting, setValues, status: { error }, submitCount, submitForm }) => {
        if (shouldAutoSubmit) {
          if (submitCount === 0) {
            submitForm();
            return;
          }
          if (isSubmitting) {
            return <Loader variant="overlay" />;
          }
        }

        return (
          <Form id="shipping-address" i18nId="addressForm">
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
            {isAddressCustom(address) && <AddressFormFields autoCompleteSection="shipping-address" />}
            <ErrorSummary errors={error} />
            <Button type="submit">{submitLabel}</Button>
          </Form>
        );
      }}
    </SetShippingAddressFormProvider>
  );
};
