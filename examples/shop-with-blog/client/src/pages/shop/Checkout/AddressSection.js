import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { FlexLayout, Checkbox, Label, Details, DetailsContent, Button } from '@deity/falcon-ui';
import { T, I18n } from '@deity/falcon-i18n';
import { AddressDetails, Form, AddressFormFields } from '@deity/falcon-ui-kit';
import ErrorList from '../components/ErrorList';
import SectionHeader from './CheckoutSectionHeader';
import AddressPicker from './AddressPicker';

class AddressSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      useTheSame: !!props.useTheSame,
      selectedAddressId: null
    };
  }

  submitAddress = ({ street1, street2, ...restValues }) => {
    this.props.setAddress({ ...restValues, street: [street1, street2] });
  };

  submitSelectedAddress = () => {
    const selectedAddressId = this.state.selectedAddressId || this.props.defaultSelected.id;
    const selectedAddress = this.props.availableAddresses.find(item => item.id === selectedAddressId);

    const { __typename, region, country, ...rest } = selectedAddress; // make sure we don't send __typename field
    const addressInput = {
      ...rest,
      // include ID fields instead of full country/region objects
      regionId: region ? region.id : undefined,
      countryId: country.id
    };

    this.props.setAddress(addressInput);
  };

  render() {
    const {
      id,
      open,
      title,
      labelUseTheSame,
      setUseTheSame,
      selectedAddress,
      onEditRequested,
      submitLabel,
      errors,
      availableAddresses,
      defaultSelected
    } = this.props;

    const { street = [], ...selectedAddressRest } = selectedAddress || {};
    const initialAddressValue = {
      firstname: '',
      lastname: '',
      street1: street[0] || '',
      street2: street.length > 1 ? street[1] : '',
      postcode: '',
      city: '',
      telephone: '',
      countryId: '',
      ...selectedAddressRest
    };

    let header;
    let content;

    if (!open && selectedAddress) {
      // WORKAROUND: because `selectedAddress` actually contain CheckoutAddressInput instead of Address
      const selectedAddressForDetails = availableAddresses.find(item => item.id === selectedAddress.id);

      header = (
        <I18n>
          {t => (
            <SectionHeader
              title={title}
              onActionClick={onEditRequested}
              editLabel={t('edit')}
              complete
              summary={<AddressDetails {...selectedAddressForDetails} />}
            />
          )}
        </I18n>
      );
    } else {
      header = <SectionHeader title={title} />;
    }

    let selectedAvailableAddress;
    // if available addresses are passed then we should display dropdown so the user can pick his saved address
    if (availableAddresses) {
      // get address ID that should be selected in the dropdown
      const selectedId =
        // if we have locally selected address id then use it
        this.state.selectedAddressId ||
        // if there's passed selected address then use it
        (selectedAddress && selectedAddress.id) ||
        // if default that should be selected is passed then use it
        (defaultSelected && defaultSelected.id);

      selectedAvailableAddress = availableAddresses.find(item => item.id === selectedId);
    }

    // lets the user manually enter an address
    const addressForm = (
      <Formik initialValues={initialAddressValue} onSubmit={this.submitAddress}>
        <Form id={id} i18nId="addressForm" my="sm">
          <AddressFormFields id={id} askEmail submitLabel={submitLabel} autoCompleteSection={id} />
          <Button type="submit">{submitLabel}</Button>
        </Form>
      </Formik>
    );

    // lets the user pick an existing address or show the address form
    const addressEditor = (
      <React.Fragment>
        {availableAddresses && (
          <AddressPicker
            addresses={availableAddresses}
            selectedAddressId={selectedAvailableAddress ? selectedAvailableAddress.id : 0}
            onChange={addrId => this.setState({ selectedAddressId: addrId })}
          />
        )}
        {!selectedAvailableAddress && addressForm}
        {!!selectedAvailableAddress && (
          <Button my="sm" onClick={this.submitSelectedAddress}>
            <T id="continue" />
          </Button>
        )}
      </React.Fragment>
    );

    if (setUseTheSame) {
      // ask if the same address from a previous step should be used
      content = (
        <React.Fragment>
          <FlexLayout mb="md">
            <Checkbox
              id="use-default"
              size="sm"
              checked={this.state.useTheSame}
              onChange={ev => this.setState({ useTheSame: ev.target.checked })}
            />
            <Label ml="xs" htmlFor="use-default">
              {labelUseTheSame}
            </Label>
          </FlexLayout>

          {this.state.useTheSame ? (
            <Button onClick={() => setUseTheSame(true)}>
              <T id="continue" />
            </Button>
          ) : (
            addressEditor
          )}
        </React.Fragment>
      );
    } else if (availableAddresses) {
      // let the user pick an existing address or enter another one
      content = addressEditor;
    } else {
      // no addresses are available, the only option is to enter one manually
      content = addressForm;
    }

    return (
      <Details open={open}>
        {header}
        <DetailsContent>
          {content}
          <ErrorList errors={errors} />
        </DetailsContent>
      </Details>
    );
  }
}

AddressSection.propTypes = {
  // id of the form - used for generating unique ids for form fields inside
  id: PropTypes.string,
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

export default AddressSection;
