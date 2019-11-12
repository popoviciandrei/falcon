import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@deity/falcon-i18n';
import { Details, DetailsContent, Button } from '@deity/falcon-ui';
import {
  SetShippingAddressFormProvider,
  checkoutAddressToSetCheckoutAddressFormValues,
  useCheckout
} from '@deity/falcon-front-kit';
import { AddressDetails, Form, AddressFormFields, ErrorSummary, Loader } from '@deity/falcon-ui-kit';
import { CustomerWithAddressesQuery } from '@deity/falcon-shop-data';
import SectionHeader from './CheckoutSectionHeader';
import { AddressPicker, isAddressCustom } from './components';

export const ShippingAddressSection = props => {
  const { open, title, onEditRequested, submitLabel } = props;
  const { values } = useCheckout();

  let header;
  if (!open && values.shippingAddress) {
    header = (
      <I18n>
        {t => (
          <SectionHeader
            title={title}
            onActionClick={onEditRequested}
            editLabel={t('edit')}
            complete
            summary={<AddressDetails {...values.shippingAddress} />}
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
  submitLabel: PropTypes.string,
  // default selected address - address that should be selected when address picker is shown
  defaultSelected: PropTypes.shape({})
};

export const ShippingAddressEditor = ({ addresses, submitLabel }) => {
  const defaultShipping = addresses.find(x => x.defaultShipping);
  const { setShippingAddress, values } = useCheckout();
  const shouldAutoSubmit = !values.shippingAddress && !!defaultShipping;

  return (
    <SetShippingAddressFormProvider address={values.shippingAddress || defaultShipping} onSuccess={setShippingAddress}>
      {({ isSubmitting, setValues, status: { error }, submitCount, submitForm, values: address }) => {
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
                selected={{ ...address, street: [] }}
                onChange={x => setValues(checkoutAddressToSetCheckoutAddressFormValues(x))}
              />
            )}
            {(addresses.length === 0 || isAddressCustom(address)) && (
              <AddressFormFields autoCompleteSection="shipping-address" />
            )}
            <ErrorSummary errors={error} />
            <Button type="submit">{submitLabel}</Button>
          </Form>
        );
      }}
    </SetShippingAddressFormProvider>
  );
};
