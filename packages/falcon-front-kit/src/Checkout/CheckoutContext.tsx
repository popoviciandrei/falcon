import React from 'react';
import { PlaceOrderResult, CheckoutDetailsInput, ShippingMethod, PaymentMethod } from '@deity/falcon-shop-extension';
import { CheckoutAddress } from './CheckoutAddress';

export type CheckoutContextValues = {
  email?: string;
  shippingAddress?: CheckoutAddress;
  billingAddress?: CheckoutAddress;
  billingSameAsShipping?: boolean; // TODO: do we really need this flag here?
  shippingMethod?: CheckoutDetailsInput;
  paymentMethod?: CheckoutDetailsInput;
};

type CheckoutContextError = {
  message: string;
};

export type CheckoutContextData = {
  errors: CheckoutContextErrors;
  values: CheckoutContextValues;
  result?: PlaceOrderResult;
  availableShippingMethods: ShippingMethod[];
  availablePaymentMethods: PaymentMethod[];
};

type CheckoutContextErrors = {
  email?: CheckoutContextError[];
  shippingAddress?: CheckoutContextError[];
  billingSameAsShipping?: CheckoutContextError[];
  billingAddress?: CheckoutContextError[];
  shippingMethod?: CheckoutContextError[];
  paymentMethod?: CheckoutContextError[];
  order?: CheckoutContextError[];
};

export type CheckoutProviderRenderProps = {
  loading: boolean;
  setEmail(email: string): void;
  setShippingAddress(address: CheckoutAddress): void;
  setBillingSameAsShipping(same: boolean): void;
  setBillingAddress(address: CheckoutAddress): void;
  setShippingMethod(shipping: CheckoutDetailsInput): void;
  setPaymentMethod(payment: CheckoutDetailsInput): void;
  placeOrder(): void;
} & CheckoutContextData;

export const CheckoutContext = React.createContext<CheckoutProviderRenderProps>({} as any);
