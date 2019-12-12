import React, { useState, useCallback } from 'react';
import { PlaceOrderResult } from '@deity/falcon-shop-extension';
import { CheckoutValues, SetCheckoutValues } from './CheckoutValues';
import { CheckoutStep, CheckoutStepType, CheckoutFlow, getNextStepForValues } from './CheckoutStep';
import { CheckoutContext } from './CheckoutContext';

export type CheckoutProviderProps<TCheckoutStep extends CheckoutStepType = CheckoutStepType> = {
  initialValues?: CheckoutValues;
  billingSameAsShipping?: boolean;
  stepsOrder?: TCheckoutStep[];
  autoStepForward?: boolean;
};
export const CheckoutProvider: React.SFC<CheckoutProviderProps> = props => {
  const { children, initialValues = {}, billingSameAsShipping, stepsOrder, autoStepForward } = props;

  /**
   * Returns next possible step for `step` based on available `CheckoutFlow`, or `undefined` when no more steps
   * @param step
   */
  const getNextStep = (step: CheckoutStepType): CheckoutStepType | undefined => {
    const currentStepIndex = stepsOrder.findIndex(x => x === step);

    return currentStepIndex < stepsOrder.length ? stepsOrder[currentStepIndex + 1] : undefined;
  };

  const [step, setStep] = useState<keyof typeof CheckoutStep>(getNextStepForValues(initialValues));
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isBillingSameAsShipping, setBillingSameAsShipping] = useState<boolean>(billingSameAsShipping || false);
  const [values, setValues] = useState<CheckoutValues>({
    ...initialValues
  });
  const [result, setResult] = useState<PlaceOrderResult>();

  const setEmail: SetCheckoutValues['setEmail'] = email =>
    setValues(x => {
      const newValues = { ...x, email };
      if (autoStepForward) {
        setStep(getNextStepForValues(newValues));
      }

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
      if (autoStepForward) {
        setStep(getNextStepForValues(newValues));
      }

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
      if (autoStepForward) {
        setStep(getNextStepForValues(newValues));
      }

      return newValues;
    });

  const setShippingMethod: SetCheckoutValues['setShippingMethod'] = shippingMethod =>
    setValues(x => {
      const newValues = {
        ...x,
        shippingMethod,
        paymentMethod: undefined
      };
      if (autoStepForward) {
        setStep(getNextStepForValues(newValues));
      }

      return newValues;
    });

  const setPaymentMethod: SetCheckoutValues['setPaymentMethod'] = paymentMethod =>
    setValues(x => {
      const newValues = { ...x, paymentMethod };
      if (autoStepForward) {
        setStep(getNextStepForValues(newValues));
      }

      return newValues;
    });

  /**
   * Allows to override OrderData values, useful when order was placed with some overrides and state needs to be synchronized
   * @param order
   */
  const setOrderData: SetCheckoutValues['setOrderData'] = order => {
    if (order) {
      if (autoStepForward) {
        setStep(getNextStepForValues(order));
      }
      setValues({ ...order });
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        step,
        nextStep: getNextStep(step),
        stepForward: () => setStep(getNextStep(step)),
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
CheckoutProvider.defaultProps = {
  stepsOrder: CheckoutFlow,
  autoStepForward: true,
  billingSameAsShipping: false,
  initialValues: {}
};
