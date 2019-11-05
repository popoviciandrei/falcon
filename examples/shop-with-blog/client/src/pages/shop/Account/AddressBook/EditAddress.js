import React from 'react';
import { NavLink } from 'react-router-dom';
import { Formik } from 'formik';
import { T } from '@deity/falcon-i18n';
import { H1, Text, Button, FlexLayout, GridLayout } from '@deity/falcon-ui';
import {
  getAddressType,
  Form,
  FormField,
  CheckboxFormField,
  FormErrorSummary,
  TwoColumnsLayout,
  TwoColumnsLayoutArea,
  CountryPicker
} from '@deity/falcon-ui-kit';
import { GET_ADDRESS, AddressQuery, EditAddressMutation, CountryListQuery } from '@deity/falcon-shop-data';

const EditAddress = ({ match, history }) => {
  const id = parseInt(match.params.id, 10);

  return (
    <AddressQuery variables={{ id }}>
      {({ data: { address } }) => (
        <GridLayout>
          <H1>
            <T id="editAddress.title" />
          </H1>

          {(address.defaultBilling || address.defaultShipping) && (
            <Text>
              <T id="editAddress.defaultAddressLabel" context={getAddressType(address)} />
            </Text>
          )}
          <EditAddressMutation refetchQueries={['AddressList', { query: GET_ADDRESS, variables: { id } }]}>
            {(editAddress, { loading, error }) => (
              <Formik
                initialValues={{
                  firstname: address.firstname,
                  lastname: address.lastname,
                  street1: address.street[0],
                  street2: address.street.length > 1 ? address.street[1] : '',
                  postcode: address.postcode,
                  city: address.city,
                  countryId: address.country.id,
                  company: address.company || undefined,
                  telephone: address.telephone,
                  defaultBilling: address.defaultBilling,
                  defaultShipping: address.defaultShipping
                }}
                onSubmit={({ street1, street2, ...values }) =>
                  editAddress({
                    variables: {
                      input: {
                        ...values,
                        id,
                        street: [street1, street2]
                      }
                    }
                  }).then(() => history.push('/account/address-book'))
                }
              >
                {() => (
                  <Form id={id} i18nId="editAddress">
                    {!address.defaultBilling && <CheckboxFormField name="defaultBilling" />}
                    {!address.defaultShipping && <CheckboxFormField name="defaultShipping" />}
                    <TwoColumnsLayout>
                      <GridLayout gridArea={TwoColumnsLayoutArea.left} gridGap="sm">
                        <FormField name="company" />
                        <FormField name="firstname" required />
                        <FormField name="lastname" required />
                        <FormField name="telephone" />
                      </GridLayout>
                      <GridLayout gridArea={TwoColumnsLayoutArea.right} gridGap="sm">
                        <FormField name="street1" required />
                        <FormField name="street2" />
                        <FormField name="postcode" required />
                        <FormField name="city" required />
                        <FormField name="countryId" required>
                          {({ field }) => (
                            <CountryListQuery passLoading>
                              {({ data: { countryList = { items: [] } } }) => (
                                <CountryPicker {...field} options={countryList.items} />
                              )}
                            </CountryListQuery>
                          )}
                        </FormField>
                      </GridLayout>
                    </TwoColumnsLayout>
                    <FlexLayout justifyContent="flex-end" alignItems="center" mt="md">
                      <FormErrorSummary errors={error && [error.message]} />
                      <Button as={NavLink} to="/account/address-book" mr="md">
                        <T id="addAddress.cancelButton" />
                      </Button>
                      <Button type="submit" variant={loading ? 'loader' : undefined}>
                        <T id="editAddress.submitButton" />
                      </Button>
                    </FlexLayout>
                  </Form>
                )}
              </Formik>
            )}
          </EditAddressMutation>
        </GridLayout>
      )}
    </AddressQuery>
  );
};

export default EditAddress;
