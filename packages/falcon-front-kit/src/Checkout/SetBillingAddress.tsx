import React, { useState, useCallback } from 'react';
import { useSetBillingAddressMutation, SetBillingAddressResponse } from '@deity/falcon-shop-data';
import { useCheckout } from './CheckoutConsumer';
import { CheckoutAddress, addressToCheckoutAddressInput } from './CheckoutAddress';
import { CheckoutOperation, CheckoutOperationHook } from './CheckoutOperation';

export const useSetBillingAddress: CheckoutOperationHook<SetBillingAddressResponse, CheckoutAddress> = () => {
  const [address, setAddress] = useState<CheckoutAddress>();
  const { isLoading, setLoading, setBillingAddress, isBillingSameAsShipping } = useCheckout();
  const [mutation, result] = useSetBillingAddressMutation({
    onCompleted: data => {
      if (data) {
        setBillingAddress(address);
        setLoading(false);
      }
    }
  });

  if (result.loading !== isLoading) {
    setLoading(result.loading);
  }

  return [
    useCallback(
      async (input: CheckoutAddress, options) => {
        setLoading(true);
        setAddress(input);

        return mutation({
          ...options,
          variables: {
            input: {
              address: addressToCheckoutAddressInput(input),
              billingSameAsShipping: isBillingSameAsShipping
            }
          }
        });
      },
      [isBillingSameAsShipping]
    ),
    result
  ];
};

export type SetBillingAddressProps = {
  children: CheckoutOperation<SetBillingAddressResponse, CheckoutAddress>;
};
export const SetBillingAddress: React.FC<SetBillingAddressProps> = ({ children }) => {
  return children(...useSetBillingAddress());
};
