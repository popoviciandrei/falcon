import React from 'react';
import { PlaceOrderResult } from '@deity/falcon-shop-extension';
import { CheckoutStep } from './CheckoutStep';
import { CheckoutValues, SetCheckoutValues } from './CheckoutValues';

export type CheckoutContextType = SetCheckoutValues & {
  step: keyof typeof CheckoutStep;
  nextStep?: keyof typeof CheckoutStep;
  stepForward: () => void;
  setStep(step: keyof typeof CheckoutStep): void;
  values: CheckoutValues;
  isLoading: boolean;
  setLoading(isLoading: boolean);
  isBillingSameAsShipping: boolean; // TODO: do we really need this flag here?
  setBillingSameAsShipping(same: boolean): void;
  result?: PlaceOrderResult;
  setResult(result: PlaceOrderResult): void;
};

export const CheckoutContext = React.createContext<CheckoutContextType>({} as any);
