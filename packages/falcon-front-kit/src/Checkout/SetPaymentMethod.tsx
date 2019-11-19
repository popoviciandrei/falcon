import React, { useState, useCallback } from 'react';
import { useSetPaymentMethodMutation, SetPaymentMethodResponse } from '@deity/falcon-shop-data';
import { useCheckout } from './CheckoutConsumer';
import { CheckoutOperation, CheckoutOperationHook } from './CheckoutOperation';
import { PaymentMethodData, paymentMethodToCheckoutDetailsInput } from './PaymentMethodData';

export const useSetPaymentMethod: CheckoutOperationHook<SetPaymentMethodResponse, PaymentMethodData> = () => {
  const [state, setState] = useState<PaymentMethodData>();
  const { isLoading, setLoading, setPaymentMethod } = useCheckout();
  const [mutation, result] = useSetPaymentMethodMutation({
    onCompleted: data => {
      if (data) {
        setPaymentMethod(state);
        setLoading(false);
      }
    }
  });

  if (result.loading !== isLoading) {
    setLoading(result.loading);
  }

  return [
    useCallback(async (input: PaymentMethodData, options) => {
      setLoading(true);
      setState(input);

      return mutation({ ...options, variables: { input: paymentMethodToCheckoutDetailsInput(input) } });
    }, []),
    result
  ];
};

export type SetPaymentMethodProps = {
  children: CheckoutOperation<SetPaymentMethodResponse, PaymentMethodData>;
};
export const SetPaymentMethod: React.FC<SetPaymentMethodProps> = ({ children }) => {
  return children(...useSetPaymentMethod());
};
