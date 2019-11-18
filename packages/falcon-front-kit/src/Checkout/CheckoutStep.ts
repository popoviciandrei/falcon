import { CheckoutValues } from './CheckoutValues';

/** Define basic checkout steps */
export const CheckoutStep = {
  Email: 'Email',
  ShippingAddress: 'ShippingAddress',
  BillingAddress: 'BillingAddress',
  Shipping: 'Shipping',
  Payment: 'Payment',
  Confirmation: 'Confirmation'
};

/**
 * Returns next step for checkout wizard based on checkout values
 * @param values
 */
export const getNextStepForValues = (values: CheckoutValues): keyof typeof CheckoutStep => {
  if (!values.email) {
    return 'Email';
  }

  if (!values.shippingAddress) {
    return `ShippingAddress`;
  }

  if (!values.billingAddress) {
    return 'BillingAddress';
  }

  if (!values.shippingMethod) {
    return 'Shipping';
  }

  if (!values.paymentMethod) {
    return 'Payment';
  }

  return 'Confirmation';
};
