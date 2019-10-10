import React from 'react';
import PropTypes from 'prop-types';
import {
  CheckboxFormField,
  CountryPicker,
  TwoColumnsLayout,
  TwoColumnsLayoutArea,
  FormField
} from '@deity/falcon-ui-kit';
import { CountryListQuery } from '@deity/falcon-shop-data';
import { Box, GridLayout } from '@deity/falcon-ui';

const AddressFormFields = props => {
  const { twoColumns, askDefault, askEmail, autoCompleteSection } = props;

  const getAutoComplete = attribute => [autoCompleteSection, attribute].filter(x => x).join(' ');

  const askDefaultFields = (
    <Box mb="sm">
      <CheckboxFormField name="defaultShipping" />
      <CheckboxFormField name="defaultBilling" />
    </Box>
  );

  // the form content, not including default address fields and submit button(s)
  const mainContent = (
    <React.Fragment>
      <GridLayout gridArea={twoColumns ? TwoColumnsLayoutArea.left : null}>
        {askEmail && <FormField name="email" type="email" required />}
        <FormField name="company" autoComplete={getAutoComplete('company')} />
        <FormField name="firstname" required autoComplete={getAutoComplete('given-name')} />
        <FormField name="lastname" required autoComplete={getAutoComplete('family-name')} />
        <FormField name="telephone" required autoComplete={getAutoComplete('tel')} />
      </GridLayout>
      <GridLayout gridArea={twoColumns ? TwoColumnsLayoutArea.right : null}>
        <FormField name="street1" required autoComplete={getAutoComplete('address-line1')} />
        <FormField name="street2" autoComplete={getAutoComplete('address-line2')} />
        <FormField name="postcode" required autoComplete={getAutoComplete('postal-code')} />
        <FormField name="city" required autoComplete={getAutoComplete('address-level2')} />
        <FormField name="countryId" required autoComplete={getAutoComplete('country')}>
          {({ field }) => (
            <CountryListQuery passLoading>
              {({ data: { countryList = {} } }) => <CountryPicker {...field} options={countryList.items || []} />}
            </CountryListQuery>
          )}
        </FormField>
      </GridLayout>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {askDefault && askDefaultFields}
      {twoColumns ? <TwoColumnsLayout>{mainContent}</TwoColumnsLayout> : mainContent}
    </React.Fragment>
  );
};

AddressFormFields.propTypes = {
  // whether to use a two column layout instead of a single column
  twoColumns: PropTypes.bool,
  // whether the form should ask whether the address should be set as default
  askDefault: PropTypes.bool,
  // whether the form should ask for an email address
  askEmail: PropTypes.bool
};
AddressFormFields.defaultProps = {
  twoColumns: false,
  askDefault: false,
  askEmail: false
};

export default AddressFormFields;
