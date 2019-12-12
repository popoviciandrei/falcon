import { RecordEnumLike } from '../RecordEnumLike';
import { CheckoutValues } from './CheckoutValues';

/** Defines basic checkout steps */
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

/** Defines default checkout steps order */
export const CheckoutFlow = [
  CheckoutStep.Email,
  CheckoutStep.ShippingAddress,
  CheckoutStep.BillingAddress,
  CheckoutStep.Shipping,
  CheckoutStep.Payment,
  CheckoutStep.Confirmation
];

/** Returns next possible step for `step` based on available `CheckoutFlow`, or `undefined` when no more steps
 * @param step
 */
export const getNextStep = (step: keyof typeof CheckoutStep): keyof typeof CheckoutStep | undefined => {
  const currentStepIndex = CheckoutFlow.findIndex(x => x === step);

  return currentStepIndex === CheckoutFlow.length - 1 ? CheckoutFlow[currentStepIndex + 1] : undefined;
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
