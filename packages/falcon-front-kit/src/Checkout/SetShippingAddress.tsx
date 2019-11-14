import React, { useState } from 'react';
import { useSetShippingAddressMutation, SetShippingAddressResponse } from '@deity/falcon-shop-data';
import { useCheckoutState } from './CheckoutState';
import { CheckoutAddress, addressToCheckoutAddressInput } from './CheckoutAddress';
import { CheckoutOperation, CheckoutOperationHook } from './CheckoutOperation';

export const useSetShippingAddress: CheckoutOperationHook<SetShippingAddressResponse, CheckoutAddress> = () => {
  const [address, setAddress] = useState<CheckoutAddress>();
  const [, { setLoading, setShippingAddress }] = useCheckoutState();
  const [mutation, mutationResult] = useSetShippingAddressMutation({ onCompleted: () => setShippingAddress(address) });
  setLoading(mutationResult.loading);

  return [
    (input: CheckoutAddress, options) => {
      setAddress(input);

      return mutation({ ...options, variables: { input: addressToCheckoutAddressInput(input) } });
    },
    mutationResult
  ];
};

export type SetShippingAddressProps = {
  children: CheckoutOperation<SetShippingAddressResponse, CheckoutAddress>;
};
export const SetShippingAddress: React.FC<SetShippingAddressProps> = ({ children }) => {
  return children(...useSetShippingAddress());
};
