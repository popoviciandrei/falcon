import { ShippingMethod } from '@deity/falcon-shop-extension';
import { CheckoutAddress } from './CheckoutAddress';
import { PaymentMethodData } from './PaymentMethodData';

export type OrderData = {
  email?: string;
  shippingAddress: CheckoutAddress;
  billingAddress: CheckoutAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethodData;
};

export type CheckoutValues = {
  email?: string;
  shippingAddress?: CheckoutAddress;
  billingAddress?: CheckoutAddress;
  shippingMethod?: ShippingMethod;
  paymentMethod?: PaymentMethodData;
};

export type SetCheckoutValues = {
  setEmail(email: string): void;
  setShippingAddress(shippingAddress: CheckoutAddress): void;
  setBillingAddress(billingAddress: CheckoutAddress): void;
  setShippingMethod(shippingMethod: ShippingMethod): void;
  setPaymentMethod(paymentMethod: PaymentMethodData): void;
  placeOrder(data: OrderData): void;
};
