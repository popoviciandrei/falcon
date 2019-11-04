import React from 'react';
import { Formik } from 'formik';
import { useGetUserError } from '@deity/falcon-data';
import { useAddAddressMutation } from '@deity/falcon-shop-data';
import { FormProviderProps } from '../Forms';

export type AddAddressFormValues = {
  firstname: string;
  lastname: string;
  street1?: string;
  street2?: string;
  postcode: string;
  city: string;
  countryId: string;
  company?: string;
  telephone?: string;
  defaultBilling?: boolean;
  defaultShipping?: boolean;
};

export type AddAddressFormProviderProps = FormProviderProps<AddAddressFormValues>;

export const AddAddressFormProvider: React.SFC<AddAddressFormProviderProps> = props => {
  const { onSuccess, initialValues, ...formikProps } = props;
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

  const [addAddress] = useAddAddressMutation();
  const [getUserError] = useGetUserError();

  return (
    <Formik
      initialValues={initialValues || defaultInitialValues}
      onSubmit={({ street1, street2, ...values }, { setSubmitting, setStatus }) =>
        addAddress({
          variables: {
            input: {
              ...values,
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
