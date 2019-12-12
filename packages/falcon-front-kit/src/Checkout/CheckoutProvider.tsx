import React, { useState } from 'react';
import { PlaceOrderResult } from '@deity/falcon-shop-extension';
import { CheckoutValues, SetCheckoutValues } from './CheckoutValues';
import { CheckoutStep, getNextStepForValues } from './CheckoutStep';
import { CheckoutContext } from './CheckoutContext';

export type CheckoutProviderProps = {
  initialValues?: CheckoutValues;
  billingSameAsShipping?: boolean;
};
export const CheckoutProvider: React.SFC<CheckoutProviderProps> = props => {
  const { children, initialValues = {}, billingSameAsShipping } = props;

  const [step, setStep] = useState<keyof typeof CheckoutStep>('Email');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isBillingSameAsShipping, setBillingSameAsShipping] = useState<boolean>(billingSameAsShipping || false);
  const [values, setValues] = useState<CheckoutValues>({
    ...initialValues
  });
  const [result, setResult] = useState<PlaceOrderResult>();

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
        billingAddress: isBillingSameAsShipping ? shippingAddress : x.billingAddress,
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
        shippingAddress: isBillingSameAsShipping ? billingAddress : x.shippingAddress,
        billingAddress,
        shippingMethod: isBillingSameAsShipping ? undefined : x.shippingMethod,
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

  /**
   * Allows to override OrderData values, useful when order was placed with some overrides and state needs to be synchronized
   * @param order
   */
  const setOrderData: SetCheckoutValues['setOrderData'] = order => {
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
        setOrderData,
        result,
        setResult
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
