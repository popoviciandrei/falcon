import { PaymentMethod, CheckoutDetailsInput } from '@deity/falcon-shop-extension';

export type PaymentMethodData = PaymentMethod & {
  data?: object;
};

/**
 * Map `ShippingMethod` to `CheckoutDetailsInput`
 * @param payment
 */
export const paymentMethodToCheckoutDetailsInput = (payment: PaymentMethodData): CheckoutDetailsInput => {
  const { code: method, data } = payment;

  return {
    method,
    data
  };
};
