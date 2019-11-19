import React, { useCallback } from 'react';
import { usePlaceOrderMutation, PlaceOrderResponse } from '@deity/falcon-shop-data';
import { addressToCheckoutAddressInput } from './CheckoutAddress';
import { OrderData } from './CheckoutValues';
import { useCheckout } from './CheckoutConsumer';
import { CheckoutOperation, CheckoutOperationHook } from './CheckoutOperation';
import { shippingMethodToCheckoutDetailsInput } from './shippingMethodToCheckoutDetailsInput';
import { paymentMethodToCheckoutDetailsInput } from './PaymentMethodData';

export const usePlaceOrder: CheckoutOperationHook<PlaceOrderResponse, OrderData | undefined> = () => {
  const { isLoading, setLoading, setOrderData, setResult } = useCheckout();
  const [mutation, result] = usePlaceOrderMutation({
    onCompleted: data => {
      if (data) {
        setResult(data.placeOrder);
        setLoading(false);
      }
    }
  });

  if (result.loading !== isLoading) {
    setLoading(result.loading);
  }

  return [
    useCallback(async (input: OrderData, options) => {
      setLoading(true);
      setOrderData(input);

      return mutation({
        ...(options || {}),
        variables: {
          input: {
            email: input.email,
            billingAddress: addressToCheckoutAddressInput(input.billingAddress),
            shippingAddress: addressToCheckoutAddressInput(input.shippingAddress),
            shippingMethod: shippingMethodToCheckoutDetailsInput(input.shippingMethod),
            paymentMethod: paymentMethodToCheckoutDetailsInput(input.paymentMethod)
          }
        }
      });
    }, []),
    result
  ];
};

export type PlaceOrderProps = {
  children: CheckoutOperation<PlaceOrderResponse, OrderData>;
};
export const PlaceOrder: React.FC<PlaceOrderProps> = ({ children }) => {
  return children(...usePlaceOrder());
};
