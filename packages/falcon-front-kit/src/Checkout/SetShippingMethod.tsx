import React, { useState, useCallback } from 'react';
import { ShippingMethod } from '@deity/falcon-shop-extension';
import { useSetShippingMethodMutation, SetShippingMethodResponse } from '@deity/falcon-shop-data';
import { useCheckout } from './CheckoutConsumer';
import { CheckoutOperation, CheckoutOperationHook } from './CheckoutOperation';
import { shippingMethodToCheckoutDetailsInput } from './shippingMethodToCheckoutDetailsInput';

export const useSetShippingMethod: CheckoutOperationHook<SetShippingMethodResponse, ShippingMethod> = () => {
  const [state, setState] = useState<ShippingMethod>();
  const { setLoading, setShippingMethod } = useCheckout();
  const [mutation, mutationResult] = useSetShippingMethodMutation({
    onCompleted: () => {
      setShippingMethod(state);
      setLoading(false);
    }
  });

  return [
    useCallback(async (input: ShippingMethod, options) => {
      setLoading(true);
      setState(input);

      return mutation({ ...options, variables: { input: shippingMethodToCheckoutDetailsInput(input) } });
    }, []),
    mutationResult
  ];
};

export type SetShippingMethodProps = {
  children: CheckoutOperation<SetShippingMethodResponse, ShippingMethod>;
};
export const SetShippingMethod: React.FC<SetShippingMethodProps> = ({ children }) => {
  return children(...useSetShippingMethod());
};
