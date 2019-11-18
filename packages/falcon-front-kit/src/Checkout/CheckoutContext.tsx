import React from 'react';
import { PlaceOrderResult } from '@deity/falcon-shop-extension';
import { CheckoutStep } from './CheckoutStep';
import { CheckoutValues, SetCheckoutValues } from './CheckoutValues';

export type CheckoutProviderRenderProps = SetCheckoutValues & {
  step: keyof typeof CheckoutStep;
  setStep(step: keyof typeof CheckoutStep): void;
  values: CheckoutValues;
  isLoading: boolean;
  setLoading(isLoading: boolean);
  isBillingSameAsShipping: boolean; // TODO: do we really need this flag here?
  setBillingSameAsShipping(same: boolean): void;
  result?: PlaceOrderResult;
  setResult(result: PlaceOrderResult): void;
};

export type CheckoutContextType = {};

export const CheckoutContext = React.createContext<CheckoutProviderRenderProps>({} as any);
