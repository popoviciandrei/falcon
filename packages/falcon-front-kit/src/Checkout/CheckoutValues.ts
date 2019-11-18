import { CheckoutDetailsInput, ShippingMethod } from '@deity/falcon-shop-extension';
import { CheckoutAddress } from './CheckoutAddress';

export type OrderData = {
  email?: string;
  shippingAddress: CheckoutAddress;
  billingAddress: CheckoutAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: CheckoutDetailsInput; // TODO: use `PaymentMethod` type?
};

export type CheckoutValues = {
  email?: string;
  shippingAddress?: CheckoutAddress;
  billingAddress?: CheckoutAddress;
  shippingMethod?: ShippingMethod;
  paymentMethod?: CheckoutDetailsInput;
};

export type SetCheckoutValues = {
  setEmail(email: string): void;
  setShippingAddress(shippingAddress: CheckoutAddress): void;
  setBillingAddress(billingAddress: CheckoutAddress): void;
  setShippingMethod(shippingMethod: ShippingMethod): void;
  setPaymentMethod(paymentMethod: CheckoutDetailsInput): void;
  placeOrder(data: OrderData): void;
};
