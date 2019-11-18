import { ShippingMethod, CheckoutDetailsInput } from '@deity/falcon-shop-extension';

/**
 * Map `ShippingMethod` to `CheckoutDetailsInput`
 * @param shipping
 */
export const shippingMethodToCheckoutDetailsInput = (shipping: ShippingMethod): CheckoutDetailsInput => {
  const { methodCode: method, ...data } = shipping;

  return {
    method,
    data
  };
};
