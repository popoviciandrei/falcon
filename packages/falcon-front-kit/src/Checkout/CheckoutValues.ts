import { CheckoutDetailsInput } from '@deity/falcon-shop-extension';
import { CheckoutAddress } from './CheckoutAddress';

export type OrderData = {
  email?: string;
  billingAddress: CheckoutAddress;
  shippingAddress: CheckoutAddress;
  paymentMethod: CheckoutDetailsInput; // TODO: use `PaymentMethod` type?
  shippingMethod: CheckoutDetailsInput; // TODO: use `ShippingMethod` type?
};

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
