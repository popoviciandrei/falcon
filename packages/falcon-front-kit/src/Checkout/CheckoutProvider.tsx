import React, { useState } from 'react';
import { PlaceOrderResult } from '@deity/falcon-shop-extension';
import { CheckoutValues, SetCheckoutValues } from './CheckoutValues';
import { CheckoutStep, getNextStepForValues } from './CheckoutStep';
import { CheckoutContext, CheckoutProviderRenderProps } from './CheckoutContext';

export type CheckoutProviderProps = {
  initialValues?: CheckoutValues;
  children(props: CheckoutProviderRenderProps): React.ReactNode;
};

export const CheckoutProvider: React.SFC<CheckoutProviderProps> = props => {
  const { children, initialValues } = props;

  const [step, setStep] = useState<keyof typeof CheckoutStep>('Email');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isBillingSameAsShipping, setBillingSameAsShipping] = useState<boolean>(false);
  const [values, setValues] = useState<CheckoutValues>({
    ...initialValues
  });
  const [result, setResult] = useState<PlaceOrderResult>();

  // /** @param {boolean} same Whether the billing address should be the same as shipping address */
  // const setBillingSameAsShipping = (same: boolean) => {
  //   // setState({
  //   //   ...state,
  //   //   isBillingSameAsShipping: same,
  //   //   billingAddress: same ? state.shippingAddress : null
  //   // });
  //   // setBillingAddress(state.shippingAddress);
  // };

  const setEmail: SetCheckoutValues['setEmail'] = email =>
    setValues(x => {
      const newValues = { ...x, email };
      setStep(getNextStepForValues(newValues));

      return newValues;
    });

  const setShippingAddress: SetCheckoutValues['setShippingAddress'] = shippingAddress =>
    setValues(x => {
      const newValues = {
        ...x,
        shippingAddress,
        // billingAddress: isBillingSameAsShipping ? shippingAddress : state.billingAddress
        shippingMethod: undefined,
        paymentMethod: undefined
      };
      setStep(getNextStepForValues(newValues));

      return newValues;
    });

  const setBillingAddress: SetCheckoutValues['setBillingAddress'] = billingAddress =>
    setValues(x => {
      const newValues = {
        ...x,
        billingAddress,
        paymentMethod: undefined
      };
      setStep(getNextStepForValues(newValues));

      return newValues;
    });

  const setShippingMethod: SetCheckoutValues['setShippingMethod'] = shippingMethod =>
    setValues(x => {
      const newValues = {
        ...x,
        shippingMethod,
        paymentMethod: undefined
      };
      setStep(getNextStepForValues(newValues));

      return newValues;
    });

  const setPaymentMethod: SetCheckoutValues['setPaymentMethod'] = paymentMethod =>
    setValues(x => {
      const newValues = { ...x, paymentMethod };
      setStep(getNextStepForValues(newValues));

      return newValues;
    });

  const placeOrder: SetCheckoutValues['placeOrder'] = order => {
    if (order) {
      setStep(getNextStepForValues(order));
      setValues({ ...order });
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        step,
        setStep,
        isLoading,
        setLoading,
        isBillingSameAsShipping,
        setBillingSameAsShipping,
        values,
        setEmail,
        setShippingAddress,
        setBillingAddress,
        setShippingMethod,
        setPaymentMethod,
        placeOrder,
        result,
        setResult
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
