import React, { useState, useCallback } from 'react';
import { CheckoutDetailsInput } from '@deity/falcon-shop-extension';
import { useSetShippingMethodMutation, SetShippingMethodResponse } from '@deity/falcon-shop-data';
import { useCheckout } from './CheckoutConsumer';
import { CheckoutOperation, CheckoutOperationHook } from './CheckoutOperation';

export const useSetShippingMethod: CheckoutOperationHook<SetShippingMethodResponse, CheckoutDetailsInput> = () => {
  const [method, setMethod] = useState<CheckoutDetailsInput>();
  const { setLoading, setShippingMethod } = useCheckout();
  const [mutation, mutationResult] = useSetShippingMethodMutation({
    onCompleted: () => {
      setShippingMethod(method);
      setLoading(false);
    }
  });

  return [
    useCallback(async (input: CheckoutDetailsInput, options) => {
      setLoading(true);
      setMethod(input);

      return mutation({ ...options, variables: { input } });
    }, []),
    mutationResult
  ];
};

export type SetShippingMethodProps = {
  children: CheckoutOperation<SetShippingMethodResponse, CheckoutDetailsInput>;
};
export const SetShippingMethod: React.FC<SetShippingMethodProps> = ({ children }) => {
  return children(...useSetShippingMethod());
};
