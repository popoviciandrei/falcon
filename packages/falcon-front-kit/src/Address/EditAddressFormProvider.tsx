import React from 'react';
import { Formik } from 'formik';
import { useGetUserError } from '@deity/falcon-data';
import { useEditAddressMutation, GET_ADDRESS } from '@deity/falcon-shop-data';
import { Address } from '@deity/falcon-shop-extension';
import { FormProviderProps } from '../Forms';

export type EditAddressFormValues = {
  firstname: string;
  lastname: string;
  street1: string;
  street2: string;
  postcode: string;
  city: string;
  countryId: string;
  company: string;
  telephone: string;
  defaultBilling: boolean;
  defaultShipping: boolean;
};

export type EditAddressFormProviderProps = FormProviderProps<EditAddressFormValues> & {
  address: Address;
};

export const EditAddressFormProvider: React.SFC<EditAddressFormProviderProps> = props => {
  const { address, onSuccess, initialValues, ...formikProps } = props;
  const defaultInitialValues = {
    firstname: address.firstname,
    lastname: address.lastname,
    street1: address.street.length > 0 ? address.street[0] : undefined,
    street2: address.street.length > 1 ? address.street[1] : undefined,
    postcode: address.postcode,
    city: address.city,
    countryId: address.country.id,
    company: address.company || undefined,
    telephone: address.telephone,
    defaultBilling: address.defaultBilling,
    defaultShipping: address.defaultShipping
  };

  const [editAddress] = useEditAddressMutation({
    refetchQueries: ['Addresses', { query: GET_ADDRESS, variables: { id: address.id } }]
  });
  const [getUserError] = useGetUserError();

  return (
    <Formik
      initialValues={initialValues || defaultInitialValues}
      onSubmit={({ street1, street2, ...values }, { setSubmitting, setStatus }) =>
        editAddress({
          variables: {
            input: {
              ...values,
              id: address.id,
              street: [street1, street2]
            }
          }
        })
          .then(() => {
            setSubmitting(false);
            return onSuccess && onSuccess();
          })
          .catch(e => {
            const error = getUserError(e);
            if (error.length) {
              setStatus({ error });
              setSubmitting(false);
            }
          })
      }
      {...formikProps}
    />
  );
};
