import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Details, DetailsContent, Button } from '@deity/falcon-ui';
import { I18n } from '@deity/falcon-i18n';
import { SetShippingAddressFormProvider, useCheckout } from '@deity/falcon-front-kit';
import { AddressDetails, Form, AddressFormFields, ErrorSummary, Loader } from '@deity/falcon-ui-kit';
import SectionHeader from './CheckoutSectionHeader';
import { AddressPicker } from './components/AddressPicker';

const checkoutAddressToSetCheckoutAddressFormValues = address => {
  const { __typename, ...rest } = { __typename: undefined, ...address };

  return {
    street1: rest.street.length > 0 ? address.street[0] : undefined,
    street2: rest.street.length > 1 ? address.street[1] : undefined,
    ...rest
  };
};

export const ShippingAddressSection = props => {
  const { open, title, onEditRequested, submitLabel, availableAddresses } = props;
  const {
    setShippingAddress,
    values: { shippingAddress }
  } = useCheckout();

  const [address, setAddress] = useState(shippingAddress || props.defaultSelected || null);

  let header;
  if (!open && address) {
    header = (
      <I18n>
        {t => (
          <SectionHeader
            title={title}
            onActionClick={onEditRequested}
            editLabel={t('edit')}
            complete
            summary={<AddressDetails {...address} />}
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
        <SetShippingAddressFormProvider
          // address={address === 'Other' ? undefined : address}
          onSuccess={x => {
            setAddress(x);
            setShippingAddress(x);
          }}
        >
          {({ isSubmitting, resetForm, setValues, status: { error } }) => (
            <React.Fragment>
              {availableAddresses && !!availableAddresses.length && (
                <AddressPicker
                  options={availableAddresses}
                  selected={address}
                  onChange={x => {
                    setAddress(x);
                    if (address === 'Other') {
                      resetForm(undefined);
                    }
                    setValues(checkoutAddressToSetCheckoutAddressFormValues(x));
                  }}
                />
              )}
              <Form id="shipping-address" i18nId="addressForm" my="sm">
                {isSubmitting && <Loader variant="overlay" />}
                {(!availableAddresses || availableAddresses.length === 0 || address === 'Other') && (
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
  // callback that sets the address
  setAddress: PropTypes.func,
  // callback that should be called when user requests edit of this particular section
  onEditRequested: PropTypes.func,
  // flag indicates if "use the same address" is selected - if so then address form is hidden
  useTheSame: PropTypes.bool,
  // callback that sets value for "use the same address" feature
  setUseTheSame: PropTypes.func,
  // label for "use the same address" feature
  labelUseTheSame: PropTypes.string,
  // label for submit button
  submitLabel: PropTypes.string,
  // list of available addresses to pick from - if not passed then address selection field won't be presented
  availableAddresses: PropTypes.arrayOf(PropTypes.shape({})),
  // default selected address - address that should be selected when address picker is shown
  defaultSelected: PropTypes.shape({}),
  // errors passed from outside that should be displayed for this section
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string
    })
  )
};
