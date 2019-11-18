import React, { useState } from 'react';
import isEqual from 'lodash.isequal';
import { PlaceOrderResult } from '@deity/falcon-shop-extension';
import { CheckoutState } from './CheckoutState';
import { CheckoutContext, CheckoutProviderRenderProps } from './CheckoutContext';

export type CheckoutProviderProps = {
  initialValues?: CheckoutState;
  children(props: CheckoutProviderRenderProps): React.ReactNode;
};

export const CheckoutProvider: React.SFC<CheckoutProviderProps> = props => {
  const { children, initialValues } = props;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState<CheckoutState>({
    billingSameAsShipping: false,
    ...initialValues
  });
  const [result, setResult] = useState<PlaceOrderResult>();

  const setEmail: CheckoutProviderRenderProps['setEmail'] = email =>
    setState(x => (x.email === email ? x : { ...x, email }));

  /** @param {boolean} same Whether the billing address should be the same as shipping address */
  const setBillingSameAsShipping = (same: boolean) => {
    // setState({
    //   ...state,
    //   billingSameAsShipping: same,
    //   billingAddress: same ? state.shippingAddress : null
    // });
    // setBillingAddress(state.shippingAddress);
  };

  const setShippingAddress: CheckoutProviderRenderProps['setShippingAddress'] = shippingAddress =>
    setState(x =>
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

  const setBillingAddress: CheckoutProviderRenderProps['setBillingAddress'] = billingAddress =>
    setState(x =>
      isEqual(x.billingAddress, billingAddress)
        ? x
        : {
            ...x,
            billingAddress,
            paymentMethod: undefined
          }
    );

  const setShippingMethod: CheckoutProviderRenderProps['setShippingMethod'] = shippingMethod =>
    setState(x =>
      isEqual(x.shippingMethod, shippingMethod)
        ? x
        : {
            ...x,
            shippingMethod,
            paymentMethod: undefined
          }
    );

  const setPaymentMethod: CheckoutProviderRenderProps['setPaymentMethod'] = paymentMethod =>
    setState(x => (isEqual(x.paymentMethod, paymentMethod) ? x : { ...x, paymentMethod }));

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
    values: state,
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
