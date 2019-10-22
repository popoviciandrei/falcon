import React from 'react';
import { Formik } from 'formik';
import { useGetUserError } from '@deity/falcon-data';
import { useEditAddressMutation, GET_ADDRESS } from '@deity/falcon-shop-data';
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
export type EditAddressFormProvider = FormProviderProps<EditAddressFormValues> & {
  id: number;
};
export const EditAddressFormProvider: React.SFC<EditAddressFormProvider> = props => {
  const { id, onSuccess, initialValues, ...formikProps } = props;
  const defaultInitialValues = {
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

  const [editAddress] = useEditAddressMutation({
    refetchQueries: ['Addresses', { query: GET_ADDRESS, variables: { id } }]
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
              id,
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
