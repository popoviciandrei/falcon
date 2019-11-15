import React, { useState, useCallback } from 'react';
import { CheckoutDetailsInput } from '@deity/falcon-shop-extension';
import { useSetPaymentMethodMutation, SetPaymentMethodResponse } from '@deity/falcon-shop-data';
import { useCheckout } from './CheckoutConsumer';
import { CheckoutOperation, CheckoutOperationHook } from './CheckoutOperation';

export const useSetPaymentMethod: CheckoutOperationHook<SetPaymentMethodResponse, CheckoutDetailsInput> = () => {
  const [method, setMethod] = useState<CheckoutDetailsInput>();
  const { setLoading, setPaymentMethod } = useCheckout();
  const [mutation, mutationResult] = useSetPaymentMethodMutation({
    onCompleted: () => {
      setPaymentMethod(method);
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

export type SetPaymentMethodProps = {
  children: CheckoutOperation<SetPaymentMethodResponse, CheckoutDetailsInput>;
};
export const SetPaymentMethod: React.FC<SetPaymentMethodProps> = ({ children }) => {
  return children(...useSetPaymentMethod());
};
