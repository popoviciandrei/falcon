import React, { useState } from 'react';
import { useSetBillingAddressMutation, SetBillingAddressResponse } from '@deity/falcon-shop-data';
import { useCheckoutState } from './CheckoutState';
import { CheckoutAddress, addressToCheckoutAddressInput } from './CheckoutAddress';
import { CheckoutOperation, CheckoutOperationHook } from './CheckoutOperation';

export const useSetBillingAddress: CheckoutOperationHook<SetBillingAddressResponse, CheckoutAddress> = () => {
  const [address, setAddress] = useState<CheckoutAddress>();
  const [, { setLoading, setBillingAddress }] = useCheckoutState();
  const [mutation, mutationResult] = useSetBillingAddressMutation({ onCompleted: () => setBillingAddress(address) });
  setLoading(mutationResult.loading);

  return [
    (input: CheckoutAddress, options) => {
      setAddress(input);

      return mutation({ ...options, variables: { input: addressToCheckoutAddressInput(input) } });
    },
    mutationResult
  ];
};

export type SetBillingAddressProps = {
  children: CheckoutOperation<SetBillingAddressResponse, CheckoutAddress>;
};
export const SetBillingAddress: React.FC<SetBillingAddressProps> = ({ children }) => {
  return children(...useSetBillingAddress());
};
