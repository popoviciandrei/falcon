import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Formik } from 'formik';
import { T } from '@deity/falcon-i18n';
import { H1, FlexLayout, GridLayout, Button } from '@deity/falcon-ui';
import { Loader, Form } from '@deity/falcon-ui-kit';
import { AddAddressMutation } from '@deity/falcon-shop-data';
import AddressFormFields from '../../components/AddressFormFields';
import ErrorList from '../../components/ErrorList';

const AddAddress = () => {
  const initialAddressValues = {
    firstname: '',
    lastname: '',
    street1: '',
    street2: '',
    postcode: '',
    city: '',
    countryId: '',
    company: '',
    telephone: '',
    defaultBilling: false,
    defaultShipping: false
  };

  const [done, setDone] = useState(false);

  if (done) {
    return <Redirect to="/account/address-book" />;
  }

  return (
    <AddAddressMutation>
      {(addAddress, { loading, error }) => (
        <GridLayout position="relative" mb="md" gridGap="md">
          {loading && <Loader variant="overlay" />}
          <H1>
            <T id="addAddress.title" />
          </H1>
          <Formik
            initialValues={initialAddressValues}
            onSubmit={({ street1, street2, ...values }) =>
              addAddress({
                variables: {
                  input: {
                    ...values,
                    street: [street1, street2]
                  }
                }
              }).then(setDone(true))
            }
          >
            <Form id="add-address" i18nId="addressForm">
              <AddressFormFields twoColumns askDefault onCancel={() => setDone(true)} />
              <FlexLayout justifyContent="flex-end" alignItems="center" mt="md">
                <Button onClick={() => setDone(true)} mr="md">
                  <T id="addAddress.cancelButton" />
                </Button>
                <Button type="submit">
                  <T id="addAddress.submitButton" />
                </Button>
              </FlexLayout>
            </Form>
          </Formik>
          <ErrorList errors={error ? [new Error(error)] : []} />
        </GridLayout>
      )}
    </AddAddressMutation>
  );
};

export default AddAddress;
