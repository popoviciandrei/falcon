import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { AddressCountry, Address } from '@deity/falcon-shop-extension';
import { useGetUserError } from '@deity/falcon-data';
import { SetShippingAddressResponse, SetBillingAddressResponse } from '@deity/falcon-shop-data';
import { FormProviderProps } from '../Forms';
import { CheckoutAddress } from './CheckoutAddress';
import { CheckoutOperationFunction } from './CheckoutOperation';

export type SetCheckoutAddressFormValues = {
  email?: string;
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

const INITIAL_VALUES: SetCheckoutAddressFormValues = {
  email: '',
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
};

export type SetCheckoutAddressFormProviderProps = FormProviderProps<SetCheckoutAddressFormValues, CheckoutAddress> & {
  setAddress: CheckoutOperationFunction<SetShippingAddressResponse | SetBillingAddressResponse, CheckoutAddress>;
  address?: CheckoutAddress | Address;
};
export const SetCheckoutAddressFormProvider: React.SFC<SetCheckoutAddressFormProviderProps> = props => {
  const { initialValues, setAddress, address, onSuccess, ...formikProps } = props;
  const isMounted = React.useRef(true);
  const [getUserError] = useGetUserError();

  React.useEffect(() => {
    // https://stackoverflow.com/a/56443045/412319
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <Formik
      initialStatus={{}}
      initialValues={address ? checkoutAddressToSetCheckoutAddressFormValues(address) : initialValues}
      enableReinitialize
      onSubmit={({ street1, street2, ...values }, { setSubmitting, setStatus }) =>
        setAddress({
          ...values,
          street: [street1, street2].filter(Boolean)
        })
          .then(() => {
            const successData = {
              ...values,
              street: [street1, street2].filter(Boolean)
            };

            if (isMounted.current) {
              setStatus({ data: successData });
              setSubmitting(false);
            }

            return onSuccess && onSuccess(successData);
          })
          .catch(e => {
            const error = getUserError(e);
            if (error.length && isMounted.current) {
              setStatus({ error });
              setSubmitting(false);
            }
          })
      }
      {...formikProps}
    />
  );
};
SetCheckoutAddressFormProvider.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  initialValues: { ...INITIAL_VALUES }
};
SetCheckoutAddressFormProvider.propTypes = {
  setAddress: PropTypes.func.isRequired
};

export type checkoutAddressToSetCheckoutAddressFormValues = (
  address?: CheckoutAddress | Address
) => SetCheckoutAddressFormValues;
export const checkoutAddressToSetCheckoutAddressFormValues: checkoutAddressToSetCheckoutAddressFormValues = address => {
  if (!address) {
    return INITIAL_VALUES;
  }

  const { __typename, street, ...rest } = { __typename: undefined, ...address };

  return {
    street1: street.length > 0 ? street[0] : undefined,
    street2: street.length > 1 ? street[1] : undefined,
    ...rest
  };
};
