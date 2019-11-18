import React from 'react';
import { CheckoutDetailsInput, PlaceOrderResult } from '@deity/falcon-shop-extension';
import { CheckoutAddress } from './CheckoutAddress';

export type CheckoutValues = {
  email?: string;
  shippingAddress?: CheckoutAddress;
  billingAddress?: CheckoutAddress;
  shippingMethod?: CheckoutDetailsInput;
  paymentMethod?: CheckoutDetailsInput;
};

export type SetCheckoutValues = {
  setEmail(email: string): void;
  setShippingAddress(shippingAddress: CheckoutAddress): void;
  setBillingAddress(billingAddress: CheckoutAddress): void;
  setShippingMethod(shippingMethod: CheckoutDetailsInput): void;
  setPaymentMethod(paymentMethod: CheckoutDetailsInput): void;
  placeOrder(data: OrderData): void;
};

export type OrderData = {
  email?: string;
  billingAddress: CheckoutAddress;
  shippingAddress: CheckoutAddress;
  paymentMethod: CheckoutDetailsInput; // TODO: use `PaymentMethod` type?
  shippingMethod: CheckoutDetailsInput; // TODO: use `ShippingMethod` type?
};

export type CheckoutProviderRenderProps = SetCheckoutValues & {
  values: CheckoutValues;
  isLoading: boolean;
  setLoading(isLoading: boolean);
  isBillingSameAsShipping: boolean; // TODO: do we really need this flag here?
  setBillingSameAsShipping(same: boolean): void;
  result?: PlaceOrderResult;
  setResult(result: PlaceOrderResult): void;
};

export type CheckoutContextType = {};

export const CheckoutContext = React.createContext<CheckoutProviderRenderProps>({} as any);
