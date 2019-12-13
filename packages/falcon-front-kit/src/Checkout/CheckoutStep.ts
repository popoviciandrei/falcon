import { RecordEnumLike } from '../RecordEnumLike';

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
