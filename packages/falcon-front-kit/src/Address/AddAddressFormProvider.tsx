import React from 'react';
import { Formik } from 'formik';
import { AddressCountry } from '@deity/falcon-shop-extension';
import { useGetUserError } from '@deity/falcon-data';
import { useAddAddressMutation, AddAddressResponse } from '@deity/falcon-shop-data';
import { FormProviderProps } from '../Forms';

export type AddAddressFormValues = {
  firstname: string;
  lastname: string;
  street1?: string;
  street2?: string;
  postcode: string;
  city: string;
  country: AddressCountry;
  company?: string;
  telephone?: string;
  defaultBilling?: boolean;
  defaultShipping?: boolean;
};

export type AddAddressFormProviderProps = FormProviderProps<AddAddressFormValues, AddAddressResponse>;
export const AddAddressFormProvider: React.SFC<AddAddressFormProviderProps> = props => {
  const { onSuccess, initialValues, ...formikProps } = props;
  const defaultInitialValues = {
    firstname: '',
    lastname: '',
    street1: '',
    street2: '',
    postcode: '',
    city: '',
    country: undefined,
    company: '',
    telephone: '',
    defaultBilling: false,
    defaultShipping: false
  };

  const [addAddress] = useAddAddressMutation();
  const [getUserError] = useGetUserError();

  return (
    <Formik
      initialStatus={{}}
      initialValues={initialValues || defaultInitialValues}
      onSubmit={({ street1, street2, country, ...values }, { setSubmitting, setStatus }) =>
        addAddress({
          variables: {
            input: {
              ...values,
              street: [street1, street2].filter(Boolean),
              countryId: country.id
            }
          }
        })
          .then(({ data }) => {
            setSubmitting(false);
            setStatus({ data });
            return onSuccess && onSuccess(data);
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
