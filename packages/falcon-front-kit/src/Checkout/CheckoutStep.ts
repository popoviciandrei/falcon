import { RecordEnumLike } from '../RecordEnumLike';
import { CheckoutValues } from './CheckoutValues';

/** Defines basic checkout steps */
export const CheckoutStep: RecordEnumLike<
  'email' | 'shippingAddress' | 'billingAddress' | 'shippingMethod' | 'paymentMethod' | 'placeOrder'
> = {
  email: 'email',
  shippingAddress: 'shippingAddress',
  billingAddress: 'billingAddress',
  shippingMethod: 'shippingMethod',
  paymentMethod: 'paymentMethod',
  placeOrder: 'placeOrder'
};

/** Defines default checkout steps order */
export const CheckoutFlow = [
  CheckoutStep.email,
  CheckoutStep.shippingAddress,
  CheckoutStep.billingAddress,
  CheckoutStep.shippingMethod,
  CheckoutStep.paymentMethod,
  CheckoutStep.placeOrder
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
    return CheckoutStep.email;
  }

  if (!values.shippingAddress) {
    return CheckoutStep.shippingAddress;
  }

  if (!values.billingAddress) {
    return CheckoutStep.billingAddress;
  }

  if (!values.shippingMethod) {
    return CheckoutStep.shippingMethod;
  }

  if (!values.paymentMethod) {
    return CheckoutStep.paymentMethod;
  }

  return CheckoutStep.placeOrder;
};
