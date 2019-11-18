import React from 'react';
import { CheckoutDetailsInput, PlaceOrderResult } from '@deity/falcon-shop-extension';
import { CheckoutAddress } from './CheckoutAddress';

export type CheckoutState = {
  billingSameAsShipping: boolean; // TODO: do we really need this flag here?
  email?: string;
  shippingAddress?: CheckoutAddress;
  billingAddress?: CheckoutAddress;
  shippingMethod?: CheckoutDetailsInput;
  paymentMethod?: CheckoutDetailsInput;
};

export type CheckoutSetState = {
  // setBillingSameAsShipping(same: boolean): void;
  setEmail(email: string): void;
  setShippingAddress(shippingAddress: CheckoutAddress): void;
  setBillingAddress(billingAddress: CheckoutAddress): void;
  setShippingMethod(shippingMethod: CheckoutDetailsInput): void;
  setPaymentMethod(paymentMethod: CheckoutDetailsInput): void;
};

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
  setBillingSameAsShipping(same: boolean): void;
  placeOrder(result: OrderData): void;
  result?: PlaceOrderResult;
  setResult(result: PlaceOrderResult): void;
} & CheckoutSetState;

export type CheckoutContextType = {};

export const CheckoutContext = React.createContext<CheckoutProviderRenderProps>({} as any);
