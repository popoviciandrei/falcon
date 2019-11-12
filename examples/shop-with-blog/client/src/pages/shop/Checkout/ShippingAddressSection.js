import React, { useState } from 'react';
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
import { AddressPicker } from './components';

export const ShippingAddressSection = props => {
  const { open, title, onEditRequested, submitLabel } = props;
  const { setShippingAddress, values } = useCheckout();
  const [address, setAddress] = useState(values.shippingAddress);
  const isAddressOther = address && !address.id;

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
        <CustomerWithAddressesQuery>
          {({ data: { customer } }) => (
            <SetShippingAddressFormProvider onSuccess={setShippingAddress}>
              {({ isSubmitting, setValues, status: { error } }) => (
                <Form id="shipping-address" i18nId="addressForm" my="sm">
                  {isSubmitting && <Loader variant="overlay" />}
                  {customer && customer.addresses.length && (
                    <AddressPicker
                      options={customer.addresses}
                      selected={address}
                      onChange={x => {
                        setAddress(x);
                        setValues(x ? checkoutAddressToSetCheckoutAddressFormValues(x) : {});
                        // if (x) {
                        //   setValues(checkoutAddressToSetCheckoutAddressFormValues(x));
                        // } else {
                        //   resetForm();
                        // }
                      }}
                    />
                  )}
                  {((customer && customer.addresses.length) || !address || isAddressOther) && (
                    <AddressFormFields autoCompleteSection="shipping-address" />
                  )}
                  <Button type="submit">{submitLabel}</Button>
                  <ErrorSummary errors={error} />
                </Form>
              )}
            </SetShippingAddressFormProvider>
          )}
        </CustomerWithAddressesQuery>
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
