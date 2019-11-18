import React from 'react';
import { CheckoutDetailsInput, PlaceOrderResult } from '@deity/falcon-shop-extension';
import { CheckoutAddress } from './CheckoutAddress';
import { CheckoutState } from './CheckoutState';

export type OrderData = {
  email?: string;
  billingAddress: CheckoutAddress;
  shippingAddress: CheckoutAddress;
  paymentMethod: CheckoutDetailsInput; // TODO: use `PaymentMethod` type?
  shippingMethod: CheckoutDetailsInput; // TODO: use `ShippingMethod` type?
};

export type CheckoutProviderRenderProps = {
  isLoading: boolean;
  setLoading(isLoading: boolean);
  values: CheckoutState;
  setEmail(email: string): void;
  setShippingAddress(address: CheckoutAddress): void;
  setBillingSameAsShipping(same: boolean): void;
  setBillingAddress(address: CheckoutAddress): void;
  setShippingMethod(shipping: CheckoutDetailsInput): void;
  setPaymentMethod(payment: CheckoutDetailsInput): void;
  placeOrder(result: OrderData): void;
  result?: PlaceOrderResult;
  setResult(result: PlaceOrderResult): void;
};

export type CheckoutContextType = {};

export const CheckoutContext = React.createContext<CheckoutProviderRenderProps>({} as any);
