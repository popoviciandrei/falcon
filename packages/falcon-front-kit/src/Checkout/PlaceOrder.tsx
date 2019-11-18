import React, { useCallback } from 'react';
import { usePlaceOrderMutation, PlaceOrderResponse } from '@deity/falcon-shop-data';
import { addressToCheckoutAddressInput } from './CheckoutAddress';
import { OrderData } from './CheckoutValues';
import { useCheckout } from './CheckoutConsumer';
import { CheckoutOperation, CheckoutOperationHook } from './CheckoutOperation';

export const usePlaceOrder: CheckoutOperationHook<PlaceOrderResponse, OrderData | undefined> = () => {
  const { setLoading, placeOrder, setResult } = useCheckout();
  const [mutation, mutationResult] = usePlaceOrderMutation({
    onCompleted: data => {
      setResult(data.placeOrder);
      setLoading(false);
    }
  });

  return [
    useCallback(async (input: OrderData, options) => {
      setLoading(true);
      placeOrder(input);

      return mutation({
        ...(options || {}),
        variables: {
          input: {
            email: input.email,
            billingAddress: addressToCheckoutAddressInput(input.billingAddress),
            shippingAddress: addressToCheckoutAddressInput(input.shippingAddress),
            shippingMethod: input.shippingMethod,
            paymentMethod: input.paymentMethod
          }
        }
      });
    }, []),
    mutationResult
  ];
};

export type PlaceOrderProps = {
  children: CheckoutOperation<PlaceOrderResponse, OrderData>;
};
export const PlaceOrder: React.FC<PlaceOrderProps> = ({ children }) => {
  return children(...usePlaceOrder());
};
