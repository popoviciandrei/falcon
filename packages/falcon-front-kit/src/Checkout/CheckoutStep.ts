import { RecordEnumLike } from '../RecordEnumLike';
import { CheckoutValues } from './CheckoutValues';

/** Define basic checkout steps */
export const CheckoutStep: RecordEnumLike<
  'Email' | 'ShippingAddress' | 'BillingAddress' | 'Shipping' | 'Payment' | 'Confirmation'
> = {
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
    return CheckoutStep.Email;
  }

  if (!values.shippingAddress) {
    return CheckoutStep.ShippingAddress;
  }

  if (!values.billingAddress) {
    return CheckoutStep.BillingAddress;
  }

  if (!values.shippingMethod) {
    return CheckoutStep.Shipping;
  }

  if (!values.paymentMethod) {
    return CheckoutStep.Payment;
  }

  return CheckoutStep.Confirmation;
};
