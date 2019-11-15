import React, { useState, useCallback } from 'react';
import { useSetBillingAddressMutation, SetBillingAddressResponse } from '@deity/falcon-shop-data';
import { useCheckout } from './CheckoutConsumer';
import { CheckoutAddress, addressToCheckoutAddressInput } from './CheckoutAddress';
import { CheckoutOperation, CheckoutOperationHook } from './CheckoutOperation';

export const useSetBillingAddress: CheckoutOperationHook<SetBillingAddressResponse, CheckoutAddress> = () => {
  const [address, setAddress] = useState<CheckoutAddress>();
  const { setLoading, setBillingAddress } = useCheckout();
  const [mutation, mutationResult] = useSetBillingAddressMutation({
    onCompleted: () => {
      setBillingAddress(address);
      setLoading(false);
    }
  });

  return [
    useCallback(async (input: CheckoutAddress, options) => {
      setLoading(true);
      setAddress(input);

      return mutation({ ...options, variables: { input: addressToCheckoutAddressInput(input) } });
    }, []),
    mutationResult
  ];
};

export type SetBillingAddressProps = {
  children: CheckoutOperation<SetBillingAddressResponse, CheckoutAddress>;
};
export const SetBillingAddress: React.FC<SetBillingAddressProps> = ({ children }) => {
  return children(...useSetBillingAddress());
};
