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
  /**
   * Allows to override OrderData values, useful when order was placed with some overrides and state needs to be synchronized
   * @param data
   */
  setOrderData(data?: OrderData): void;
};
