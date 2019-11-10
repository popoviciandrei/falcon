import React from 'react';
import { Formik } from 'formik';
import { AddressCountry, Address } from '@deity/falcon-shop-extension';
import { useGetUserError } from '@deity/falcon-data';
import { useSetShippingAddressMutation } from '@deity/falcon-shop-data';
import { FormProviderProps } from '../Forms';
import { CheckoutAddress } from './CheckoutAddress';

export type SetCheckoutAddressFormValues = {
  firstname: string;
  lastname: string;
  street1?: string;
  street2?: string;
  postcode: string;
  city: string;
  country: AddressCountry;
  company?: string;
  telephone?: string;
  saveInAddressBook?: boolean;
};

export type SetShippingAddressFormProviderProps = FormProviderProps<SetCheckoutAddressFormValues, CheckoutAddress> & {
  address?: CheckoutAddress | Address;
};
export const SetShippingAddressFormProvider: React.SFC<SetShippingAddressFormProviderProps> = props => {
  const { onSuccess, initialValues, address, ...formikProps } = props;
  const [setShippingAddress] = useSetShippingAddressMutation();
  const [getUserError] = useGetUserError();

  return (
    <Formik
      initialStatus={{}}
      initialValues={address ? checkoutAddressToSetCheckoutAddressFormValues(address) : initialValues}
      onSubmit={({ street1, street2, country, ...values }, { setSubmitting, setStatus }) => {
        return setShippingAddress({
          variables: {
            input: {
              ...values,
              street: [street1, street2].filter(Boolean),
              countryId: country.id
            }
          }
        })
          .then(() => {
            const successData = {
              ...values,
              street: [street1, street2].filter(Boolean),
              country
            };

            setSubmitting(false);
            setStatus({ data: successData });

            return onSuccess && onSuccess(successData);
          })
          .catch(e => {
            const error = getUserError(e);
            if (error.length) {
              setStatus({ error });
              setSubmitting(false);
            }
          });
      }}
      {...formikProps}
    />
  );
};
SetShippingAddressFormProvider.defaultProps = {
  initialValues: {
    firstname: '',
    lastname: '',
    street1: '',
    street2: '',
    postcode: '',
    city: '',
    country: undefined,
    company: '',
    telephone: '',
    saveInAddressBook: false
  }
};

const checkoutAddressToSetCheckoutAddressFormValues = (
  address: CheckoutAddress | Address
): SetCheckoutAddressFormValues => {
  const { __typename, ...rest } = { __typename: undefined, ...address };

  return {
    street1: rest.street.length > 0 ? address.street[0] : undefined,
    street2: rest.street.length > 1 ? address.street[1] : undefined,
    ...rest
  };
};
