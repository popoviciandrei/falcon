import React from 'react';
import { Formik } from 'formik';
import { Address } from '@deity/falcon-shop-extension';
import { useGetUserError } from '@deity/falcon-data';
import { FormProviderProps } from '../Forms';
import { CheckoutAddress } from './CheckoutAddress';
import { useSetBillingAddress } from './SetBillingAddress';
import {
  SetCheckoutAddressFormValues,
  checkoutAddressToSetCheckoutAddressFormValues
} from './SetShippingAddressFormProvider';

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

export type SetBillingAddressFormProviderProps = FormProviderProps<SetCheckoutAddressFormValues, CheckoutAddress> & {
  address?: CheckoutAddress | Address;
};
export const SetBillingAddressFormProvider: React.SFC<SetBillingAddressFormProviderProps> = props => {
  const { initialValues, address, onSuccess, ...formikProps } = props;
  const isMounted = React.useRef(true);
  const [setAddress] = useSetBillingAddress();
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
SetBillingAddressFormProvider.defaultProps = {
  initialValues: { ...INITIAL_VALUES }
};
