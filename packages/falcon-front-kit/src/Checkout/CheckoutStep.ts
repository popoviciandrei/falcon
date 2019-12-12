import { RecordEnumLike } from '../RecordEnumLike';
import { CheckoutValues } from './CheckoutValues';

export type CheckoutStepType =
  | 'email'
  | 'shippingAddress'
  | 'billingAddress'
  | 'shippingMethod'
  | 'paymentMethod'
  | 'placeOrder';

/** Defines basic checkout steps */
export const CheckoutStep: RecordEnumLike<CheckoutStepType> = {
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

export const getNextStepFactory = <TCheckoutStep extends CheckoutStepType = CheckoutStepType>(
  stepsOrder: TCheckoutStep[]
) => {
  /**
   * Returns next possible step for `step` based on available `CheckoutFlow`, or `undefined` when no more steps
   * @param step
   */
  return (step: CheckoutStepType): CheckoutStepType | undefined => {
    const currentStepIndex = stepsOrder.findIndex(x => x === step);

    return currentStepIndex < stepsOrder.length ? stepsOrder[currentStepIndex + 1] : undefined;
  };
};

/**
 * Returns next step for checkout wizard based on checkout values
 * @param values
 */
export const getNextStepForValues = (values: CheckoutValues): CheckoutStepType => {
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
