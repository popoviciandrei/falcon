import React from 'react';
import { Formik } from 'formik';
import { Address, Country, Region } from '@deity/falcon-shop-extension';
import { useGetUserError } from '@deity/falcon-data';
import { useEditAddressMutation, EditAddressResponse } from '@deity/falcon-shop-data';
import { FormProviderProps } from '../Forms';

export type EditAddressFormValues = {
  firstname: string;
  lastname: string;
  street1?: string;
  street2?: string;
  postcode: string;
  city: string;
  country: Country;
  region?: Region;
  company?: string;
  telephone?: string;
  defaultBilling?: boolean;
  defaultShipping?: boolean;
};

export type EditAddressFormProviderProps = FormProviderProps<EditAddressFormValues, EditAddressResponse> & {
  address: Address;
};
export const EditAddressFormProvider: React.SFC<EditAddressFormProviderProps> = props => {
  const { address, onSuccess, initialValues, mutationOptions, ...formikProps } = props;
  const { __typename, street, ...rest } = address;
  const defaultInitialValues = {
    street1: street.length > 0 ? street[0] : undefined,
    street2: street.length > 1 ? street[1] : undefined,
    ...rest
  };

  const [editAddress] = useEditAddressMutation();
  const [getUserError] = useGetUserError();

  return (
    <Formik
      initialStatus={{}}
      initialValues={initialValues || defaultInitialValues}
      onSubmit={({ street1, street2, country, region, ...values }, { setSubmitting, setStatus }) =>
        editAddress({
          variables: {
            input: {
              ...values,
              id: address.id,
              street: [street1, street2].filter(Boolean),
              countryId: country.id,
              regionId: region ? region.id : undefined
            }
          },
          ...(mutationOptions || {})
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
