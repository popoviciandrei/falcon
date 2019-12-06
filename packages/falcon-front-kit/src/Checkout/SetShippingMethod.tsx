import React, { useState, useCallback } from 'react';
import { ShippingMethod } from '@deity/falcon-shop-extension';
import { useSetShippingMethodMutation, SetShippingMethodResponse } from '@deity/falcon-shop-data';
import { useCheckout } from './CheckoutConsumer';
import { CheckoutOperation, CheckoutOperationHook } from './CheckoutOperation';
import { shippingMethodToCheckoutDetailsInput } from './shippingMethodToCheckoutDetailsInput';

export const useSetShippingMethod: CheckoutOperationHook<SetShippingMethodResponse, ShippingMethod> = () => {
  const [state, setState] = useState<ShippingMethod>();
  const { isLoading, setLoading, setShippingMethod } = useCheckout();
  const [mutation, result] = useSetShippingMethodMutation({
    onCompleted: data => {
      if (data) {
        setShippingMethod(state);
        setLoading(false);
      }
    }
  });

  if (result.loading !== isLoading) {
    setLoading(result.loading);
  }

  return [
    useCallback(async (input: ShippingMethod, options) => {
      setLoading(true);
      setState(input);

      return mutation({ ...options, variables: { input: shippingMethodToCheckoutDetailsInput(input) } });
    }, []),
    result
  ];
};

export type SetShippingMethodProps = {
  children: CheckoutOperation<SetShippingMethodResponse, ShippingMethod>;
};
export const SetShippingMethod: React.FC<SetShippingMethodProps> = ({ children }) => {
  return children(...useSetShippingMethod());
};
