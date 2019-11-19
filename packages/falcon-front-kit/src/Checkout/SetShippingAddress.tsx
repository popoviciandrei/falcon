import React, { useState, useCallback } from 'react';
import { useSetShippingAddressMutation, SetShippingAddressResponse } from '@deity/falcon-shop-data';
import { useCheckout } from './CheckoutConsumer';
import { CheckoutAddress, addressToCheckoutAddressInput } from './CheckoutAddress';
import { CheckoutOperation, CheckoutOperationHook } from './CheckoutOperation';

export const useSetShippingAddress: CheckoutOperationHook<SetShippingAddressResponse, CheckoutAddress> = () => {
  const [address, setAddress] = useState<CheckoutAddress>();
  const { isLoading, setLoading, setShippingAddress } = useCheckout();
  const [mutation, result] = useSetShippingAddressMutation({
    onCompleted: data => {
      if (data) {
        setShippingAddress(address);
        setLoading(false);
      }
    }
  });

  if (result.loading !== isLoading) {
    setLoading(result.loading);
  }

  return [
    useCallback(async (input: CheckoutAddress, options = {}) => {
      setLoading(true);
      setAddress(input);

      return mutation({ ...options, variables: { input: addressToCheckoutAddressInput(input) } });
    }, []),
    result
  ];
};

export type SetShippingAddressProps = {
  children: CheckoutOperation<SetShippingAddressResponse, CheckoutAddress>;
};
export const SetShippingAddress: React.FC<SetShippingAddressProps> = ({ children }) => {
  return children(...useSetShippingAddress());
};
