import React, { useState } from 'react';
import isEqual from 'lodash.isequal';
import { PlaceOrderResult } from '@deity/falcon-shop-extension';
import { CheckoutContext, CheckoutValues, SetCheckoutValues, CheckoutProviderRenderProps } from './CheckoutContext';

export type CheckoutProviderProps = {
  initialValues?: CheckoutValues;
  children(props: CheckoutProviderRenderProps): React.ReactNode;
};

export const CheckoutProvider: React.SFC<CheckoutProviderProps> = props => {
  const { children, initialValues } = props;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [values, setValues] = useState<CheckoutValues>({
    billingSameAsShipping: false,
    ...initialValues
  });
  const [result, setResult] = useState<PlaceOrderResult>();

  const setEmail: SetCheckoutValues['setEmail'] = email => setValues(x => (x.email === email ? x : { ...x, email }));

  /** @param {boolean} same Whether the billing address should be the same as shipping address */
  const setBillingSameAsShipping = (same: boolean) => {
    // setState({
    //   ...state,
    //   billingSameAsShipping: same,
    //   billingAddress: same ? state.shippingAddress : null
    // });
    // setBillingAddress(state.shippingAddress);
  };

  const setShippingAddress: SetCheckoutValues['setShippingAddress'] = shippingAddress =>
    setValues(x =>
      isEqual(x.shippingAddress, shippingAddress)
        ? x
        : {
            ...x,
            shippingAddress,
            // billingAddress: state.billingSameAsShipping ? shippingAddress : state.billingAddress
            shippingMethod: undefined,
            paymentMethod: undefined
          }
    );

  const setBillingAddress: SetCheckoutValues['setBillingAddress'] = billingAddress =>
    setValues(x =>
      isEqual(x.billingAddress, billingAddress)
        ? x
        : {
            ...x,
            billingAddress,
            paymentMethod: undefined
          }
    );

  const setShippingMethod: SetCheckoutValues['setShippingMethod'] = shippingMethod =>
    setValues(x =>
      isEqual(x.shippingMethod, shippingMethod)
        ? x
        : {
            ...x,
            shippingMethod,
            paymentMethod: undefined
          }
    );

  const setPaymentMethod: SetCheckoutValues['setPaymentMethod'] = paymentMethod =>
    setValues(x => (isEqual(x.paymentMethod, paymentMethod) ? x : { ...x, paymentMethod }));

  const placeOrder: CheckoutProviderRenderProps['placeOrder'] = order => {
    if (order) {
      setEmail(order.email);
      setBillingAddress(order.billingAddress);
      setShippingAddress(order.shippingAddress);
      setShippingMethod(order.shippingMethod);
      setPaymentMethod(order.paymentMethod);
    }
  };

  const context: CheckoutProviderRenderProps = {
    values,
    isLoading,
    setLoading,
    setEmail,
    setBillingSameAsShipping,
    setShippingAddress,
    setBillingAddress,
    setShippingMethod,
    setPaymentMethod,
    placeOrder,
    result,
    setResult
  };

  return <CheckoutContext.Provider value={context}>{children}</CheckoutContext.Provider>;
};
