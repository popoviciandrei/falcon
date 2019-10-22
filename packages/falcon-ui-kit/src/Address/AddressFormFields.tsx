// @ts-nocheck
import React from 'react';
import { CountryListQuery } from '@deity/falcon-shop-data';
import { Box, GridLayout } from '@deity/falcon-ui';
import { CheckboxFormField, FormField } from '../Forms';
import { TwoColumnsLayoutArea, TwoColumnsLayout } from '../Layouts';
import { CountryPicker } from '../Country';

export type AddressFormFieldsProps = {
  autoCompleteSection?: string;
  // whether to use a two column layout instead of a single column
  twoColumns?: boolean;
  // whether the form should ask whether the address should be set as default
  askDefault?: boolean;
  // whether the form should ask for an email address
  askEmail?: boolean;
};

export const AddressFormFields: React.SFC<AddressFormFieldsProps> = props => {
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
              {({ data: { countryList = {} } }) => (
                // @ts-ignore
                // FIXME: resolve this type error
                <CountryPicker {...field} options={countryList.items || []} />
              )}
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

AddressFormFields.defaultProps = {
  twoColumns: false,
  askDefault: false,
  askEmail: false
};
