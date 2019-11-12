import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Details, DetailsContent, Button } from '@deity/falcon-ui';
import { I18n } from '@deity/falcon-i18n';
import {
  SetShippingAddressFormProvider,
  checkoutAddressToSetCheckoutAddressFormValues,
  useCheckout
} from '@deity/falcon-front-kit';
import { AddressDetails, Form, AddressFormFields, ErrorSummary, Loader } from '@deity/falcon-ui-kit';
import SectionHeader from './CheckoutSectionHeader';
import { AddressPicker } from './components';

export const ShippingAddressSection = props => {
  const { open, title, onEditRequested, submitLabel, availableAddresses } = props;
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
        <SetShippingAddressFormProvider onSuccess={setShippingAddress}>
          {({ isSubmitting, setValues, status: { error } }) => (
            <React.Fragment>
              {availableAddresses.length > 0 && (
                <AddressPicker
                  options={availableAddresses}
                  selected={address}
                  onChange={x => {
                    setAddress(x);
                    setValues(x ? checkoutAddressToSetCheckoutAddressFormValues(x) : {});
                  }}
                />
              )}
              <Form id="shipping-address" i18nId="addressForm" my="sm">
                {isSubmitting && <Loader variant="overlay" />}
                {(availableAddresses.length === 0 || !address || isAddressOther) && (
                  <AddressFormFields autoCompleteSection="shipping-address" />
                )}
                <Button type="submit">{submitLabel}</Button>
                <ErrorSummary errors={error} />
              </Form>
            </React.Fragment>
          )}
        </SetShippingAddressFormProvider>
      </DetailsContent>
    </Details>
  );
};
ShippingAddressSection.propTypes = {
  // flag that indicates if the section is currently open
  open: PropTypes.bool,
  // title of the section
  title: PropTypes.string,
  // currently selected address
  selectedAddress: PropTypes.shape({}),
  // callback that should be called when user requests edit of this particular section
  onEditRequested: PropTypes.func,
  // flag indicates if "use the same address" is selected - if so then address form is hidden
  // label for submit button
  submitLabel: PropTypes.string,
  // list of available addresses to pick from - if not passed then address selection field won't be presented
  availableAddresses: PropTypes.arrayOf(PropTypes.shape({})),
  // default selected address - address that should be selected when address picker is shown
  defaultSelected: PropTypes.shape({})
};
