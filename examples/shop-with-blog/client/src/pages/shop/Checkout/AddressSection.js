import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { FlexLayout, Checkbox, Label, Details, DetailsContent, Button } from '@deity/falcon-ui';
import { T, I18n } from '@deity/falcon-i18n';
import { AddressDetails, Form, AddressFormFields, ErrorSummary } from '@deity/falcon-ui-kit';
import SectionHeader from './CheckoutSectionHeader';
import { AddressPicker } from './components/AddressPicker';

class AddressSection extends React.Component {
  constructor(props) {
    super(props);

    const { selectedAddress, defaultSelected, useTheSame } = props;

    this.state = {
      useTheSame: !!useTheSame,
      selectedAddress: selectedAddress || defaultSelected || null
    };
  }

  submitAddress = ({ street1, street2, ...restValues }) => {
    this.props.setAddress({ ...restValues, street: [street1, street2] });
  };

  submitSelectedAddress = () => {
    const { selectedAddress } = this.state;
    const { __typename, region, ...rest } = selectedAddress; // make sure we don't send __typename field
    const addressInput = {
      ...rest,
      // include ID fields instead of full country/region objects
      regionId: region ? region.id : undefined
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
      onEditRequested,
      submitLabel,
      errors,
      availableAddresses,
      selectedAddress
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
      country: undefined,
      ...selectedAddressRest
    };

    let header;
    let content;

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

    const { selectedAddress: selectedAddr } = this.state;

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
        {!!availableAddresses.length && (
          <AddressPicker
            options={availableAddresses}
            selected={selectedAddr}
            onChange={value => this.setState({ selectedAddress: value })}
          />
        )}
        {selectedAddr !== 'Other' && (
          <Button my="sm" onClick={this.submitSelectedAddress}>
            <T id="continue" />
          </Button>
        )}
        {(selectedAddr === 'Other' || !availableAddresses.length) && addressForm}
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
          <ErrorSummary errors={errors} />
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
