import React, { useCallback } from 'react';
import { usePlaceOrderMutation, PlaceOrderResponse } from '@deity/falcon-shop-data';
import { addressToCheckoutAddressInput } from './CheckoutAddress';
import { OrderData } from './CheckoutValues';
import { useCheckout } from './CheckoutConsumer';
import { CheckoutOperation, CheckoutOperationHook } from './CheckoutOperation';
import { shippingMethodToCheckoutDetailsInput } from './shippingMethodToCheckoutDetailsInput';
import { paymentMethodToCheckoutDetailsInput } from './PaymentMethodData';

export const usePlaceOrder: CheckoutOperationHook<PlaceOrderResponse, OrderData | undefined> = () => {
  const { setLoading, setOrderData, setResult } = useCheckout();
  const [mutation, mutationResult] = usePlaceOrderMutation({
    onCompleted: data => {
      setResult(data.placeOrder);
      setLoading(false);
    }
  });

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
    mutationResult
  ];
};

export type PlaceOrderProps = {
  children: CheckoutOperation<PlaceOrderResponse, OrderData>;
};
export const PlaceOrder: React.FC<PlaceOrderProps> = ({ children }) => {
  return children(...usePlaceOrder());
};
