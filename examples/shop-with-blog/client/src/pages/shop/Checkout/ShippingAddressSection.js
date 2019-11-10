import React from 'react';
import PropTypes from 'prop-types';
import { Details, DetailsContent, Button } from '@deity/falcon-ui';
import { I18n } from '@deity/falcon-i18n';
import { SetShippingAddressFormProvider } from '@deity/falcon-front-kit';
import { AddressDetails, Form, AddressFormFields, ErrorSummary, Loader } from '@deity/falcon-ui-kit';
import SectionHeader from './CheckoutSectionHeader';
import { AddressPicker } from './components/AddressPicker';

export class ShippingAddressSection extends React.Component {
  constructor(props) {
    super(props);

    const { selectedAddress, defaultSelected } = props;

    this.state = {
      selectedAddress: selectedAddress || defaultSelected || null
    };
  }

  render() {
    const { open, title, onEditRequested, submitLabel, availableAddresses, setAddress } = this.props;
    const { selectedAddress } = this.state;

    let header;
    if (!open && selectedAddress) {
      header = (
        <I18n>
          {t => (
            <SectionHeader
              title={title}
              onActionClick={onEditRequested}
              editLabel={t('edit')}
              complete
              summary={<AddressDetails {...selectedAddress} />}
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
          {availableAddresses && !!availableAddresses.length && (
            <AddressPicker
              options={availableAddresses}
              selected={selectedAddress}
              onChange={value => this.setState({ selectedAddress: value })}
            />
          )}
          <SetShippingAddressFormProvider
            address={selectedAddress}
            onSuccess={x => this.setState({ selectedAddress: x }, setAddress(x))}
          >
            {({ isSubmitting, status: { error } }) => (
              <Form id="shipping-address" i18nId="addressForm" my="sm">
                {isSubmitting && <Loader variant="overlay" />}
                {(!availableAddresses || availableAddresses.length === 0 || selectedAddress === 'Other') && (
                  <AddressFormFields autoCompleteSection="shipping-address" />
                )}
                <Button type="submit">{submitLabel}</Button>
                <ErrorSummary errors={error} />
              </Form>
            )}
          </SetShippingAddressFormProvider>
        </DetailsContent>
      </Details>
    );
  }
}
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
